import React, { useState } from 'react';

const EyeglassesPrescriptionForm = ({ onChange }) => {
  const [prescription, setPrescription] = useState({
    rightEye: {
      sphere: '',
      cylinder: '',
      axis: '',
      add: ''
    },
    leftEye: {
      sphere: '',
      cylinder: '',
      axis: '',
      add: ''
    },
    pd: '',
    notes: ''
  });

  const handleChange = (eye, field, value) => {
    if (eye === 'pd') {
      setPrescription(prev => {
        const updated = { ...prev, pd: value };
        onChange(updated);
        return updated;
      });
      return;
    }
    
    if (eye === 'notes') {
      setPrescription(prev => {
        const updated = { ...prev, notes: value };
        onChange(updated);
        return updated;
      });
      return;
    }
    
    setPrescription(prev => {
      const updated = {
        ...prev,
        [eye]: {
          ...prev[eye],
          [field]: value
        }
      };
      onChange(updated);
      return updated;
    });
  };

  const sphereOptions = [];
  for (let i = -20; i <= 20; i += 0.25) {
    sphereOptions.push(i.toFixed(2));
  }

  const cylinderOptions = [];
  for (let i = -10; i <= 10; i += 0.25) {
    cylinderOptions.push(i.toFixed(2));
  }

  const axisOptions = [];
  for (let i = 1; i <= 180; i++) {
    axisOptions.push(i);
  }

  const addOptions = ['', '0.75', '1.00', '1.25', '1.50', '1.75', '2.00', '2.25', '2.50', '2.75', '3.00', '3.25', '3.50'];

  return (
    <div className="mt-4 bg-white p-4 border rounded-md">
      <h3 className="text-lg font-medium mb-4">Enter Your Prescription</h3>
      
      <div className="grid grid-cols-5 gap-2 mb-4 text-sm">
        <div className="font-medium"></div>
        <div className="font-medium text-center">SPH (Sphere)</div>
        <div className="font-medium text-center">CYL (Cylinder)</div>
        <div className="font-medium text-center">Axis</div>
        <div className="font-medium text-center">Add</div>
        
        <div className="font-medium">Right Eye (OD)</div>
        <div>
          <select 
            className="w-full p-2 border rounded"
            value={prescription.rightEye.sphere}
            onChange={(e) => handleChange('rightEye', 'sphere', e.target.value)}
          >
            <option value="">Select</option>
            {sphereOptions.map(option => (
              <option key={`right-sphere-${option}`} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div>
          <select 
            className="w-full p-2 border rounded"
            value={prescription.rightEye.cylinder}
            onChange={(e) => handleChange('rightEye', 'cylinder', e.target.value)}
          >
            <option value="">Select</option>
            {cylinderOptions.map(option => (
              <option key={`right-cyl-${option}`} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div>
          <select 
            className="w-full p-2 border rounded"
            value={prescription.rightEye.axis}
            onChange={(e) => handleChange('rightEye', 'axis', e.target.value)}
            disabled={!prescription.rightEye.cylinder}
          >
            <option value="">Select</option>
            {axisOptions.map(option => (
              <option key={`right-axis-${option}`} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div>
          <select 
            className="w-full p-2 border rounded"
            value={prescription.rightEye.add}
            onChange={(e) => handleChange('rightEye', 'add', e.target.value)}
          >
            <option value="">Select</option>
            {addOptions.map(option => (
              <option key={`right-add-${option}`} value={option}>{option || 'None'}</option>
            ))}
          </select>
        </div>
        
        <div className="font-medium">Left Eye (OS)</div>
        <div>
          <select 
            className="w-full p-2 border rounded"
            value={prescription.leftEye.sphere}
            onChange={(e) => handleChange('leftEye', 'sphere', e.target.value)}
          >
            <option value="">Select</option>
            {sphereOptions.map(option => (
              <option key={`left-sphere-${option}`} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div>
          <select 
            className="w-full p-2 border rounded"
            value={prescription.leftEye.cylinder}
            onChange={(e) => handleChange('leftEye', 'cylinder', e.target.value)}
          >
            <option value="">Select</option>
            {cylinderOptions.map(option => (
              <option key={`left-cyl-${option}`} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div>
          <select 
            className="w-full p-2 border rounded"
            value={prescription.leftEye.axis}
            onChange={(e) => handleChange('leftEye', 'axis', e.target.value)}
            disabled={!prescription.leftEye.cylinder}
          >
            <option value="">Select</option>
            {axisOptions.map(option => (
              <option key={`left-axis-${option}`} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div>
          <select 
            className="w-full p-2 border rounded"
            value={prescription.leftEye.add}
            onChange={(e) => handleChange('leftEye', 'add', e.target.value)}
          >
            <option value="">Select</option>
            {addOptions.map(option => (
              <option key={`left-add-${option}`} value={option}>{option || 'None'}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">PD (Pupillary Distance)</label>
        <input
          type="number"
          className="w-full max-w-xs p-2 border rounded"
          placeholder="Enter PD (mm)"
          value={prescription.pd}
          onChange={(e) => handleChange('pd', null, e.target.value)}
        />
        <p className="text-xs text-gray-500 mt-1">If you don't know your PD, leave it blank and we'll use the standard adult average.</p>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Additional Notes</label>
        <textarea
          className="w-full p-2 border rounded"
          rows="2"
          placeholder="Any special instructions or requests"
          value={prescription.notes}
          onChange={(e) => handleChange('notes', null, e.target.value)}
        ></textarea>
      </div>
      
      <div className="text-xs text-gray-500">
        <p>* Please ensure your prescription is current (less than 2 years old).</p>
        <p>* If you need help, you can upload your prescription image after adding to cart.</p>
      </div>
    </div>
  );
};

const ContactLensPrescriptionForm = ({ onChange }) => {
  const [prescription, setPrescription] = useState({
    baseCurve: '',
    diameter: '',
    power: '',
    notes: ''
  });

  const handleChange = (field, value) => {
    setPrescription(prev => {
      const updated = { ...prev, [field]: value };
      onChange(updated);
      return updated;
    });
  };

  // Power options (same as sphere values)
  const powerOptions = [];
  for (let i = -20; i <= 20; i += 0.25) {
    powerOptions.push(i.toFixed(2));
  }

  // Base curve options
  const baseCurveOptions = ['8.4', '8.5', '8.6', '8.7', '8.8', '8.9', '9.0'];
  
  // Diameter options
  const diameterOptions = ['13.8', '14.0', '14.2', '14.5'];

  return (
    <div className="mt-4 bg-white p-4 border rounded-md">
      <h3 className="text-lg font-medium mb-4">Enter Your Contact Lens Prescription</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Power</label>
          <select 
            className="w-full p-2 border rounded"
            value={prescription.power}
            onChange={(e) => handleChange('power', e.target.value)}
          >
            <option value="">Select Power</option>
            {powerOptions.map(option => (
              <option key={`power-${option}`} value={option}>{option}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Base Curve (BC)</label>
          <select 
            className="w-full p-2 border rounded"
            value={prescription.baseCurve}
            onChange={(e) => handleChange('baseCurve', e.target.value)}
          >
            <option value="">Select Base Curve</option>
            {baseCurveOptions.map(option => (
              <option key={`bc-${option}`} value={option}>{option}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Diameter (DIA)</label>
          <select 
            className="w-full p-2 border rounded"
            value={prescription.diameter}
            onChange={(e) => handleChange('diameter', e.target.value)}
          >
            <option value="">Select Diameter</option>
            {diameterOptions.map(option => (
              <option key={`dia-${option}`} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Additional Notes</label>
        <textarea
          className="w-full p-2 border rounded"
          rows="2"
          placeholder="Any special instructions or requests"
          value={prescription.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
        ></textarea>
      </div>
      
      <div className="text-xs text-gray-500">
        <p>* Please ensure your prescription is current (less than 1 year old).</p>
        <p>* If you need help, contact our customer support for assistance.</p>
      </div>
    </div>
  );
};

const PrescriptionForm = ({ productType, onChange }) => {
  if (productType === "eyeglasses" || productType === "prescription_sunglasses") {
    return (
      <>
        <div className="mt-2 mb-4">
          <h3 className="text-lg font-medium">
            {productType === "prescription_sunglasses" 
              ? "Prescription Sunglasses" 
              : "Eyeglasses"} Prescription
          </h3>
        </div>
        <EyeglassesPrescriptionForm onChange={onChange} />
      </>
    );
  } else if (productType === "contacts") {
    return <ContactLensPrescriptionForm onChange={onChange} />;
  }
  
  return (
    <div className="mt-4 p-4 border rounded bg-gray-50">
      <p className="text-center text-gray-500">No prescription form available for this product type.</p>
    </div>
  );
};

export default PrescriptionForm;
