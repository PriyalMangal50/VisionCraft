/**
 * Image Deduplication Utility
 * 
 * Provides functionality to detect and manage duplicate product images
 * in both the database and Cloudinary storage.
 */

import crypto from 'crypto';
import fs from 'fs';
import mongoose from 'mongoose';
import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// This would be a new model to track unique images
const ImageAssetSchema = new mongoose.Schema({
  hash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  cloudinaryPublicId: {
    type: String,
    required: true
  },
  cloudinaryUrl: {
    type: String,
    required: true
  },
  signature: {
    type: String
  },
  usageCount: {
    type: Number,
    default: 1
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

// Create a model if it doesn't exist
const ImageAsset = mongoose.models.ImageAsset || mongoose.model('ImageAsset', ImageAssetSchema);

/**
 * Calculate hash of an image file
 * @param {string} filePath - Path to the image file
 * @returns {string} - SHA256 hash of the file
 */
export const calculateImageHash = (filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const fileBuffer = fs.readFileSync(filePath);
      const hashSum = crypto.createHash('sha256');
      hashSum.update(fileBuffer);
      const hex = hashSum.digest('hex');
      resolve(hex);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Check if an image already exists based on its hash
 * @param {string} imageHash - The hash of the image
 * @returns {Object|null} - The existing image asset or null if not found
 */
export const findExistingImage = async (imageHash) => {
  try {
    const existingImage = await ImageAsset.findOne({ hash: imageHash });
    return existingImage;
  } catch (error) {
    console.error("Error finding existing image:", error);
    return null;
  }
};

/**
 * Register a new image in the system
 * @param {string} hash - The hash of the image
 * @param {Object} cloudinaryResult - The result from Cloudinary upload
 * @returns {Object} - The created image asset
 */
export const registerImage = async (hash, cloudinaryResult) => {
  try {
    const newImage = new ImageAsset({
      hash,
      cloudinaryPublicId: cloudinaryResult.public_id,
      cloudinaryUrl: cloudinaryResult.secure_url,
      signature: cloudinaryResult.signature
    });
    
    await newImage.save();
    return newImage;
  } catch (error) {
    console.error("Error registering image:", error);
    throw error;
  }
};

/**
 * Increment usage count for an existing image
 * @param {string} imageId - The ID of the image asset
 */
export const incrementImageUsage = async (imageId) => {
  try {
    await ImageAsset.findByIdAndUpdate(imageId, { $inc: { usageCount: 1 } });
  } catch (error) {
    console.error("Error incrementing image usage:", error);
  }
};

/**
 * Process an image for deduplication
 * @param {string} filePath - Path to the image file
 * @param {Object} uploadOptions - Options for Cloudinary upload
 * @returns {Object} - The image data including URL
 */
export const processImage = async (filePath, uploadOptions = {}, cloudinary) => {
  try {
    // Calculate the hash of the image
    const imageHash = await calculateImageHash(filePath);
    
    // Check if this image already exists
    const existingImage = await findExistingImage(imageHash);
    
    if (existingImage) {
      // Image already exists, increment its usage count
      await incrementImageUsage(existingImage._id);
      
      // Return the existing image data
      return {
        url: existingImage.cloudinaryUrl,
        public_id: existingImage.cloudinaryPublicId,
        isReused: true
      };
    } else {
      // Image doesn't exist, upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        resource_type: "image",
        ...uploadOptions
      });
      
      // Register the new image
      const newImage = await registerImage(imageHash, uploadResult);
      
      return {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        isReused: false
      };
    }
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
};

export default {
  processImage,
  calculateImageHash,
  findExistingImage,
  registerImage,
  incrementImageUsage
};

/**
 * Checks if an image with the same public_id already exists in Cloudinary
 * @param {string} publicId - The public ID to check
 * @returns {Promise<boolean>} - True if image exists, false otherwise
 */
export async function checkImageExists(publicId) {
  try {
    await cloudinary.api.resource(publicId);
    return true;
  } catch (error) {
    if (error.error && error.error.http_code === 404) {
      return false;
    }
    // For other errors (like auth errors), rethrow
    throw error;
  }
}

/**
 * Finds duplicate products by comparing model numbers
 * @param {string} modelNo - The model number to check
 * @returns {Promise<Object|null>} - Existing product with same model number or null
 */
export async function findDuplicateByModelNo(modelNo) {
  if (!modelNo) return null;
  
  try {
    const product = await productModel.findOne({ sku: modelNo });
    return product;
  } catch (error) {
    console.error("Error finding duplicate by model number:", error);
    return null;
  }
}

/**
 * Updates an existing product's image
 * @param {Object} product - The product document to update
 * @param {Object} newImageData - The new image data
 * @returns {Promise<boolean>} - True if update successful, false otherwise
 */
export async function updateProductImage(product, newImageData) {
  try {
    if (!product || !newImageData) return false;
    
    // Update the product with new image (keep the same array length)
    const newImages = [...product.image];
    newImages[0] = newImageData.url; // Replace the main image
    
    const newImageDetails = [...product.imageDetails];
    if (newImageDetails.length > 0) {
      newImageDetails[0] = newImageData; // Replace the main image details
    } else {
      newImageDetails.push(newImageData);
    }
    
    // Update the product
    product.image = newImages;
    product.imageDetails = newImageDetails;
    
    await product.save();
    return true;
  } catch (error) {
    console.error("Error updating product image:", error);
    return false;
  }
}

/**
 * Handles duplicate detection and management when uploading new images
 * @param {string} modelNo - The model number for the product
 * @param {string} imagePath - Path to the image file
 * @param {string} category - Product category
 * @returns {Promise<{isDuplicate: boolean, product: Object|null, message: string}>}
 */
export async function handleDuplicateDetection(modelNo, imagePath, category) {
  try {
    // Check if a product with this model number already exists
    const existingProduct = await findDuplicateByModelNo(modelNo);
    
    if (existingProduct) {
      return {
        isDuplicate: true,
        product: existingProduct,
        message: `Product with model number ${modelNo} already exists`
      };
    }
    
    return {
      isDuplicate: false,
      product: null,
      message: "No duplicate found"
    };
  } catch (error) {
    console.error("Error in duplicate detection:", error);
    return {
      isDuplicate: false,
      product: null,
      message: `Error checking for duplicates: ${error.message}`
    };
  }
}
