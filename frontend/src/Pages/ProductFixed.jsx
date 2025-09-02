import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { sanitizeImageUrl } from "../utils/image";
import RelatedProduct from "../components/RelatedProduct";
import axios from "axios";
import PrescriptionForm from "../components/PrescriptionForm";
import ProductRecommendations from "../components/ProductRecommendations";
import SizeChartButton from "../components/SizeChartButton";
import { toast } from 'react-toastify';

// Fallback image in case assets.no_image fails
const FALLBACK_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAP1BMVEUAAADq6urn5+fl5eXj4+Pi4uLh4eHi4uLj4+Pl5eXo6Ojr6+vu7u7x8fHz8/P19fX29vb4+Pj5+fn7+/v///9P/Ui8AAAAFHRSTlMAAgQGCg4SFhogJCgsMDQ4PEBQ+qpGR2UAAAIKSURBVHja7dbbboMwDIZRJxyTAGlD9/5PuqlrpQ5pQA3olv+7nQtL/hQrhvh+Op1Op9PpdDqdTqfT6XT63xD8YXwGfxCvk2+pvk++ofYUfVtplvEQffxpenl6GrcvT2D95cXp6THHfXy3VOq7uKMHDxx48MCBB/734NUSSz92C9l7ZLK0Mm1jL7VKcasaJPeOFVL2jglKccwFSnXcA0oj7h62wlVwBUolrgKXQK2JyoFaHlUDtSbqBWqBWkst0Aus9bkWeOP6XA2Ey3IYExC6lCcqB0JJuQXeQSj/U6CTbsEMhFJWywIhq2YBUssCQRYIj0Bo0T6QlXu0D3BW7tE+8FTu0T5QlHu0D0xqAQq0D0RZIMgCQRYIr0CQBcInEIqWgSgLBMvAIAsEw8CkFqBAw0BUC1CgYSCqBVLQL8CsF4hBv0DSC6SgX4BZLxD1AjToF5j0AjToF5j0AlEvMOkF9H8fZL1AkAWCLBBkgfAOBFkgfAJBFgiXQJAFwiUQZIHwDARZIDwDoSgLRFkg3APh0Wkgy33aB9Ylqx/QITBt4fkEj8C8BbUP6BBIF+UebQJ5UQtQoEmgqAUo0CSwrmoB/QKTWoACTQKjWiAF9QJJLZCCeoGkFohBvcCsXkC/wKReQL9AVgvE9wP6/wbSLxD1C6SgXyDpF4j6BYJ+gaBfQL9A1P8P6nQ6nU6n0/09fgEWTIm3euIfJwAAAABJRU5ErkJggg==";

// Wishlist helper functions
const isInWishlist = (productId) => {
  if (!productId) return false;
  
  try {
    // Get the wishlist from localStorage
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Check if the product is in the wishlist
    return wishlist.includes(productId);
  } catch (error) {
    console.error("Error checking wishlist:", error);
    return false;
  }
};

const toggleWishlist = (productId) => {
  if (!productId) return false;
  
  try {
    // Get the current wishlist
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Check if the product is already in the wishlist
    const index = wishlist.indexOf(productId);
    
    if (index === -1) {
      // Add the product to wishlist
      wishlist.push(productId);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      return true; // Product was added
    } else {
      // Remove the product from wishlist
      wishlist.splice(index, 1);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      return false; // Product was removed
    }
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    return false;
  }
};

