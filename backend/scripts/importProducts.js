import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import xlsx from "xlsx";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

import productModel from "../models/productModel.js";
import connectCloudinary from "../config/cloudinary.js";

// SKU generation utility
function generateSKU(modelNo, color, size) {
  // Normalize: lowercase, trim, replace spaces with dashes, remove special chars
  const norm = str => (str || "").toString().trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  return `${norm(modelNo)}-${norm(color)}-${norm(size)}`;
}

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    connectCloudinary();
    importAll();
  })
  .catch(err => console.error("MongoDB connection error:", err));

// Import all Excel files
async function importAll() {
  // Category is determined by the file name
  const categoryMapping = {
    'branded_frames.xlsx': 'Eyeglasses', 
    'branded_sunglasses.xlsx': 'Sunglasses'
  };
  
  // Process each Excel file
  for (const [fileName, category] of Object.entries(categoryMapping)) {
    console.log(`\n========== IMPORTING ${category.toUpperCase()} ==========`);
    await importFile(fileName, category);
  }
  
  console.log("\n✅ All products imported successfully");
  process.exit(0);
}

async function importFile(fileName, category) {
  console.log(`\nProcessing ${fileName} as ${category}...`);
  
  const filePath = path.join(__dirname, fileName);
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${fileName}`);
    return;
  }
  
  const workbook = xlsx.readFile(filePath);
  const sheetNames = workbook.SheetNames;
  
  let totalProcessed = 0;
  let totalImported = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  
  for (const sheetName of sheetNames) {
    console.log(`\nProcessing sheet: ${sheetName}`);
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet);
    
    console.log(`Found ${rows.length} products in sheet`);
    
    for (const row of rows) {
      totalProcessed++;
      const modelNo = row["Model No."];
      const color = row["Color"] || "";
      const size = row["Size"] || "";
      if (!modelNo) {
        console.log(`❌ Skipping row with missing Model No.`);
        totalErrors++;
        continue;
      }
      // Generate SKU
      const sku = generateSKU(modelNo, color, size);
      // Check if product already exists (case-insensitive)
      const existingProduct = await productModel.findOne({ sku: { $regex: `^${sku}$`, $options: 'i' } });
      if (existingProduct) {
        console.log(`⏭️ Skipping duplicate SKU: ${sku}`);
        totalSkipped++;
        continue;
      }
      try {
        // Check if image exists
        const imagePath = path.join(__dirname, '../public/images/products', `${modelNo}.jpg`);
        let imageData = [];
        let imagesURL = [];
        
        if (fs.existsSync(imagePath)) {
          // Upload to Cloudinary
          const sanitizedName = modelNo.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
          
          try {
            const result = await cloudinary.uploader.upload(imagePath, {
              resource_type: "image",
              folder: `eyewear/${category.toLowerCase()}`,
              public_id: `${sanitizedName}`,
              transformation: [{ width: 800, height: 800, crop: 'fill', quality: 'auto', fetch_format: 'auto' }],
              tags: [category, row["Gender"], row["Brand"]].filter(Boolean),
              context: `alt=${row["Brand"]} ${row["Product"]}|category=${category}|brand=${row["Brand"] || 'unbranded'}`
            });
            
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
            console.log(`🖼️ Uploaded image for ${modelNo}`);
          } catch (uploadError) {
            console.error(`❌ Error uploading image for ${modelNo}:`, uploadError.message);
            // Use placeholder image
            imagesURL.push(`https://res.cloudinary.com/dzoat29rk/image/upload/v1/eyewear/placeholder.jpg`);
          }
        } else {
          // Use placeholder image
          console.log(`⚠️ Image not found for ${modelNo}, using placeholder`);
          imagesURL.push(`https://res.cloudinary.com/dzoat29rk/image/upload/v1/eyewear/placeholder.jpg`);
        }
        
        // Parse and validate sizes
        let sizes = [];
        if (row["Size"]) {
          // Example format: "52-18-140" (lens width-bridge-temple length)
          const sizeParts = row["Size"].split("-");
          if (sizeParts.length === 3) {
            sizes = [
              {
                lensWidth: parseInt(sizeParts[0]) || 0,
                bridgeWidth: parseInt(sizeParts[1]) || 0,
                templeLength: parseInt(sizeParts[2]) || 0
              }
            ];
          } else {
            // Handle other size formats
            sizes = [{ size: row["Size"] }];
          }
        }
        
        // Create product with mapped fields
        const product = new productModel({
          name: `${row["Brand"]} ${row["Product"]}`.trim(),
          description: `${row["Brand"]} ${row["Product"]} ${row["Color"]} ${row["Material"]} ${category}. Model: ${modelNo}`,
          price: Number(row["Price"]),
          image: imagesURL,
          imageDetails: imageData,
          sku: sku,
          category: category,
          subCategory: row["Gender"] || "Unisex",
          brand: row["Brand"] || "",
          frameShape: row["Shape"] || "",
          frameMaterial: row["Material"] || "",
          frameColor: row["Color"] || "",
          sizes: sizes,
          prescription: category === "Eyeglasses",
          prescriptionRequired: category === "Eyeglasses" ? "optional" : "none",
          prescriptionType: category === "Eyeglasses" ? "eyeglasses" : 
                           category === "Sunglasses" ? "prescription_sunglasses" : "none",
          bestseller: false,
          date: Date.now(),
          suitableFaceShapes: [],
          usage: ["everyday"],
          features: {
            blueLight: false,
            lightweight: row["Material"]?.toLowerCase().includes("titanium") || false,
            polarized: category === "Sunglasses",
            transition: false
          },
          quizRelevanceScore: 0
        });
        
        await product.save();
        console.log(`✅ Imported: ${modelNo}`);
        totalImported++;
      } catch (err) {
        console.error(`❌ Error processing ${modelNo}:`, err.message);
        totalErrors++;
      }
    }
  }
  
  console.log(`\n📊 File ${fileName} summary:`);
  console.log(`- Total processed: ${totalProcessed}`);
  console.log(`- Successfully imported: ${totalImported}`);
  console.log(`- Skipped duplicates: ${totalSkipped}`);
  console.log(`- Errors: ${totalErrors}`);
}