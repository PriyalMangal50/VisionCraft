import mongoose from 'mongoose';
import { config } from 'dotenv';
import productModel from './models/productModel.js';
import { FACE_SHAPES, FEATURE_OPTIONS } from './utils/quizConstants.js';

// Load environment variables
config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Main function to test quiz filtering logic
const testQuizFiltering = async () => {
  console.log("\n=== Testing Quiz Filtering Logic ===\n");
  
  // Get all products
  const allProducts = await productModel.find({});
  console.log(`Total products in database: ${allProducts.length}`);
  
  // Print information about each product's quiz attributes
  console.log("\n=== Product Quiz Attributes ===\n");
  
  for (const product of allProducts) {
    console.log(`Product: ${product.name}`);
    console.log(`- ID: ${product._id}`);
    console.log(`- Face shapes: ${product.suitableFaceShapes?.length ? product.suitableFaceShapes.join(', ') : 'None'}`);
    console.log(`- Usage: ${product.usage?.length ? product.usage.join(', ') : 'None'}`);
    
    console.log("- Features:");
    if (product.features) {
      Object.entries(product.features).forEach(([key, value]) => {
        if (value === true) {
          console.log(`  • ${key}: Yes`);
        }
      });
    } else {
      console.log("  • None");
    }
    
    console.log(`- Quiz relevance score: ${product.quizRelevanceScore || 0}`);
    console.log("-------------------");
  }
  
  // Simulate a few sample quiz filters
  const sampleQuizFilters = [
    {
      name: "Oval face + Rectangle frame",
      query: {
        suitableFaceShapes: { $in: ['oval'] },
        frameShape: 'Rectangle'
      }
    },
    {
      name: "Computer usage",
      query: {
        usage: { $in: ['computer'] }
      }
    },
    {
      name: "Blue light filtering",
      query: {
        "features.blueLight": true
      }
    }
  ];
  
  console.log("\n=== Testing Sample Quiz Filters ===\n");
  
  for (const filter of sampleQuizFilters) {
    const matchingProducts = await productModel.find(filter.query);
    
    console.log(`Filter: ${filter.name}`);
    console.log(`Query: ${JSON.stringify(filter.query)}`);
    console.log(`Matching products: ${matchingProducts.length}`);
    
    if (matchingProducts.length > 0) {
      console.log("Products:");
      matchingProducts.forEach(product => {
        console.log(`- ${product.name} (ID: ${product._id})`);
      });
    } else {
      console.log("No matching products found");
    }
    
    console.log("-------------------");
  }
  
  console.log("\n=== Testing Complete ===\n");
};

// Run the test
const runTest = async () => {
  await connectDB();
  await testQuizFiltering();
  await mongoose.disconnect();
  console.log('MongoDB disconnected');
};

runTest().catch(console.error);
