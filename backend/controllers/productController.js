import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
// import createError from "http-errors";
// import { successResponse } from "./response.controller.js";
import mongoose from "mongoose";

// SKU generation utility (same as in importProducts.js)
function generateSKU(modelNo, color, size) {
  const norm = str => (str || "").toString().trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  return `${norm(modelNo)}-${norm(color)}-${norm(size)}`;
}

// Helper: sanitize product image array to avoid external placeholders
function sanitizeProductImages(product) {
  const LOCAL_PLACEHOLDER = '/images/no_image.png';
  if (!product) return product;
  if (!Array.isArray(product.image)) product.image = [];
  product.image = product.image
    .filter(img => typeof img === 'string' && img.trim() !== '')
    .map(url => (/via\.placeholder\.com/i.test(url) ? LOCAL_PLACEHOLDER : url));
  if (product.image.length === 0) product.image = [LOCAL_PLACEHOLDER];
  return product;
}

//add product
const addProduct = async (req, res, next) => {
  try {
    const { 
      name, 
      description, 
      price, 
      category, 
      subCategory, 
      sizes,
      brand, 
      frameShape, 
      frameMaterial, 
      frameColor, 
      lensType, 
      prescription,
      prescriptionRequired,
      prescriptionType,
      bestseller,
      modelNo, // required for SKU
      color,   // required for SKU
      size     // required for SKU
    } = req.body;

    // Validate required fields
    if (!name || name.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: "Product name is required" 
      });
    }
    if (!modelNo) {
      return res.status(400).json({
        success: false,
        message: "Model No. is required for SKU generation"
      });
    }

    // Generate SKU
    const sku = generateSKU(modelNo, color, size);
    // Check for duplicate SKU (case-insensitive)
    const existingProduct = await productModel.findOne({ sku: { $regex: `^${sku}$`, $options: 'i' } });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: `Product with same SKU already exists: ${sku}`
      });
    }

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter((img) => img !== undefined);
    
    // Enhanced image processing with optimization
    let imageData = [];
    
    // Upload images to Cloudinary with enhanced options for professional results
    let imagesURL = await Promise.all(
      images.map(async (img, index) => {
        // Set transformation options based on image position
        // First image gets special treatment as the main product image
        const transformationOptions = index === 0 ? 
          { width: 800, height: 800, crop: 'fill', quality: 'auto', fetch_format: 'auto' } : 
          { width: 600, height: 600, crop: 'fill', quality: 'auto', fetch_format: 'auto' };
        
        // Create a unique public_id with product category and name for SEO benefits
        const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
        const uniqueIdentifier = Date.now().toString().slice(-6);
        
        let result = await cloudinary.uploader.upload(img.path, {
          resource_type: "image",
          folder: `eyewear/${category.toLowerCase()}`,
          public_id: `${sanitizedName}-${uniqueIdentifier}-${index + 1}`,
          transformation: [transformationOptions],
          tags: [category, subCategory, brand].filter(Boolean),
          context: `alt=${name}|category=${category}|brand=${brand || 'unbranded'}`
        });

        // Store comprehensive image metadata
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

        return result.secure_url;
      })
    );

    // Generate professional SKU (Stock Keeping Unit)
    const generateSKU = () => {
      const categoryPrefix = {
        'Eyeglasses': 'EG',
        'Sunglasses': 'SG',
        'Contact Lenses': 'CL'
      }[category] || 'OT';
      
      const brandInitials = (brand || 'XX').substring(0, 2).toUpperCase();
      const timestamp = Date.now().toString().slice(-6);
      
      return `${categoryPrefix}-${brandInitials}-${timestamp}`;
    };
    
    const productData = {
      name: name.trim(),
      description,
      price: Number(price),
      category,
      subCategory,
      brand: brand || "",
      frameShape: frameShape || "",
      frameMaterial: frameMaterial || "",
      frameColor: frameColor || "",
      lensType: lensType || "",
      prescription: prescription === "true" ? true : false,
      prescriptionRequired: prescriptionRequired || "none",
      prescriptionType: prescriptionType || "none",
      sizes: JSON.parse(sizes),
      bestseller: bestseller === "true" ? true : false,
      image: imagesURL,
      imageDetails: imageData,
      sku: sku, // Use generated SKU
      date: Date.now(),
    };
    
    // Make sure we're not using the title field at all
    delete productData.title;
    
    console.log('Creating new product:', productData.name);
    const product = new productModel(productData);
    await product.save();

    res.json({success:true , message:"Product added"})

  } catch (error) {
    console.log('Error adding product:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: "A product with this SKU or name already exists" 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Failed to add product. Please try again." 
    });
  }
};

