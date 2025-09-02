import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { sanitizeImageUrl } from "../utils/image";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);
  const navigate = useNavigate();
   
  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const itemId in cartItems) {
        for (const itemKey in cartItems[itemId]) {
          const cartItem = cartItems[itemId][itemKey];
          
          if (cartItem.quantity > 0) {
            // Parse the item key to extract size and prescription
            const [size, prescriptionKey] = itemKey.split('|');
            const prescription = prescriptionKey !== 'none' ? JSON.parse(prescriptionKey) : null;
            
            tempData.push({
              _id: itemId,
              itemKey,
              size,
              prescription,
              quantity: cartItem.quantity,
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);
  
  // Format prescription details for display
  const formatPrescription = (prescription) => {
    if (!prescription) return null;
    
    // For eyeglasses/sunglasses prescription
    if (prescription.rightEye || prescription.leftEye) {
      return (
        <div className="mt-2 text-xs text-gray border-t border-light-gray pt-2">
          <p className="font-medium text-pink">Prescription Details:</p>
          {prescription.rightEye && (
            <p>Right Eye: SPH {prescription.rightEye.sphere || 'N/A'}, 
               CYL {prescription.rightEye.cylinder || 'N/A'}, 
               Axis {prescription.rightEye.axis || 'N/A'}</p>
          )}
          {prescription.leftEye && (
            <p>Left Eye: SPH {prescription.leftEye.sphere || 'N/A'}, 
               CYL {prescription.leftEye.cylinder || 'N/A'}, 
               Axis {prescription.leftEye.axis || 'N/A'}</p>
          )}
          {prescription.pd && <p>PD: {prescription.pd}</p>}
        </div>
      );
    }
    
    // For contact lens prescription
    if (prescription.power || prescription.baseCurve || prescription.diameter) {
      return (
        <div className="mt-2 text-xs text-gray border-t border-light-gray pt-2">
          <p className="font-medium text-pink">Prescription Details:</p>
          {prescription.power && <p>Power: {prescription.power}</p>}
          {prescription.baseCurve && <p>Base Curve: {prescription.baseCurve}</p>}
          {prescription.diameter && <p>Diameter: {prescription.diameter}</p>}
        </div>
      );
    }
    
    return null;
  };

  return (
    <main className='border-t pt-14'>
      <div className='text-2xl mb-3'>
        <Title text={"YOUR"} text2={"CART"} />
      </div>

      <div>
        {cartData.map((item, i) => {
          const productData = products.find(
            (product) => product._id === item._id
          );
          
          if (!productData) return null;

          return (
            <div key={i} className='py-5 border-b border-light-gray text-gray grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4 hover:bg-light-gray transition-colors font-arial'>
              <div className='flex items-start gap-4 sm:gap-6'>
                <div className="relative">
                  <img
                    className='w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-md border border-light-gray'
                    src={sanitizeImageUrl(productData.image?.[0])}
                    alt={productData.name}
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/no_image.png'; }}
                  />
                  {productData.sku && (
                    <span className="absolute bottom-0 right-0 bg-primary bg-opacity-80 text-white text-[8px] px-1">
                      {productData.sku.split('-')[0]}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className='text-sm sm:text-base font-arial-extrabold text-primary-dark line-clamp-2'>
                      {productData.name}
                    </p>
                    <p className="font-arial-extrabold text-right hidden sm:block text-primary">
                      {currency}{productData.price}
                    </p>
                  </div>

                  <div className='flex items-center gap-2 flex-wrap mt-2'>
                    {productData.brand && (
                      <span className="text-xs text-gray">{productData.brand}</span>
                    )}
                    <p className='px-2 py-1 text-xs border border-orange bg-orange/10 rounded text-primary-dark'>
                      {item.size}
                    </p>
                    <p className="sm:hidden text-primary font-arial-extrabold">
                      {currency}{productData.price}
                    </p>
                  </div>
                  
                  {/* Render prescription details if available */}
                  {item.prescription && formatPrescription(item.prescription)}
                  
                  {/* Option to update prescription */}
                  {item.prescription && (
                    <div className="mt-2">
                      <button 
                        onClick={() => navigate(`/product/${item._id}`)}
                        className="text-xs text-pink hover:text-primary transition-colors flex items-center"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Update Prescription
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="relative">
                <input
                  onChange={(e) =>
                    e.target.value === "" || e.target.value === "0"
                      ? null
                      : updateQuantity(
                          item._id,
                          item.itemKey,
                          Number(e.target.value)
                        )
                  }
                  className='border rounded w-16 sm:w-20 px-2 py-1 text-center'
                  type='number'
                  min={1}
                  defaultValue={item.quantity}
                />
                <div className="text-xs text-gray-500 mt-1 hidden sm:block">Qty</div>
              </div>

              <button
                onClick={() => updateQuantity(item._id, item.itemKey, 0)}
                className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-100"
              >
                <img
                  className='w-4 sm:w-5'
                  src={assets.bin_icon}
                  alt='Remove item'
                />
              </button>
            </div>
          );
        })}
      </div>

      {cartData.length === 0 && (
        <div className="text-center py-10 bg-light-gray rounded-lg p-8 font-arial">
          <p className="text-xl text-pink font-arial-extrabold mb-2">Your cart is empty</p>
          <p className="text-gray mb-4">Add some products to your cart to checkout</p>
          <button
            onClick={() => navigate("/collection")}
            className="mt-4 bg-primary hover:bg-primary-dark transition-colors text-white px-6 py-2 rounded"
          >
            Shop Now
          </button>
        </div>
      )}

      {cartData.length > 0 && (
        <div className='flex justify-end my-20'>
          <div className='w-full sm:w-[450px]'>
            <CartTotal />

            <div className='w-full text-end'>
              <button
                onClick={() => navigate("/place-order")}
                className='text-sm bg-primary hover:bg-primary-dark transition-colors text-white my-8 px-8 py-3 rounded shadow-md font-arial'
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Cart;
