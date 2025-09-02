import quizModel from "../models/quizModel.js";
import productModel from "../models/productModel.js";
import mongoose from "mongoose";
import { FEATURE_VALUE_TO_KEY } from "../utils/quizConstants.js";

// Submit quiz answers and get product recommendations
const submitQuiz = async (req, res, next) => {
  try {
    const { userId, sessionId, answers } = req.body;
    
    if (!sessionId) {
      return res.json({ success: false, message: "Session ID is required" });
    }
    
    // Log incoming data
    console.log('Quiz submission received:', JSON.stringify({
      userId: userId || 'anonymous',
      sessionId,
      faceShape: answers.faceShape,
      frameStyle: answers.frameStyle,
      usage: answers.usage,
      features: answers.features || []
    }, null, 2));
    
    // Prepare query to find products matching quiz answers
    let productQuery = {};
    let recommendedProducts = [];
    
    // 1. Find products by suitable face shape if provided
    if (answers.faceShape) {
      // Make sure face shape is lowercase for consistent matching
      const faceShape = answers.faceShape.toLowerCase();
      // Changed to use $in operator to find products with this face shape in their array
      productQuery.suitableFaceShapes = { $in: [faceShape] };
    }
    
    // 2. If frame style is selected, use it as a filter
    if (answers.frameStyle) {
      // Match frameShape field to the frameStyle answer (case-sensitive)
      productQuery.frameShape = answers.frameStyle;
    }
    
    // 3. Filter by usage if provided
    if (answers.usage) {
      productQuery.usage = { $in: [answers.usage] };
    }
    
    // 4. Filter by features if provided
    if (answers.features && answers.features.length > 0) {
      // Map quiz feature values to product feature keys using our standardized mapping
      const featureQueries = [];
      
      answers.features.forEach(featureValue => {
        const featureKey = FEATURE_VALUE_TO_KEY[featureValue];
        if (featureKey) {
          const query = {};
          query[`features.${featureKey}`] = true;
          featureQueries.push(query);
        }
      });
      
      if (featureQueries.length > 0) {
        productQuery.$or = featureQueries;
      }
    }
    
    // Find products that match the criteria
    console.log('Quiz filter query:', JSON.stringify(productQuery, null, 2));
    
    // Only find products that have quiz attributes set
    let products = await productModel.find({
      ...productQuery,
      // Require at least one quiz-related field to be populated
      $or: [
        { suitableFaceShapes: { $exists: true, $ne: [] } },
        { usage: { $exists: true, $ne: [] } },
        { "features.blueLight": true },
        { "features.lightweight": true },
        { "features.polarized": true },
        { "features.transition": true }
      ]
    }).limit(20);
    
    console.log(`Found ${products.length} products with strict filtering`);
    
    // If no products found with strict filters, try with just the most important criteria
    if (products.length === 0 && answers.faceShape) {
      console.log('No products found with strict filters, trying with just face shape');
      const faceShape = answers.faceShape.toLowerCase();
      products = await productModel.find({ 
        suitableFaceShapes: { $in: [faceShape] },
        // Still require quiz attributes to be set
        $or: [
          { suitableFaceShapes: { $exists: true, $ne: [] } },
          { usage: { $exists: true, $ne: [] } },
          { "features.blueLight": true },
          { "features.lightweight": true },
          { "features.polarized": true },
          { "features.transition": true }
        ]
      }).limit(20);
      
      console.log(`Found ${products.length} products with face shape filtering`);
    }
    
    // If still no results, return a clear message instead of all products
    if (products.length === 0) {
      console.log('No products found with quiz attributes');
      // We'll still return an empty array, but with better frontend messaging
      products = [];
    }
    
    console.log(`Found ${products.length} products matching quiz criteria`);
    
    // 5. Calculate relevance scores for ranking
    recommendedProducts = products.map(product => {
      let score = 0;
      
      // Face shape match gives highest score
      if (answers.faceShape && product.suitableFaceShapes && 
          product.suitableFaceShapes.includes(answers.faceShape.toLowerCase())) {
        score += 5;
      }
      
      // Frame style match
      if (answers.frameStyle && product.frameShape === answers.frameStyle) {
        score += 3;
      }
      
      // Usage match
      if (answers.usage && product.usage && product.usage.includes(answers.usage)) {
        score += 2;
      }
      
      // Feature matches using our standardized mapping
      if (answers.features && answers.features.length > 0 && product.features) {
        answers.features.forEach(featureValue => {
          const featureKey = FEATURE_VALUE_TO_KEY[featureValue];
          if (featureKey && product.features[featureKey]) {
            score += 1;
          }
        });
      }
      
      // Add product's base relevance score
      score += product.quizRelevanceScore || 0;
      
      return {
        productId: product._id,
        score: score,
        product: product
      };
    });
    
    // Sort by score (descending)
    recommendedProducts.sort((a, b) => b.score - a.score);
    
    // Save quiz results to database
    const quizResult = new quizModel({
      userId: userId || null,
      sessionId,
      answers,
      recommendedProducts: recommendedProducts.map(item => ({
        productId: item.productId,
        score: item.score
      }))
    });
    
    await quizResult.save();
    
    // Return recommended products with their scores
    res.json({
      success: true,
      recommendations: recommendedProducts,
      quizId: quizResult._id
    });
    
  } catch (error) {
    console.error("Quiz submission error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Track user interaction with quiz results
const trackQuizInteraction = async (req, res, next) => {
  try {
    const { quizId, productId, action } = req.body;
    
    if (!quizId || !action) {
      return res.json({ success: false, message: "Quiz ID and action are required" });
    }
    
    const validActions = ['click', 'purchase'];
    if (!validActions.includes(action)) {
      return res.json({ success: false, message: "Invalid action" });
    }
    
    // Update quiz result based on action
    const updateData = {};
    if (action === 'click') {
      updateData.clicked = true;
    } else if (action === 'purchase') {
      updateData.purchased = true;
    }
    
    await quizModel.findByIdAndUpdate(quizId, updateData);
    
    res.json({ success: true });
    
  } catch (error) {
    console.error("Track quiz interaction error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Get quiz analytics for admin
// getQuizAnalytics function has been removed

export { submitQuiz, trackQuizInteraction };
