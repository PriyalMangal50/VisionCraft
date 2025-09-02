
import express from 'express';
import multer from 'multer';
import * as importController from '../controllers/importProductsSmartController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/admin/import-products',
  upload.fields([
    { name: 'productsFile', maxCount: 1 },
    { name: 'images', maxCount: 100 }
  ]),
  importController.smartImport
);

export default router;
