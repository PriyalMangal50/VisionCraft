import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const ListBlogs = ({ token }) => {
  const [list, setList] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    excerpt: "",
    author: "",
    category: "Fashion",
    status: "Draft",
    isFeature: false,
    readTime: 5,
  });

  const fetchList = async () => {
    try {
      console.log("Fetching blogs with token:", token ? "Token available" : "No token");
      console.log("Backend URL:", backendUrl);
      
      const response = await axios.get(`${backendUrl}/api/blog/list`, {
        headers: { token },
      });

      console.log("Blog fetch response:", response.data);

      if (response.data.success) {
        setList(response.data.blogs);
        console.log("Blogs loaded:", response.data.blogs.length);
      } else {
        console.error("Backend error:", response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Request failed:", error);
      console.error("Error details:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to fetch blogs");
    }
  };

  const removeBlog = async (id) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/blog/remove`,
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to remove blog");
    }
  };

  const updateBlog = async (id) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/blog/update`,
        { id, ...editForm },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setEditingBlog(null);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update blog");
    }
  };

  const startEditing = (blog) => {
    setEditingBlog(blog._id);
    setEditForm({
      title: blog.title,
      excerpt: blog.excerpt,
      author: blog.author,
      category: blog.category,
      status: blog.status,
      isFeature: blog.isFeature,
      readTime: blog.readTime,
    });
  };

  const cancelEditing = () => {
    setEditingBlog(null);
    setEditForm({
      title: "",
      excerpt: "",
      author: "",
      category: "Fashion",
      status: "Draft",
      isFeature: false,
      readTime: 5,
    });
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2">All Blog Posts</p>
      <div className="flex flex-col gap-2">
        {/* Headers */}
        <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Title</b>
          <b>Category</b>
          <b>Author</b>
          <b>Status</b>
          <b>Views</b>
          <b>Action</b>
          <b>Remove</b>
        </div>

        {/* Blog List */}
        {list.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_2fr_1fr] md:grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
            key={index}
          >
            {editingBlog === item._id ? (
              <>
                {/* Edit Mode */}
                <img className="w-12 h-12 object-cover" src={item.featuredImage} alt="" />
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="border px-2 py-1 text-xs"
                  />
                  <textarea
                    value={editForm.excerpt}
                    onChange={(e) =>
                      setEditForm({ ...editForm, excerpt: e.target.value })
                    }
                    className="border px-2 py-1 text-xs"
                    rows={2}
                    maxLength={200}
                  />
                </div>
                <select
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm({ ...editForm, category: e.target.value })
                  }
                  className="border px-2 py-1 text-xs"
                >
                  <option value="Fashion">Fashion</option>
                  <option value="Style Tips">Style Tips</option>
                  <option value="Product Care">Product Care</option>
                  <option value="Company News">Company News</option>
                  <option value="Trends">Trends</option>
                  <option value="Lifestyle">Lifestyle</option>
                </select>
                <input
                  type="text"
                  value={editForm.author}
                  onChange={(e) =>
                    setEditForm({ ...editForm, author: e.target.value })
                  }
                  className="border px-2 py-1 text-xs"
                />
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                  className="border px-2 py-1 text-xs"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
                <p>{item.views}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateBlog(item._id)}
                    className="text-green-600 cursor-pointer text-lg"
                  >
                    ✓
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="text-red-600 cursor-pointer text-lg"
                  >
                    ✗
                  </button>
                </div>
                <p
                  onClick={() => removeBlog(item._id)}
                  className="text-right md:text-center cursor-pointer text-lg"
                >
                  🗑️
                </p>
              </>
            ) : (
              <>
                {/* View Mode */}
                <img className="w-12 h-12 object-cover rounded" src={item.featuredImage} alt="" />
                <div>
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                    {item.excerpt}
                  </p>
                  {item.isFeature && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded mt-1 inline-block">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-xs">{item.category}</p>
                <p className="text-xs">{item.author}</p>
                <span className={`text-xs px-2 py-1 rounded ${
                  item.status === 'Published' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {item.status}
                </span>
                <p className="text-center">{item.views}</p>
                <p
                  onClick={() => startEditing(item)}
                  className="text-right md:text-center cursor-pointer text-lg"
                >
                  ✏️
                </p>
                <p
                  onClick={() => removeBlog(item._id)}
                  className="text-right md:text-center cursor-pointer text-lg"
                >
                  🗑️
                </p>
              </>
            )}
          </div>
        ))}
      </div>

      {list.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No blog posts found. Create your first blog post!</p>
        </div>
      )}
    </>
  );
};

export default ListBlogs;
