import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const QuizBanner = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full bg-gradient-to-br from-[#233362]/5 to-white rounded-xl my-12 font-arial shadow-lg border border-[#233362]/20">
      <div className="p-6 md:p-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 md:mr-8">
            <div className="inline-block bg-[#233362]/10 px-4 py-1 rounded-full mb-3">
              <span className="text-[#233362] text-sm font-medium">Find Your Perfect Match</span>
            </div>
            <h3 className="text-xl md:text-3xl font-arial-extrabold text-[#233362] mb-3">
              Not sure which frames are right for you?
            </h3>
            <p className="text-gray-600 mb-5 max-w-xl text-base">
              Take our 60-second quiz and discover frames that perfectly match your face shape and style preferences!
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/frame-finder"
                className="bg-[#233362] hover:bg-[#2c407a] py-2 px-6 rounded-md text-white font-medium transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Take the Quiz
              </Link>
              
              <button 
                onClick={() => setExpanded(!expanded)} 
                className="inline-block border border-secondary/30 hover:border-secondary text-secondary hover:text-secondary-dark font-medium py-2 px-6 rounded-md transition-colors"
              >
                {expanded ? 'Show Less' : 'Learn More'}
              </button>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <div className="w-44 h-44 md:w-52 md:h-52 bg-gradient-to-br from-[#233362]/20 to-white rounded-full overflow-hidden border-4 border-white shadow-lg flex items-center justify-center transform transition-transform hover:scale-105 duration-300 relative">
              {/* Decorative elements */}
              <div className="absolute top-2 left-2 w-8 h-8 bg-accent-400 opacity-30 rounded-full"></div>
              <div className="absolute bottom-4 right-4 w-6 h-6 bg-secondary-500 opacity-30 rounded-full"></div>
              
              {/* Icon */}
              <div className="text-center relative z-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-[#233362] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-[#233362] font-bold mt-2 text-lg">Frame Finder</div>
              </div>
            </div>
          </div>
        </div>
        
        {expanded && (
          <div className="mt-6 pt-6 border-t border-primary-light/30">
            <h4 className="font-medium text-primary-dark mb-3 text-lg">How the Frame Finder Quiz Works:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-5 shadow-md border border-primary-light/20 hover:shadow-lg transition-shadow">
                <span className="flex w-10 h-10 bg-primary bg-opacity-10 text-primary rounded-full items-center justify-center font-bold mb-3 shadow-inner">1</span>
                <h5 className="font-medium mb-2 text-primary-dark">Identify Your Face Shape</h5>
                <p className="text-sm text-gray-600">We'll help you determine your face shape to find complementary frame styles.</p>
              </div>
              
              <div className="bg-white rounded-lg p-5 shadow-md border border-secondary-light/20 hover:shadow-lg transition-shadow">
                <span className="flex w-10 h-10 bg-secondary bg-opacity-10 text-secondary rounded-full items-center justify-center font-bold mb-3 shadow-inner">2</span>
                <h5 className="font-medium mb-2 text-primary-dark">Choose Your Style</h5>
                <p className="text-sm text-gray-600">Select your preferred aesthetic and frame features that match your personality.</p>
              </div>
              
              <div className="bg-white rounded-lg p-5 shadow-md border border-accent-light/20 hover:shadow-lg transition-shadow">
                <span className="flex w-10 h-10 bg-accent bg-opacity-10 text-accent rounded-full items-center justify-center font-bold mb-3 shadow-inner">3</span>
                <h5 className="font-medium mb-2 text-primary-dark">Get Personalized Results</h5>
                <p className="text-sm text-gray-600">Receive customized recommendations from our collection based on your answers.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizBanner;
