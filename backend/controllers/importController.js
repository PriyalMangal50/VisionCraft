import { v2 as cloudinary } from "cloudinary";
import xlsx from "xlsx";
import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";
import os from "os";
import productModel from "../models/productModel.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current directory (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Global variable to track import status
let importStatus = {
  inProgress: false,
  total: 0,
  processed: 0,
  imported: 0,
  skipped: 0,
  errors: 0,
  logs: [],
  startTime: null,
  endTime: null,
  category: null
};

/**
 * Import products from Excel file
 */
export const importProducts = async (req, res) => {
  try {
    // Check if another import is in progress
    if (importStatus.inProgress) {
      return res.status(409).json({ 
        success: false, 
        message: "Another import is already in progress",
        status: getStatusResponse()
      });
    }
    
    // Reset status for new import
    importStatus = {
      inProgress: true,
      total: 0,
      processed: 0,
      imported: 0,
      skipped: 0,
      errors: 0,
      logs: [],
      startTime: new Date(),
      endTime: null,
      category: null
    };
    
    console.log("Starting new import process");
    console.log("Files received:", req.files);
    
    // Check if Excel file was uploaded
    if (!req.files || !req.files.excelFile || !req.files.excelFile[0]) {
      importStatus.inProgress = false;
      return res.status(400).json({ 
        success: false, 
        message: "No Excel file uploaded" 
      });
    }
    
    const excelFile = req.files.excelFile[0];
    const imageZip = req.files.imageZip ? req.files.imageZip[0] : null;
    
    console.log(`Excel file: ${excelFile.originalname}, size: ${excelFile.size}`);
    if (imageZip) {
      console.log(`Image zip: ${imageZip.originalname}, size: ${imageZip.size}`);
    }
    
    // Get the category from the request or try to determine it from the file name
    const fileName = excelFile.originalname;
    let category = req.body.category;
    
    // If category wasn't provided in the request, try to determine it from the filename (backward compatibility)
    if (!category) {
      category = determineCategory(fileName);
    }
    
    importStatus.category = category;
    
    // Check if category is valid
    if (!category) {
      importStatus.inProgress = false;
      importStatus.logs.push(`❌ No category specified for file: ${fileName}`);
      return res.status(400).json({ 
        success: false, 
        message: "Please specify a product category (Eyeglasses, Sunglasses, or Contact Lenses)" 
      });
    }
    
    // Validate that the category is one of the allowed values
    const validCategories = ["Eyeglasses", "Sunglasses", "Contact Lenses"];
    if (!validCategories.includes(category)) {
      importStatus.inProgress = false;
      importStatus.logs.push(`❌ Invalid category: ${category}`);
      return res.status(400).json({ 
        success: false, 
        message: "Category must be one of: Eyeglasses, Sunglasses, or Contact Lenses" 
      });
    }

    // Add log
    importStatus.logs.push(`📊 Starting import for ${category}`);
    console.log(`Starting import process for ${category} from file ${fileName}`);

    // Generate a unique batch ID for this import
    const importBatchId = `batch_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    importStatus.logs.push(`🆔 Batch ID: ${importBatchId}`);
    console.log(`Generated batch ID: ${importBatchId}`);

    // Create temp directory for extracted images if zip file is provided
    let tempImageDir = null;
    if (imageZip) {
      tempImageDir = await extractImages(imageZip.path);
      importStatus.logs.push(`📁 Extracted images to temporary directory: ${tempImageDir}`);
      console.log(`Extracted images to: ${tempImageDir}`);
    }

    // Start import process in background
    processExcelFile(excelFile.path, category, tempImageDir, importBatchId)
      .catch(err => {
        console.error("Error in background import process:", err);
        importStatus.logs.push(`❌ Import process error: ${err.message}`);
        importStatus.inProgress = false;
        importStatus.endTime = new Date();
        importStatus.errors++;
      });

    // Return immediate response
    res.status(202).json({ 
      success: true, 
      message: `Import of ${category} started. Check status for updates.`,
      status: getStatusResponse()
    });

  } catch (error) {
    console.error("Import error:", error);
    importStatus.inProgress = false;
    importStatus.logs.push(`❌ Import error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete imported products by category or batch identifier
 */
export const deleteImport = async (req, res) => {
  try {
    const { category, batchId, createdAfter, createdBefore } = req.body;
    
    if (!category && !batchId && !createdAfter && !createdBefore) {
      return res.status(400).json({ 
        success: false, 
        message: "You must provide at least one filter: category, batchId, createdAfter, or createdBefore" 
      });
    }
    
    // Build the filter query
    const filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (batchId) {
      filter.batchId = batchId;
    }
    
    // Date range filters
    if (createdAfter || createdBefore) {
      filter.createdAt = {};
      
      if (createdAfter) {
        filter.createdAt.$gte = new Date(createdAfter);
      }
      
      if (createdBefore) {
        filter.createdAt.$lte = new Date(createdBefore);
      }
    }
    
    console.log("Deleting products with filter:", JSON.stringify(filter));
    
    // First, get the products that will be deleted so we can clean up Cloudinary images
    const productsToDelete = await productModel.find(filter);
    console.log(`Found ${productsToDelete.length} products to delete`);
    
    // Extract image public IDs for Cloudinary cleanup
    const imagePublicIds = [];
    productsToDelete.forEach(product => {
      if (product.images && Array.isArray(product.images)) {
        product.images.forEach(img => {
          // Extract public_id from Cloudinary URL or use the stored public_id if available
          if (img.public_id) {
            imagePublicIds.push(img.public_id);
          }
        });
      }
    });
    
    // Delete the products from MongoDB
    const deleteResult = await productModel.deleteMany(filter);
    console.log(`Deleted ${deleteResult.deletedCount} products`);
    
    // Clean up Cloudinary images
    if (imagePublicIds.length > 0) {
      console.log(`Cleaning up ${imagePublicIds.length} images from Cloudinary`);
      for (const publicId of imagePublicIds) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error(`Error deleting Cloudinary image ${publicId}:`, err);
        }
      }
    }
    
    return res.json({
      success: true,
      message: `Successfully deleted ${deleteResult.deletedCount} products and ${imagePublicIds.length} images`,
      deletedCount: deleteResult.deletedCount,
      imagesDeleted: imagePublicIds.length
    });

  } catch (error) {
    console.error("Import error:", error);
    importStatus.inProgress = false;
    importStatus.logs.push(`❌ Import error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get current status of import operation
 */
export const getImportStatus = (req, res) => {
  res.json({
    success: true,
    status: getStatusResponse()
  });
};

/**
 * Delete uploaded Excel files
 */
export const deleteExcelFile = async (req, res) => {
  try {
    const { filename } = req.params;
    
    if (!filename) {
      return res.status(400).json({
        success: false,
        message: "Filename is required"
      });
    }
    
    // Create the file path
    const filePath = path.join(__dirname, '../uploads', filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found"
      });
    }
    
    // Delete the file
    fs.unlinkSync(filePath);
    
    console.log(`File deleted successfully: ${filename}`);
    
    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
      filename
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete file",
      error: error.message
    });
  }
};

/**
 * List all uploaded Excel files
 */
export const listExcelFiles = async (req, res) => {
  try {
    // Create the directory path
    const dirPath = path.join(__dirname, '../uploads');
    const excelDirPath = path.join(__dirname, '../uploads/excel');
    
    // Create directories if they don't exist
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);
    }
    
    if (!fs.existsSync(excelDirPath)) {
      fs.mkdirSync(excelDirPath, { recursive: true });
      console.log(`Created directory: ${excelDirPath}`);
      
      // Return empty array since the directories were just created
      return res.status(200).json({
        success: true,
        message: "Files retrieved successfully (directories were just created)",
        files: []
      });
    }
    
    // Read all files in the directory
    const files = fs.readdirSync(dirPath)
      .filter(file => file.startsWith('excelFile-') && file.endsWith('.xlsx'));
    
    // Get file details
    const fileDetails = files.map(file => {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      
      return {
        name: file,
        path: filePath,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime
      };
    });
    
    return res.status(200).json({
      success: true,
      message: "Files retrieved successfully",
      files: fileDetails
    });
  } catch (error) {
    console.error("Error listing files:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to list files",
      error: error.message
    });
  }
};

/**
 * Delete an uploaded image folder
 */
export const deleteImageFolder = async (req, res) => {
  try {
    const { folderName } = req.params;
    
    if (!folderName) {
      return res.status(400).json({
        success: false,
        message: "Folder name is required"
      });
    }
    
    // Create the folder path
    const folderPath = path.join(__dirname, '../uploads/images', folderName);
    
    // Check if folder exists
    if (!fs.existsSync(folderPath)) {
      return res.status(404).json({
        success: false,
        message: "Image folder not found"
      });
    }
    
    // Delete the folder
    fs.rmSync(folderPath, { recursive: true, force: true });
    
    console.log(`Image folder deleted successfully: ${folderName}`);
    
    return res.status(200).json({
      success: true,
      message: "Image folder deleted successfully",
      folderName
    });
  } catch (error) {
    console.error("Error deleting image folder:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete image folder",
      error: error.message
    });
  }
};

/**
 * List all uploaded image folders
 */
export const listImageFolders = async (req, res) => {
  try {
    // Create the directory path
    const dirPath = path.join(__dirname, '../uploads/images');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);
      
      // Return empty array since the directory was just created
      return res.status(200).json({
        success: true,
        message: "Image folders retrieved successfully (directory was just created)",
        folders: []
      });
    }
    
    // Read all folders in the directory
    const folders = fs.readdirSync(dirPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    // Get folder details
    const folderDetails = folders.map(folder => {
      const folderPath = path.join(dirPath, folder);
      const stats = fs.statSync(folderPath);
      
      // Count files in folder
      let fileCount = 0;
      try {
        fileCount = fs.readdirSync(folderPath).length;
      } catch (err) {
        console.error(`Error reading files in folder ${folder}:`, err);
      }
      
      return {
        name: folder,
        path: folderPath,
        fileCount,
        created: stats.birthtime,
        modified: stats.mtime
      };
    });
    
    return res.status(200).json({
      success: true,
      message: "Image folders retrieved successfully",
      folders: folderDetails
    });
  } catch (error) {
    console.error("Error listing image folders:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to list image folders",
      error: error.message
    });
  }
};

/**
 * Delete products by batch ID
 */
export const deleteBatchProducts = async (req, res) => {
  try {
    const { batchId } = req.params;
    
    if (!batchId) {
      return res.status(400).json({ 
        success: false, 
        message: "Batch ID is required" 
      });
    }
    
    // Find products in this batch
    const products = await productModel.find({ batchId });
    
    if (products.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No products found with this batch ID" 
      });
    }
    
    // Extract Cloudinary image IDs for deletion
    const imageIds = [];
    products.forEach(product => {
      if (product.imageDetails && Array.isArray(product.imageDetails)) {
        product.imageDetails.forEach(img => {
          if (img.public_id) {
            imageIds.push(img.public_id);
          }
        });
      }
    });
    
    // Delete Cloudinary images if any
    if (imageIds.length > 0) {
      try {
        await cloudinary.api.delete_resources(imageIds);
        console.log(`Deleted ${imageIds.length} images from Cloudinary`);
      } catch (error) {
        console.error("Error deleting Cloudinary images:", error);
      }
    }
    
    // Delete products
    const deleteResult = await productModel.deleteMany({ batchId });
    
    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${deleteResult.deletedCount} products from batch ${batchId}`,
      deletedCount: deleteResult.deletedCount
    });
  } catch (error) {
    console.error("Error deleting batch products:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete batch products",
      error: error.message
    });
  }
};

