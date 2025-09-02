import express from "express";
import { 
  importProducts, 
  getImportStatus, 
  deleteExcelFile, 
  listExcelFiles,
  deleteImageFolder,
  listImageFolders,
  listBatches,
  deleteBatchProducts
} from "../controllers/importController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current directory (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const importRouter = express.Router();

// Route for importing products from Excel with images
importRouter.post(
  "/products",
  adminAuth,
  upload.fields([
    { name: "excelFile", maxCount: 1 },
    { name: "imageZip", maxCount: 1 }
  ]),
  importProducts
);

// Route for deleting products by batch ID
importRouter.delete("/batch/:batchId", adminAuth, deleteBatchProducts);

// Get status of import operation
importRouter.get("/status", adminAuth, getImportStatus);

// List all uploaded Excel files
importRouter.get("/files", adminAuth, listExcelFiles);

// Delete a specific Excel file
importRouter.delete("/files/:filename", adminAuth, deleteExcelFile);

// List all uploaded image folders
importRouter.get("/images", adminAuth, listImageFolders);

// Delete a specific image folder
importRouter.delete("/images/:folderName", adminAuth, deleteImageFolder);

// List all import batches
importRouter.get("/batches", adminAuth, listBatches);

export default importRouter;
