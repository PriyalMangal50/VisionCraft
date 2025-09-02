import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";

const About = () => {
  return (
    <main className="font-arial">
      <div className='text-2xl text-center mt-8 border-t border-light-gray'>
        <Title text1={"ABOUT"} text2={"US"} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img
          className='w-full md:max-w-[450px]'
          src={assets.about_img}
          alt='about image'
        />

        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray bg-orange bg-opacity-5 p-6 rounded-lg'>
          <p>
            {" "}
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis
            quo, dolore provident accusamus excepturi maxime error facere quam
            enim delectus architecto, maiores, iure soluta ut quae explicabo
            possimus! Ducimus, dolores?
          </p>
          <p>
            {" "}
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis
            quo, dolore provident accusamus excepturi maxime error facere quam
            enim delectus architecto, maiores, iure soluta ut quae explicabo
            possimus! Ducimus, dolores?
          </p>
          <b className='text-primary-dark font-arial-extrabold'>Our Mission</b>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aperiam
            voluptate corrupti delectus ipsam esse assumenda ex non, accusamus
            odit modi.
          </p>
        </div>

        </div>
        
        <div className='text-4xl py-4'>
          <Title text1={"WHY"} text2={"CHOOSE US"} />
        </div>
        <div className='flex flex-col md:flex-row text-sm mb-20'>
          <div className='border border-light-gray px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 bg-orange bg-opacity-5'>
            <b className="text-orange font-arial-extrabold">Quality Assurance:</b>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quae
              officia tempora cumque debitis, doloremque nisi.
            </p>
          </div>
          <div className='border border-light-gray px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 bg-pink bg-opacity-5'>
            <b className="text-pink font-arial-extrabold">Convenience:</b>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quae
              officia tempora cumque debitis, doloremque nisi.
            </p>
          </div>
          <div className='border border-light-gray px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 bg-primary bg-opacity-5'>
            <b className="text-primary font-arial-extrabold">Exceptional Customer Service:</b>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quae
              officia tempora cumque debitis, doloremque nisi.
            </p>
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

export default About;