/**
 * List all import batches with their statistics
 */
export const listBatches = async (req, res) => {
  try {
    // Check if there are any products with batchId first
    const hasProducts = await productModel.countDocuments({ batchId: { $ne: null } });
    
    // If there are no products with batchId, return an empty array
    if (hasProducts === 0) {
      return res.status(200).json({
        success: true,
        message: "No batches found",
        batches: []
      });
    }
    
    // Group products by batchId - wrap in try/catch for better error handling
    try {
      const batches = await productModel.aggregate([
        { $match: { batchId: { $ne: null } } },
        { 
          $group: {
            _id: "$batchId",
            count: { $sum: 1 },
            category: { $first: "$category" },
            sourceFile: { $first: "$sourceFile" },
            date: { $first: "$date" },
            importDate: { $first: "$date" }, // Add importDate for better readability
            categories: { $addToSet: "$category" }, // In case batch has multiple categories
            brands: { $addToSet: "$brand" } // List of brands in this batch
          }
        },
        { $sort: { date: -1 } } // Sort by date, newest first
      ]);
      
      return res.status(200).json({
        success: true,
        message: "Batches retrieved successfully",
        batches: batches || [] // Ensure we always return an array
      });
    } catch (aggregateError) {
      console.error("Error in aggregate query:", aggregateError);
      // Fall back to a simpler approach
      const distinctBatchIds = await productModel.distinct('batchId');
      
      const simpleBatches = distinctBatchIds
        .filter(id => id) // Filter out null/undefined
        .map(id => ({
          _id: id,
          count: 0,
          importDate: new Date()
        }));
      
      return res.status(200).json({
        success: true,
        message: "Batches retrieved (simplified due to aggregation error)",
        batches: simpleBatches
      });
    }
  } catch (error) {
    console.error("Error listing batches:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to list batches",
      error: error.message
    });
  }
};

