import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 200,
  },
  author: {
    type: String,
    required: true,
    default: 'VisionCraft Team'
  },
  category: {
    type: String,
    required: true,
    enum: ['Fashion', 'Style Tips', 'Product Care', 'Company News', 'Trends', 'Lifestyle'],
    default: 'Fashion'
  },
  tags: [{
    type: String,
    trim: true
  }],
  featuredImage: {
    type: String,
    required: true,
  },
  images: {
    type: Array,
    default: [],
  },
  status: {
    type: String,
    enum: ['Draft', 'Published'],
    default: 'Draft'
  },
  isFeature: {
    type: Boolean,
    default: false,
  },
  readTime: {
    type: Number,
    default: 5, // minutes
  },
  views: {
    type: Number,
    default: 0,
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const blogModel = mongoose.model("Blog", blogSchema);

export default blogModel;
