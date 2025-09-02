import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const { getCartAmount, currency, delivery_fee } = useContext(ShopContext);
  return (
    <div className='w-full font-arial'>
      <div className='text-2xl'>
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>

      <div className='flex flex-col gap-2 mt-2 text-sm text-gray bg-pink bg-opacity-5 p-4 rounded-lg border border-pink border-opacity-20'>
        <div className='flex justify-between'>
          <p>Subtotal</p>
          <p>
            {getCartAmount()}.00{currency}
          </p>
        </div>
        <hr className="border-light-gray" />
        <div className='flex justify-between'>
          <p>Shipping Fee:</p>
          <p>
            {delivery_fee}.00
            {currency}
          </p>
        </div>
        <hr className="border-light-gray" />
        <div className='flex justify-between'>
          <p>Total</p>
          <b className="text-orange font-arial-extrabold">
            {getCartAmount() === 0
              ? 0
              : getCartAmount() + delivery_fee }.00{currency}
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
