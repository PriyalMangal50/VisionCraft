import { sanitizeImageUrl } from "../utils/image";
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Title from './Title';

const LatestBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/blog/published`);
        if (response.data.success) {
          // Get latest 3 blogs
          setBlogs(response.data.blogs.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBlogs();
  }, [backendUrl]);

  if (loading) {
    return (
      <div className="text-center py-10 font-arial">
        <div className="text-3xl">
          <Title text1={"LATEST FROM"} text2={"OUR BLOG"} />
        </div>
        <p className="text-gray-500 mt-2">Loading latest posts...</p>
      </div>
    );
  }

  if (blogs.length === 0) {
    return null; // Don't show the section if no blogs
  }

  return (
    <div className="my-16 font-arial">
      <div className="text-center py-8 text-3xl mb-4">
        <div className="section-title">
          <Title text1={"LATEST FROM"} text2={"OUR BLOG"} />
        </div>
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 mt-2">
          Discover the latest trends, styling tips, and fashion insights from our expert team.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 gap-y-8">
        {blogs.map((blog) => (
          <Link to={`/blog/${blog._id}`} key={blog._id} className="cursor-pointer group">
            <div className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-white h-full">
              <div className="overflow-hidden">
                <img
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                  src={sanitizeImageUrl(blog.featuredImage || '/images/no_image.png')}
                  alt={blog.title}
                  onError={e => { e.target.onerror = null; e.target.src = '/images/no_image.png'; }}
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <span className="badge bg-primary/10 text-primary px-3 py-1">{blog.category}</span>
                  <span>•</span>
                  <span>{blog.readTime} min read</span>
                </div>
                <h3 className="font-arial-extrabold text-primary text-base mb-3 line-clamp-2 group-hover:text-primary-dark transition-colors">
                  {blog.title}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {blog.excerpt}
                </p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">By {blog.author}</span>
                  <span className="text-xs text-secondary group-hover:text-secondary-dark transition-colors font-medium">Read More →</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link
          to="/blogs"
          className="btn-secondary px-8 py-3 text-sm"
        >
          VIEW ALL BLOG POSTS
        </Link>
      </div>
    </div>
  );
};

export default LatestBlogs;