// Helper Functions

/**
 * Determine product category from Excel file name
 */
function determineCategory(fileName) {
  const name = fileName.toLowerCase();
  
  if (name.includes("frames")) return "Eyeglasses";
  if (name.includes("sunglasses")) return "Sunglasses";
  if (name.includes("contact") || name.includes("lenses")) return "Contact Lenses";
  
  return null;
}

/**
 * Extract images from zip file to temp directory
 */
async function extractImages(zipPath) {
  try {
    // Create temporary directory
    const tempDir = path.join(os.tmpdir(), 'product-images-' + Date.now());
    fs.mkdirSync(tempDir, { recursive: true });
    
    console.log(`Extracting zip file from ${zipPath} to ${tempDir}`);
    
    // Extract zip file
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(tempDir, true);
    
    return tempDir;
  } catch (error) {
    importStatus.logs.push(`❌ Error extracting images: ${error.message}`);
    console.error("Error extracting images:", error);
    return null;
  }
}

/**
 * Find image files for a model number in directory
 * 
 * Naming convention:
 * - Single image: ModelNo.jpg (e.g., VPR63U.jpg)
 * - Multiple images: ModelNo.jpg, ModelNo_1.jpg, ModelNo_2.jpg, etc. (up to 4 images)
 * - Supported formats: .jpg, .jpeg, .png, .webp, .gif
 */