//list all product
const listProducts = async (req, res, next) => {
  try {
  const products = await productModel.find({});
  products.forEach(p => sanitizeProductImages(p));
  res.json({success:true , products})

  } catch (error) {
    console.log(error);
   res.json({success:false , message: error.message})
  }
};

//remove product
const removeProduct = async (req, res, next) => {
  try {
     await productModel.findOneAndDelete(req.body.id);
     res.json({success:true, message:"Product Deleted"})

  } catch (error) {
    console.log(error);
   res.json({success:false , message: error.message})
  }
};


//get single product
const singleProduct = async (req, res, next) => {
  try {
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format"
      });
    }
    
    const product = await productModel.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    
    // Validate product image data
    if (!product.image || !Array.isArray(product.image)) {
      product.image = [];
      console.log("Product has invalid image data:", productId);
    }
    
    // Make sure all image URLs are valid strings and not external placeholder hosts
    const LOCAL_PLACEHOLDER = '/images/no_image.png';
    product.image = product.image
      .filter(img => typeof img === 'string' && img.trim() !== '')
      .map(url => {
        try {
          return /via\.placeholder\.com/i.test(url) ? LOCAL_PLACEHOLDER : url;
        } catch {
          return url;
        }
      });
    
    // Add default placeholder image if no valid images exist
    if (product.image.length === 0) {
      console.log("Product has no valid images, adding placeholder:", productId);
      // Use a data URI that's guaranteed to work without external dependencies
  product.image = [LOCAL_PLACEHOLDER];
    }
    
    res.json({success: true, product});

  } catch (error) {
    console.log("Error in singleProduct controller:", error);
    res.status(500).json({success: false, message: error.message || "Failed to retrieve product"});
  }
};

// filter products
const filterProducts = async (req, res, next) => {
  try {
    const { 
      category, 
      subCategory, 
      brand, 
      frameShape, 
      frameMaterial, 
      lensType, 
      priceRange,
      prescriptionRequired,
      prescriptionType
    } = req.body;
    
    let query = {};
    
    if (category) query.category = category;
    if (subCategory) query.subCategory = subCategory;
    if (brand) query.brand = brand;
    if (frameShape) query.frameShape = frameShape;
    if (frameMaterial) query.frameMaterial = frameMaterial;
    if (lensType) query.lensType = lensType;
    if (prescriptionRequired) query.prescriptionRequired = prescriptionRequired;
    if (prescriptionType) query.prescriptionType = prescriptionType;
    
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      query.price = { $gte: min };
      if (max) query.price.$lte = max;
    }
    
  const products = await productModel.find(query);
  products.forEach(p => sanitizeProductImages(p));
  res.json({success: true, products});
    
  } catch (error) {
    console.log(error);
    res.json({success: false, message: error.message});
  }
};

// Update product
const updateProduct = async (req, res, next) => {
  try {
    const { productId, updates } = req.body;
    
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Valid product ID is required" 
      });
    }
    
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "No updates provided" 
      });
    }
    
    // Validate that only allowed fields are being updated
    const allowedFields = [
      'name', 'description', 'price', 'category', 'subCategory', 
      'brand', 'frameShape', 'frameMaterial', 'frameColor', 'lensType',
      'prescription', 'prescriptionRequired', 'prescriptionType', 'bestseller',
      'suitableFaceShapes', 'usage', 'features', 'quizRelevanceScore'
    ];
    
    const updateFields = {};
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        updateFields[key] = updates[key];
      }
    });
    
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "No valid fields to update" 
      });
    }
    
    const product = await productModel.findByIdAndUpdate(
      productId,
      { $set: updateFields },
      { new: true } // Return updated document
    );
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }
    
    res.json({ 
      success: true, 
      message: "Product updated successfully", 
      product 
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { 
  addProduct, 
  listProducts, 
  removeProduct, 
  singleProduct, 
  filterProducts,
  updateProduct
};
