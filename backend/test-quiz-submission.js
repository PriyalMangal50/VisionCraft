// Test script for quiz submission
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/mongodb.js';

// Load environment variables
dotenv.config();

// First connect to the database
connectDB()
  .then(async () => {
    console.log("Connected to MongoDB");
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Available collections:", collections.map(c => c.name));
    
    // Test quiz submission
    await testQuizSubmission();
    
    // Check if quiz data was saved
    await checkQuizData();
    
    // Exit process
    process.exit(0);
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Test quiz submission
async function testQuizSubmission() {
  try {
    console.log('\n=== Testing Quiz Submission ===');
    
    const sessionId = `test_${Math.random().toString(36).substring(2, 15)}`;
    console.log(`Using session ID: ${sessionId}`);
    
    const quizData = {
      sessionId,
      answers: {
        faceShape: 'oval',
        frameStyle: 'Rectangle',
        usage: 'everyday',
        features: ['Blue Light', 'Lightweight']
      }
    };
    
    console.log('Quiz data:', JSON.stringify(quizData, null, 2));
    
    // Get backend URL from environment or use default
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
    console.log(`Using backend URL: ${backendUrl}`);
    
    const response = await fetch(`${backendUrl}/api/quiz/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quizData)
    });
    
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.success && data.quizId) {
      console.log(`Quiz submitted successfully with ID: ${data.quizId}`);
      // Store quiz ID for analytics check
      global.testQuizId = data.quizId;
      global.testSessionId = sessionId;
    } else {
      console.error('Quiz submission failed:', data.message || 'Unknown error');
    }
    
  } catch (error) {
    console.error('Error submitting quiz:', error);
  }
}

// Check if quiz data was saved
async function checkQuizData() {
  try {
    console.log('\n=== Checking Quiz Data ===');
    
    // Wait a moment for the database to update
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find the quiz model collection
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log("Available collections:", collectionNames);
    
    // The quiz collection could be named "quizzes", "quiz", or "quizresults"
    const quizCollectionName = collectionNames.find(name => 
      name === 'quizzes' || name === 'quiz' || name === 'quizresults'
    );
    
    if (!quizCollectionName) {
      console.error("Quiz collection not found!");
      return;
    }
    
    console.log(`Found quiz collection: ${quizCollectionName}`);
    
    // Query for quiz data
    const quizCollection = mongoose.connection.db.collection(quizCollectionName);
    
    // If we have a test quiz ID, use it to find the quiz
    if (global.testQuizId) {
      const quiz = await quizCollection.findOne({ 
        _id: new mongoose.Types.ObjectId(global.testQuizId) 
      });
      
      if (quiz) {
        console.log("Found quiz by ID:", JSON.stringify(quiz, null, 2));
      } else {
        console.error(`Quiz with ID ${global.testQuizId} not found!`);
      }
    }
    
    // Also try to find by session ID
    if (global.testSessionId) {
      const quiz = await quizCollection.findOne({ sessionId: global.testSessionId });
      
      if (quiz) {
        console.log("Found quiz by session ID:", JSON.stringify(quiz, null, 2));
      } else {
        console.error(`Quiz with session ID ${global.testSessionId} not found!`);
      }
    }
    
    // Check total count of quizzes
    const totalQuizzes = await quizCollection.countDocuments();
    console.log(`Total quizzes in database: ${totalQuizzes}`);
    
  } catch (error) {
    console.error('Error checking quiz data:', error);
  }
}
