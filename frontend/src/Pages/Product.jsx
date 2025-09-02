import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { useState } from "react";
import { assets } from "../assets/assets";
import RelatedProduct from "../components/RelatedProduct";
import axios from "axios";

// Fallback image in case assets.no_image fails
const FALLBACK_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAP1BMVEUAAADq6urn5+fl5eXj4+Pi4uLh4eHi4uLj4+Pl5eXo6Ojr6+vu7u7x8fHz8/P19fX29vb4+Pj5+fn7+/v///9P/Ui8AAAAFHRSTlMAAgQGCg4SFhogJCgsMDQ4PEBQ+qpGR2UAAAIKSURBVHja7dbbboMwDIZRJxyTAGlD9/5PuqlrpQ5pQA3olv+7nQtL/hQrhvh+Op1Op9PpdDqdTqfT6XT63xD8YXwGfxCvk2+pvk++ofYUfVtplvEQffxpenl6GrcvT2D95cXp6THHfXy3VOq7uKMHDxx48MCBB/734NUSSz92C9l7ZLK0Mm1jL7VKcasaJPeOFVL2jglKccwFSnXcA0oj7h62wlVwBUolrgKXQK2JyoFaHlUDtSbqBWqBWkst0Aus9bkWeOP6XA2Ey3IYExC6lCcqB0JJuQXeQSj/U6CTbsEMhFJWywIhq2YBUssCQRYIj0Bo0T6QlXu0D3BW7tE+8FTu0T5QlHu0D0xqAQq0D0RZIMgCQRYIr0CQBcInEIqWgSgLBMvAIAsEw8CkFqBAw0BUC1CgYSCqBVLQL8CsF4hBv0DSC6SgX4BZLxD1AjToF5j0AjToF5j0AlEvMOkF9H8fZL1AkAWCLBBkgfAOBFkgfAJBFgiXQJAFwiUQZIHwDARZIDwDoSgLRFkg3APh0Wkgy33aB9Ylqx/QITBt4fkEj8C8BbUP6BBIF+UebQJ5UQtQoEmgqAUo0CSwrmoB/QKTWoACTQKjWiAF9QJJLZCCeoGkFohBvcCsXkC/wKReQL9AVgvE9wP6/wbSLxD1C6SgXyDpF4j6BYJ+gaBfQL9A1P8P6nQ6nU6n0/09fgEWTIm3euIfJwAAAABJRU5ErkJggg==";
import { toggleWishlist, isInWishlist } from "./Wishlist";
import PrescriptionForm from "../components/PrescriptionForm";
import ProductRecommendations from "../components/ProductRecommendations";
import SizeChartButton from "../components/SizeChartButton";
import { toast } from 'react-toastify';

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const shopContext = useContext(ShopContext);
  const { currency, addToCart, getProductsData, backendUrl } = shopContext;
  const products = shopContext.products || [];
  const [productData, setProductData] = useState(null);
  const [size, setSize] = useState("");
  const [image, setImage] = useState("");
  const [inWishlist, setInWishlist] = useState(false);
  
  // Use the no_image from assets.js as our guaranteed fallback
  const [showPrescription, setShowPrescription] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const fetchProductData = async () => {
    if (!productId) {
      console.error("No productId provided in URL");
      setLoading(false);
      // Set a fallback product data so we don't show a blank page
      setProductData({
        name: "Product Not Found",
        description: "No product ID was provided in the URL.",
        price: "",
        image: [assets.no_image || FALLBACK_IMAGE]
      });
      return;
    }
    
    setLoading(true);
    console.log(`Fetching product data for ID: ${productId} (from useParams)`);
    
    // Make sure we have our guaranteed fallback image available
    console.log("Making sure fallback image is available:", assets.no_image ? "Yes" : "No");
    
    // Check if products context is available
    console.log("Products in context:", products ? `${products.length} items` : "None");
    
    try {
      console.log("Making direct API call for product ID:", productId);
      
      // Make a direct API call first, since we know it works from our test
      const response = await axios.post(
        `${backendUrl}/api/product/single`,
        { productId },
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      if (response.data.success && response.data.product) {
        console.log("Product retrieved directly from API:", response.data.product.name);
        const product = response.data.product;
        setProductData(product);
        
        if (product.image && Array.isArray(product.image) && product.image.length > 0) {
          setImage(product.image[0]);
          console.log("Setting default image from API response:", product.image[0]);
        } else {
          console.log("No images found for product in API response");
          const fallbackImage = assets.no_image || FALLBACK_IMAGE;
          product.image = [fallbackImage];
          setImage(fallbackImage);
        }
        
        // Set inWishlist status
        setInWishlist(isInWishlist(productId));
        setLoading(false);
        return;
      }
      
      // Fallback to context if direct API call fails
      const foundProduct = products && products.length > 0 ? 
        products.find(product => product._id === productId) : null;
      
      if (foundProduct) {
        console.log("Product found in local cache:", foundProduct.name);
        setProductData(foundProduct);
        
        // Set default image if images exist
        if (foundProduct.image && Array.isArray(foundProduct.image) && foundProduct.image.length > 0) {
          setImage(foundProduct.image[0]);
          console.log("Setting default image:", foundProduct.image[0]);
        } else {
          console.log("No images found for product in cache");
          // Add an inline fallback image that always works
          foundProduct.image = ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAP1BMVEUAAADq6urn5+fl5eXj4+Pi4uLh4eHi4uLj4+Pl5eXo6Ojr6+vu7u7x8fHz8/P19fX29vb4+Pj5+fn7+/v///9P/Ui8AAAAFHRSTlMAAgQGCg4SFhogJCgsMDQ4PEBQ+qpGR2UAAAIKSURBVHja7dbbboMwDIZRJxyTAGlD9/5PuqlrpQ5pQA3olv+7nQtL/hQrhvh+Op1Op9PpdDqdTqfT6XT63xD8YXwGfxCvk2+pvk++ofYUfVtplvEQffxpenl6GrcvT2D95cXp6THHfXy3VOq7uKMHDxx48MCBB/734NUSSz92C9l7ZLK0Mm1jL7VKcasaJPeOFVL2jglKccwFSnXcA0oj7h62wlVwBUolrgKXQK2JyoFaHlUDtSbqBWqBWkst0Aus9bkWeOP6XA2Ey3IYExC6lCcqB0JJuQXeQSj/U6CTbsEMhFJWywIhq2YBUssCQRYIj0Bo0T6QlXu0D3BW7tE+8FTu0T5QlHu0D0xqAQq0D0RZIMgCQRYIr0CQBcInEIqWgSgLBMvAIAsEw8CkFqBAw0BUC1CgYSCqBVLQL8CsF4hBv0DSC6SgX4BZLxD1AjToF5j0AjToF5j0AlEvMOkF9H8fZL1AkAWCLBBkgfAOBFkgfAJBFgiXQJAFwiUQZIHwDARZIDwDoSgLRFkg3APh0Wkgy33aB9Ylqx/QITBt4fkEj8C8BbUP6BBIF+UebQJ5UQtQoEmgqAUo0CSwrmoB/QKTWoACTQKjWiAF9QJJLZCCeoGkFohBvcCsXkC/wKReQL9AVgvE9wP6/wbSLxD1C6SgXyDpF4j6BYJ+gaBfQL9A1P8P6nQ6nU6n0/09fgEWTIm3euIfJwAAAABJRU5ErkJggg=="];
          setImage(foundProduct.image[0]);
        }
      } else {
        // If not found in products array, fetch directly from the backend
        console.log("Product not found in cache, fetching from API for ID:", productId);
        // Make sure we have a valid backend URL
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
        console.log(`Making API call to ${backendUrl}/api/product/single with ID: ${productId}`);
        
        // Try with axios first for better error handling
        try {
          const axiosResponse = await axios.post(
            `${backendUrl}/api/product/single`,
            { productId: productId },
            {
              headers: {
                'Content-Type': 'application/json',
              }
            }
          );
          
          if (axiosResponse.data) {
            const data = axiosResponse.data;
            console.log("API Response via axios:", data);
            
            if (data.success && data.product) {
              console.log("Product retrieved from API:", data.product.name);
              // Make a defensive copy of the product
              const product = JSON.parse(JSON.stringify(data.product));
              setProductData(product);
              
              // Set default image if images exist
              if (product.image && Array.isArray(product.image) && product.image.length > 0) {
                setImage(product.image[0]);
                console.log("Setting default image from API response:", product.image[0]);
              } else {
                console.log("No images found for product in API response");
                // Add an inline fallback image that always works
                const fallbackImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAP1BMVEUAAADq6urn5+fl5eXj4+Pi4uLh4eHi4uLj4+Pl5eXo6Ojr6+vu7u7x8fHz8/P19fX29vb4+Pj5+fn7+/v///9P/Ui8AAAAFHRSTlMAAgQGCg4SFhogJCgsMDQ4PEBQ+qpGR2UAAAIKSURBVHja7dbbboMwDIZRJxyTAGlD9/5PuqlrpQ5pQA3olv+7nQtL/hQrhvh+Op1Op9PpdDqdTqfT6XT63xD8YXwGfxCvk2+pvk++ofYUfVtplvEQffxpenl6GrcvT2D95cXp6THHfXy3VOq7uKMHDxx48MCBB/734NUSSz92C9l7ZLK0Mm1jL7VKcasaJPeOFVL2jglKccwFSnXcA0oj7h62wlVwBUolrgKXQK2JyoFaHlUDtSbqBWqBWkst0Aus9bkWeOP6XA2Ey3IYExC6lCcqB0JJuQXeQSj/U6CTbsEMhFJWywIhq2YBUssCQRYIj0Bo0T6QlXu0D3BW7tE+8FTu0T5QlHu0D0xqAQq0D0RZIMgCQRYIr0CQBcInEIqWgSgLBMvAIAsEw8CkFqBAw0BUC1CgYSCqBVLQL8CsF4hBv0DSC6SgX4BZLxD1AjToF5j0AjToF5j0AlEvMOkF9H8fZL1AkAWCLBBkgfAOBFkgfAJBFgiXQJAFwiUQZIHwDARZIDwDoSgLRFkg3APh0Wkgy33aB9Ylqx/QITBt4fkEj8C8BbUP6BBIF+UebQJ5UQtQoEmgqAUo0CSwrmoB/QKTWoACTQKjWiAF9QJJLZCCeoGkFohBvcCsXkC/wKReQL9AVgvE9wP6/wbSLxD1C6SgXyDpF4j6BYJ+gaBfQL9A1P8P6nQ6nU6n0/09fgEWTIm3euIfJwAAAABJRU5ErkJggg==";
                product.image = [fallbackImage];
                setImage(fallbackImage);
              }
              // Check wishlist status
              if (productId) {
                setInWishlist(isInWishlist(productId));
              }
              
              // Don't set loading false here, let the finally block handle it
              return; // Exit early as we have data
            }
          }
        } catch (axiosError) {
          console.error("Axios error fetching product:", axiosError);
        }
        
        // Fallback to fetch if axios fails
        const response = await fetch(`${backendUrl}/api/product/single`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId }),
        });
        try {
          const data = await response.json();
          console.log("API Response (fetch):", data);
          
          if (data && data.success && data.product) {
            console.log("Product retrieved from API (fetch):", data.product.name);
            // Make a defensive copy of the product
            const product = JSON.parse(JSON.stringify(data.product));
            setProductData(product);
            
            // Set default image if images exist
            if (product.image && Array.isArray(product.image) && product.image.length > 0) {
              setImage(product.image[0]);
              console.log("Setting default image from API response:", product.image[0]);
            } else {
              console.log("No images found for product in API response");
              // Add an inline fallback image that always works
              const fallbackImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAP1BMVEUAAADq6urn5+fl5eXj4+Pi4uLh4eHi4uLj4+Pl5eXo6Ojr6+vu7u7x8fHz8/P19fX29vb4+Pj5+fn7+/v///9P/Ui8AAAAFHRSTlMAAgQGCg4SFhogJCgsMDQ4PEBQ+qpGR2UAAAIKSURBVHja7dbbboMwDIZRJxyTAGlD9/5PuqlrpQ5pQA3olv+7nQtL/hQrhvh+Op1Op9PpdDqdTqfT6XT63xD8YXwGfxCvk2+pvk++ofYUfVtplvEQffxpenl6GrcvT2D95cXp6THHfXy3VOq7uKMHDxx48MCBB/734NUSSz92C9l7ZLK0Mm1jL7VKcasaJPeOFVL2jglKccwFSnXcA0oj7h62wlVwBUolrgKXQK2JyoFaHlUDtSbqBWqBWkst0Aus9bkWeOP6XA2Ey3IYExC6lCcqB0JJuQXeQSj/U6CTbsEMhFJWywIhq2YBUssCQRYIj0Bo0T6QlXu0D3BW7tE+8FTu0T5QlHu0D0xqAQq0D0RZIMgCQRYIr0CQBcInEIqWgSgLBMvAIAsEw8CkFqBAw0BUC1CgYSCqBVLQL8CsF4hBv0DSC6SgX4BZLxD1AjToF5j0AjToF5j0AlEvMOkF9H8fZL1AkAWCLBBkgfAOBFkgfAJBFgiXQJAFwiUQZIHwDARZIDwDoSgLRFkg3APh0Wkgy33aB9Ylqx/QITBt4fkEj8C8BbUP6BBIF+UebQJ5UQtQoEmgqAUo0CSwrmoB/QKTWoACTQKjWiAF9QJJLZCCeoGkFohBvcCsXkC/wKReQL9AVgvE9wP6/wbSLxD1C6SgXyDpF4j6BYJ+gaBfQL9A1P8P6nQ6nU6n0/09fgEWTIm3euIfJwAAAABJRU5ErkJggg==";
              product.image = [fallbackImage];
              setImage(fallbackImage);
            }
          } else {
            console.error("Invalid response from API:", data);
            toast.error("Product not found!");
            
            // Set fallback product data to prevent blank page
            setProductData({
              name: "Product Not Found",
              description: "The product you're looking for might be unavailable or no longer exists.",
              price: "",
              image: [assets.no_image || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAP1BMVEUAAADq6urn5+fl5eXj4+Pi4uLh4eHi4uLj4+Pl5eXo6Ojr6+vu7u7x8fHz8/P19fX29vb4+Pj5+fn7+/v///9P/Ui8AAAAFHRSTlMAAgQGCg4SFhogJCgsMDQ4PEBQ+qpGR2UAAAIKSURBVHja7dbbboMwDIZRJxyTAGlD9/5PuqlrpQ5pQA3olv+7nQtL/hQrhvh+Op1Op9PpdDqdTqfT6XT63xD8YXwGfxCvk2+pvk++ofYUfVtplvEQffxpenl6GrcvT2D95cXp6THHfXy3VOq7uKMHDxx48MCBB/734NUSSz92C9l7ZLK0Mm1jL7VKcasaJPeOFVL2jglKccwFSnXcA0oj7h62wlVwBUolrgKXQK2JyoFaHlUDtSbqBWqBWkst0Aus9bkWeOP6XA2Ey3IYExC6lCcqB0JJuQXeQSj/U6CTbsEMhFJWywIhq2YBUssCQRYIj0Bo0T6QlXu0D3BW7tE+8FTu0T5QlHu0D0xqAQq0D0RZIMgCQRYIr0CQBcInEIqWgSgLBMvAIAsEw8CkFqBAw0BUC1CgYSCqBVLQL8CsF4hBv0DSC6SgX4BZLxD1AjToF5j0AjToF5j0AlEvMOkF9H8fZL1AkAWCLBBkgfAOBFkgfAJBFgiXQJAFwiUQZIHwDARZIDwDoSgLRFkg3APh0Wkgy33aB9Ylqx/QITBt4fkEj8C8BbUP6BBIF+UebQJ5UQtQoEmgqAUo0CSwrmoB/QKTWoACTQKjWiAF9QJJLZCCeoGkFohBvcCsXkC/wKReQL9AVgvE9wP6/wbSLxD1C6SgXyDpF4j6BYJ+gaBfQL9A1P8P6nQ6nU6n0/09fgEWTIm3euIfJwAAAABJRU5ErkJggg=="]
            });
          }
        } catch (jsonError) {
          console.error("Error parsing API response:", jsonError);
          toast.error("Error loading product. Please try again.");
          
          // Set fallback product data to prevent blank page
          setProductData({
            name: "Error Loading Product",
            description: "There was a problem loading this product. Please try again later.",
            price: "",
            image: [assets.no_image || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAP1BMVEUAAADq6urn5+fl5eXj4+Pi4uLh4eHi4uLj4+Pl5eXo6Ojr6+vu7u7x8fHz8/P19fX29vb4+Pj5+fn7+/v///9P/Ui8AAAAFHRSTlMAAgQGCg4SFhogJCgsMDQ4PEBQ+qpGR2UAAAIKSURBVHja7dbbboMwDIZRJxyTAGlD9/5PuqlrpQ5pQA3olv+7nQtL/hQrhvh+Op1Op9PpdDqdTqfT6XT63xD8YXwGfxCvk2+pvk++ofYUfVtplvEQffxpenl6GrcvT2D95cXp6THHfXy3VOq7uKMHDxx48MCBB/734NUSSz92C9l7ZLK0Mm1jL7VKcasaJPeOFVL2jglKccwFSnXcA0oj7h62wlVwBUolrgKXQK2JyoFaHlUDtSbqBWqBWkst0Aus9bkWeOP6XA2Ey3IYExC6lCcqB0JJuQXeQSj/U6CTbsEMhFJWywIhq2YBUssCQRYIj0Bo0T6QlXu0D3BW7tE+8FTu0T5QlHu0D0xqAQq0D0RZIMgCQRYIr0CQBcInEIqWgSgLBMvAIAsEw8CkFqBAw0BUC1CgYSCqBVLQL8CsF4hBv0DSC6SgX4BZLxD1AjToF5j0AjToF5j0AlEvMOkF9H8fZL1AkAWCLBBkgfAOBFkgfAJBFgiXQJAFwiUQZIHwDARZIDwDoSgLRFkg3APh0Wkgy33aB9Ylqx/QITBt4fkEj8C8BbUP6BBIF+UebQJ5UQtQoEmgqAUo0CSwrmoB/QKTWoACTQKjWiAF9QJJLZCCeoGkFohBvcCsXkC/wKReQL9AVgvE9wP6/wbSLxD1C6SgXyDpF4j6BYJ+gaBfQL9A1P8P6nQ6nU6n0/09fgEWTIm3euIfJwAAAABJRU5ErkJggg=="]
          });
        }
      }
      
      // Check wishlist status
      if (productId) {
        setInWishlist(isInWishlist(productId));
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      console.error("Product ID that caused error:", productId);
      
      // Ensure we still set product data to prevent blank page
      if (!productData) {
        setProductData({
          name: "Product Unavailable",
          description: "We're having trouble loading this product. Please try again later.",
          price: "",
          image: [assets.no_image || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAP1BMVEUAAADq6urn5+fl5eXj4+Pi4uLh4eHi4uLj4+Pl5eXo6Ojr6+vu7u7x8fHz8/P19fX29vb4+Pj5+fn7+/v///9P/Ui8AAAAFHRSTlMAAgQGCg4SFhogJCgsMDQ4PEBQ+qpGR2UAAAIKSURBVHja7dbbboMwDIZRJxyTAGlD9/5PuqlrpQ5pQA3olv+7nQtL/hQrhvh+Op1Op9PpdDqdTqfT6XT63xD8YXwGfxCvk2+pvk++ofYUfVtplvEQffxpenl6GrcvT2D95cXp6THHfXy3VOq7uKMHDxx48MCBB/734NUSSz92C9l7ZLK0Mm1jL7VKcasaJPeOFVL2jglKccwFSnXcA0oj7h62wlVwBUolrgKXQK2JyoFaHlUDtSbqBWqBWkst0Aus9bkWeOP6XA2Ey3IYExC6lCcqB0JJuQXeQSj/U6CTbsEMhFJWywIhq2YBUssCQRYIj0Bo0T6QlXu0D3BW7tE+8FTu0T5QlHu0D0xqAQq0D0RZIMgCQRYIr0CQBcInEIqWgSgLBMvAIAsEw8CkFqBAw0BUC1CgYSCqBVLQL8CsF4hBv0DSC6SgX4BZLxD1AjToF5j0AjToF5j0AlEvMOkF9H8fZL1AkAWCLBBkgfAOBFkgfAJBFgiXQJAFwiUQZIHwDARZIDwDoSgLRFkg3APh0Wkgy33aB9Ylqx/QITBt4fkEj8C8BbUP6BBIF+UebQJ5UQtQoEmgqAUo0CSwrmoB/QKTWoACTQKjWiAF9QJJLZCCeoGkFohBvcCsXkC/wKReQL9AVgvE9wP6/wbSLxD1C6SgXyDpF4j6BYJ+gaBfQL9A1P8P6nQ6nU6n0/09fgEWTIm3euIfJwAAAABJRU5ErkJggg=="]
        });
      }
      
      toast.error("Failed to load product details. Please try again.");
    } finally {
      console.log("Fetch product completed, setting loading to false");
      
      // Set loading to false and verify product data
      setLoading(false);
      
      // Check one last time if we have product data
      setTimeout(() => {
        if (!productData) {
          console.log("Still no product data in finally block, setting emergency fallback");
          setProductData({
            name: "Product Could Not Be Loaded",
            description: "Please check your connection and try again.",
            price: "0.00",
            image: [assets.no_image || FALLBACK_IMAGE]
          });
        }
      }, 100);
    }
  };

  // Main useEffect for loading product data
  useEffect(() => {
    console.log("Product component effect running with productId:", productId);
    
    // Only proceed if we have a valid productId
    if (productId) {
      console.log("Valid ProductID detected, resetting state and fetching data");
      
      // Reset state completely to avoid stale data
      setLoading(true);
      setProductData(null);
      setImage("");
      
      try {
        // Fetch data directly - no timeout needed
        fetchProductData();
      } catch (error) {
        console.error("Error in useEffect when calling fetchProductData:", error);
        // Set loading to false if there's an error
        setLoading(false);
        
        // Always ensure we have some product data to display
        setProductData({
          name: "Error Loading Product",
          description: "There was an error loading this product. Please try again later.",
          price: "0.00",
          image: [assets.no_image || FALLBACK_IMAGE]
        });
      }
      
      // Safety timeout to ensure loading state is never stuck
      const safetyTimeout = setTimeout(() => {
        console.log("Safety timeout reached after 8 seconds");
        
        // Force loading to false
        setLoading(false);
        
        // Set fallback product data if needed
        setProductData(currentData => {
          if (currentData) {
            console.log("Product data already exists:", currentData.name);
            return currentData;
          }
          
          console.log("No product data after timeout, setting fallback");
          toast.warning("Product information could not be loaded. Please try again later.");
          
          return {
            name: "Product Unavailable",
            description: "We're having trouble loading this product. Please try refreshing the page.",
            price: "0.00",
            image: [assets.no_image || FALLBACK_IMAGE]
          };
        });
      }, 8000); // 8 second safety
      
      return () => clearTimeout(safetyTimeout);
    } else {
      console.error("No productId in URL params");
      setLoading(false);
    }
  }, [productId]);

  // Auto-show prescription form if prescription is required
  useEffect(() => {
    if (productData && isPrescriptionRequired()) {
      setShowPrescription(true);
    }
  }, [productData]);

  // Handle wishlist toggle
  const handleWishlist = () => {
    if (!productId) return;
    const added = toggleWishlist(productId);
    setInWishlist(added);
  };

  // Handle prescription form data change
  const handlePrescriptionChange = (data) => {
    setPrescriptionData(data);
  };

  // Determine prescription type for the product
  const getPrescriptionType = () => {
    if (!productData) return "none";
    
    if (productData?.prescriptionType) {
      return productData.prescriptionType;
    }
    
    if (productData?.category === "Contact Lenses") {
      return "contacts";
    } else if (productData?.category === "Eyeglasses") {
      return "eyeglasses";
    } else if (productData?.category === "Sunglasses" && productData?.prescription) {
      return "prescription_sunglasses";
    }
    
    return "none";
  };

  // Check if prescription is required or optional
  const isPrescriptionRequired = () => {
    if (!productData) return false;
    
    if (productData?.prescriptionRequired === "required") {
      return true;
    }
    
    return false;
  };
  
  // Show loading state
  if (loading) {
    console.log("Rendering loading state");
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-primary-700 border-primary-300 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }
  
  // Show error state if product not found
  if (!productData) {
    console.log("Rendering product not found state");
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md p-8 rounded-lg bg-white shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for might have been removed or is temporarily unavailable.</p>
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

  // Check if prescription is available for this product
  const isPrescriptionAvailable = () => {
    if (!productData) return false;
    
    // Check explicit prescription flag
    if (productData?.prescription) {
      return true;
    }
    
    // Check prescription requirement setting
    if (productData?.prescriptionRequired === "required" || productData?.prescriptionRequired === "optional") {
      return true;
    }
    
    // Check prescription type
    if (productData?.prescriptionType && productData?.prescriptionType !== "none") {
      return true;
    }
    
    return false;
  };

  // Now we can safely assume that productData exists for the rest of the component
  console.log("Rendering product details for:", productData?.name);
  // Ensure no external placeholder hosts get rendered
  const sanitize = (u) => {
    try { return /^https?:\/\/via\.placeholder\.com\b/i.test(u) ? '/images/no_image.png' : u; } catch { return '/images/no_image.png'; }
  };

  return (
    <main className='border-t-2 transition-opacity ease-in duration-500 opacity-100'>
      {/* --------product data---------- */}
      <div className='flex gap-12 sm:gap-12 flex-col mt-10 sm:flex-row'>
        {/* Enhanced product images display */}
        <div className='flex-1 flex flex-col-reverse gap-4 sm:flex-row'>
          {/* Thumbnail navigation */}
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-auto max-h-[500px] hide-scrollbar justify-between sm:justify-start sm:w-[18%] w-full'>
            {/* Display thumbnails if available, otherwise show placeholder */}
            {productData?.image && Array.isArray(productData.image) && productData.image.length > 0 ? 
              productData.image.map((item, i) => (
                <div 
                  key={i}
                  onClick={() => setImage(item)}
                  className={`relative mb-3 flex-shrink-0 rounded overflow-hidden cursor-pointer border-2 ${image === item ? 'border-pink' : 'border-transparent'}`}
                >
                  <img
                    src={sanitize(item)}
                    alt={`${productData.name} view ${i+1}`}
                    className='w-[22%] sm:w-full h-auto object-cover aspect-square'
                    onError={(e) => {
                      console.log("Thumbnail failed to load, using fallback");
                      e.target.onerror = null; 
                      e.target.src = assets.no_image || "data:image/png;base64,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";
                    }}
                  />
                  {i === 0 && (
                    <span className="absolute top-1 left-1 bg-pink text-white text-[9px] px-1.5 py-0.5 rounded-sm">Main</span>
                  )}
                </div>
              )) : 
              // Show one placeholder if no images available
              <div className="mb-3 flex-shrink-0 rounded overflow-hidden cursor-not-allowed">
                <img
                  src={assets.no_image}
                  alt="No image available"
                  className='w-[22%] sm:w-full h-auto object-cover aspect-square'
                />
              </div>
            }
          </div>

          {/* Main product image with zoom effect */}
          <div className='w-full sm:w-[80%] rounded-lg overflow-hidden bg-light-gray bg-opacity-30 p-2'>
            <div className="relative group">
                <img 
                className='w-full h-auto object-contain aspect-square bg-white' 
                src={sanitize(image) || (productData?.image && Array.isArray(productData.image) && productData.image.length > 0 ? sanitize(productData.image[0]) : assets.no_image || FALLBACK_IMAGE)} 
                alt={productData?.name || 'Product image'} 
                onError={(e) => {
                  console.log("Image failed to load, using fallback");
                  e.target.onerror = null; 
                  e.target.src = assets.no_image;
                }}
              />
              {/* Overlay information */}
              {productData?.bestseller && (
                <span className="absolute top-4 left-4 bg-orange text-white text-xs px-2 py-1 rounded">
                  BESTSELLER
                </span>
              )}
              {productData?.sku && (
                <span className="absolute bottom-4 right-4 bg-black bg-opacity-40 text-white text-xs px-2 py-1 rounded">
                  SKU: {productData.sku}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* -----product informations------- */}
        <div className='flex-1'>
          <div className="flex justify-between items-start">
            <h1 className='font-medium text-2xl mt-2'>{productData?.name}</h1>
            <button
              onClick={handleWishlist}
              className="flex items-center justify-center bg-white p-2 rounded-full hover:bg-light-gray"
            >
              {inWishlist ? (
                <svg className="w-6 h-6 text-pink" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              )}
            </button>
          </div>

          {/* Brand info */}
          {productData.brand && (
            <p className="mt-1 text-gray font-arial">{productData.brand}</p>
          )}

          {/* Rating */}
          <div className='flex items-center gap-1 mt-2 text-gray'>
            <img src={assets.star_icon} alt='' className='w-3.5' />
            <img src={assets.star_icon} alt='' className='w-3.5' />
            <img src={assets.star_icon} alt='' className='w-3.5' />
            <img src={assets.star_icon} alt='' className='w-3.5' />
            <img src={assets.star_dull_icon} alt='' className='w-3.5' />
            <p className='pl-2'>(132)</p>
          </div>

          {/* Price */}
          <p className='mt-5 text-3xl font-arial-extrabold text-orange'>
            {currency}{productData?.price || '0.00'}
          </p>
          
          {/* Description */}
          <p className='mt-5 text-gray w-4/5'>{productData?.description || 'No description available'}</p>

          {/* Product specifications */}
          <div className="mt-5 mb-5">
            <h3 className="font-arial-extrabold mb-2 text-primary-dark">Product Specifications</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {productData.category && (
                <>
                  <div className="text-gray">Category:</div>
                  <div className="text-primary-dark">{productData.category}</div>
                </>
              )}
              
              {productData.subCategory && (
                <>
                  <div className="text-gray">For:</div>
                  <div>{productData.subCategory}</div>
                </>
              )}
              
              {productData.frameShape && (
                <>
                  <div className="text-gray">Frame Shape:</div>
                  <div>{productData.frameShape}</div>
                </>
              )}
              
              {productData.frameMaterial && (
                <>
                  <div className="text-gray">Frame Material:</div>
                  <div>{productData.frameMaterial}</div>
                </>
              )}
              
              {productData.frameColor && (
                <>
                  <div className="text-gray">Frame Color:</div>
                  <div>{productData.frameColor}</div>
                </>
              )}
              
              {productData.lensType && (
                <>
                  <div className="text-gray">Lens Type:</div>
                  <div>{productData.lensType}</div>
                </>
              )}
            </div>
          </div>

          {/* Size selection */}
          {productData.sizes && Array.isArray(productData.sizes) && productData.sizes.length > 0 && (
            <div className='flex flex-col gap-4 my-8'>
              <div className="flex items-center justify-between">
                <p className="font-medium">Select Size</p>
                <SizeChartButton 
                  category={productData.category || "Eyeglasses"} 
                  label={productData.category === "Contact Lenses" ? "Contact Lens Size Guide" : "Frame Size Guide"}
                />
              </div>
              <div className='flex gap-2 flex-wrap'>
                {productData.sizes.map((item, i) => (
                  <button
                    onClick={() => setSize(item)}
                    key={i}
                    className={`border py-2 px-4 bg-light-gray hover:bg-gray/10 transition-colors ${
                      item === size ? "border-2 border-orange bg-orange/10" : ""
                    }`}
                  >
                    {item}
                    {productData.category === "Contact Lenses" && item.includes("/") && (
                      <span className="block text-xs text-gray mt-1">BC/DIA (mm)</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Prescription option - if available/required */}
          {isPrescriptionAvailable() && (
            <div className="mb-5">
              {/* Required prescription alert */}
              {isPrescriptionRequired() && (
                <div className="mb-3 p-3 bg-pink/10 border-l-4 border-pink text-pink">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                    </svg>
                    <span className="font-medium">
                      Prescription is required for this product. Please enter your prescription details below.
                    </span>
                  </div>
                </div>
              )}
              
              <button 
                onClick={() => setShowPrescription(!showPrescription)}
                className={`flex items-center gap-2 ${isPrescriptionRequired() ? 'text-pink hover:text-pink font-medium' : 'text-primary hover:text-primary-dark'}`}
              >
                <span>
                  {isPrescriptionRequired()
                    ? "Enter Required Prescription Details" 
                    : "Add Prescription Details (Optional)"}
                </span>
                <svg className={`w-4 h-4 transition-transform ${showPrescription ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {showPrescription && (
                <PrescriptionForm 
                  productType={getPrescriptionType()} 
                  onChange={handlePrescriptionChange} 
                />
              )}
            </div>
          )}
          
          {/* Display note for prescription sunglasses */}
          {productData.category === "Sunglasses" && productData.prescriptionType === "prescription_sunglasses" && (
            <div className="mb-5 p-3 bg-blue-50 border border-blue-100 rounded-md text-sm">
              <p className="text-blue-700">
                <span className="font-medium">Prescription Sunglasses:</span> You can enter your prescription details or add to cart and upload your prescription later.
              </p>
            </div>
          )}

          {/* Add to cart button */}
          <button
            onClick={() => {
              // Check if prescription is required but not provided
              if (isPrescriptionRequired()) {
                // Check if prescription form is shown
                if (!showPrescription) {
                  toast.error("Please enter your prescription details before adding to cart");
                  setShowPrescription(true);
                  return;
                }
                
                // Check if prescription data is complete
                if (!prescriptionData) {
                  toast.error("Please enter your prescription details before adding to cart");
                  return;
                }
                
                // Validate minimum prescription data based on product type
                if (getPrescriptionType() === "eyeglasses" || getPrescriptionType() === "prescription_sunglasses") {
                  if (!prescriptionData.rightEye.sphere || !prescriptionData.leftEye.sphere) {
                    toast.error("At minimum, Sphere (SPH) values for both eyes are required");
                    return;
                  }
                } else if (getPrescriptionType() === "contacts" && !prescriptionData.power) {
                  toast.error("Contact lens power is required");
                  return;
                }
              }
              
              // Check if size is required but not selected
              if (productData.sizes && productData.sizes.length > 0 && !size) {
                toast.error("Please select a size first");
                return;
              }
              
              // Add to cart with prescription data if available and entered
              const finalPrescriptionData = isPrescriptionAvailable() && showPrescription ? prescriptionData : null;
              addToCart(productData._id, size || "Default", finalPrescriptionData);
              toast.success("Added to cart successfully!");
              navigate("/cart");
            }}
            className={`bg-primary hover:bg-primary-dark text-white px-8 py-3 text-sm transition-colors font-arial ${
              (productData.sizes && productData.sizes.length > 0 && !size) ||
              (isPrescriptionRequired() && (!prescriptionData || !showPrescription))
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {productData.sizes && productData.sizes.length > 0 && !size
              ? "SELECT A SIZE FIRST"
              : isPrescriptionRequired() && (!prescriptionData || !showPrescription)
                ? "ENTER PRESCRIPTION FIRST" 
                : "ADD TO CART"
            }
          </button>
          
          <hr className='mt-8 sm:w-4/5' />
          
          {/* Additional info */}
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
            {isPrescriptionRequired() && (
              <p className="font-medium text-orange-600">
                Valid prescription is required for this product.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ------description & review section-------- */}
      <div className='mt-16'>
        <div className='flex'>
          <p className='border px-5 py-3 text-sm font-medium bg-gray-50'>Description</p>
          <p className='border px-5 py-3 text-sm'>Reviews (132)</p>
        </div>
        <div className='flex flex-col gap-4 border p-6 text-sm text-gray-500'>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-black mb-2">Product Details</h3>
              <p>{productData?.description || 'No description available'}</p>
              {productData.category === "Eyeglasses" && (
                <p className="mt-2">These eyeglasses feature premium quality lenses and comfortable frames designed for everyday use. The stylish design combines fashion with functionality for a perfect addition to your eyewear collection.</p>
              )}
              {productData.category === "Sunglasses" && (
                <p className="mt-2">These sunglasses provide excellent UV protection while keeping you stylish. The premium lenses reduce glare and enhance visibility, making them perfect for driving and outdoor activities.</p>
              )}
              {productData.category === "Contact Lenses" && (
                <p className="mt-2">These contact lenses are made from high-quality materials for maximum comfort throughout the day. They're designed to maintain eye moisture and provide clear vision for extended wearing periods.</p>
              )}
            </div>
            
            <div>
              <h3 className="font-medium text-black mb-2">Specifications</h3>
              <table className="w-full text-sm">
                <tbody>
                  {productData.brand && (
                    <tr className="border-b">
                      <td className="py-2 font-medium">Brand</td>
                      <td className="py-2">{productData.brand}</td>
                    </tr>
                  )}
                  {productData.frameShape && (
                    <tr className="border-b">
                      <td className="py-2 font-medium">Frame Shape</td>
                      <td className="py-2">{productData.frameShape}</td>
                    </tr>
                  )}
                  {productData.frameMaterial && (
                    <tr className="border-b">
                      <td className="py-2 font-medium">Frame Material</td>
                      <td className="py-2">{productData.frameMaterial}</td>
                    </tr>
                  )}
                  {productData.frameColor && (
                    <tr className="border-b">
                      <td className="py-2 font-medium">Frame Color</td>
                      <td className="py-2">{productData.frameColor}</td>
                    </tr>
                  )}
                  {productData.lensType && (
                    <tr className="border-b">
                      <td className="py-2 font-medium">Lens Type</td>
                      <td className="py-2">{productData.lensType}</td>
                    </tr>
                  )}
                  {productData.sku && (
                    <tr className="border-b">
                      <td className="py-2 font-medium">SKU</td>
                      <td className="py-2">{productData.sku}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Personalized product recommendations */}
      <ProductRecommendations currentProduct={productData} />

      {/* ------display related products */}
      {productData.category && <RelatedProduct category={productData.category} subCategory={productData.subCategory || ""} />}
    </main>
  );
};

export default Product;