function findImageForModel(modelNo, imageDir) {
  if (!imageDir) return [];
  
  // Common image extensions
  const extensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const images = [];
  const imagesAdded = new Set(); // Track which images we've already added
  
  try {
    // Create the directory if it doesn't exist
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
      console.log(`Created image directory: ${imageDir}`);
      return []; // Return empty array since we just created the directory
    }
    
    // Get all files in the directory first
    const allFiles = fs.existsSync(imageDir) ? fs.readdirSync(imageDir) : [];
    
    // First try exact match with extensions (primary image)
    for (const ext of extensions) {
      const primaryImageName = modelNo + ext;
      if (allFiles.includes(primaryImageName)) {
        const filePath = path.join(imageDir, primaryImageName);
        images.push(filePath);
        imagesAdded.add(primaryImageName.toLowerCase());
        console.log(`Found primary image: ${filePath}`);
        break; // Found the primary image, move on to additional images
      }
    }
    
    // Check for _0 as primary image (alternative naming pattern)
    for (const ext of extensions) {
      const primaryImageName = `${modelNo}_0${ext}`;
      if (allFiles.includes(primaryImageName) && !imagesAdded.has(primaryImageName.toLowerCase())) {
        const filePath = path.join(imageDir, primaryImageName);
        images.push(filePath);
        imagesAdded.add(primaryImageName.toLowerCase());
        console.log(`Found _0 primary image: ${filePath}`);
        break;
      }
    }
    
    // Then look for image variations with _1, _2, _3, _4 suffixes (additional images)
    for (let i = 1; i <= 3; i++) { // Only up to 3 additional images (4 total)
      for (const ext of extensions) {
        const additionalImageName = `${modelNo}_${i}${ext}`;
        if (allFiles.includes(additionalImageName) && !imagesAdded.has(additionalImageName.toLowerCase())) {
          const filePath = path.join(imageDir, additionalImageName);
          images.push(filePath);
          imagesAdded.add(additionalImageName.toLowerCase());
          console.log(`Found additional image ${i}: ${filePath}`);
          break; // Found this numbered image, move to next number
        }
      }
    }
    
    // Case-insensitive match as fallback for any we missed
    const modelLower = modelNo.toLowerCase();
    
    for (const file of allFiles) {
      if (imagesAdded.has(file.toLowerCase())) continue; // Skip files we already added
      
      const fileBase = path.parse(file).name.toLowerCase();
      const fileExt = path.parse(file).ext.toLowerCase();
      
      // Only consider valid image extensions
      if (!extensions.includes(fileExt)) continue;
      
      // Match pattern: modelno, modelno_0, modelno_1, modelno_2, etc.
      if (fileBase === modelLower || 
          fileBase === `${modelLower}_0` || 
          fileBase === `${modelLower}_1` || 
          fileBase === `${modelLower}_2` || 
          fileBase === `${modelLower}_3`) {
        const filePath = path.join(imageDir, file);
        // Only add if not already in the array
        if (!images.includes(filePath)) {
          images.push(filePath);
        }
      }
    }
  } catch (err) {
    console.error("Error reading directory:", err);
  }
  
  // Limit to 4 images
  const result = images.slice(0, 4);
  
  // If no images found, return null to maintain backward compatibility
  return result.length > 0 ? result : null;
}

