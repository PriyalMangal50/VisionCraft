import React, { useEffect, useState } from "react";
import axios from "axios";

const BlogTest = () => {
  const [result, setResult] = useState("Testing...");

  useEffect(() => {
    const testAPI = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
        console.log("Testing with backend URL:", backendUrl);
        
        // Test 1: Basic connection
        const testResponse = await axios.get(`${backendUrl}/api/blog/test`);
        console.log("Test response:", testResponse.data);
        
        // Test 2: Fetch blogs
        const blogResponse = await axios.get(`${backendUrl}/api/blog/published`);
        console.log("Blog response:", blogResponse.data);
        
        setResult(`
          Test Route: ${JSON.stringify(testResponse.data)}
          
          Blog Route: ${JSON.stringify(blogResponse.data)}
          
          Blog Count: ${blogResponse.data.blogs ? blogResponse.data.blogs.length : 0}
        `);
      } catch (error) {
        console.error("API Test Error:", error);
        setResult(`Error: ${error.message}
        
        Error Details: ${JSON.stringify(error.response?.data || error)}
        
        Backend URL: ${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}`);
      }
    };

    testAPI();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Blog API Test</h1>
      <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
        {result}
      </pre>
    </div>
  );
};

export default BlogTest;
