import React, { useState } from 'react';
import Title from '../components/Title';

const SizeGuide = () => {
  const [activeTab, setActiveTab] = useState('frames');
  
  return (
    <div className='border-t pt-10 px-5 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-12'>
      <div className='text-2xl mb-3'>
        <Title text1={'EYEWEAR'} text2={'SIZE GUIDE'} />
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
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
      
      {activeTab === 'frames' && (
        <div className='my-10'>
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">How to Read Frame Measurements</h3>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/2">
                <img 
                  src="/images/frame-measurements-diagram.svg" 
                  alt="Frame Measurement Diagram" 
                  className="w-full max-w-md mx-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 100'%3E%3Crect width='300' height='100' fill='%23eee'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif'%3EFrame Diagram%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              <div className="w-full md:w-1/2">
                <p className="mb-4">Frame measurements are typically shown as three numbers, like <strong>52-18-140</strong>.</p>
                <ul className="space-y-2 list-disc pl-5">
                  <li><strong>A: Lens Width</strong> - The horizontal width of each lens (in mm)</li>
                  <li><strong>B: Bridge Width</strong> - The distance between lenses (in mm)</li>
                  <li><strong>C: Temple Length</strong> - The length of each temple arm (in mm)</li>
                  <li><strong>D: Lens Height</strong> - The vertical height of each lens (in mm)</li>
                  <li><strong>E: Frame Width</strong> - The total width of the frame (in mm)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Frame Size Categories</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-3 px-4 border-b border-gray-200 text-left">Size Category</th>
                    <th className="py-3 px-4 border-b border-gray-200 text-left">Face Width</th>
                    <th className="py-3 px-4 border-b border-gray-200 text-left">Lens Width</th>
                    <th className="py-3 px-4 border-b border-gray-200 text-left">Bridge Width</th>
                    <th className="py-3 px-4 border-b border-gray-200 text-left">Temple Length</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className='border border-gray-300 px-4 py-2 font-medium'>XS</td>
                    <td className='border border-gray-300 px-4 py-2'>Narrow</td>
                    <td className='border border-gray-300 px-4 py-2'>42-48mm</td>
                    <td className='border border-gray-300 px-4 py-2'>16-18mm</td>
                    <td className='border border-gray-300 px-4 py-2'>135-140mm</td>
                  </tr>
                  <tr>
                    <td className='border border-gray-300 px-4 py-2 font-medium'>S</td>
                    <td className='border border-gray-300 px-4 py-2'>Narrow-Medium</td>
                    <td className='border border-gray-300 px-4 py-2'>48-50mm</td>
                    <td className='border border-gray-300 px-4 py-2'>18-19mm</td>
                    <td className='border border-gray-300 px-4 py-2'>135-140mm</td>
                  </tr>
                  <tr>
                    <td className='border border-gray-300 px-4 py-2 font-medium'>M</td>
                    <td className='border border-gray-300 px-4 py-2'>Medium</td>
                    <td className='border border-gray-300 px-4 py-2'>50-52mm</td>
                    <td className='border border-gray-300 px-4 py-2'>19-21mm</td>
                    <td className='border border-gray-300 px-4 py-2'>140-145mm</td>
                  </tr>
                  <tr>
                    <td className='border border-gray-300 px-4 py-2 font-medium'>L</td>
                    <td className='border border-gray-300 px-4 py-2'>Medium-Wide</td>
                    <td className='border border-gray-300 px-4 py-2'>52-54mm</td>
                    <td className='border border-gray-300 px-4 py-2'>21-22mm</td>
                    <td className='border border-gray-300 px-4 py-2'>140-145mm</td>
                  </tr>
                  <tr>
                    <td className='border border-gray-300 px-4 py-2 font-medium'>XL</td>
                    <td className='border border-gray-300 px-4 py-2'>Wide</td>
                    <td className='border border-gray-300 px-4 py-2'>54-58mm</td>
                    <td className='border border-gray-300 px-4 py-2'>22-24mm</td>
                    <td className='border border-gray-300 px-4 py-2'>145-150mm</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">How to Choose the Right Frame Size</h3>
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="mb-3">To find your perfect fit, you should consider:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>The width of your face at its widest point</li>
                  <li>The distance between your pupils</li>
                  <li>The style and shape of frames you prefer</li>
                  <li>How the frames sit on your nose bridge</li>
                </ol>
                <p className="mt-3">If you have an existing pair that fits well, check its measurements as a reference.</p>
              </div>
            </div>
          
            <div className='mt-6 p-4 bg-gray-50 rounded'>
              <h3 className='font-medium mb-2'>Need Help?</h3>
              <p className='text-gray-600 text-sm'>
                Still unsure about sizing? Contact our customer service team at 
                <span className='text-black font-medium'> visioncraft@gmail.com</span> or check our 
                <span className='text-black font-medium'> FAQ section</span> for more information.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'contacts' && (
        <div className='my-10'>
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Contact Lens Sizing Explained</h3>
            <div className="bg-yellow-50 p-4 rounded-md mb-6">
              <p className="font-medium text-yellow-800 mb-2">Important Note:</p>
              <p>Contact lens size is different from prescription. Both are necessary for a proper fit. Always consult with an eye care professional before purchasing contact lenses.</p>
            </div>
            
            <p className="mb-4">Contact lenses have two primary measurements that determine their fit:</p>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-full md:w-1/2 bg-white p-4 border rounded-md">
                <h4 className="font-semibold mb-2">Base Curve (BC)</h4>
                <p>The base curve measures the curvature of the back surface of the contact lens, determining how it fits on your eye's cornea.</p>
                <div className="my-4">
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
                <ul className="mt-3 list-disc pl-5 space-y-1">
                  <li>Measured in millimeters (mm)</li>
                  <li>Typical range: 8.0 to 9.5 mm</li>
                  <li>Lower numbers = steeper curve</li>
                  <li>Higher numbers = flatter curve</li>
                </ul>
              </div>
              <div className="w-full md:w-1/2 bg-white p-4 border rounded-md">
                <h4 className="font-semibold mb-2">Diameter (DIA)</h4>
                <p>The diameter measures the total width of the contact lens from edge to edge.</p>
                <div className="my-4">
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
                <ul className="mt-3 list-disc pl-5 space-y-1">
                  <li>Measured in millimeters (mm)</li>
                  <li>Typical range: 13.0 to 15.0 mm</li>
                  <li>Soft contacts usually: 14.0 to 14.5 mm</li>
                  <li>Hard contacts usually smaller: 9.0 to 10.0 mm</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Common Contact Lens Specifications</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-3 px-4 border-b border-gray-200 text-left">Contact Type</th>
                    <th className="py-3 px-4 border-b border-gray-200 text-left">Base Curve (BC)</th>
                    <th className="py-3 px-4 border-b border-gray-200 text-left">Diameter (DIA)</th>
                    <th className="py-3 px-4 border-b border-gray-200 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className='border border-gray-300 px-4 py-2 font-medium'>Daily Disposable</td>
                    <td className='border border-gray-300 px-4 py-2'>8.5 - 9.0 mm</td>
                    <td className='border border-gray-300 px-4 py-2'>14.0 - 14.3 mm</td>
                    <td className='border border-gray-300 px-4 py-2'>Most common, good for beginners</td>
                  </tr>
                  <tr>
                    <td className='border border-gray-300 px-4 py-2 font-medium'>Bi-weekly</td>
                    <td className='border border-gray-300 px-4 py-2'>8.3 - 8.9 mm</td>
                    <td className='border border-gray-300 px-4 py-2'>14.0 - 14.5 mm</td>
                    <td className='border border-gray-300 px-4 py-2'>More durable than dailies</td>
                  </tr>
                  <tr>
                    <td className='border border-gray-300 px-4 py-2 font-medium'>Monthly</td>
                    <td className='border border-gray-300 px-4 py-2'>8.4 - 8.8 mm</td>
                    <td className='border border-gray-300 px-4 py-2'>14.0 - 14.4 mm</td>
                    <td className='border border-gray-300 px-4 py-2'>Most economical, requires proper cleaning</td>
                  </tr>
                  <tr>
                    <td className='border border-gray-300 px-4 py-2 font-medium'>Toric (Astigmatism)</td>
                    <td className='border border-gray-300 px-4 py-2'>8.5 - 8.9 mm</td>
                    <td className='border border-gray-300 px-4 py-2'>14.2 - 14.5 mm</td>
                    <td className='border border-gray-300 px-4 py-2'>Special design for astigmatism</td>
                  </tr>
                  <tr>
                    <td className='border border-gray-300 px-4 py-2 font-medium'>Multifocal</td>
                    <td className='border border-gray-300 px-4 py-2'>8.4 - 8.8 mm</td>
                    <td className='border border-gray-300 px-4 py-2'>14.0 - 14.5 mm</td>
                    <td className='border border-gray-300 px-4 py-2'>For presbyopia, multiple prescriptions</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Understanding Contact Lens Prescriptions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 border rounded-md">
                <h4 className="font-semibold mb-2">Prescription Components</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>PWR/SPH</strong> - Sphere power (nearsighted or farsighted)</li>
                  <li><strong>CYL</strong> - Cylinder power (astigmatism)</li>
                  <li><strong>AXIS</strong> - Orientation of astigmatism correction</li>
                  <li><strong>ADD</strong> - Additional power for multifocal lenses</li>
                </ul>
              </div>
              <div className="bg-white p-4 border rounded-md">
                <h4 className="font-semibold mb-2">Sizing Components</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>BC</strong> - Base curve</li>
                  <li><strong>DIA</strong> - Diameter</li>
                  <li><strong>Brand</strong> - Often specified by eye doctor</li>
                  <li><strong>Replacement Schedule</strong> - Daily, bi-weekly, monthly</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-5 rounded-md mb-8">
            <h3 className="text-lg font-semibold mb-3">Contact Lens Safety Tips</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Never share contact lenses with others</li>
              <li>Always wash hands before handling lenses</li>
              <li>Follow the recommended replacement schedule</li>
              <li>Do not sleep in contacts unless specifically approved by your doctor</li>
              <li>Keep contact lens case clean and replace it every three months</li>
              <li>Do not use expired contact lenses or solutions</li>
              <li>Remove contacts immediately if you experience discomfort or redness</li>
            </ul>
          </div>

          <div className='mt-6 p-4 bg-gray-50 rounded'>
            <h3 className='font-medium mb-2'>Need Help?</h3>
            <p className='text-gray-600 text-sm'>
              Questions about contact lens sizing? Contact our customer service team at 
              <span className='text-black font-medium'> visioncraft@gmail.com</span> or consult with an eye care professional.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SizeGuide;
