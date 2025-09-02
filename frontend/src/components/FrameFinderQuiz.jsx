import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FACE_SHAPES, FRAME_SHAPES, USAGE_OPTIONS, FEATURE_OPTIONS } from '../utils/quizConstants';

const FrameFinderQuiz = () => {
  const navigate = useNavigate();
  
  // Quiz state management
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    faceShape: '',
    frameStyle: '',
    usage: '',
    features: []
  });
  
  // Face shape images with descriptions
  const faceShapes = FACE_SHAPES.map(shape => ({
    ...shape,
    image: `/images/quiz/${shape.value}-face.svg`,
    description: shape.value === 'oval' 
      ? 'Balanced proportions, slightly narrower at the forehead and jawline'
      : shape.value === 'round'
      ? 'Similar width and height, soft curves with full cheeks'
      : shape.value === 'square'
      ? 'Strong jawline, broad forehead, and angular features'
      : shape.value === 'heart'
      ? 'Wider forehead that tapers to a narrower chin'
      : 'Narrow forehead and jawline with wider cheekbones' // diamond
  }));
  
  // Frame style options
  const frameStyles = FRAME_SHAPES.map(shape => ({
    ...shape,
    image: `/images/quiz/${shape.value.toLowerCase().replace(' ', '-')}-frame.svg`
  }));
  
  // Usage purpose options
  const usageOptions = USAGE_OPTIONS.map(usage => ({
    ...usage,
    icon: usage.value === 'everyday' 
      ? '🌞' 
      : usage.value === 'computer' 
      ? '💻' 
      : usage.value === 'reading' 
      ? '📚' 
      : usage.value === 'fashion' 
      ? '👓' 
      : '🏃' // sports
  }));
  
  // Special features options
  const featureOptions = FEATURE_OPTIONS.map(feature => ({
    value: feature.value,
    label: feature.label,
    icon: feature.key === 'blueLight' 
      ? '🖥️' 
      : feature.key === 'transition' 
      ? '🌓' 
      : feature.key === 'polarized' 
      ? '☀️' 
      : '🪶' // lightweight
  }));
  
  // Quiz steps configuration
  const steps = [
    {
      title: "What's your face shape?",
      description: "Select the shape that most closely resembles your face.",
      component: (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
          {faceShapes.map((shape) => (
            <div
              key={shape.value}
              onClick={() => handleAnswer('faceShape', shape.value)}
              className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all
                ${answers.faceShape === shape.value 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'}`}
            >
              <div className="w-20 h-20 mb-3">
                {/* Replace with actual image paths when available */}
                <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center text-3xl">
                  {shape.label[0]}
                </div>
              </div>
              <span className="font-medium">{shape.label}</span>
              <p className="text-xs text-gray-500 text-center mt-2">{shape.description}</p>
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Which frame style do you prefer?",
      description: "Choose the style that appeals to you most.",
      component: (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
          {frameStyles.map((style) => (
            <div
              key={style.value}
              onClick={() => handleAnswer('frameStyle', style.value)}
              className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all
                ${answers.frameStyle === style.value 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'}`}
            >
              <div className="w-20 h-20 mb-3">
                {/* Replace with actual image paths when available */}
                <div className="bg-gray-100 rounded-lg w-20 h-12 flex items-center justify-center">
                  {style.label}
                </div>
              </div>
              <span className="font-medium">{style.label}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      title: "What will you primarily use these glasses for?",
      description: "Select your main purpose for these glasses.",
      component: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {usageOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => handleAnswer('usage', option.value)}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all
                ${answers.usage === option.value 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'}`}
            >
              <span className="text-3xl mr-3">{option.icon}</span>
              <span className="font-medium">{option.label}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Do you need any special features?",
      description: "Select all that apply.",
      component: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {featureOptions.map((option) => {
            const isSelected = answers.features.includes(option.value);
            return (
              <div
                key={option.value}
                onClick={() => toggleFeature(option.value)}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'}`}
              >
                <div className={`w-6 h-6 border rounded mr-3 flex items-center justify-center ${
                  isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                }`}>
                  {isSelected && <span className="text-white text-sm">✓</span>}
                </div>
                <span className="text-xl mr-2">{option.icon}</span>
                <span className="font-medium">{option.label}</span>
              </div>
            );
          })}
        </div>
      )
    }
  ];
  
  // Handle single-select answers
  const handleAnswer = (field, value) => {
    setAnswers(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle multi-select features
  const toggleFeature = (feature) => {
    setAnswers(prev => {
      if (prev.features.includes(feature)) {
        return {
          ...prev,
          features: prev.features.filter(f => f !== feature)
        };
      } else {
        return {
          ...prev,
          features: [...prev.features, feature]
        };
      }
    });
  };
  
  // Navigate to next step
  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      submitQuiz();
    }
  };
  
  // Navigate to previous step
  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Get recommended frame shapes based on face shape
  const getRecommendedFrameShapes = (faceShape) => {
    switch (faceShape) {
      case 'oval':
        return ['Rectangle', 'Square', 'Aviator'];
      case 'round':
        return ['Rectangle', 'Square', 'Cat Eye'];
      case 'square':
        return ['Round', 'Cat Eye', 'Aviator'];
      case 'heart':
        return ['Round', 'Aviator', 'Cat Eye'];
      case 'diamond':
        return ['Rectangle', 'Cat Eye', 'Round'];
      default:
        return [];
    }
  };
  
  // Submit quiz and navigate to collection with filters
  const submitQuiz = async () => {
    try {
      // Generate a session ID if user is not logged in
      const sessionId = localStorage.getItem('quizSessionId') || 
                        `guest_${Math.random().toString(36).substring(2, 15)}`;
      
      // Save session ID for future reference
      localStorage.setItem('quizSessionId', sessionId);
      
      // Get current user ID if logged in
      const userId = localStorage.getItem('userId'); // Assuming this is how you store user ID
      
      // Prepare the quiz data - make sure to use lowercase face shape to match admin panel
      const quizData = {
        userId,
        sessionId,
        answers: {
          faceShape: answers.faceShape, // already lowercase from constants
          frameStyle: answers.frameStyle,
          usage: answers.usage, // already lowercase from constants
          features: answers.features // will be mapped to feature keys in backend
        }
      };
      
      console.log('Submitting quiz data:', quizData);
      
      // Make API call to submit quiz data
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/quiz/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Store quiz ID for tracking
        localStorage.setItem('lastQuizId', data.quizId);
        console.log("Quiz ID saved:", data.quizId);
        
        // Also set as activeQuizId for legacy support
        localStorage.setItem('activeQuizId', data.quizId);
        
        // Get recommended frame shapes based on face shape as fallback
        const recommendedShapes = getRecommendedFrameShapes(answers.faceShape);
        
        // If user selected a frame style, use that; otherwise use recommendations
        const frameShapes = answers.frameStyle ? [answers.frameStyle] : recommendedShapes;
        
        // Determine lens types based on usage and features
        let lensTypes = [];
        
        if (answers.usage === 'computer' || answers.features.includes('Blue Light')) {
          lensTypes.push('Blue Light');
        }
        
        if (answers.features.includes('Transition')) {
          lensTypes.push('Photochromic');
        }
        
        if (answers.features.includes('Polarized')) {
          lensTypes.push('Polarized');
        }
        
        // Navigate to collection with filters
        navigate('/collection', { 
          state: { 
            quizFilters: {
              frameShapes,
              lensTypes,
              usage: answers.usage,
              faceShape: answers.faceShape,
              quizId: data.quizId,
              recommendedProducts: data.recommendations?.map(item => item.productId) || []
            } 
          }
        });
      } else {
        console.error("Error submitting quiz:", data.message);
        
        // Fallback to client-side filtering if API fails
        navigate('/collection', { 
          state: { 
            quizFilters: {
              frameShapes: answers.frameStyle ? [answers.frameStyle] : getRecommendedFrameShapes(answers.faceShape),
              lensTypes: answers.features
                .filter(f => ['Blue Light', 'Transition', 'Polarized'].includes(f))
                .map(f => f === 'Transition' ? 'Photochromic' : f),
              usage: answers.usage,
              faceShape: answers.faceShape
            } 
          }
        });
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      
      // Fallback to client-side filtering if API fails
      navigate('/collection', { 
        state: { 
          quizFilters: {
            frameShapes: answers.frameStyle ? [answers.frameStyle] : getRecommendedFrameShapes(answers.faceShape),
            lensTypes: answers.features
              .filter(f => ['Blue Light', 'Transition', 'Polarized'].includes(f))
              .map(f => f === 'Transition' ? 'Photochromic' : f),
            usage: answers.usage,
            faceShape: answers.faceShape
          } 
        }
      });
    }
  };
  
  // Skip quiz and go to collection
  const skipQuiz = () => {
    navigate('/collection');
  };
  
  // Check if current step has an answer (for next button enabling)
  const currentStepHasAnswer = () => {
    switch (currentStep) {
      case 0:
        return !!answers.faceShape;
      case 1:
        return !!answers.frameStyle;
      case 2:
        return !!answers.usage;
      case 3:
        return true; // Features are optional
      default:
        return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden my-8">
      <div className="p-8">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Find Your Perfect Frames</h2>
          <button 
            onClick={skipQuiz} 
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Skip Quiz
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
        
        {/* Step indicators */}
        <div className="flex justify-between mb-8">
          {steps.map((_, index) => (
            <div 
              key={index}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
        
        {/* Current step content */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{steps[currentStep].title}</h3>
          <p className="text-gray-600 mb-4">{steps[currentStep].description}</p>
          {steps[currentStep].component}
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between pt-6">
          <button
            onClick={goToPrevStep}
            className={`px-6 py-2 rounded ${
              currentStep === 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
            disabled={currentStep === 0}
          >
            Back
          </button>
          
          <button
            onClick={goToNextStep}
            disabled={!currentStepHasAnswer()}
            className={`px-6 py-2 rounded ${
              currentStepHasAnswer() 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-blue-300 text-white cursor-not-allowed'
            }`}
          >
            {currentStep === steps.length - 1 ? 'See My Results' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FrameFinderQuiz;