/**
 * Format status response for client
 */
function getStatusResponse() {
  const elapsedTime = importStatus.endTime 
    ? (importStatus.endTime - importStatus.startTime) / 1000
    : importStatus.startTime
      ? (new Date() - importStatus.startTime) / 1000
      : 0;
  
  return {
    inProgress: importStatus.inProgress,
    category: importStatus.category,
    total: importStatus.total,
    processed: importStatus.processed,
    imported: importStatus.imported,
    skipped: importStatus.skipped,
    errors: importStatus.errors,
    completionPercentage: importStatus.total > 0 
      ? Math.round((importStatus.processed / importStatus.total) * 100) 
      : 0,
    elapsedTime: elapsedTime.toFixed(1),
    logs: importStatus.logs.slice(-20), // Only return last 20 logs
    startTime: importStatus.startTime,
    endTime: importStatus.endTime
  };
}

/**
 * Main function to process Excel file and import products
 */
async function processExcelFile(excelPath, category, imageDir, batchId = null) {
  try {
    console.log(`Processing Excel file: ${excelPath}, category: ${category}`);
    
    // Read Excel file
    const workbook = xlsx.readFile(excelPath);
    const sheetNames = workbook.SheetNames;
    
    // Process each sheet
    for (const sheetName of sheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const rows = xlsx.utils.sheet_to_json(sheet);
      
      // Update total count
      importStatus.total += rows.length;
      importStatus.logs.push(`Found ${rows.length} products in sheet: ${sheetName}`);
      console.log(`Processing sheet ${sheetName} with ${rows.length} products`);
      
      // Process each row
      for (const row of rows) {
        importStatus.processed++;
        
        try {
          // Extract model number
          const modelNo = row["Model No."];
          
          if (!modelNo) {
            importStatus.errors++;
            importStatus.logs.push(`❌ Skipping row with missing Model No.`);
            continue;
          }
          
          console.log(`Processing product with Model No: ${modelNo}`);
          
          // Check if product already exists
          const existingProduct = await productModel.findOne({ sku: modelNo });
          if (existingProduct) {
            // If product exists, we'll just update the images if any are found
            if (imageDir) {
              const imagePaths = findImageForModel(modelNo, imageDir);
              if (imagePaths && imagePaths.length > 0) {
                await updateProductImage(existingProduct, imagePaths, category);
                importStatus.logs.push(`🔄 Updated ${imagePaths.length} images for existing product: ${modelNo}`);
                importStatus.skipped++;
                continue;
              }
            }
            
            importStatus.logs.push(`⏭️ Skipping duplicate: ${modelNo}`);
            importStatus.skipped++;
            continue;
          }
          
          // Process product images
          let imageData = [];
          let imagesURL = [];
          
          if (imageDir) {
            const imagePaths = findImageForModel(modelNo, imageDir);
            if (imagePaths && imagePaths.length > 0) {
              // Upload each image to Cloudinary
              for (let i = 0; i < imagePaths.length; i++) {
                const imagePath = imagePaths[i];
                const suffix = i > 0 ? `_${i}` : '';
                const result = await uploadToCloudinary(imagePath, `${modelNo}${suffix}`, category, row);
                
                if (result) {
                  imageData.push({
                    url: result.secure_url,
                    public_id: result.public_id,
                    signature: result.signature,
                    width: result.width,
                    height: result.height,
                    format: result.format,
                    resourceType: result.resource_type,
                    bytes: result.bytes,
                    version: result.version
                  });
                
                imagesURL.push(result.secure_url);
                importStatus.logs.push(`🖼️ Uploaded image ${i+1} for ${modelNo}`);
              }
              }
            } else {
              // Use local placeholder served by the frontend app
              imagesURL.push('/images/no_image.png');
              importStatus.logs.push(`⚠️ No image found for ${modelNo}, using local placeholder`);
            }
          } else {
            // No image directory provided, use local placeholder
            imagesURL.push('/images/no_image.png');
          }
          
          // Parse sizes based on category
          const sizes = parseSizes(row, category);
          
          // Use provided description or default
          const description = row["Description"] && row["Description"].trim() 
            ? row["Description"].trim()
            : `Lorem ipsum dolor sit amet, consectetur adipiscing elit. ${row["Brand"] || ''} ${row["Product"] || ''} ${row["Color"] || ''} ${category} with model number ${modelNo}.`;
          
          // Create new product
          const productData = {
            name: `${row["Brand"] || ''} ${row["Product"] || ''}`.trim(),
            description,
            price: Number(row["Price"]) || 0,
            image: imagesURL,
            imageDetails: imageData,
            sku: modelNo,
            category,
            subCategory: row["Gender"] || "Unisex",
            brand: row["Brand"] || "",
            frameShape: row["Shape"] || "",
            frameMaterial: row["Material"] || "",
            frameColor: row["Color"] || row["Color Text"] || "",
            lensType: category === "Contact Lenses" ? "Contact Lens" : "",
            sizes,
            stock: Number(row["Stock"]) || 10, // Default to 10 if not specified
            prescription: category === "Contact Lenses" || category === "Eyeglasses",
            prescriptionRequired: category === "Contact Lenses" ? "required" : 
                                 category === "Eyeglasses" ? "optional" : "none",
            prescriptionType: category === "Contact Lenses" ? "contacts" : 
                             category === "Eyeglasses" ? "eyeglasses" : 
                             category === "Sunglasses" ? "prescription_sunglasses" : "none",
            bestseller: false,
            date: Date.now(),
            batchId: batchId, // Add batch ID to track which import this product came from
            sourceFile: path.basename(excelPath), // Store the source filename
            suitableFaceShapes: [],
            usage: ["everyday"],
            features: {
              blueLight: false,
              lightweight: row["Material"]?.toLowerCase().includes("titanium") || false,
              polarized: category === "Sunglasses",
              transition: false
            },
            quizRelevanceScore: 0
          };
          
          // Save product to database
          const product = new productModel(productData);
          await product.save();
          
          importStatus.imported++;
          importStatus.logs.push(`✅ Imported: ${modelNo}`);
          
        } catch (error) {
          importStatus.errors++;
          importStatus.logs.push(`❌ Error processing row: ${error.message}`);
          console.error("Error processing row:", error);
        }
      }
    }
    
  } catch (error) {
    importStatus.logs.push(`❌ Excel processing error: ${error.message}`);
    console.error("Excel processing error:", error);
  } finally {
    // Clean up temporary directory
    if (imageDir && fs.existsSync(imageDir)) {
      try {
        fs.rmSync(imageDir, { recursive: true, force: true });
        console.log(`Cleaned up temporary directory: ${imageDir}`);
      } catch (err) {
        console.error("Error cleaning up temp directory:", err);
      }
    }
    
    // Clean up temporary Excel file
    if (excelPath && fs.existsSync(excelPath)) {
      try {
        fs.unlinkSync(excelPath);
        console.log(`Removed temporary Excel file: ${excelPath}`);
      } catch (err) {
        console.error("Error removing Excel file:", err);
      }
    }
    
    // Update import status
    importStatus.inProgress = false;
    importStatus.endTime = new Date();
    importStatus.logs.push(`✨ Import completed: ${importStatus.imported} imported, ${importStatus.skipped} skipped, ${importStatus.errors} errors`);
    console.log(`Import completed: ${importStatus.imported} imported, ${importStatus.skipped} skipped, ${importStatus.errors} errors`);
  }
}

