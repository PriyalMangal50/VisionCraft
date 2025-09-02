import React, { useState } from "react";
import AddBlog from "./AddBlog";
import ListBlogs from "./ListBlogs";

const BlogManagement = ({ token }) => {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab("add")}
          className={`pb-2 px-4 font-medium ${
            activeTab === "add"
              ? "text-black border-b-2 border-black"
              : "text-gray-500"
          }`}
        >
          Add Blog Post
        </button>
        <button
          onClick={() => setActiveTab("list")}
          className={`pb-2 px-4 font-medium ${
            activeTab === "list"
              ? "text-black border-b-2 border-black"
              : "text-gray-500"
          }`}
        >
          Manage Blog Posts
        </button>
      </div>

      {/* Blog Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm text-gray-600">Total Posts</h3>
          <p className="text-2xl font-bold text-blue-600">--</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm text-gray-600">Published</h3>
          <p className="text-2xl font-bold text-green-600">--</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-sm text-gray-600">Drafts</h3>
          <p className="text-2xl font-bold text-yellow-600">--</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm text-gray-600">Total Views</h3>
          <p className="text-2xl font-bold text-purple-600">--</p>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "add" && <AddBlog token={token} />}
        {activeTab === "list" && <ListBlogs token={token} />}
      </div>
    </div>
  );
};

export default BlogManagement;
