import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Wishlist = () => {
  const { products, currency, navigate } = useContext(ShopContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Get wishlist from localStorage
      const savedWishlist = JSON.parse(localStorage.getItem('visioncraft_wishlist') || '[]');
      
      if (Array.isArray(products) && products.length > 0) {
        const validProducts = products.filter(product => product && product._id);
        const wishlistProducts = validProducts.filter(product => 
          savedWishlist.includes(product._id)
        );
        setWishlistItems(wishlistProducts);
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  }, [products]);

  const removeFromWishlist = (productId) => {
    if (!productId) return;
    
    try {
      const savedWishlist = JSON.parse(localStorage.getItem('visioncraft_wishlist') || '[]');
      const updatedWishlist = savedWishlist.filter(id => id !== productId);
      localStorage.setItem('visioncraft_wishlist', JSON.stringify(updatedWishlist));
      setWishlistItems(prev => prev.filter(item => item._id !== productId));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  if (loading) {
    return (
      <div className='border-t pt-10 px-5 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] text-center py-20'>
        <p>Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className='border-t pt-10 px-5 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <div className='text-2xl mb-3'>
        <Title text1={'MY'} text2={'WISHLIST'} />
      </div>

      {wishlistItems.length === 0 ? (
        <div className='text-center py-20'>
          <div className='text-6xl mb-4'>💝</div>
          <h2 className='text-2xl font-medium mb-4'>Your wishlist is empty</h2>
          <p className='text-gray-600 mb-8'>
            Save your favorite items to your wishlist so you can easily find them later.
          </p>
          <button 
            onClick={() => navigate('/collection')}
            className='bg-black text-white px-8 py-3 text-sm hover:bg-gray-800 transition-colors'
          >
            START SHOPPING
          </button>
        </div>
      ) : (
        <div>
          <p className='text-gray-600 mb-8'>
            You have {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist
          </p>
          
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            {wishlistItems.map((item, index) => (
              <div key={item._id || index} className='relative'>
                <ProductItem 
                  _id={item._id} 
                  image={item.image} 
                  name={item.name} 
                  price={item.price}
                  category={item.category}
                  brand={item.brand}
                  frameShape={item.frameShape}
                  frameColor={item.frameColor}
                  lensType={item.lensType}
                />
                <button
                  onClick={() => removeFromWishlist(item._id)}
                  className='absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors'
                  title='Remove from wishlist'
                >
                  <svg className='w-4 h-4 text-red-500' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd' />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className='mt-12 text-center'>
            <button 
              onClick={() => navigate('/collection')}
              className='bg-black text-white px-8 py-3 text-sm hover:bg-gray-800 transition-colors mr-4'
            >
              CONTINUE SHOPPING
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Export the component as default
export default Wishlist;

// Utility: check if product is in wishlist
export const isInWishlist = (productId) => {
  if (!productId) return false;
  try {
    const wishlist = JSON.parse(localStorage.getItem('visioncraft_wishlist') || '[]');
    return wishlist.includes(productId);
  } catch {
    return false;
  }
};

// Utility: toggle wishlist
export const toggleWishlist = (productId) => {
  if (!productId) return false;
  try {
    const wishlist = JSON.parse(localStorage.getItem('visioncraft_wishlist') || '[]');
    const index = wishlist.indexOf(productId);
    let added;
    if (index === -1) {
      wishlist.push(productId);
      added = true;
    } else {
      wishlist.splice(index, 1);
      added = false;
    }
    localStorage.setItem('visioncraft_wishlist', JSON.stringify(wishlist));
    return added;
  } catch {
    return false;
  }
};


