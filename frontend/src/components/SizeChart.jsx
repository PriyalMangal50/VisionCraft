import React, { useState } from 'react';

/**
 * A reusable size chart component that displays sizing information for eyewear products
 * @param {Object} props
 * @param {string} props.category - 'Eyeglasses', 'Sunglasses', or 'Contact Lenses'
 * @param {boolean} props.isOpen - Whether the chart is open
 * @param {Function} props.onClose - Function to close the chart
 */
const SizeChart = ({ category = 'Eyeglasses', isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState(
    category === 'Contact Lenses' ? 'contacts' : 'frames'
  );
  
  if (!isOpen) return null;
  
  // Contact lens size chart
  const renderContactLensesChart = () => (
    <>
      <div className="mb-6 font-arial">
        <h3 className="font-arial-extrabold text-lg mb-2 text-primary-dark">Contact Lens Parameters</h3>
        <p className="text-sm mb-4">
          Contact lenses require specific measurements to ensure proper fit and comfort. Unlike eyeglasses,
          contact lens sizes are determined by your eye care professional during a fitting.
        </p>
        <div className="space-y-6">
          <div>
            <h4 className="font-arial-extrabold text-primary">Base Curve (BC)</h4>
            <p className="text-sm text-gray mb-2">The curvature of the inner surface of the lens that sits on your eye.</p>
            <div className="mb-3">
              <img 
                src="/images/contact-base-curve-diagram.svg" 
                alt="Contact lens base curve illustration" 
                className="w-full max-w-sm mx-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 100'%3E%3Crect width='300' height='100' fill='%23eee'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif'%3EBase Curve Diagram%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-light-gray">
                    <th className="border border-light-gray p-2 text-left font-arial-extrabold text-primary-dark">Base Curve (mm)</th>
                    <th className="border border-light-gray p-2 text-left font-arial-extrabold text-primary-dark">Eye Type</th>
                    <th className="border border-light-gray p-2 text-left font-arial-extrabold text-primary-dark">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-light-gray p-2 text-gray">8.4 - 8.5</td>
                    <td className="border border-light-gray p-2 text-gray">Steeper cornea</td>
                    <td className="border border-light-gray p-2 text-gray">For eyes with more curved corneas</td>
                  </tr>
                  <tr className="bg-light-gray bg-opacity-50">
                    <td className="border border-light-gray p-2 text-gray">8.6 - 8.7</td>
                    <td className="border border-light-gray p-2 text-gray">Average cornea</td>
                    <td className="border border-light-gray p-2 text-gray">Most common fit for average eyes</td>
                  </tr>
                  <tr>
                    <td className="border border-light-gray p-2 text-gray">8.8 - 9.0</td>
                    <td className="border border-light-gray p-2 text-gray">Flatter cornea</td>
                    <td className="border border-light-gray p-2 text-gray">For eyes with flatter corneas</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="font-arial-extrabold text-primary">Diameter (DIA)</h4>
            <p className="text-sm text-gray mb-2">The total width of the contact lens.</p>
            <div className="mb-3">
              <img 
                src="/images/contact-diameter-diagram.svg" 
                alt="Contact lens diameter illustration" 
                className="w-full max-w-sm mx-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 100'%3E%3Crect width='300' height='100' fill='%23eee'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif'%3EDiameter Diagram%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-light-gray">
                    <th className="border border-light-gray p-2 text-left font-arial-extrabold text-primary-dark">Diameter (mm)</th>
                    <th className="border border-light-gray p-2 text-left font-arial-extrabold text-primary-dark">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">13.8 - 14.0</td>
                    <td className="border p-2">Smaller eyes or steeper corneas</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border p-2">14.0 - 14.2</td>
                    <td className="border p-2">Average eyes (most common)</td>
                  </tr>
                  <tr>
                    <td className="border p-2">14.2 - 14.5</td>
                    <td className="border p-2">Larger eyes or flatter corneas</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium text-lg mb-2">Common Size Combinations by Lens Type</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Contact Lens Type</th>
                <th className="border p-2 text-left">Common Size Combinations (BC/DIA)</th>
                <th className="border p-2 text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2 font-medium">Daily Disposables</td>
                <td className="border p-2">8.5/14.2, 8.6/14.0, 8.7/14.0</td>
                <td className="border p-2">Worn once then discarded</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2 font-medium">Bi-weekly/Monthly</td>
                <td className="border p-2">8.4/14.0, 8.6/14.0, 8.6/14.2, 8.8/14.0</td>
                <td className="border p-2">Worn for 2-4 weeks, cleaned daily</td>
              </tr>
              <tr>
                <td className="border p-2 font-medium">Toric (Astigmatism)</td>
                <td className="border p-2">8.5/14.5, 8.7/14.5</td>
                <td className="border p-2">For correcting astigmatism</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2 font-medium">Multifocal</td>
                <td className="border p-2">8.4/14.0, 8.6/14.2, 8.7/14.0</td>
                <td className="border p-2">For presbyopia (reading issues)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Important:</strong> Contact lenses require a valid prescription from an eye care professional. 
              The size parameters must be determined by your doctor after an eye examination and fitting.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium text-lg mb-2">Understanding Prescription vs. Size</h3>
        <p className="text-sm mb-2">
          It's important to understand that contact lens size and prescription are different but related concepts:
        </p>
        <ul className="list-disc pl-4 space-y-1 text-sm">
          <li><strong>Size parameters</strong> (BC and DIA): Determine the physical fit of the lens on your eye</li>
          <li><strong>Prescription parameters</strong> (Power, Cylinder, Axis): Determine the vision correction provided</li>
          <li>Both are required for properly fitted contact lenses</li>
          <li>Your eye care professional will determine both during your fitting</li>
        </ul>
      </div>
    </>
  );

  const renderEyeglassesChart = () => (
    <>
      <div className="mb-6">
        <h3 className="font-medium text-lg mb-2">Understanding Frame Measurements</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <img 
              src="/images/frame-measurements-diagram.svg" 
              alt="Eyeglass frame measurements diagram" 
              className="w-full mb-2"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 100'%3E%3Crect width='300' height='100' fill='%23eee'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif'%3EFrame Diagram%3C/text%3E%3C/svg%3E";
              }}
            />
            <p className="text-sm text-gray-500 text-center italic">Frame measurement diagram</p>
          </div>
          <div className="flex-1">
            <p className="text-sm mb-4">
              Frame measurements are typically listed in millimeters and often shown on the inside of the temple arm.
            </p>
            <ul className="list-disc pl-4 space-y-2 text-sm">
              <li><strong>Lens Width (A):</strong> The horizontal width of a single lens</li>
              <li><strong>Bridge Width (B):</strong> The distance between lenses</li>
              <li><strong>Temple Length (C):</strong> The length of the side arms</li>
              <li><strong>Lens Height (D):</strong> The vertical height of a lens</li>
              <li><strong>Total Frame Width (E):</strong> The entire width from temple to temple</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto mb-6">
        <h3 className="font-medium text-lg mb-2">Frame Size Guide</h3>
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Size Category</th>
              <th className="border p-2 text-left">Face Width</th>
              <th className="border p-2 text-left">Lens Width</th>
              <th className="border p-2 text-left">Bridge Width</th>
              <th className="border p-2 text-left">Temple Length</th>
              <th className="border p-2 text-left">Typical Fit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2 font-medium">Small</td>
              <td className="border p-2">Narrow</td>
              <td className="border p-2">40-48mm</td>
              <td className="border p-2">14-18mm</td>
              <td className="border p-2">135-140mm</td>
              <td className="border p-2">Children, Small Adults</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border p-2 font-medium">Medium</td>
              <td className="border p-2">Average</td>
              <td className="border p-2">49-53mm</td>
              <td className="border p-2">18-21mm</td>
              <td className="border p-2">140-145mm</td>
              <td className="border p-2">Most Adults</td>
            </tr>
            <tr>
              <td className="border p-2 font-medium">Large</td>
              <td className="border p-2">Wide</td>
              <td className="border p-2">54-58mm</td>
              <td className="border p-2">20-22mm</td>
              <td className="border p-2">145-150mm</td>
              <td className="border p-2">Larger Adults</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border p-2 font-medium">X-Large</td>
              <td className="border p-2">Very Wide</td>
              <td className="border p-2">58mm+</td>
              <td className="border p-2">22mm+</td>
              <td className="border p-2">150mm+</td>
              <td className="border p-2">Oversized Fit</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h3 className="font-medium text-lg mb-2">How to Find Your Size</h3>
        <div className="space-y-3">
          <p className="text-sm"><strong>Method 1:</strong> Check your current glasses</p>
          <ul className="list-disc pl-4 text-sm space-y-1">
            <li>Look inside the temple arm of your current glasses</li>
            <li>You'll find numbers like "52-18-140" representing lens width, bridge width, and temple length</li>
          </ul>
          
          <p className="text-sm mt-3"><strong>Method 2:</strong> Measure your face</p>
          <ul className="list-disc pl-4 text-sm space-y-1">
            <li>Face width: Measure the distance from temple to temple (across your face)</li>
            <li>Small: Less than 130mm | Medium: 130-138mm | Large: 138-145mm | XL: Above 145mm</li>
          </ul>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-lg mb-2">Face Shape and Frame Style Guide</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 border rounded">
            <p className="font-medium">Round Face</p>
            <p className="text-sm">Best fits: Square, rectangular, or angular frames</p>
          </div>
          <div className="p-3 border rounded">
            <p className="font-medium">Square Face</p>
            <p className="text-sm">Best fits: Round or oval frames</p>
          </div>
          <div className="p-3 border rounded">
            <p className="font-medium">Oval Face</p>
            <p className="text-sm">Best fits: Most frame shapes</p>
          </div>
          <div className="p-3 border rounded">
            <p className="font-medium">Heart-Shaped Face</p>
            <p className="text-sm">Best fits: Frames wider at the top, narrower at the bottom</p>
          </div>
        </div>
      </div>
    </>
  );



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Size Guide: {category}</h2>
          <button 
            onClick={onClose}
            className="bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex -mb-px">
            <button
              className={`py-2 px-4 border-b-2 ${
                activeTab === 'frames' ? 'border-blue-500 text-blue-600' : 'border-transparent hover:border-gray-300'
              } font-medium`}
              onClick={() => setActiveTab('frames')}
            >
              Eyeglass & Sunglass Frames
            </button>
            <button
              className={`py-2 px-4 border-b-2 ${
                activeTab === 'contacts' ? 'border-blue-500 text-blue-600' : 'border-transparent hover:border-gray-300'
              } font-medium`}
              onClick={() => setActiveTab('contacts')}
            >
              Contact Lenses
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {activeTab === 'contacts' ? renderContactLensesChart() : renderEyeglassesChart()}
        </div>
        
        <div className="bg-gray-100 px-6 py-4 flex justify-end border-t">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeChart;
