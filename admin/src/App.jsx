import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import FAQManagement from "./pages/FAQManagement";
import BlogManagement from "./pages/BlogManagement";
import SizeChartFrames from "./pages/SizeChartFrames";
import SizeChartContacts from "./pages/SizeChartContacts";
import QuizProductEditor from "./pages/QuizProductEditor";
import ImportProducts from "./pages/ImportProducts";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import { ToastContainer } from 'react-toastify';
// Backend URL configuration with fallback for development
export const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

// Log backend URL on startup for debugging
console.log(`Backend URL: ${backendUrl}`);

export const currency = "₹"


const App = () => {
  const [token, setToken] = useState( localStorage.getItem("token") ? localStorage.getItem("token") : "")

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  // Log token state for debugging
  useEffect(() => {
    console.log("Current token state:", token ? "Token exists" : "No token");
  }, [token]);

  return (
    <div className='min-h-screen w-full'>
      <ToastContainer/>
      {token === ""
        ? <Login setToken={setToken}/>
        : <>
          {" "}
          <Navbar setToken={setToken} />
          <hr />
          <div className='flex w-full  gap-10 '>
            <Sidebar />
            <div className='py-5 w-full'>
              <Routes>
                <Route path='/' element={<Add token={token} />} />
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/list' element={<List token={token}/>} />
                <Route path='/orders' element={<Orders token={token} />} />
                <Route path='/faqs' element={<FAQManagement token={token} />} />
                <Route path='/blogs' element={<BlogManagement token={token} />} />
                <Route path='/import' element={<ImportProducts token={token} />} />
                <Route path='/size-chart-frames' element={<SizeChartFrames />} />
                <Route path='/size-chart-contacts' element={<SizeChartContacts />} />
                <Route path='/quiz-products' element={<QuizProductEditor token={token} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </>
      }
    </div>
  );
};

export default App;
