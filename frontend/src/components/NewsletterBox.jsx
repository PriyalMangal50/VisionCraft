import React from "react";

const NewsletterBox = () => {

  const haldleNewsletter = (e) => {
    e.preventDefault();
  };
  return (
    <div className='flex flex-col items-center justify-center w-full text-center font-arial p-8 rounded-xl bg-gradient-to-br from-[#233362]/5 via-white to-secondary-50 shadow-xl border border-[#233362]/10 relative overflow-hidden'>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#233362] opacity-5 rounded-full -translate-x-16 -translate-y-16"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-accent-400 opacity-5 rounded-full translate-x-20 translate-y-20"></div>
      
      <div className="inline-block bg-[#233362]/10 px-4 py-1 rounded-full mb-3">
        <span className="text-[#233362] text-sm font-medium">Special Offer</span>
      </div>
      
      <p className='text-3xl font-arial-extrabold text-[#233362] mb-1'>Subscribe now & <span className="text-accent-500">get 20% off!</span></p>

      <p className='text-gray-600 mt-3 max-w-md'>
        Join our newsletter for exclusive deals, eyewear tips, and be the first to see our new collections
      </p>
      <div className="w-full max-w-xl px-4 sm:px-8 py-8 mx-auto">
        <form onSubmit={haldleNewsletter} className='w-full flex items-center border-2 border-[#233362]/20 overflow-hidden rounded-full shadow-md hover:shadow-lg transition-shadow'>
          <input
            required
            className='w-full flex-1 outline-none py-3.5 px-6 bg-white bg-opacity-90'
            type='email'
            placeholder='Enter your email'
          />
          <button
            className='bg-[#233362] hover:bg-[#2c407a] px-8 sm:px-10 py-4 whitespace-nowrap rounded-r-full text-white text-sm font-medium transition-all duration-300'
            type='submit'>
            SUBSCRIBE
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-3">*By subscribing, you agree to receive marketing emails from us</p>
      </div>
    </div>
  );
};

export default NewsletterBox;
