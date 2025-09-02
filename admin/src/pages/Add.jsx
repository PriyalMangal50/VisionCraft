import React, { useState } from "react";
import { assets } from "../assets/assets";
import api from "../api/http";
import { toast } from "react-toastify";


const Add = ({ token }) => {
  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("Eyeglasses")
  const [subCategory, setSubcategory] = useState("Men")
  const [brand, setBrand] = useState("")
  const [frameShape, setFrameShape] = useState("Rectangle")
  const [frameMaterial, setFrameMaterial] = useState("Metal")
  const [frameColor, setFrameColor] = useState("")
  const [lensType, setLensType] = useState("")
  const [prescription, setPrescription] = useState(false)
  const [prescriptionRequired, setPrescriptionRequired] = useState("none")
  const [prescriptionType, setPrescriptionType] = useState("none")
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState([])

  // Frame shape options
  const frameShapeOptions = [
    "Rectangle", "Square", "Round", "Oval", "Cat Eye",
    "Aviator", "Browline", "Geometric", "Rimless", "Semi-Rimless"
  ];

  // Frame material options
  const frameMaterialOptions = [
    "Metal", "Plastic", "Acetate", "Titanium", "Stainless Steel",
    "Memory Metal", "Carbon Fiber", "Wood", "Mixed Material"
  ];

  // Prescription required options
  const prescriptionRequiredOptions = [
    { value: "none", label: "Not Required" },
    { value: "optional", label: "Optional" },
    { value: "required", label: "Required" },
  ];

  // Prescription type options
  const prescriptionTypeOptions = [
    { value: "none", label: "None" },
    { value: "eyeglasses", label: "Eyeglasses" },
    { value: "prescription_sunglasses", label: "Prescription Sunglasses" },
    { value: "contacts", label: "Contact Lenses" },
  ];

  // Update prescription fields when category changes
  React.useEffect(() => {
    if (category === "Eyeglasses") {
      setPrescriptionRequired("optional");
      setPrescriptionType("eyeglasses");
    } else if (category === "Sunglasses") {
      // For sunglasses, default to non-prescription (can be changed by admin)
      setPrescriptionRequired("none");
      setPrescriptionType("none");
    } else if (category === "Contact Lenses") {
      setPrescriptionRequired("required");
      setPrescriptionType("contacts");
    }
  }, [category]);

  // Show size inputs based on product category
  const getSizeInputs = () => {
    if (category === "Contact Lenses") {
      return (
        <div>
          <div className='flex justify-between items-center mb-2'>
            <p className='text-sm text-gray-600'>Select the contact lens sizes (base curve / diameter):</p>
            <button
              type="button"
              className="text-xs text-blue-600 underline"
              onClick={() => window.open("/size-chart-contacts", "_blank")}
            >
              View Size Guide
            </button>
          </div>
          <div className='flex gap-2.5 flex-wrap'>
            {[
              "8.4/14.0", "8.5/14.0", 
              "8.6/14.0", "8.6/14.2", 
              "8.7/14.0", "8.7/14.2",
              "8.8/14.0", "8.9/14.5"
            ].map(size => (
              <div key={size} onClick={() =>
                setSizes(prev =>
                  prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size]
                )}>
                <p className={`${sizes.includes(size) ? "bg-pink-100" : "bg-pink-200"} px-3 py-1 cursor-pointer text-sm`}>
                  {size}
                  <span className="block text-xs text-gray-500">BC/DIA (mm)</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      // For eyeglasses and sunglasses
      return (
        <div>
          <div className='flex justify-between items-center mb-2'>
            <p className='text-sm text-gray-600'>Select the frame sizes available for this product:</p>
            <button
              type="button"
              className="text-xs text-blue-600 underline"
              onClick={() => window.open("/size-chart-frames", "_blank")}
            >
              View Size Guide
            </button>
          </div>
          <div className='flex gap-2.5 flex-wrap'>
            {["Small", "Medium", "Large", "X-Large"].map(size => (
              <div key={size} onClick={() =>
                setSizes(prev =>
                  prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size]
                )}>
                <p className={`${sizes.includes(size) ? "bg-pink-100" : "bg-pink-200"} px-3 py-1 cursor-pointer`}>
                  {size}
                  {size === "Small" && <span className="block text-xs text-gray-500">40-48mm lens width</span>}
                  {size === "Medium" && <span className="block text-xs text-gray-500">49-53mm lens width</span>}
                  {size === "Large" && <span className="block text-xs text-gray-500">54-58mm lens width</span>}
                  {size === "X-Large" && <span className="block text-xs text-gray-500">58mm+ lens width</span>}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  // Function to get lens type options based on category
  const getLensTypeOptions = () => {
    if (category === "Eyeglasses") {
      return [
        "Single Vision", "Bifocal", "Progressive", 
        "Blue Light Blocking", "Reading", "Non-Prescription"
      ];
    } else if (category === "Sunglasses") {
      return [
        "Standard Tint", "Polarized", "Mirror Coating", 
        "Gradient Tint", "Photochromic", "Non-Prescription"
      ];
    } else if (category === "Contact Lenses") {
      return [
        "Daily Disposable", "Weekly Disposable", "Monthly Disposable",
        "Extended Wear", "Colored Contacts", "Toric (for Astigmatism)",
        "Multifocal", "Rigid Gas Permeable (RGP)"
      ];
    }
    return [];
  };

  // Handle form submission
  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      // Validate required fields
      if (!name || name.trim() === '') {
        toast.error("Product name is required");
        return;
      }
      if (!description || description.trim() === '') {
        toast.error("Product description is required");
        return;
      }
      if (!price || price <= 0) {
        toast.error("Valid product price is required");
        return;
      }
      if (!image1) {
        toast.error("Add at least one image");
        return;
      }
      if (sizes.length === 0) {
        toast.error("Add at least one size");
        return;
      }
      // Show loading state
      toast.info("Adding product...");

      const formData = new FormData();
      formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      // Trim whitespace from name
      formData.append("name", name.trim());
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("brand", brand);
      formData.append("frameShape", frameShape);
      formData.append("frameMaterial", frameMaterial);
      formData.append("frameColor", frameColor);
      formData.append("lensType", lensType);
      formData.append("prescription", prescription);
      formData.append("prescriptionRequired", prescriptionRequired);
      formData.append("prescriptionType", prescriptionType);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

  const response = await api.post("/api/product/add", formData)
      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setBrand('')
        setFrameShape('')
        setFrameMaterial('')
        setFrameColor('')
        setLensType('')
        setPrescription(false)
        setPrescriptionRequired("none")
        setPrescriptionType("none")
        setSizes([])
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice('')
        setBestseller(false)
      }
      else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error("Error adding product:", error);
      
      // Handle different error types
      if (error.response) {
        // The request was made and the server responded with an error status
        toast.error(error.response.data?.message || "Server error. Please try again.");
      } else if (error.request) {
        // The request was made but no response was received
        toast.error("No response from server. Please check your connection.");
      } else {
        // Something happened in setting up the request
        toast.error(error.message || "An error occurred. Please try again.");
      }
    }
  };
  return (
    <main>
      <form onSubmit={onSubmitHandler}
        className='flex flex-col w-full items-start gap-3'>
        <div className="border p-4 rounded bg-gray-50 mb-4">
          <p className='mb-2 font-medium'>Professional Image Guidelines</p>
          <ul className="text-xs text-gray-600 list-disc pl-4 mb-3">
            <li>First image should be a front-facing view against a clean white background</li>
            <li>Use consistent lighting and styling across all product images</li>
            <li>Recommended resolution: 1200x1200px minimum for high quality display</li>
            <li>Provide multiple angles: front, side, and detail views</li>
            <li>For professional results, use the same image style for similar products</li>
          </ul>
        </div>
        
        <div className="mb-4">
          <p className='mb-2 font-medium text-sm'>Upload Images</p>
          <div className='flex flex-wrap gap-3'>
            <div className="text-center">
              <p className="text-xs text-blue-700 mb-1">Main Image</p>
              <label htmlFor="image1" className="block">
                <div className={`w-28 h-28 flex items-center justify-center border-2 ${image1 ? 'border-blue-500' : 'border-dashed border-gray-300'} rounded-md overflow-hidden`}>
                  {!image1 ? 
                    <div className="flex flex-col items-center">
                      <img className='w-8 opacity-50' src={assets.upload_area} alt='upload' />
                      <span className="text-xs text-gray-500 mt-1">Primary View</span>
                    </div> : 
                    <img className='w-full h-full object-cover' src={URL.createObjectURL(image1)} alt='Product preview' />
                  }
                </div>
              </label>
              <input
                onChange={(e) => setImage1(e.target.files[0])}
                type='file'
                id="image1"
                hidden
              />
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Side View</p>
              <label htmlFor="image2" className="block">
                <div className={`w-28 h-28 flex items-center justify-center border-2 ${image2 ? 'border-blue-500' : 'border-dashed border-gray-300'} rounded-md overflow-hidden`}>
                  {!image2 ? 
                    <div className="flex flex-col items-center">
                      <img className='w-8 opacity-50' src={assets.upload_area} alt='upload' />
                      <span className="text-xs text-gray-500 mt-1">Side View</span>
                    </div> : 
                    <img className='w-full h-full object-cover' src={URL.createObjectURL(image2)} alt='Side view preview' />
                  }
                </div>
                <input
                  onChange={(e) => setImage2(e.target.files[0])}
                  type='file'
                  id="image2"
                  hidden
                />
              </label>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Top View</p>
              <label htmlFor="image3" className="block">
                <div className={`w-28 h-28 flex items-center justify-center border-2 ${image3 ? 'border-blue-500' : 'border-dashed border-gray-300'} rounded-md overflow-hidden`}>
                  {!image3 ? 
                    <div className="flex flex-col items-center">
                      <img className='w-8 opacity-50' src={assets.upload_area} alt='upload' />
                      <span className="text-xs text-gray-500 mt-1">Top View</span>
                    </div> : 
                    <img className='w-full h-full object-cover' src={URL.createObjectURL(image3)} alt='Top view preview' />
                  }
                </div>
                <input
                  onChange={(e) => setImage3(e.target.files[0])}
                  type='file'
                  id="image3"
                  hidden
                />
              </label>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Detail View</p>
              <label htmlFor="image4" className="block">
                <div className={`w-28 h-28 flex items-center justify-center border-2 ${image4 ? 'border-blue-500' : 'border-dashed border-gray-300'} rounded-md overflow-hidden`}>
                  {!image4 ? 
                    <div className="flex flex-col items-center">
                      <img className='w-8 opacity-50' src={assets.upload_area} alt='upload' />
                      <span className="text-xs text-gray-500 mt-1">Detail View</span>
                    </div> : 
                    <img className='w-full h-full object-cover' src={URL.createObjectURL(image4)} alt='Detail view preview' />
                  }
                </div>
                <input
                  onChange={(e) => setImage4(e.target.files[0])}
                  type='file'
                  id="image4"
                  hidden
                />
              </label>
            </div>
          </div>
        </div>

        {/* ----input fields------ */}

        <div className="border p-4 rounded bg-gray-50 mb-4">
          <p className='font-medium mb-2'>Product Information Best Practices</p>
          <ul className="text-xs text-gray-600 list-disc pl-4">
            <li>Use descriptive, search-friendly product names that include brand and key features</li>
            <li>Write detailed descriptions highlighting benefits and unique selling points</li>
            <li>Be consistent with sizing, specifications and technical details</li>
            <li>For prescription products, clearly specify requirements and available options</li>
            <li>A SKU (Stock Keeping Unit) will be automatically generated for inventory tracking</li>
          </ul>
        </div>

        <div className='w-full'>
          <p className='mb-2 font-medium text-sm'>Product Name</p>
          <input
            name='name'
            onChange={(e) => setName(e.target.value)}
            value={name}
            className='w-full max-w-[500px] px-3 py-2'
            type='text'
            placeholder='Product Name'
            required
          />
        </div>
        <div className='w-full'>
          <p className='mb-2 font-medium text-sm'>Product Description</p>
          <textarea
            rows={4}
            name='description'
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className='w-full max-w-[500px] px-3 py-2'
            type='text'
            placeholder='Product Description'
            required
          />
        </div>
        <div className='w-full'>
          <p className='mb-2 font-medium text-sm'>Product Price</p>
          <input
            name='price'
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className='w-full max-w-[500px] px-3 py-2'
            type='number'
            placeholder='Price'
            required
          />
        </div>

        <div className='w-full max-w-[500px]'>
          <p className='mb-2 font-medium text-sm'>Product Category</p>
          <select className='w-full px-3 py-2'
            name='category'
            onChange={(e) => {
              setCategory(e.target.value);
              // Reset subcategory when category changes
              setSubcategory(e.target.value === "Contact Lenses" ? "Daily" : "Men");
              setSizes([]);
              setLensType("");
            }}
            value={category}
          >
            <option value='Eyeglasses'>Eyeglasses</option>
            <option value='Sunglasses'>Sunglasses</option>
            <option value='Contact Lenses'>Contact Lenses</option>
          </select>
        </div>

        <div className='w-full max-w-[500px]'>
          <p className='mb-2 font-medium text-sm'>Product Sub Category</p>
          <select className='w-full px-3 py-2'
            name='subCategory'
            onChange={(e) => setSubcategory(e.target.value)}
            value={subCategory}
          >
            {category !== "Contact Lenses" ? (
              <>
                <option value='Men'>Men</option>
                <option value='Women'>Women</option>
                <option value='Kids'>Kids</option>
                <option value='Unisex'>Unisex</option>
              </>
            ) : (
              <>
                <option value='Daily'>Daily</option>
                <option value='Weekly'>Weekly</option>
                <option value='Monthly'>Monthly</option>
                <option value='Colored'>Colored</option>
                <option value='Toric'>Toric (Astigmatism)</option>
                <option value='Multifocal'>Multifocal</option>
              </>
            )}
          </select>
        </div>

        <div className='w-full'>
          <p className='mb-2 font-medium text-sm'>Brand</p>
          <input
            name='brand'
            onChange={(e) => setBrand(e.target.value)}
            value={brand}
            className='w-full max-w-[500px] px-3 py-2'
            type='text'
            placeholder='Ray-Ban, Oakley, etc.'
          />
        </div>

        {(category === "Eyeglasses" || category === "Sunglasses") && (
          <div className='flex flex-col sm:flex-row sm:gap-6 gap-2 w-full'>
            <div>
              <p className='mb-2 font-medium text-sm'>Frame Shape</p>
              <select className='w-full px-3 py-2'
                name='frameShape'
                onChange={(e) => setFrameShape(e.target.value)}
                value={frameShape}
              >
                {frameShapeOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <p className='mb-2 font-medium text-sm'>Frame Material</p>
              <select className='w-full px-3 py-2'
                name='frameMaterial'
                onChange={(e) => setFrameMaterial(e.target.value)}
                value={frameMaterial}
              >
                {frameMaterialOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <p className='mb-2 font-medium text-sm'>Frame Color</p>
              <input
                name='frameColor'
                onChange={(e) => setFrameColor(e.target.value)}
                value={frameColor}
                className='w-full max-w-[500px] px-3 py-2'
                type='text'
                placeholder='Black, Tortoise, etc.'
              />
            </div>
          </div>
        )}

        <div>
          <p className='mb-2 font-medium text-sm'>Lens Type</p>
          <select className='w-full max-w-[500px] px-3 py-2'
            name='lensType'
            onChange={(e) => setLensType(e.target.value)}
            value={lensType}
          >
            <option value="">Select Lens Type</option>
            {getLensTypeOptions().map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div>
          <p className='mb-2 font-medium text-sm'>Product Sizes</p>
          {getSizeInputs()}
        </div>

        <div className='flex gap-4 mt-2'>
          <div className='flex gap-2'>
            <input
              name='prescription'
              type='checkbox'
              id='prescription'
              checked={prescription}
              onChange={() => setPrescription(prev => !prev)}
            />
            <label htmlFor='prescription'>Available with prescription</label>
          </div>

          <div className='flex gap-2'>
            <input
              name='bestseller'
              type='checkbox'
              id='bestseller'
              checked={bestseller}
              onChange={() => setBestseller(prev => !prev)}
            />
            <label htmlFor='bestseller'>Add to bestseller</label>
          </div>
        </div>

        {/* Prescription fields */}
        <div className='w-full max-w-[500px]'>
          <p className='mb-2 font-medium text-sm'>Prescription Requirement</p>
          <select className='w-full px-3 py-2'
            name='prescriptionRequired'
            onChange={(e) => setPrescriptionRequired(e.target.value)}
            value={prescriptionRequired}
          >
            {prescriptionRequiredOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className='w-full max-w-[500px]'>
          <p className='mb-2 font-medium text-sm'>Prescription Form Type</p>
          <select className='w-full px-3 py-2'
            name='prescriptionType'
            onChange={(e) => setPrescriptionType(e.target.value)}
            value={prescriptionType}
          >
            {prescriptionTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            This determines which type of prescription form will be shown to customers.
          </p>
        </div>

        <button type='submit'
          className='uppercase bg-black text-white px-3 py-3 rounded'>
          Add Product
        </button>
      </form>
    </main>
  );
};

export default Add;
