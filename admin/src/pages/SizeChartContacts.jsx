import React from 'react';

const SizeChartContacts = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Contact Lenses Size Guide</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Understanding Contact Lens Sizing</h2>
        <p className="mb-4">
          Unlike eyeglasses, contact lenses require precise measurements to ensure proper fit on the eye.
          Two primary measurements determine the physical fit of a contact lens:
        </p>
        
        <div className="flex flex-col md:flex-row gap-8 mt-6">
          <div className="flex-1 p-4 border rounded bg-blue-50">
            <h3 className="font-medium mb-2">Base Curve (BC)</h3>
            <p>The curvature of the inside surface of the lens that sits on the eye's cornea.</p>
            <img 
              src="/images/contact-base-curve-diagram.svg" 
              alt="Contact lens base curve illustration" 
              className="w-full max-h-48 object-contain my-4 bg-white p-2"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 100'%3E%3Crect width='300' height='100' fill='%23eee'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif'%3EBase Curve Diagram%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
          
          <div className="flex-1 p-4 border rounded bg-blue-50">
            <h3 className="font-medium mb-2">Diameter (DIA)</h3>
            <p>The total width of the contact lens from edge to edge.</p>
            <img 
              src="/images/contact-diameter-diagram.svg" 
              alt="Contact lens diameter illustration" 
              className="w-full max-h-48 object-contain my-4 bg-white p-2"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 100'%3E%3Crect width='300' height='100' fill='%23eee'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif'%3EDiameter Diagram%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Contact Lens Size Parameters</h2>

        <div className="mb-6">
          <h3 className="font-medium mb-2">Base Curve (BC) Range</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border text-left">Base Curve (mm)</th>
                  <th className="p-3 border text-left">Eye Type</th>
                  <th className="p-3 border text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border">8.4 - 8.5</td>
                  <td className="p-3 border">Steeper cornea</td>
                  <td className="p-3 border">For eyes with more curved corneas</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border">8.6 - 8.7</td>
                  <td className="p-3 border">Average cornea</td>
                  <td className="p-3 border">Most common fit for average eyes</td>
                </tr>
                <tr>
                  <td className="p-3 border">8.8 - 9.0</td>
                  <td className="p-3 border">Flatter cornea</td>
                  <td className="p-3 border">For eyes with flatter corneas</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-2">Diameter (DIA) Range</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border text-left">Diameter (mm)</th>
                  <th className="p-3 border text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border">13.8 - 14.0</td>
                  <td className="p-3 border">Smaller eyes or steeper corneas</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border">14.0 - 14.2</td>
                  <td className="p-3 border">Average eyes (most common)</td>
                </tr>
                <tr>
                  <td className="p-3 border">14.2 - 14.5</td>
                  <td className="p-3 border">Larger eyes or flatter corneas</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Common Combinations by Lens Type</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border text-left">Contact Lens Type</th>
                <th className="p-3 border text-left">Common Size Combinations (BC/DIA)</th>
                <th className="p-3 border text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border font-medium">Daily Disposables</td>
                <td className="p-3 border">8.5/14.2, 8.6/14.0, 8.7/14.0</td>
                <td className="p-3 border">Most popular for convenience</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 border font-medium">Bi-weekly/Monthly</td>
                <td className="p-3 border">8.4/14.0, 8.6/14.0, 8.6/14.2, 8.8/14.0</td>
                <td className="p-3 border">More size options available</td>
              </tr>
              <tr>
                <td className="p-3 border font-medium">Toric (Astigmatism)</td>
                <td className="p-3 border">8.5/14.5, 8.7/14.5</td>
                <td className="p-3 border">Often slightly larger in diameter</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 border font-medium">Multifocal</td>
                <td className="p-3 border">8.4/14.0, 8.6/14.2, 8.7/14.0</td>
                <td className="p-3 border">For presbyopia (reading issues)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-yellow-700 font-bold">
              Important Information for Store Administrators
            </p>
            <ul className="mt-2 space-y-2 list-disc pl-5 text-sm text-yellow-700">
              <li>Contact lenses require a valid prescription from an eye care professional</li>
              <li>Always verify that customers have a proper prescription when selling contact lenses</li>
              <li>Ensure your product listings clearly indicate which size parameters are available</li>
              <li>Provide guidance for customers on how to read their contact lens prescription</li>
              <li>Consider offering a size verification process before fulfilling orders</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600 italic border-t pt-4 mt-8">
        This guide is for reference only. Contact lenses should only be prescribed by licensed eye care professionals.
      </div>
    </div>
  );
};

export default SizeChartContacts;
