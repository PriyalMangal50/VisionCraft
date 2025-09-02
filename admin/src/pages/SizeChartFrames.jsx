import React from 'react';

const SizeChartFrames = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Eyeglasses & Sunglasses Size Guide</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">How to Measure Frames</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <img 
              src="/images/frame-measurements-diagram.svg" 
              alt="Frame Measurement Diagram" 
              className="w-full border p-4 bg-white"
            />
          </div>
          <div className="flex-1">
            <p className="mb-4">Frame measurements are typically shown as three numbers, like <strong>52□18-140</strong>.</p>
            <ul className="space-y-3 list-disc pl-5">
              <li><strong>Lens Width (52mm):</strong> The horizontal width of each lens</li>
              <li><strong>Bridge Width (18mm):</strong> The distance between lenses</li>
              <li><strong>Temple Length (140mm):</strong> The length of each temple arm</li>
              <li><strong>Lens Height:</strong> The vertical height of each lens</li>
              <li><strong>Frame Width:</strong> The total width from temple to temple</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Size Categories and Measurements</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border text-left">Size Category</th>
                <th className="p-3 border text-left">Face Width</th>
                <th className="p-3 border text-left">Lens Width</th>
                <th className="p-3 border text-left">Bridge Width</th>
                <th className="p-3 border text-left">Temple Length</th>
                <th className="p-3 border text-left">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border font-medium">Small</td>
                <td className="p-3 border">Narrow</td>
                <td className="p-3 border">40-48mm</td>
                <td className="p-3 border">14-18mm</td>
                <td className="p-3 border">135-140mm</td>
                <td className="p-3 border">Children, small adults</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 border font-medium">Medium</td>
                <td className="p-3 border">Average</td>
                <td className="p-3 border">49-53mm</td>
                <td className="p-3 border">18-21mm</td>
                <td className="p-3 border">140-145mm</td>
                <td className="p-3 border">Most adults</td>
              </tr>
              <tr>
                <td className="p-3 border font-medium">Large</td>
                <td className="p-3 border">Wide</td>
                <td className="p-3 border">54-58mm</td>
                <td className="p-3 border">20-22mm</td>
                <td className="p-3 border">145-150mm</td>
                <td className="p-3 border">Adults with wider faces</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 border font-medium">X-Large</td>
                <td className="p-3 border">Very Wide</td>
                <td className="p-3 border">58mm+</td>
                <td className="p-3 border">22mm+</td>
                <td className="p-3 border">150mm+</td>
                <td className="p-3 border">Adults with very wide faces</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Frame Size Recommendations</h2>
        <div className="space-y-4">
          <div className="p-4 border bg-blue-50">
            <h3 className="font-medium">Finding the Right Size</h3>
            <ul className="mt-2 space-y-2 list-disc pl-5">
              <li>Check a customer's existing glasses for sizing information (often printed on the inside of the temple)</li>
              <li>Match the measurement to the appropriate size category</li>
              <li>Consider face width and shape when recommending frames</li>
              <li>When in doubt, medium size fits most adult faces</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600 italic border-t pt-4 mt-8">
        This guide is for reference only. Actual fit may vary depending on face shape and personal preference.
      </div>
    </div>
  );
};

export default SizeChartFrames;
