import React from "react";
import { assets } from "../assets/assets";

const OurPolicy = () => {
  return (
    <section className='my-16 py-12 bg-gradient-to-br from-primary-light/5 to-white rounded-xl'>
      <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-8 text-center text-xs sm:text-sm md:text-base font-arial max-w-5xl mx-auto'>
        <div className="policy-card">
          <div className="mb-5 bg-white p-5 rounded-full shadow-md mx-auto w-20 h-20 flex items-center justify-center hover:shadow-lg transition-shadow">
            <img className='w-12' src={assets.exchange_icon} alt='exchange'/>
          </div>
          <p className='font-arial-extrabold text-lg text-primary mb-2'>Easy Exchange Policy</p>
          <p className='text-gray-600'>We offer a hassle-free exchange policy for your complete satisfaction.</p>
        </div>

        <div className="policy-card">
          <div className="mb-5 bg-white p-5 rounded-full shadow-md mx-auto w-20 h-20 flex items-center justify-center hover:shadow-lg transition-shadow">
            <img className='w-12' src={assets.quality_icon} alt='return policy'/>
          </div>
          <p className='font-arial-extrabold text-lg text-secondary mb-2'>7 Days Return Policy</p>
          <p className='text-gray-600'>Try your eyewear and return within 7 days if you're not completely satisfied.</p>
        </div>

        <div className="policy-card">
          <div className="mb-5 bg-white p-5 rounded-full shadow-md mx-auto w-20 h-20 flex items-center justify-center hover:shadow-lg transition-shadow">
            <img className='w-12' src={assets.support_img} alt='customer support' />
          </div>
          <p className='font-arial-extrabold text-lg text-accent mb-2'>24/7 Customer Support</p>
          <p className='text-gray-600'>Our dedicated team is available around the clock to assist with any queries.</p>
        </div>
      </div>
    </section>
  );
};

export default OurPolicy;
