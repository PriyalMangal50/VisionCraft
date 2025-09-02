import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Title from "../components/Title";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [featuredBlogs, setFeaturedBlogs] = useState([]);

  const categories = ["All", "Fashion", "Style Tips", "Product Care", "Company News", "Trends", "Lifestyle"];

  const fetchBlogs = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
      const response = await axios.get(`${backendUrl}/api/blog/published`);
      
      if (response.data.success) {
        setBlogs(response.data.blogs);
        setFeaturedBlogs(response.data.blogs.filter(blog => blog.isFeature).slice(0, 3));
      } else {
        toast.error("Failed to load blog posts");
      }
    } catch (error) {
      console.error("Blog fetch error:", error);
      toast.error("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = selectedCategory === "All" 
    ? blogs 
    : blogs.filter(blog => blog.category === selectedCategory);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 font-arial">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray">Loading blog posts...</p>
      </div>
    );
  }

  return (
    <div className="py-10 font-arial">
      {/* Header */}
      <div className="text-center mb-10">
        <Title text1={"OUR"} text2={"BLOG"} />
        <p className="text-gray max-w-2xl mx-auto mt-4">
          Discover the latest trends, style tips, and insights from the world of fashion. 
          Stay updated with our expert advice and company updates.
        </p>
      </div>

      {/* Featured Posts */}
      {featuredBlogs.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-arial-extrabold text-primary-dark mb-6">Featured Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredBlogs.map((blog) => (
              <Link key={blog._id} to={`/blog/${blog._id}`}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img 
                    src={blog.featuredImage} 
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <span className="text-xs bg-primary bg-opacity-10 text-primary px-2 py-1 rounded">
                      Featured
                    </span>
                    <h3 className="font-arial-extrabold text-lg mt-2 mb-2 line-clamp-2">{blog.title}</h3>
                    <p className="text-gray text-sm line-clamp-2">{blog.excerpt}</p>
                    <div className="flex items-center justify-between mt-4 text-xs text-gray">
                      <span>{blog.author}</span>
                      <span>{formatDate(blog.publishDate)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? "bg-primary text-white"
                : "bg-light-gray text-gray hover:bg-gray hover:text-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBlogs
          .filter(blog => !blog.isFeature) // Exclude featured posts from main grid
          .map((blog) => (
          <Link key={blog._id} to={`/blog/${blog._id}`}>
            <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={blog.featuredImage} 
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs bg-light-gray text-primary px-2 py-1 rounded">
                    {blog.category}
                  </span>
                  <span className="text-xs text-gray">
                    {blog.readTime} min read
                  </span>
                </div>
                <h3 className="font-arial-extrabold text-xl text-primary-dark mb-3 line-clamp-2">{blog.title}</h3>
                <p className="text-gray mb-4 line-clamp-3">{blog.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray">
                  <span>By {blog.author}</span>
                  <span>{formatDate(blog.publishDate)}</span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      if (filteredBlogs.length === 0 && !loading) {
        <div className="text-center py-10">
          <p className="text-gray">
            {selectedCategory === "All" 
              ? "No blog posts available yet. Check back soon for fresh content!" 
              : "No blog posts found for the selected category."}
          </p>
          {selectedCategory !== "All" && (
            <button 
              onClick={() => setSelectedCategory("All")}
              className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              View All Posts
            </button>
          )}
        </div>
      }

      {/* Newsletter CTA */}
      <div className="text-center mt-16 p-8 bg-gray-50 rounded-lg">
        <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
        <p className="text-gray-600 mb-6">
          Subscribe to our newsletter to get the latest blog posts and style updates delivered to your inbox.
        </p>
        <div className="flex max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-1 px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
          />
          <button className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
