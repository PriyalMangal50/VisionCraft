import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = () => {
  return (
    <aside className='w-[18%] min-h-screen border-r-2'>
      <div className='flex flex-col items-start gap-4 pt-6 pl-[20%] w-full text-sm'>

        <NavLink
          to='/add'
          className='flex items-center w-full gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'
        >
          <img className='w-5 h-5' src={assets.add_product_icon} alt='add product icon' />
          <p className='hidden md:block'>Add Product</p>
        </NavLink>

        <NavLink
          to='/list'
          className='flex items-center w-full gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'
        >
          <img className='w-5 h-5' src={assets.products_icon} alt='list products icon' />
          <p className='hidden sm:block'>List Products</p>
        </NavLink>

        <NavLink
          to='/orders'
          className='flex items-center w-full gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'
        >
          <img className='w-5 h-5' src={assets.order_icon} alt='orders icon' />
          <p className='hidden sm:block'>Orders</p>
        </NavLink>

        <NavLink
          to='/faqs'
          className='flex items-center w-full gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'
        >
          <img className='w-5 h-5' src={assets.faq_icon} alt='faq icon' />
          <p className='hidden sm:block'>FAQs</p>
        </NavLink>

        <NavLink
          to='/blogs'
          className='flex items-center w-full gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'
        >
          <img className='w-5 h-5' src={assets.blog_icon} alt='blog icon' />
          <p className='hidden sm:block'>Blogs</p>
        </NavLink>

        <NavLink
          to='/import'
          className='flex items-center w-full gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'
        >
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          <p className='hidden sm:block'>Import Products</p>
        </NavLink>
        

        
        <NavLink
          to='/quiz-products'
          className='flex items-center w-full gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'
        >
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <p className='hidden sm:block'>Quiz Products</p>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
