import React, { useState } from "react";
import api from "../api/http";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Login = ({setToken}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      
  const response = await api.post(`/api/user/admin`, {
        email,
        password
      });
        
      if (response.data.success) {
        toast.success("Login successful!");
        setToken(response.data.token);
      } else {
        toast.error("Admin login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center w-full bg-gray-50'>
      <div className='bg-white shadow-lg rounded-lg px-8 py-8 max-w-md w-full border border-gray-100'>
        <div className="flex flex-col items-center mb-6">
          <img src={assets.logo} alt="Logo" className="h-16 mb-2" />
          <h1 className='text-2xl font-semibold'>Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Login to access your admin panel</p>
        </div>
        
        <form onSubmit={onSubmitHandler}>
          <div className='mb-4'>
            <label htmlFor="email" className='text-sm font-medium text-gray-700 mb-2 block'>
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className='rounded-md w-full pl-10 px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                type='email'
                placeholder='admin@example.com'
                required
              />
            </div>
          </div>
          
          <div className='mb-6'>
            <label htmlFor="password" className='text-sm font-medium text-gray-700 mb-2 block'>
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='rounded-md w-full pl-10 px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                type='password'
                placeholder='Enter your password'
                required
              />
            </div>
          </div>
          
          <button
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            type='submit'
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : "Sign In"}
          </button>
        </form>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        © {new Date().getFullYear()} EyeWear Admin Portal
      </div>
    </div>
  );
};

export default Login;