/**
 * Parse size field based on product category
 */
function parseSizes(row, category) {
  const sizes = [];
  
  if (!row["Size"]) {
    return category === "Contact Lenses" ? [{ size: "Standard" }] : [{ size: "One Size" }];
  }
  
  if (category === "Eyeglasses" || category === "Sunglasses") {
    // For eyewear, try to parse "lens width-bridge-temple length" format
    const sizeParts = String(row["Size"]).split("-");
    
    if (sizeParts.length === 3) {
      sizes.push({
        lensWidth: parseInt(sizeParts[0]) || 0,
        bridgeWidth: parseInt(sizeParts[1]) || 0,
        templeLength: parseInt(sizeParts[2]) || 0,
        size: row["Size"] // Keep original string as well
      });
    } else {
      sizes.push({ size: row["Size"] });
    }
  } else if (category === "Contact Lenses") {
    // For contacts, try to parse "base curve/diameter" format
    const sizeParts = String(row["Size"]).split("/");
    
    if (sizeParts.length === 2) {
      sizes.push({
        baseCurve: parseFloat(sizeParts[0]) || 0,
        diameter: parseFloat(sizeParts[1]) || 0,
        size: row["Size"] // Keep original string as well
      });
    } else {
      sizes.push({ size: row["Size"] });
    }
  }
  
  return sizes;
}

