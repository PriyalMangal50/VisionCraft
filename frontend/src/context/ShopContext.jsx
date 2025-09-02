import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

// Make sure we have the correct backend URL
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
console.log("Shop context using backend URL:", backendUrl);

export const ShopContext = createContext();

const ShopContextProvider = (props)=>{
    const currency = "₹"
    const delivery_fee = 20; 
    const [search , setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);

    const navigate = useNavigate();


    const addToCart = async (itemId, size, prescription = null) => {
        if (!size) {
          toast.error("Size not selected!");
          return;
        }
        
        let cartData = structuredClone(cartItems);

        // Create a unique key for the item+size+prescription combination
        const prescriptionKey = prescription ? JSON.stringify(prescription) : 'none';
        const itemKey = `${size}|${prescriptionKey}`;

        if (cartData[itemId]) {
          if (cartData[itemId][itemKey]) {
            cartData[itemId][itemKey].quantity += 1;
          } else {
            cartData[itemId][itemKey] = {
              quantity: 1,
              size: size,
              prescription: prescription
            };
          }
        } else {
          cartData[itemId] = {};
          cartData[itemId][itemKey] = {
            quantity: 1,
            size: size,
            prescription: prescription
          };
        }
        
        setCartItems(cartData);

        if (token) {
          try {
            await axios.post(
              backendUrl + "/api/cart/add",
              { itemId, size, prescription },
              { headers: { token } }
            );
          } catch (error) {
            console.log(error);
            toast.error(error.message);
          }
        }
    };

  const getCartCount = () => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      for (const itemKey in cartItems[itemId]) {
        try {
          const item = cartItems[itemId][itemKey];
          if (item.quantity > 0) {
            totalCount += item.quantity;
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, itemKey, quantity) => {
    let cartData = structuredClone(cartItems);
    
    if (!cartData[itemId] || !cartData[itemId][itemKey]) {
      console.error("Item not found in cart");
      return;
    }
    
    cartData[itemId][itemKey].quantity = quantity;
    setCartItems(cartData);
    
    // Extract size and prescription from the itemKey for API
    const [size, prescriptionKey] = itemKey.split('|');
    const prescription = prescriptionKey !== 'none' ? JSON.parse(prescriptionKey) : null;
    
    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity, prescription },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      let itemInfo = products.find((product) => product._id === itemId);
      if (!itemInfo) continue;

      for (const itemKey in cartItems[itemId]) {
        try {
          const item = cartItems[itemId][itemKey];
          if (item.quantity > 0) {
            totalAmount += itemInfo.price * item.quantity;
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      console.log("Fetching products from API...");
      const response = await axios.get(backendUrl + '/api/product/list');

      if (response.data.success) {
        console.log(`Successfully loaded ${response.data.products.length} products`);
        setProducts(response.data.products);
        return response.data.products;
      }
      else{
        console.error("API returned error:", response.data.message);
        toast.error(response.data.message);
        return [];
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error(error.message || "Failed to load products");
      return [];
    }
  };

  const getUserCart = async (token) => {
    try {
      const response = await axios.post(backendUrl + "/api/cart/get",{}, {headers: { token }});

      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Fetch current user's profile
  const fetchProfile = async (activeToken) => {
    const t = activeToken || token;
    if (!t) return null;
    try {
      const res = await axios.get(backendUrl + "/api/user/profile", { headers: { token: t } });
      if (res.data.success) {
        setUser(res.data.user);
        return res.data.user;
      }
      return null;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  // Update profile basic fields
  const updateProfile = async (payload) => {
    if (!token) return { success: false, message: "Not authenticated" };
    try {
      const res = await axios.put(backendUrl + "/api/user/profile", payload, { headers: { token } });
      if (res.data.success) {
        setUser(res.data.user);
        toast.success("Profile updated");
      } else {
        toast.error(res.data.message || "Failed to update profile");
      }
      return res.data;
    } catch (err) {
      console.log(err);
      toast.error(err.message || "Failed to update profile");
      return { success: false, message: err.message };
    }
  };

  // Save or update an address
  const saveAddress = async (address) => {
    if (!token) return { success: false, message: "Not authenticated" };
    try {
      const res = await axios.post(backendUrl + "/api/user/address", { address }, { headers: { token } });
      if (res.data.success) {
        setUser(res.data.user);
        toast.success("Address saved");
      } else {
        toast.error(res.data.message || "Failed to save address");
      }
      return res.data;
    } catch (err) {
      console.log(err);
      toast.error(err.message || "Failed to save address");
      return { success: false, message: err.message };
    }
  };

  const removeAddress = async (id) => {
    if (!token) return { success: false, message: "Not authenticated" };
    try {
      const res = await axios.delete(backendUrl + "/api/user/address/" + id, { headers: { token } });
      if (res.data.success) {
        setUser(res.data.user);
        toast.success("Address removed");
      } else {
        toast.error(res.data.message || "Failed to remove address");
      }
      return res.data;
    } catch (err) {
      console.log(err);
      toast.error(err.message || "Failed to remove address");
      return { success: false, message: err.message };
    }
  };

  useEffect(()=>{
    // Make sure products are loaded immediately
    console.log("Initial products load triggered");
    getProductsData()
      .then(products => {
        console.log(`Products loaded successfully: ${products.length} items`);
        // No need to call setProducts again as it's done in getProductsData
      })
      .catch(err => {
        console.error("Failed to load products:", err);
        // Set an empty array to prevent null reference errors
        setProducts([]);
      });
  },[])

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
  const t = localStorage.getItem("token");
  getUserCart(t);
  fetchProfile(t);
  
    }
  }, []);

    const value = {
        products, currency, delivery_fee, search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, getCartCount, updateQuantity, getCartAmount, navigate,
  backendUrl, setToken, token, setCartItems, getProductsData,
  user, fetchProfile, updateProfile, saveAddress, removeAddress
    }

    return(
        <ShopContext.Provider value={value}>
        {props.children}
        </ShopContext.Provider>
    )
}


export default ShopContextProvider