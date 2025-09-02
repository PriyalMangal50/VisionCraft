// Smart Product Import Controller
// Handles: .xlsx + optional uploaded image files; uses placeholder when no match

import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utility: Normalize string for comparisons
function norm(str) {
  return (str || '').toString().trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Utility: Generate SKU
function generateSKU(modelNo, color, size) {
  return `${norm(modelNo)}-${norm(color)}-${norm(size)}`;
}

// Main import handler
export async function smartImport(req, res) {
  const logs = [];
  const summary = {
    imported: 0,
    imagesLinked: 0,
    missingOrFailed: 0,
    errors: []
  };

  const config = (() => {
    try {
      return req.body?.config ? JSON.parse(req.body.config) : { overwriteExisting: false };
    } catch {
      return { overwriteExisting: false };
    }
  })();

  const placeholderImageUrl = '/images/no_image.png';

  // 1) Parse Excel file to JSON rows
  let rows = [];
  try {
    if (req.files?.productsFile?.[0]?.path) {
      const workbook = xlsx.readFile(req.files.productsFile[0].path);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      rows = xlsx.utils.sheet_to_json(sheet);
    } else {
      return res.status(400).json({ success: false, message: 'productsFile is required' });
    }
  } catch (err) {
    return res.status(400).json({ success: false, message: `Failed to parse Excel: ${err.message}` });
  }

  // 2) Prepare uploaded image list for simple filename matching
  const uploadedImages = (req.files?.images || []).map(f => ({ path: f.path, name: (f.originalname || '').toLowerCase() }));

  // Helper to find an uploaded image candidate for a row
  function findImageForRow({ modelNo, color, size }) {
    const m = norm(modelNo);
    const c = norm(color);
    const s = norm(size);
    // Simple heuristic: filename contains modelNo and optionally color/size
    return uploadedImages.find(img => img.name.includes(m) && (c ? img.name.includes(c) : true) && (s ? img.name.includes(s) : true));
  }

  // 3) Iterate rows and import products
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    const modelNo = row['Model No.'] || row['modelNo'] || row['sku'] || '';
    const color = row['Color'] || row['color'] || '';
    const size = row['Size'] || row['size'] || '';
    const brand = row['Brand'] || row['brand'] || '';
    const category = row['Category'] || row['category'] || '';
    const name = row['Product'] || row['name'] || '';
    const priceRaw = row['Price'] || row['price'] || '';

    // Required field validation
    if (!name || !priceRaw || !category || !modelNo) {
      logs.push(`❌ Skipped row ${i + 1}: missing required field(s) [name: ${name}, price: ${priceRaw}, category: ${category}, modelNo: ${modelNo}]`);
      summary.errors.push(`Row ${i + 1}: missing required field(s)`);
      continue;
    }

    const price = Number(priceRaw);
    if (Number.isNaN(price)) {
      logs.push(`❌ Skipped row ${i + 1}: price is not a number [price: ${priceRaw}]`);
      summary.errors.push(`Row ${i + 1}: invalid price`);
      continue;
    }

    const sku = generateSKU(modelNo, color, size);

    try {
      // Duplicate prevention by SKU (case-insensitive)
      const existing = await productModel.findOne({ sku: { $regex: `^${sku}$`, $options: 'i' } });
      if (existing && !config.overwriteExisting) {
        logs.push(`⏭️ Duplicate SKU, skipped: ${sku}`);
        continue;
      }

      // Try uploaded image match; else use placeholder
      let imageUrl = placeholderImageUrl;
      const candidate = findImageForRow({ modelNo, color, size });
      if (candidate) {
        try {
          const result = await cloudinary.uploader.upload(candidate.path, {
            folder: `eyewear/${norm(category)}`
          });
          imageUrl = result.secure_url;
          summary.imagesLinked++;
        } catch (err) {
          logs.push(`⚠️ Cloudinary upload failed for ${sku}: ${err.message}. Using placeholder.`);
          summary.missingOrFailed++;
        }
      } else {
        summary.missingOrFailed++;
      }

      const doc = {
        sku,
        name,
        price,
        category,
        brand,
        color,
        size,
        image: imageUrl ? [imageUrl] : []
      };

      // Either update existing or create new
      if (existing && config.overwriteExisting) {
        await productModel.updateOne({ _id: existing._id }, { $set: doc });
      } else {
        const product = new productModel({ ...row, ...doc });
        await product.save();
      }

      summary.imported++;
    } catch (err) {
      logs.push(`❌ Error saving product for SKU ${sku}: ${err.message}`);
      summary.errors.push(`SKU ${sku}: save error`);
    }
  }

  return res.json({ success: true, summary, logs });
}
