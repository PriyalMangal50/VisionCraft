import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { backendUrl } from "../App";

const Navbar = ({ setToken }) => {
  const [admin, setAdmin] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch admin profile data
    const fetchAdminProfile = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/admin/profile`, {
          headers: {
            token: `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setAdmin(data);
        }
      } catch (error) {
        console.error("Error fetching admin profile:", error);
      }
    };
    
    if (token) {
      fetchAdminProfile();
    }
  }, [token]);

  return (
    <header className='flex items-center py-3 px-[4%] justify-between border-b border-gray-100 bg-white shadow-sm'>
      <Link to="/">
        <img className='w-[max(10%,120px)]' src={assets.logo} alt='logo' />
      </Link>
      
      <div className="flex items-center gap-4">
        <div className="hidden md:flex flex-col items-end">
          <span className="font-medium text-gray-800">{admin.name || 'Admin'}</span>
          <span className="text-sm text-gray-500">{admin.email}</span>
        </div>
        
        <button 
          onClick={() => setToken("")}
          className='bg-gray-700 hover:bg-gray-800 transition-colors text-white px-4 py-2 rounded-md text-sm flex items-center gap-2'
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm9 7a1 1 0 11-2 0 1 1 0 012 0zm-3 5a1 1 0 100-2 1 1 0 000 2zm0-10a1 1 0 100-2 1 1 0 000 2zm6 5a1 1 0 11-2 0 1 1 0 012 0zm-3 5a1 1 0 100-2 1 1 0 000 2zm0-10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
