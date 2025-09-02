import express from "express";
import { addBlog, listBlogs, listPublishedBlogs, singleBlog, updateBlog, removeBlog } from "../controllers/blogController.js";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/multer.js";

const blogRouter = express.Router();

blogRouter.post('/add', upload.fields([
  { name: 'featuredImage', maxCount: 1 },
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 }
]), adminAuth, addBlog);

blogRouter.post('/remove', adminAuth, removeBlog);
blogRouter.post('/single', singleBlog);
blogRouter.post('/update', upload.fields([
  { name: 'featuredImage', maxCount: 1 },
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 }
]), adminAuth, updateBlog);

blogRouter.get('/list', adminAuth, listBlogs);
blogRouter.get('/published', listPublishedBlogs);
blogRouter.get('/test', (req, res) => {
  res.json({ success: true, message: "Blog routes working!" });
});

export default blogRouter;
