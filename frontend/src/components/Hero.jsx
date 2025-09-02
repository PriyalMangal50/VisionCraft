import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className='flex flex-col sm:flex-row border-2 border-primary-700 border-opacity-10 mt-8 overflow-hidden rounded-xl shadow-xl'>
      {/* -------hero left side ---------- */}
      <div className='w-full sm:w-1/2 flex items-center justify-center py-12 sm:py-0 bg-gradient-to-br from-white via-white to-primary-50 relative'>
        <div className='absolute top-0 left-0 w-24 h-24 bg-primary-700 opacity-10 rounded-full -translate-x-12 -translate-y-12'></div>
        <div className='absolute bottom-0 right-0 w-40 h-40 bg-accent-400 opacity-10 rounded-full translate-x-16 translate-y-16'></div>
        <div className='absolute top-1/2 right-0 w-20 h-20 bg-secondary-500 opacity-5 rounded-full translate-x-10 -translate-y-10'></div>
        
        <div className='text-primary-700 relative z-10'>
          <div className='flex items-center gap-2 mb-3'>
            <div className='w-10 h-[1px] bg-primary-700'></div>
            <p className='font-semibold text-sm md:text-base font-arial text-primary-700 tracking-wider'> OUR BESTSELLER</p>
            <div className='w-10 h-[1px] bg-primary-700'></div>
          </div>
          <h1 className='font-arial-extrabold text-4xl sm:py-3 lg:text-6xl leading-relaxed'>
            Latest <span className="text-orange font-bold decoration-orange/60 underline decoration-2 underline-offset-4">Arrivals</span>
          </h1>

          <div className='flex items-center gap-3 mt-4'>
            <div className='w-12 md:w-16 h-[2px] bg-gradient-to-r from-orange to-primary-700 rounded-full'></div>
            <Link to="/collection" className='btn btn-white btn-small border border-primary-100 hover:border-primary-200'>SHOP NOW</Link>
            <div className='w-12 md:w-16 h-[2px] bg-gradient-to-r from-primary-700 to-orange rounded-full'></div>
          </div>
        </div>
      </div>
      {/* -------hero right side ---------- */}
      <div className="w-full sm:w-1/2 bg-[#233362] bg-opacity-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-accent-400 opacity-10 rounded-full -translate-y-10 translate-x-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-700 opacity-10 rounded-full translate-y-10 -translate-x-10"></div>
        <img className='w-full hover:scale-105 transition-transform duration-500 relative z-10' src={assets.hero_img} alt='hero image' />
      </div>
    </section>
  );
};

export default Hero;
