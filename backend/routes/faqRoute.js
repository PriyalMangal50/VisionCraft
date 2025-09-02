import express from "express";
import { addFAQ, listFAQs, removeFAQ, updateFAQ, singleFAQ } from "../controllers/faqController.js";
import adminAuth from "../middleware/adminAuth.js";

const faqRouter = express.Router();

faqRouter.post('/add', adminAuth, addFAQ);
faqRouter.post('/remove', adminAuth, removeFAQ);
faqRouter.post('/single', adminAuth, singleFAQ);
faqRouter.post('/update', adminAuth, updateFAQ);
faqRouter.get('/list', listFAQs);

export default faqRouter;
