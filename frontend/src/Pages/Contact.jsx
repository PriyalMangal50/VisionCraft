import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";
import { Link } from "react-router-dom";

const Contact = () => {
  return (
    <main className='font-arial'>
      <div className='text-2xl text-center pt-10 border-t border-light-gray'>
        <Title text1={"CONTACT"} text2={"US"} />
      </div>
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img
          className='w-full md:max-w-[480px] border border-light-gray rounded-lg shadow-md'
          src={assets.contact_img}
          alt='contact image'
        />

        <div className='flex flex-col justify-between items-start gap-6 bg-primary bg-opacity-5 p-6 rounded-lg border border-primary border-opacity-10'>
          <p className='font-arial-extrabold text-xl text-pink'>Our Store</p>
          <p className='text-gray'>
           11/18 MG. Marg<br /> Civil lines Prayaraj 
          </p>
          <p className='text-primary-dark'>
            Tel:(0532) 98XXXX  <br /> Email: visioncraft@gmail.com
          </p>
          <p className='font-arial-extrabold text-xl text-primary'>
            Careers at VisionCraft
          </p>
          <p className='text-gray'>
            Learn more about our teams and job openings.
          </p>
          <button className='border border-orange bg-white text-orange hover:bg-orange hover:text-white px-8 py-4 text-sm transition-all duration-300 rounded'>
            Explore jobs
          </button>
          
          {/* FAQ Quick Access */}
          <div className='mt-6 p-4 bg-light-gray rounded-lg w-full border border-gray shadow-sm'>
            <p className='font-arial-extrabold text-lg text-orange mb-2'>
              Need Quick Help?
            </p>
            <p className='text-gray text-sm mb-3'>
              Check our frequently asked questions for instant answers.
            </p>
            <Link 
              to="/faq" 
              className='inline-block bg-primary text-white px-6 py-2 text-sm rounded hover:bg-primary-dark transition-colors'
            >
              View FAQ
            </Link>
          </div>
          
          <p></p>
        </div>
      </div>
      <div className="w-full -mx-4 sm:-mx-[5vw] md:-mx-[7vw] lg:-mx-[9vw] bg-light-gray bg-opacity-50 py-8">
        <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] max-w-screen-2xl mx-auto flex justify-center">
          <NewsletterBox />
        </div>
      </div>
    </main>
  );
};

export default Contact;
