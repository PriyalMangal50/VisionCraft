import React from 'react';
import FrameFinderQuiz from '../components/FrameFinderQuiz';
import Title from '../components/Title';

const FrameFinder = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <Title title="Frame Finder" />
      
      <div className="max-w-5xl mx-auto">
        <p className="text-gray-600 text-center mb-8">
          Answer a few quick questions to find frames that perfectly match your face shape and style preferences.
        </p>
        
        <FrameFinderQuiz />
      </div>
    </div>
  );
};

export default FrameFinder;
