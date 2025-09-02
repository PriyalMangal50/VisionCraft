import { v2 as cloudinary } from "cloudinary";
import blogModel from "../models/blogModel.js";

// Add Blog Post
const addBlog = async (req, res) => {
  try {
    const { title, content, excerpt, author, category, tags, status, isFeature, readTime, publishDate } = req.body;
    
    const featuredImage = req.files.featuredImage && req.files.featuredImage[0];
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];

    if (!featuredImage) {
      return res.json({ success: false, message: "Featured image is required" });
    }

    // Upload featured image
    let featuredImageURL = await cloudinary.uploader.upload(featuredImage.path, {
      resource_type: "image",
    });

    // Upload additional images
    const additionalImages = [image1, image2, image3].filter((img) => img !== undefined);
    let imagesURL = [];
    
    if (additionalImages.length > 0) {
      imagesURL = await Promise.all(
        additionalImages.map(async (img) => {
          let result = await cloudinary.uploader.upload(img.path, {
            resource_type: "image",
          });
          return result.secure_url;
        })
      );
    }

    const blogData = {
      title,
      content,
      excerpt,
      author: author || 'VisionCraft Team',
      category: category || 'Fashion',
      tags: tags ? JSON.parse(tags) : [],
      featuredImage: featuredImageURL.secure_url,
      images: imagesURL,
      status: status || 'Draft',
      isFeature: isFeature === "true" ? true : false,
      readTime: Number(readTime) || 5,
      publishDate: publishDate ? new Date(publishDate) : Date.now(),
      date: Date.now(),
    };

    const blog = new blogModel(blogData);
    await blog.save();

    res.json({ success: true, message: "Blog post added successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// List all Blog Posts
const listBlogs = async (req, res) => {
  try {
    const blogs = await blogModel.find({}).sort({ publishDate: -1, date: -1 });
    res.json({ success: true, blogs });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// List Published Blog Posts (for frontend)
const listPublishedBlogs = async (req, res) => {
  try {
    console.log("Fetching published blogs...");
    const blogs = await blogModel.find({ status: 'Published' }).sort({ publishDate: -1 });
    console.log(`Found ${blogs.length} published blogs`);
    res.json({ success: true, blogs });
  } catch (error) {
    console.log("Error fetching blogs:", error);
    res.json({ success: false, message: error.message });
  }
};

// Get single Blog Post
const singleBlog = async (req, res) => {
  try {
    const { id } = req.body;
    const blog = await blogModel.findById(id);
    
    if (!blog) {
      return res.json({ success: false, message: "Blog post not found" });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.json({ success: true, blog });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update Blog Post
const updateBlog = async (req, res) => {
  try {
    const { id, title, content, excerpt, author, category, tags, status, isFeature, readTime, publishDate } = req.body;
    
    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (excerpt) updateData.excerpt = excerpt;
    if (author) updateData.author = author;
    if (category) updateData.category = category;
    if (tags) updateData.tags = JSON.parse(tags);
    if (status) updateData.status = status;
    if (isFeature !== undefined) updateData.isFeature = isFeature === "true";
    if (readTime) updateData.readTime = Number(readTime);
    if (publishDate) updateData.publishDate = new Date(publishDate);

    // Handle image updates if provided
    if (req.files && req.files.featuredImage) {
      const featuredImage = req.files.featuredImage[0];
      let featuredImageURL = await cloudinary.uploader.upload(featuredImage.path, {
        resource_type: "image",
      });
      updateData.featuredImage = featuredImageURL.secure_url;
    }

    await blogModel.findByIdAndUpdate(id, updateData);
    res.json({ success: true, message: "Blog post updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Remove Blog Post
const removeBlog = async (req, res) => {
  try {
    await blogModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Blog post removed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addBlog, listBlogs, listPublishedBlogs, singleBlog, updateBlog, removeBlog };
