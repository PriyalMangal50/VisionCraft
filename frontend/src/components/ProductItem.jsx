import { useContext, useEffect, useMemo, useState, memo } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { toggleWishlist, isInWishlist } from "../Pages/Wishlist";
import { sanitizeImageUrl } from "../utils/image";

const ProductItem = (props) => {
  const { _id, image, name, price, category, brand, frameShape, frameColor, lensType } = props;
  const { currency } = useContext(ShopContext);
  const [inWishlist, setInWishlist] = useState(false);
  
  // Check if product is in wishlist
  useEffect(() => {
    if (_id) {
      setInWishlist(isInWishlist(_id));
    }
  }, [_id]);
  
  // Handle wishlist toggle
  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (_id) {
      const added = toggleWishlist(_id);
      setInWishlist(added);
    }
  };
  
  // Track clicks from quiz results
  const trackQuizClick = () => {
    const quizId = localStorage.getItem('lastQuizId');
    if (quizId) {
      console.log('Tracking quiz click:', quizId, _id);
      // Track interaction with the backend
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/quiz/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizId,
          productId: _id,
          action: 'click'
        })
      }).then(response => response.json())
        .then(data => console.log('Quiz click tracked:', data))
        .catch(error => console.error("Error tracking quiz click:", error));
    }
  };
  
  // Always show a fallback image if missing or broken
  const fallbackImage = '/images/no_image.png';
  const mainImage = useMemo(() => {
    const src = (image && Array.isArray(image) && image.length > 0) ? image[0] : fallbackImage;
    return sanitizeImageUrl(src, fallbackImage);
  }, [image]);
  
  return (
    <div className="relative group font-arial card-flat hover:shadow-card-hover transition-all duration-300">
      <Link onClick={() => {
        scrollTo(0,0);
        trackQuizClick();
      }} to={`/product/${_id}`} className='text-gray-600 cursor-pointer block'>
        <div className='relative overflow-hidden rounded-lg border border-gray-100 bg-white'>
          <img 
            className='product-card-img'
            src={mainImage}
            alt={name}
            loading="lazy"
            decoding="async"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            onError={e => { e.target.onerror = null; e.target.src = fallbackImage; }}
          />
          {/* Category badge */}
          {category && (
            <div className={`badge absolute top-2 left-2 text-white text-xs px-2.5 py-1 shadow-sm ${
              category === 'Eyeglasses' ? 'bg-primary-600' : 
              category === 'Sunglasses' ? 'bg-secondary-600' :
              category === 'Contact Lenses' ? 'bg-accent-600' : 'bg-primary-600'
            }`}>
              {category}
            </div>
          )}
        </div>
        
        <div className="mt-3 px-1.5 pb-4">
          {/* Brand */}
          {brand && (
            <p className="text-xs text-secondary font-medium uppercase tracking-wider">{brand}</p>
          )}
          
          {/* Product name */}
          <p className='text-sm font-medium line-clamp-2 text-primary-dark mt-1'>{name}</p>
          
          {/* Price */}
          <p className='text-sm font-arial-extrabold mt-2 text-accent'>{currency} {price}</p>
          
          {/* Product details - only show if they exist */}
          <div className="mt-2 space-y-1 border-t border-gray-100 pt-2">
            {frameShape && (
              <p className="text-xs text-gray-500">
                <span className="font-medium text-primary-dark">Shape:</span> {frameShape}
              </p>
            )}
            
            {frameColor && (
              <p className="text-xs text-gray-500">
                <span className="font-medium text-primary-dark">Color:</span> {frameColor}
              </p>
            )}
            
            {lensType && (
              <p className="text-xs text-gray-500">
                <span className="font-medium text-primary-dark">Lens:</span> {lensType}
              </p>
            )}
          </div>
        </div>
      </Link>
      
      {/* Wishlist button */}
  <button
        onClick={handleWishlist}
        className="absolute top-2 right-2 bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md hover:shadow-lg hover:bg-gray-50"
        title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        {inWishlist ? (
          <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        )}
      </button>
      
  {/* Subtle hover overlay */}
  <div className="pointer-events-none absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/5 to-transparent"></div>
    </div>
  );
};

export default memo(ProductItem);
