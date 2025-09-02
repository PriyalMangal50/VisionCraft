import React, { useState } from "react";
import { assets } from "../assets/assets";
import api from "../api/http";
import { toast } from "react-toastify";

const AddBlog = ({ token }) => {
  const [featuredImage, setFeaturedImage] = useState(false);
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [author, setAuthor] = useState("VisionCraft Team");
  const [category, setCategory] = useState("Fashion");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("Draft");
  const [isFeature, setIsFeature] = useState(false);
  const [readTime, setReadTime] = useState(5);
  const [publishDate, setPublishDate] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      
      featuredImage && formData.append("featuredImage", featuredImage);
      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);

      formData.append("title", title);
      formData.append("content", content);
      formData.append("excerpt", excerpt);
      formData.append("author", author);
      formData.append("category", category);
      formData.append("tags", JSON.stringify(tags.split(",").map(tag => tag.trim()).filter(tag => tag)));
      formData.append("status", status);
      formData.append("isFeature", isFeature);
      formData.append("readTime", readTime);
      formData.append("publishDate", publishDate);

  const response = await api.post(`/api/blog/add`, formData);
      
      if (response.data.success) {
        toast.success(response.data.message);
        // Reset form
        setTitle("");
        setContent("");
        setExcerpt("");
        setAuthor("VisionCraft Team");
        setCategory("Fashion");
        setTags("");
        setStatus("Draft");
        setIsFeature(false);
        setReadTime(5);
        setPublishDate("");
        setFeaturedImage(false);
        setImage1(false);
        setImage2(false);
        setImage3(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to add blog post");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
      
      {/* Blog Title */}
      <div>
        <p className="mb-2">Blog Title</p>
        <input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          className="w-full max-w-[500px] px-3 py-2 border-2 border-gray-300"
          type="text"
          placeholder="Enter blog title"
          required
        />
      </div>

      {/* Blog Excerpt */}
      <div>
        <p className="mb-2">Blog Excerpt (Short Description)</p>
        <textarea
          onChange={(e) => setExcerpt(e.target.value)}
          value={excerpt}
          className="w-full max-w-[500px] px-3 py-2 border-2 border-gray-300"
          placeholder="Brief description for blog preview"
          required
          rows={2}
          maxLength={200}
        />
        <small className="text-gray-500">{excerpt.length}/200 characters</small>
      </div>

      {/* Blog Content */}
      <div>
        <p className="mb-2">Blog Content</p>
        <textarea
          onChange={(e) => setContent(e.target.value)}
          value={content}
          className="w-full max-w-[500px] px-3 py-2 border-2 border-gray-300"
          placeholder="Write your blog content here..."
          required
          rows={8}
        />
      </div>

      {/* Featured Image */}
      <div>
        <p className="mb-2">Featured Image</p>
        <label htmlFor="featuredImage">
          <img className="w-20" src={featuredImage ? URL.createObjectURL(featuredImage) : assets.upload_area} alt="" />
          <input onChange={(e) => setFeaturedImage(e.target.files[0])} type="file" id="featuredImage" hidden required />
        </label>
      </div>

      {/* Additional Images */}
      <div>
        <p className="mb-2">Additional Images (Optional)</p>
        <div className="flex gap-2">
          <label htmlFor="image1">
            <img className="w-20" src={image1 ? URL.createObjectURL(image1) : assets.upload_area} alt="" />
            <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
          </label>
          <label htmlFor="image2">
            <img className="w-20" src={image2 ? URL.createObjectURL(image2) : assets.upload_area} alt="" />
            <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden />
          </label>
          <label htmlFor="image3">
            <img className="w-20" src={image3 ? URL.createObjectURL(image3) : assets.upload_area} alt="" />
            <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden />
          </label>
        </div>
      </div>

      {/* Blog Details */}
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Author</p>
          <input
            onChange={(e) => setAuthor(e.target.value)}
            value={author}
            className="w-full px-3 py-2 border-2 border-gray-300"
            type="text"
            placeholder="Author name"
          />
        </div>

        <div>
          <p className="mb-2">Category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="w-full px-3 py-2 border-2 border-gray-300"
          >
            <option value="Fashion">Fashion</option>
            <option value="Style Tips">Style Tips</option>
            <option value="Product Care">Product Care</option>
            <option value="Company News">Company News</option>
            <option value="Trends">Trends</option>
            <option value="Lifestyle">Lifestyle</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Read Time (minutes)</p>
          <input
            onChange={(e) => setReadTime(e.target.value)}
            value={readTime}
            className="w-full px-3 py-2 border-2 border-gray-300"
            type="number"
            min="1"
            max="60"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <p className="mb-2">Tags (comma separated)</p>
        <input
          onChange={(e) => setTags(e.target.value)}
          value={tags}
          className="w-full max-w-[500px] px-3 py-2 border-2 border-gray-300"
          type="text"
          placeholder="fashion, style, eyewear, trending"
        />
      </div>

      {/* Publish Settings */}
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Status</p>
          <div className="flex gap-3">
            <div
              onClick={() => setStatus("Draft")}
              className={`cursor-pointer px-3 py-2 border-2 ${
                status === "Draft" ? "bg-yellow-100 border-yellow-500" : "border-gray-300"
              }`}
            >
              <p>Draft</p>
            </div>
            <div
              onClick={() => setStatus("Published")}
              className={`cursor-pointer px-3 py-2 border-2 ${
                status === "Published" ? "bg-green-100 border-green-500" : "border-gray-300"
              }`}
            >
              <p>Published</p>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-2">Featured Post</p>
          <div className="flex gap-3">
            <div
              onClick={() => setIsFeature(false)}
              className={`cursor-pointer px-3 py-2 border-2 ${
                !isFeature ? "bg-gray-100 border-gray-500" : "border-gray-300"
              }`}
            >
              <p>Normal</p>
            </div>
            <div
              onClick={() => setIsFeature(true)}
              className={`cursor-pointer px-3 py-2 border-2 ${
                isFeature ? "bg-blue-100 border-blue-500" : "border-gray-300"
              }`}
            >
              <p>Featured</p>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-2">Publish Date</p>
          <input
            onChange={(e) => setPublishDate(e.target.value)}
            value={publishDate}
            className="w-full px-3 py-2 border-2 border-gray-300"
            type="datetime-local"
          />
        </div>
      </div>

      <button type="submit" className="w-32 py-3 mt-4 bg-black text-white">
        ADD BLOG
      </button>
    </form>
  );
};

export default AddBlog;
