import { FACE_SHAPES, FRAME_SHAPES, USAGE_OPTIONS, FEATURE_OPTIONS, FEATURE_VALUE_TO_KEY } from './utils/quizConstants.js';
import productModel from './models/productModel.js';
import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

console.log('=== QUIZ VALUE CONSISTENCY TEST ===');
console.log('This test checks if values used in quiz options are consistent with the product database');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
};

// Function to test various quiz filters
const testQuizFiltering = async () => {
  console.log('\n=== Testing Face Shapes ===');
  
  // Test each face shape value
  for (const shape of FACE_SHAPES) {
    const query = { suitableFaceShapes: { $in: [shape.value] } };
    const count = await productModel.countDocuments(query);
    console.log(`Face shape "${shape.value}": ${count} products match`);
    
    if (count === 0) {
      console.log(`⚠️ WARNING: No products found for face shape "${shape.value}"`);
      console.log('This could indicate a mismatch between quiz values and product data');
    }
  }
  
  console.log('\n=== Testing Frame Shapes ===');
  
  // Test each frame shape value
  for (const shape of FRAME_SHAPES) {
    const query = { frameShape: shape.value };
    const count = await productModel.countDocuments(query);
    console.log(`Frame shape "${shape.value}": ${count} products match`);
    
    if (count === 0) {
      console.log(`⚠️ WARNING: No products found for frame shape "${shape.value}"`);
      console.log('This could indicate a mismatch between quiz values and product data');
    }
  }
  
  console.log('\n=== Testing Usage Options ===');
  
  // Test each usage option
  for (const usage of USAGE_OPTIONS) {
    const query = { usage: { $in: [usage.value] } };
    const count = await productModel.countDocuments(query);
    console.log(`Usage "${usage.value}": ${count} products match`);
    
    if (count === 0) {
      console.log(`⚠️ WARNING: No products found for usage "${usage.value}"`);
      console.log('This could indicate a mismatch between quiz values and product data');
    }
  }
  
  console.log('\n=== Testing Features ===');
  
  // Test each feature
  for (const feature of FEATURE_OPTIONS) {
    const query = {};
    query[`features.${feature.key}`] = true;
    
    const count = await productModel.countDocuments(query);
    console.log(`Feature "${feature.value}" (${feature.key}): ${count} products match`);
    
    if (count === 0) {
      console.log(`⚠️ WARNING: No products found with feature "${feature.value}" (${feature.key})`);
      console.log('This could indicate a mismatch between quiz values and product data');
    }
  }
  
  console.log('\n=== Testing Combined Filters ===');
  
  // Example: oval face with rectangle frames
  const combinedQuery1 = {
    suitableFaceShapes: { $in: ['oval'] },
    frameShape: 'Rectangle'
  };
  const combinedCount1 = await productModel.countDocuments(combinedQuery1);
  console.log(`Oval face + Rectangle frames: ${combinedCount1} products match`);
  
  // Example: computer usage with blue light filtering
  const combinedQuery2 = {
    usage: { $in: ['computer'] },
    'features.blueLight': true
  };
  const combinedCount2 = await productModel.countDocuments(combinedQuery2);
  console.log(`Computer usage + Blue Light filtering: ${combinedCount2} products match`);
};

// Main execution
const main = async () => {
  const connected = await connectDB();
  if (!connected) {
    console.error('Could not connect to database. Test aborted.');
    process.exit(1);
  }
  
  try {
    await testQuizFiltering();
    console.log('\n✅ Quiz value consistency test completed');
  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

main();