/**
 * Update product image for an existing product
 */
async function updateProductImage(product, imagePath, category) {
  try {
    const modelNo = product.sku;
    
    // Handle both single imagePath and array of imagePaths
    const imagePaths = Array.isArray(imagePath) ? imagePath : [imagePath];
    const imageDetails = [];
    const imageUrls = [];
    
    // Process each image
    for (let i = 0; i < imagePaths.length && i < 4; i++) {
      const path = imagePaths[i];
      const suffix = i > 0 ? `_${i}` : '';
      const result = await uploadToCloudinary(path, `${modelNo}${suffix}`, category, { Brand: product.brand });
      
      if (result) {
        const imageDetail = {
          url: result.secure_url,
          public_id: result.public_id,
          signature: result.signature,
          width: result.width,
          height: result.height,
          format: result.format,
          resourceType: result.resource_type,
          bytes: result.bytes,
          version: result.version
        };
        
        imageDetails.push(imageDetail);
        imageUrls.push(result.secure_url);
      }
    }
    
    if (imageUrls.length > 0) {
      // Update product with new images
      product.image = imageUrls;
      product.imageDetails = imageDetails;
      
      await product.save();
      return true;
    }
    return false;
  } catch (error) {
    importStatus.logs.push(`❌ Error updating images for ${product.sku}: ${error.message}`);
    console.error(`Error updating images for ${product.sku}:`, error);
    return false;
  }
}

/**
 * Upload image to Cloudinary
 */
async function uploadToCloudinary(imagePath, modelNo, category, row) {
  try {
    const sanitizedName = modelNo.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    
    console.log(`Uploading image to Cloudinary: ${imagePath} for model ${modelNo}`);
    
    const result = await cloudinary.uploader.upload(imagePath, {
      resource_type: "image",
      folder: `eyewear/${category.toLowerCase()}`,
      public_id: `${sanitizedName}`,
      transformation: [{ width: 800, height: 800, crop: 'fill', quality: 'auto', fetch_format: 'auto' }],
      tags: [category, row["Gender"], row["Brand"]].filter(Boolean),
      context: `alt=${row["Brand"] || ''} ${row["Product"] || ''}|category=${category}|brand=${row["Brand"] || 'unbranded'}`
    });
    
    console.log(`Cloudinary upload successful: ${result.secure_url}`);
    return result;
  } catch (error) {
    importStatus.logs.push(`❌ Error uploading image to Cloudinary: ${error.message}`);
    console.error("Cloudinary upload error:", error);
    return null;
  }
}
