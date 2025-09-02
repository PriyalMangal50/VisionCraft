import mongoose from "mongoose";
import "dotenv/config";

async function fixDatabaseIndex() {
  try {
    // Connect to the database
    console.log("Connecting to MongoDB...");
    await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`);
    console.log("Connected to MongoDB");

    // Get a reference to the products collection
    const db = mongoose.connection.db;
    const productsCollection = db.collection("products");

    // Option 1: Drop the problematic index
    console.log("Dropping the 'title_1' index...");
    await productsCollection.dropIndex("title_1");
    console.log("Index 'title_1' successfully dropped");

    /* 
    // Option 2: If you prefer to create a new index on the 'name' field
    // Uncomment this code if you want to create a new unique index on 'name'
    console.log("Creating new unique index on 'name' field...");
    await productsCollection.createIndex({ name: 1 }, { unique: true });
    console.log("New index on 'name' created successfully");
    */

    console.log("Database index fixed successfully");
  } catch (error) {
    if (error.codeName === 'IndexNotFound') {
      console.log("Index 'title_1' doesn't exist. Nothing to drop.");
    } else {
      console.error("Error fixing database index:", error);
    }
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

// Run the function
fixDatabaseIndex();