const ProductFixed = () => {
  const { productId } = useParams();
  // Top-level error boundary state
  const [renderError, setRenderError] = useState(null);

  // Error boundary for rendering
  useEffect(() => {
    try {
      // Just a test log to confirm mount
      console.log('ProductFixed mounted, productId:', productId);
    } catch (err) {
      setRenderError('A rendering error occurred.');
    }
  }, [productId]);
  const navigate = useNavigate();
  const shopContext = useContext(ShopContext);
  const { currency, addToCart, getProductsData, backendUrl } = shopContext;
  
  // Component state
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [inWishlist, setInWishlist] = useState(false);
  const [showPrescription, setShowPrescription] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [error, setError] = useState(null);
  const doneRef = useRef(false);
  const timeoutRef = useRef(null);

  // This function fetches product data
  const fetchProduct = async (id) => {
    if (!id) {
      setError("No product ID provided");
      setLoading(false);
      return;
    }
    
    console.log(`Fetching product with ID: ${id}`);
    
    try {
      // Use a defined backend URL
      const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      
      // Make the API call
      const response = await axios.post(
        `${apiUrl}/api/product/single`,
        { productId: id },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { data } = response;
      
      if (data.success && data.product) {
        console.log("Product retrieved successfully:", data.product.name);
        
        // Update state with product data
        setProductData(data.product);
        
        // Set default image
        if (data.product.image && Array.isArray(data.product.image) && data.product.image.length > 0) {
          setImage(data.product.image[0]);
        } else {
          // Set fallback image
          data.product.image = [assets.no_image || FALLBACK_IMAGE];
          setImage(assets.no_image || FALLBACK_IMAGE);
        }
        
        // Check wishlist status
        setInWishlist(isInWishlist(id));
        
        // Clear any errors
        setError(null);
      } else {
        setError("Product not found");
        
        // Set fallback data
        setProductData({
          name: "Product Not Found",
          description: "The product you're looking for might be unavailable or no longer exists.",
          price: "0.00",
          image: [assets.no_image || FALLBACK_IMAGE]
        });
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Failed to load product");
      
      // Set fallback data for error case
      setProductData({
        name: "Error Loading Product",
        description: "We encountered an error while trying to load this product. Please try again later.",
        price: "0.00",
        image: [assets.no_image || FALLBACK_IMAGE]
      });
    } finally {
      doneRef.current = true;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setLoading(false);
    }
  };

  // Load product data when component mounts or productId changes
  useEffect(() => {
    console.log("ProductFixed component mounted or updated with ID:", productId);
    
    // Reset state
    setLoading(true);
    setProductData(null);
    setImage("");
    setError(null);
    
    // Fetch product data
    fetchProduct(productId);
    
    // Set up timeout as a fallback (guarded against race conditions)
    timeoutRef.current = setTimeout(() => {
      if (doneRef.current) return;
      console.log("Timeout reached without resolution, showing fallback");
      setError("Request timed out");
      setProductData({
        name: "Loading Timed Out",
        description: "It's taking longer than expected to load this product. Please check your connection and try again.",
        price: "0.00",
        image: [assets.no_image || FALLBACK_IMAGE]
      });
      setLoading(false);
    }, 15000);
    
    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [productId]);

  // Handle prescription requirement
  useEffect(() => {
    if (productData && isPrescriptionRequired()) {
      setShowPrescription(true);
    }
  }, [productData]);

  // Add to cart handler
  const handleAddToCart = () => {
    if (!productData) return;
    
    // For products requiring prescription
    if (isPrescriptionRequired() && !prescriptionData) {
      toast.warning("Please fill in the prescription details first.");
      setShowPrescription(true);
      return;
    }
    
    // Handle size requirement
    if (productData.sizes && productData.sizes.length > 0 && !size) {
      toast.warning("Please select a size first.");
      return;
    }
    
    // Use context addToCart signature: (itemId, size, prescription)
    try {
      addToCart(productData._id, size || null, prescriptionData || null);
    } catch (e) {
      console.error('addToCart failed:', e);
      toast.error('Could not add to cart. Please try again.');
      return;
    }
    toast.success("Product added to cart!");
  };

  // Toggle wishlist handler
  const handleWishlist = () => {
    if (!productId) return;
    const added = toggleWishlist(productId);
    setInWishlist(added);
  };

  // Prescription form data handler
  const handlePrescriptionChange = (data) => {
    setPrescriptionData(data);
  };

  // Get prescription type for the product
  const getPrescriptionType = () => {
    if (!productData) return "none";
    
    // Sunglasses: no prescription by default unless explicitly allowed
    if (productData.category === "Sunglasses") {
      return productData.prescription === true ? "prescription_sunglasses" : "none";
    }

    // Prefer explicit type if provided
    if (productData.prescriptionType) {
      return productData.prescriptionType;
    }

    // Category-based defaults
    if (productData.category === "Contact Lenses") return "contacts";
    if (productData.category === "Eyeglasses") return "eyeglasses";

    return "none";
  };

  // Check if prescription is required
  const isPrescriptionRequired = () => {
    if (!productData) return false;
  // Never require for sunglasses
  if (productData.category === "Sunglasses") return false;
  return productData.prescriptionRequired === "required";
  };

  // Check if prescription is available
  const isPrescriptionAvailable = () => {
    if (!productData) return false;
    // Sunglasses: disabled unless explicitly allowed
    if (productData.category === "Sunglasses") {
      return productData.prescription === true || productData.prescriptionType === "prescription_sunglasses";
    }

    // Eyeglasses & Contacts: enabled by default
    if (productData.category === "Eyeglasses" || productData.category === "Contact Lenses") {
      return true;
    }

    // Fallback to explicit flags
    if (productData.prescription) return true;
    if (productData.prescriptionRequired === "required" || productData.prescriptionRequired === "optional") return true;
    if (productData.prescriptionType && productData.prescriptionType !== "none") return true;

    return false;
  };

  // Display loading spinner
  if (renderError) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md p-8 rounded-lg bg-white shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{renderError}</p>
          <button onClick={() => window.location.reload()} className="bg-primary-700 text-white py-2 px-6 rounded-md hover:bg-primary-800 transition-colors">Reload</button>
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-primary-700 border-primary-300 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Display error message if product not found
  if (!productData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md p-8 rounded-lg bg-white shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The product you're looking for might have been removed or is temporarily unavailable."}</p>
          <button 
            onClick={() => navigate('/collection')}
            className="bg-primary-700 text-white py-2 px-6 rounded-md hover:bg-primary-800 transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  // Main product display
  return (
    <main className='border-t-2 transition-opacity ease-in duration-500 opacity-100'>
      {/* Product data container */}
      <div className='flex gap-12 sm:gap-12 flex-col mt-10 sm:flex-row'>
        {/* Product images section */}
        <div className='flex-1 flex flex-col-reverse gap-4 sm:flex-row'>
          {/* Thumbnail navigation */}
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-auto max-h-[500px] hide-scrollbar justify-between sm:justify-start sm:w-[18%] w-full'>
            {productData.image && Array.isArray(productData.image) && productData.image.length > 0 ? 
              productData.image.map((item, i) => (
                <div 
                  key={i} 
                  className={`min-w-[70px] h-[70px] sm:w-[70px] border cursor-pointer ${image === item ? 'border-primary' : 'border-light-gray'}`}
                  onClick={() => setImage(item)}
                >
                  <img 
                    src={sanitizeImageUrl(item)} 
                    alt={`${productData.name} view ${i+1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log("Image failed to load, using fallback");
                      e.target.onerror = null; 
                      e.target.src = assets.no_image || FALLBACK_IMAGE;
                    }}
                  />
                </div>
              )) : 
              <div className="min-w-[70px] h-[70px] sm:w-[70px] border border-light-gray">
                <img src={assets.no_image || FALLBACK_IMAGE} alt="No image available" className="w-full h-full object-cover" />
              </div>
            }
          </div>

          {/* Main product image */}
          <div className='flex-1 sm:h-auto h-[320px] relative'>
            <img 
              src={sanitizeImageUrl(image) || (productData.image && productData.image.length > 0 ? sanitizeImageUrl(productData.image[0]) : assets.no_image || FALLBACK_IMAGE)} 
              alt={productData.name || 'Product image'} 
              className='w-full h-full object-contain'
              onError={(e) => {
                console.log("Main image failed to load, using fallback");
                e.target.onerror = null; 
                e.target.src = assets.no_image || FALLBACK_IMAGE;
              }}
            />
            
            {/* Overlay information */}
            {productData.bestseller && (
              <span className="absolute top-4 left-4 bg-orange text-white text-xs px-2 py-1 rounded">
                BESTSELLER
              </span>
            )}
            {productData.sku && (
              <span className="absolute bottom-4 right-4 bg-black bg-opacity-40 text-white text-xs px-2 py-1 rounded">
                SKU: {productData.sku}
              </span>
            )}
          </div>
        </div>

        {/* Product information section */}
        <div className='flex-1'>
          <div className="flex justify-between items-start">
            <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
            <button
              onClick={handleWishlist}
              className="flex items-center justify-center bg-white p-2 rounded-full hover:bg-light-gray"
            >
              {inWishlist ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </button>
          </div>

          {/* Price */}
          <div className='font-medium text-xl text-orange mt-3'>
            {currency}{productData.price || '0.00'}
          </div>

          {/* Description */}
          <p className='mt-5 text-gray w-4/5'>{productData.description || 'No description available'}</p>

          {/* Size selection */}
          {productData.sizes && productData.sizes.length > 0 && (
            <div className='mt-5'>
              <p className='font-medium'>Size:</p>
              <div className='flex gap-3 mt-2'>
                {productData.sizes
                  .map((s) => (typeof s === 'string' ? { label: s, value: s } : { label: s?.size ?? String(s), value: s?.size ?? String(s) }))
                  .map((opt, i) => (
                    <div 
                      key={i} 
                      onClick={() => setSize(opt.value)}
                      className={`w-[40px] h-[30px] flex justify-center items-center cursor-pointer ${size === opt.value ? 'bg-primary text-white' : 'bg-light-gray'}`}
                    >
                      {opt.label}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Size chart button */}
          {productData.sizes && productData.sizes.length > 0 && (
            <div className="mt-2">
              <SizeChartButton category={productData.category || ''} />
            </div>
          )}

          {/* Prescription form toggle */}
          {isPrescriptionAvailable() && (
            <div className='mt-5'>
              <button 
                onClick={() => setShowPrescription(!showPrescription)}
                className="flex items-center text-primary hover:text-primary-dark"
              >
                <span>
                  {showPrescription ? 'Hide Prescription Details' : 'Add Prescription Details'}
                </span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`ml-2 h-5 w-5 transition-transform ${showPrescription ? 'rotate-180' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}

          {/* Prescription form */}
          {showPrescription && (
            <div className="mt-4 bg-gray-50 p-4 rounded-md">
              <PrescriptionForm 
                type={getPrescriptionType()} 
                onSubmit={handlePrescriptionChange}
                required={isPrescriptionRequired()}
              />
            </div>
          )}

          {/* Add to cart button */}
          <div className='flex gap-5 items-center mt-8'>
            <button 
              onClick={handleAddToCart}
              className="bg-primary text-white py-2 px-6 font-medium hover:bg-primary-dark transition-colors"
            >
              ADD TO CART
            </button>
          </div>
        </div>
      </div>

      {/* Product info tabs */}
      <div className='mt-20 border-t border-light-gray'>
        <div className='mt-10'>
          <div className='border-b border-light-gray'>
            <h2 className='font-medium text-xl'>Product Details</h2>
          </div>
          <div className='mt-5'>
            <p>{productData.description || 'No description available'}</p>
            
            {/* Product specifications */}
            {productData.specifications && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(productData.specifications).map(([key, value]) => {
                  const text = Array.isArray(value)
                    ? value.join(', ')
                    : (value && typeof value === 'object')
                      ? (value.size ?? JSON.stringify(value))
                      : String(value);
                  return (
                    <div key={key} className="flex">
                      <span className="font-medium min-w-[120px]">{key}:</span>
                      <span className="ml-2">{text}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related products section */}
      <div className='mt-20'>
        <h1 className='font-medium text-2xl text-center'>Related Products</h1>
        {productData && (
          <ProductRecommendations 
            currentProduct={productData}
            limit={4}
          />
        )}
      </div>
    </main>
  );
};

export default ProductFixed;
