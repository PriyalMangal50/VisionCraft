import fetch from 'node-fetch';
import mongoose from 'mongoose';
import 'dotenv/config';
import productModel from './models/productModel.js';

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Main test function
async function testQuizFiltering() {
  // Connect to database
  await connectDB();
  
  console.log('\n=== FRAME FINDER QUIZ FILTER TEST ===\n');
  
  // Step 1: Make a sample quiz submission
  const quizData = {
    userId: null,
    sessionId: 'test-session-' + Date.now(),
    answers: {
      faceShape: 'oval',
      frameStyle: 'Rectangle',
      usage: 'everyday',
      features: ['Blue Light']
    }
  };
  
  console.log('Quiz submission data:', JSON.stringify(quizData, null, 2));
  console.log('\n--- Testing Backend Quiz Filter Logic ---');
  
  // Step 2: Use the same logic as in the controller to find matching products
  let productQuery = {};
  
  // Face shape filter
  if (quizData.answers.faceShape) {
    productQuery.suitableFaceShapes = { $in: [quizData.answers.faceShape] };
  }
  
  // Frame style filter
  if (quizData.answers.frameStyle) {
    productQuery.frameShape = quizData.answers.frameStyle;
  }
  
  // Feature filters
  if (quizData.answers.features && quizData.answers.features.length > 0) {
    const featureQueries = [];
    
    quizData.answers.features.forEach(feature => {
      if (feature === 'Blue Light') featureQueries.push({ 'features.blueLight': true });
      if (feature === 'Lightweight') featureQueries.push({ 'features.lightweight': true });
      if (feature === 'Polarized') featureQueries.push({ 'features.polarized': true });
      if (feature === 'Transition') featureQueries.push({ 'features.transition': true });
    });
    
    if (featureQueries.length > 0) {
      productQuery.$or = featureQueries;
    }
  }
  
  console.log('MongoDB query:', JSON.stringify(productQuery, null, 2));
  
  // Step 3: Execute the query
  try {
    const products = await productModel.find(productQuery).lean();
    console.log(`\nFound ${products.length} matching products`);
    
    if (products.length > 0) {
      console.log('\nSample products:');
      products.slice(0, 3).forEach((product, index) => {
        console.log(`\nProduct ${index + 1}: ${product.name}`);
        console.log(`- Frame Shape: ${product.frameShape}`);
        console.log(`- Suitable Face Shapes: ${product.suitableFaceShapes?.join(', ') || 'Not specified'}`);
        console.log(`- Features: ${JSON.stringify(product.features || {})}`);
      });
    } else {
      console.log('\nNo products found matching these criteria!');
      
      // Debug: Check if there are any products with the specified face shape
      const faceShapeProducts = await productModel.find({ 
        suitableFaceShapes: { $in: [quizData.answers.faceShape] } 
      }).lean();
      
      console.log(`\nProducts with face shape '${quizData.answers.faceShape}': ${faceShapeProducts.length}`);
      
      // Debug: Check if there are any products with the specified frame shape
      const frameShapeProducts = await productModel.find({ 
        frameShape: quizData.answers.frameStyle 
      }).lean();
      
      console.log(`\nProducts with frame shape '${quizData.answers.frameStyle}': ${frameShapeProducts.length}`);
      
      // Debug: Check if there are any products with the specified feature
      if (quizData.answers.features.includes('Blue Light')) {
        const blueProducts = await productModel.find({ 'features.blueLight': true }).lean();
        console.log(`\nProducts with Blue Light feature: ${blueProducts.length}`);
      }
    }
  } catch (err) {
    console.error('Error executing query:', err);
  }
  
  // Clean up
  await mongoose.disconnect();
  console.log('\n=== TEST COMPLETE ===');
}

// Run the test
testQuizFiltering().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
