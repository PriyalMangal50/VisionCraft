import axios from 'axios';
import path from 'path';
import { generateSearchQuery } from './generateSearchQuery.js';
import { downloadImage } from './downloadImage.js';

export async function fetchProductImages({ product, max = 4, saveLocal = false, localFolder = 'uploads/fetched', uploadToCloudinary = false, cloudinary }) {
  const logs = [];
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    const cx = process.env.GOOGLE_CSE_ID;
    if (!apiKey || !cx) {
      logs.push('Google API not configured. Skipping.');
      return { urls: [], files: [], logs };
    }

    const q = generateSearchQuery({
      brand: product.brand,
      modelNo: product.modelNo || product.sku,
      color: product.color,
      size: product.size,
      category: product.category,
      name: product.name,
    });

    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(q)}&cx=${cx}&key=${apiKey}&searchType=image&num=${Math.min(max, 10)}`;
    const res = await axios.get(url);
    const items = res.data?.items || [];
    const firstUrls = items.map(i => i.link).filter(Boolean).slice(0, max);

    const urls = [];
    const files = [];

    for (let i = 0; i < firstUrls.length; i++) {
      const imgUrl = firstUrls[i];
      if (uploadToCloudinary && cloudinary) {
        try {
          const result = await cloudinary.uploader.upload(imgUrl, { folder: `eyewear/${(product.category || 'misc').toLowerCase()}` });
          urls.push(result.secure_url);
        } catch (e) {
          logs.push(`Cloudinary fetch upload failed: ${e.message}`);
        }
      } else if (saveLocal) {
        try {
          const file = await downloadImage(imgUrl, localFolder, `${(product.sku || 'item')}-${i+1}`);
          files.push(file);
          urls.push(`/` + file.replace(/\\/g, '/'));
        } catch (e) {
          logs.push(`Download failed: ${e.message}`);
        }
      } else {
        urls.push(imgUrl);
      }
    }

    return { urls, files, logs };
  } catch (err) {
    logs.push(`fetchProductImages error: ${err.message}`);
    return { urls: [], files: [], logs };
  }
}

export default fetchProductImages;
