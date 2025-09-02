import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="font-sans bg-gray-50 mt-24 w-full border-t border-gray-200">
      <div className="content-container">
        {/* Top Footer Section */}
        <div className='py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12'>
          <div className='space-y-6'>
            <Link to="/">
              <img className='w-36 transition-transform hover:scale-105 duration-300' src={assets.logo} alt='VisionCraft Logo' />
            </Link>
            <p className='text-gray-600 leading-relaxed'>
              Stay connected with VisionCraft for the latest trends, exclusive
              offers, and style inspiration for all your eyewear needs.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex space-x-3">
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary-700 hover:text-white hover:border-primary-700 transition-all duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
              </a>
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary-700 hover:text-white hover:border-primary-700 transition-all duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.001 2.002c-5.522 0-9.999 4.477-9.999 9.999 0 4.99 3.656 9.126 8.437 9.879v-6.988h-2.54v-2.891h2.54V9.798c0-2.508 1.493-3.891 3.776-3.891 1.094 0 2.24.195 2.24.195v2.459h-1.264c-1.24 0-1.628.772-1.628 1.563v1.875h2.771l-.443 2.891h-2.328v6.988C18.344 21.129 22 16.992 22 12.001c0-5.522-4.477-9.999-9.999-9.999z"></path>
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary-700 hover:text-white hover:border-primary-700 transition-all duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"></path>
                </svg>
              </a>
              <a href="#" aria-label="YouTube" className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary-700 hover:text-white hover:border-primary-700 transition-all duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21.593 7.203a2.506 2.506 0 00-1.762-1.766C18.265 5.007 12 5 12 5s-6.264-.007-7.831.44a2.5 2.5 0 00-1.766 1.763C2.007 8.766 2 12 2 12s.007 3.234.44 4.797a2.5 2.5 0 001.767 1.763c1.566.44 7.83.44 7.83.44s6.265 0 7.831-.44a2.5 2.5 0 001.767-1.763c.436-1.566.437-4.797.437-4.797s-.007-3.234-.437-4.797zM10 15V9l5.177 3L10 15z"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div className='space-y-6'>
            <h3 className='font-display font-semibold text-lg text-gray-900'>Shop</h3>
            <ul className='space-y-3'>
              <li>
                <Link to="/collection" className="text-gray-600 hover:text-primary-700 transition-colors flex items-center gap-2">
                  <svg className="w-3 h-3 text-primary-600" fill="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"></path></svg>
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/collection?category=eyeglasses" className="text-gray-600 hover:text-primary-700 transition-colors flex items-center gap-2">
                  <svg className="w-3 h-3 text-primary-600" fill="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"></path></svg>
                  Eyeglasses
                </Link>
              </li>
              <li>
                <Link to="/collection?category=sunglasses" className="text-gray-600 hover:text-primary-700 transition-colors flex items-center gap-2">
                  <svg className="w-3 h-3 text-primary-600" fill="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"></path></svg>
                  Sunglasses
                </Link>
              </li>
              <li>
                <Link to="/collection?category=contact-lenses" className="text-gray-600 hover:text-primary-700 transition-colors flex items-center gap-2">
                  <svg className="w-3 h-3 text-primary-600" fill="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"></path></svg>
                  Contact Lenses
                </Link>
              </li>
              <li>
                <Link to="/frame-finder" className="text-gray-600 hover:text-primary-700 transition-colors flex items-center gap-2">
                  <svg className="w-3 h-3 text-primary-600" fill="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"></path></svg>
                  Frame Finder
                </Link>
              </li>
            </ul>
          </div>
          
          <div className='space-y-6'>
            <h3 className='font-display font-semibold text-lg text-gray-900'>Company</h3>
            <ul className='space-y-3'>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary-700 transition-colors flex items-center gap-2">
                  <svg className="w-3 h-3 text-primary-600" fill="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"></path></svg>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-gray-600 hover:text-primary-700 transition-colors flex items-center gap-2">
                  <svg className="w-3 h-3 text-primary-600" fill="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"></path></svg>
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-primary-700 transition-colors flex items-center gap-2">
                  <svg className="w-3 h-3 text-primary-600" fill="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"></path></svg>
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="text-gray-600 hover:text-primary-700 transition-colors flex items-center gap-2">
                  <svg className="w-3 h-3 text-primary-600" fill="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"></path></svg>
                  Size Guide
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary-700 transition-colors flex items-center gap-2">
                  <svg className="w-3 h-3 text-primary-600" fill="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"></path></svg>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div className='space-y-6'>
            <h3 className='font-display font-semibold text-lg text-gray-900'>Contact</h3>
            <ul className='space-y-4 text-gray-600'>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                9795XXXXXX
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                visioncraft@gmail.com
              </li>
              <li className="mt-4">
                <div className="flex gap-4">
                  <a href="#" className="text-gray-600 hover:text-primary-700 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-primary-700 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-primary-700 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                    </svg>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className='bg-primary bg-opacity-10 w-full'>
        <hr className="border-primary border-opacity-10" />
        <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] max-w-screen-2xl mx-auto">
          <p className='py-5 text-sm text-center text-gray-600'>
            Made with ❤️ by {"Priyal"}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
