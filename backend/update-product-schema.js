// This script will update the Product model schema to ensure
// proper handling of the name field and remove any existing title field
import mongoose from "mongoose";
import productModel from "./models/productModel.js";
import "dotenv/config";

async function updateProductSchema() {
  try {
    // Connect to the database
    console.log("Connecting to MongoDB...");
    await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`);
    console.log("Connected to MongoDB");
    
    // Get a reference to the products collection
    const db = mongoose.connection.db;
    const productsCollection = db.collection("products");
    
    // 1. Update any products that have title but no name
    console.log("Updating products with title but no name...");
    const result = await productsCollection.updateMany(
      { title: { $exists: true }, name: { $exists: false } },
      [{ $set: { name: "$title" } }]
    );
    console.log(`Updated ${result.modifiedCount} products`);

    // 2. Update any products that have null name
    console.log("Fixing products with null name...");
    const nullNameResult = await productsCollection.updateMany(
      { name: null },
      { $set: { name: "Untitled Product" } }
    );
    console.log(`Updated ${nullNameResult.modifiedCount} products with null name`);

    // 3. Remove title field from all documents
    console.log("Removing title field from all products...");
    const removeTitleResult = await productsCollection.updateMany(
      {},
      { $unset: { title: "" } }
    );
    console.log(`Removed title field from ${removeTitleResult.modifiedCount} products`);

    console.log("Product schema updated successfully");
  } catch (error) {
    console.error("Error updating product schema:", error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

// Run the function
updateProductSchema();
