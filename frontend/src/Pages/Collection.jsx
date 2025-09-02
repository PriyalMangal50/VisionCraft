import React, { useContext, useEffect, useMemo, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";


import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { useLocation } from "react-router-dom";
import { LENS_TYPE_TO_FEATURE, FRAME_SHAPES } from "../utils/quizConstants";

const Collection = () => {
  const location = useLocation();
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilters, setShowFilters] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [frameShapes, setFrameShapes] = useState([]);
  const [frameMaterials, setFrameMaterials] = useState([]);
  const [lensTypes, setLensTypes] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const [fromQuiz, setFromQuiz] = useState(false);

  // Case/format-insensitive lensType -> feature mapping
  const lensFeatureMap = useMemo(() => {
    const norm = (s) => (s || "").toLowerCase().replace(/[-_\s]+/g, " ").trim();
    const map = {};
    Object.entries(LENS_TYPE_TO_FEATURE).forEach(([k, v]) => {
      map[norm(k)] = v;
    });
    // Add common aliases
    map["blue-light"] = map["blue light"] || "blueLight";
    map["photochromic"] = map["photochromic"] || "transition";
    map["polarized"] = map["polarized"] || "polarized";
    return map;
  }, []);

  // Build dynamic filter options from products
  const uniqueCategories = useMemo(() => {
    return Array.from(new Set((products || []).map(p => (p.category || '').trim()))).filter(Boolean).sort();
  }, [products]);
  const uniqueSubCategories = useMemo(() => {
    return Array.from(new Set((products || []).map(p => (p.subCategory || '').trim()))).filter(Boolean).sort();
  }, [products]);
  const uniqueBrands = useMemo(() => {
    return Array.from(new Set((products || []).map(p => (p.brand || '').trim()))).filter(Boolean).sort();
  }, [products]);
  const uniqueFrameShapes = useMemo(() => {
    const shapes = (products || []).map(p => (p.frameShape || '').trim());
    return Array.from(new Set(shapes)).filter(Boolean).sort();
  }, [products]);
  const uniqueMaterials = useMemo(() => {
    const materials = (products || []).map(p => (p.frameMaterial || '').trim());
    return Array.from(new Set(materials)).filter(Boolean).sort();
  }, [products]);
  const uniqueLensTypes = useMemo(() => {
    const types = (products || []).map(p => (p.lensType || '').trim());
    return Array.from(new Set(types)).filter(Boolean).sort();
  }, [products]);
  
  // Handle quiz results if redirected from frame finder quiz
  useEffect(() => {
    if (location.state?.quizFilters) {
      const { 
        frameShapes: quizFrameShapes, 
        lensTypes: quizLensTypes, 
        quizId,
        recommendedProducts 
      } = location.state.quizFilters;
      
      if (quizFrameShapes && quizFrameShapes.length > 0) {
        setFrameShapes(quizFrameShapes);
      }
      
      if (quizLensTypes && quizLensTypes.length > 0) {
        setLensTypes(quizLensTypes);
      }
      
      setFromQuiz(true);
      // Automatically show filters when coming from quiz
      setShowFilters(true);
      
      // Store quiz ID for product interactions
      if (quizId) {
        localStorage.setItem('activeQuizId', quizId);
      }
    }

    // Initialize filters from navigation state (manual links)
    if (location.state?.filters) {
      const f = location.state.filters;
      if (f.categories) setCategories(f.categories);
      if (f.subCategories) setSubCategories(f.subCategories);
      if (f.brands) setBrands(f.brands);
      if (f.frameShapes) setFrameShapes(f.frameShapes);
      if (f.frameMaterials) setFrameMaterials(f.frameMaterials);
      if (f.lensTypes) setLensTypes(f.lensTypes);
      setShowFilters(true);
    }

    // Initialize from query params e.g. ?category=eyeglasses&for=men&brand=ray-ban
    if (location.search) {
      const params = new URLSearchParams(location.search);
      const cat = params.get('category');
      const sub = params.get('for');
      const brand = params.get('brand');
      const shape = params.get('shape');
      const material = params.get('material');
      const lens = params.get('lens');

      const catMap = {
        'eyeglasses': 'Eyeglasses',
        'sunglasses': 'Sunglasses',
        'contact-lenses': 'Contact Lenses',
        'contacts': 'Contact Lenses'
      };
      const norm = (s) => (s || '').trim();
      if (cat && !categories.length) setCategories([catMap[cat.toLowerCase()] || norm(cat)]);
      if (sub && !subCategories.length) setSubCategories([sub[0].toUpperCase()+sub.slice(1)]);
      if (brand && !brands.length) setBrands([brand]);
      if (shape && !frameShapes.length) setFrameShapes([shape[0].toUpperCase()+shape.slice(1)]);
      if (material && !frameMaterials.length) setFrameMaterials([material[0].toUpperCase()+material.slice(1)]);
      if (lens && !lensTypes.length) setLensTypes([lens]);
      if (cat || sub || brand || shape || material || lens) setShowFilters(true);
    }
  }, [location.state]);

  // Handle checkbox toggles for each filter type
  const toggleCategory = (e) => {
    const value = e.target.value;
    if (categories.includes(value)) {
      setCategories(prev => prev.filter(item => item !== value));
    } else {
      setCategories(prev => [...prev, value]);
    } 
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    if (subCategories.includes(value)) {
      setSubCategories(prev => prev.filter(item => item !== value));
    } else {
      setSubCategories(prev => [...prev, value]);
    }
  };

  const toggleBrand = (e) => {
    const value = e.target.value;
    if (brands.includes(value)) {
      setBrands(prev => prev.filter(item => item !== value));
    } else {
      setBrands(prev => [...prev, value]);
    }
  };

  const toggleFrameShape = (e) => {
    const value = e.target.value;
    if (frameShapes.includes(value)) {
      setFrameShapes(prev => prev.filter(item => item !== value));
    } else {
      setFrameShapes(prev => [...prev, value]);
    }
  };

  const toggleFrameMaterial = (e) => {
    const value = e.target.value;
    if (frameMaterials.includes(value)) {
      setFrameMaterials(prev => prev.filter(item => item !== value));
    } else {
      setFrameMaterials(prev => [...prev, value]);
    }
  };

  const toggleLensType = (e) => {
    const value = e.target.value;
    if (lensTypes.includes(value)) {
      setLensTypes(prev => prev.filter(item => item !== value));
    } else {
      setLensTypes(prev => [...prev, value]);
    }
  };

  // Apply filters to products
  const applyFilter = () => {
    if (!products || products.length === 0) {
      setFilterProducts([]);
      return;
    }

    let productsCopy = [...products];

    // Text search filter
    if (showSearch && search) {
      const q = search.toLowerCase().trim();
      productsCopy = productsCopy.filter((item) =>
        (item.name || '').toLowerCase().includes(q)
      );
    }

    // Category filter
    if (categories.length > 0) {
      const set = new Set(categories.map(c => c.toLowerCase().trim()));
      productsCopy = productsCopy.filter((item) =>
        set.has((item.category || '').toLowerCase().trim())
      );
    }

    // SubCategory filter
    if (subCategories.length > 0) {
      const set = new Set(subCategories.map(c => c.toLowerCase().trim()));
      productsCopy = productsCopy.filter((item) =>
        set.has((item.subCategory || '').toLowerCase().trim())
      );
    }

    // Brand filter
    if (brands.length > 0) {
      const set = new Set(brands.map(c => c.toLowerCase().trim()));
      productsCopy = productsCopy.filter((item) =>
        set.has((item.brand || '').toLowerCase().trim())
      );
    }

    // Frame shape filter - handle both exact matches and recommended frames
    if (frameShapes.length > 0) {
      const set = new Set(frameShapes.map(c => c.toLowerCase().trim()));
      productsCopy = productsCopy.filter((item) => {
        // First try exact match on frameShape (case-sensitive)
        if (item.frameShape && set.has((item.frameShape || '').toLowerCase().trim())) {
          return true;
        }
        
        // If coming from a quiz, also check if this product is suitable for the user's face shape
        // Face shapes are always lowercase in the database
        if (fromQuiz && item.suitableFaceShapes && item.suitableFaceShapes.length > 0) {
          // If the face shape from the quiz is in the product's suitable face shapes
          const faceShape = location.state?.quizFilters?.faceShape;
          // Make sure we're comparing lowercase to lowercase
          if (faceShape && item.suitableFaceShapes.includes(faceShape.toLowerCase())) {
            return true;
          }
        }
        
        return false;
      });
    }

    // Frame material filter
    if (frameMaterials.length > 0) {
      const set = new Set(frameMaterials.map(c => c.toLowerCase().trim()));
      productsCopy = productsCopy.filter((item) =>
        set.has((item.frameMaterial || '').toLowerCase().trim())
      );
    }

    // Lens type filter - improved to handle feature-based filters from quiz
    if (lensTypes.length > 0) {
      const set = new Set(lensTypes.map(c => c.toLowerCase().trim()));
      productsCopy = productsCopy.filter((item) => {
        // First check regular lens type
        if (item.lensType && set.has((item.lensType || '').toLowerCase().trim())) {
          return true;
        }
        
        // If coming from quiz, also check for feature matches using standardized mappings
        if (fromQuiz && item.features) {
          // Check each lens type against its corresponding feature using our mapping
          for (const lt of lensTypes) {
            const norm = (s) => (s || "").toLowerCase().replace(/[-_\s]+/g, " ").trim();
            const featureKey = lensFeatureMap[norm(lt)];
            if (featureKey && item.features[featureKey]) {
              return true;
            }
          }
        }
        
        return false;
      });
    }

    setFilterProducts(productsCopy);
  };

  // Sort products based on sortType
  const sortProducts = () => {
    if (!filterProducts || filterProducts.length === 0) return;
    
    const sortedProducts = [...filterProducts];
    
    switch (sortType) {
      case "low-high":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        sortedProducts.sort((a, b) => b.date - a.date);
        break;
      default:
        // Keep default order
        break;
    }
    
    setFilterProducts(sortedProducts);
  };

  // Apply filters when any filter state changes
  useEffect(() => {
    applyFilter();
  }, [
    categories,
    subCategories,
    brands,
    frameShapes,
    frameMaterials,
    lensTypes,
    search,
    showSearch,
    products
  ]);

  // Sort products when sortType changes
  useEffect(() => {
    sortProducts();
  }, [sortType]);

  // Set initial products when component mounts or products change
  useEffect(() => {
    if (products && products.length > 0) {
      setFilterProducts([...products]);
    }
  }, [products]);

  return (
    <div className="font-arial">
      {fromQuiz && (
        <div className="bg-white border-l-4 border-orange shadow-md rounded-md p-4 my-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-orange" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-arial-extrabold text-primary-dark mb-1">Quiz Results</h4>
              <p className="text-sm text-gray">
                {filterProducts && filterProducts.length > 0 
                  ? "Based on your quiz answers, we've selected frames that may look great on you! You can adjust filters further or browse all products."
                  : "We couldn't find exact matches for your quiz preferences. Please browse our collection below or try different filter options."}
              </p>
            </div>
          </div>
        </div>
      )}
      <main className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t border-light-gray'>
      {/* ------------filter options----------- */}
      <div className='min-w-60'>
        <p onClick={() => setShowFilters(!showFilters)} className='my-2 text-xl flex items-center cursor-pointer gap-2 text-orange font-arial-extrabold bg-light-gray px-3 py-1 rounded-md hover:shadow-md transition-shadow'>
          FILTERS{" "}
          <img
            className={`h-3 sm:hidden ${showFilters ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt='dropdown icon'
          />
        </p>

        {/* -------category filter ------- */}
        <div className={`border border-light-gray pl-5 py-3 mt-6 sm:block ${showFilters ? "" : "hidden"}`}>
          <p className='mb-3 text-sm font-arial-extrabold text-primary'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm text-gray'>
            <p className='flex gap-2'>
              <input
                className='w-3'
                type='checkbox'
                value="Eyeglasses"
                checked={categories.includes("Eyeglasses")}
                onChange={toggleCategory}
              />{" "}
              Eyeglasses
            </p>
            <p className='flex gap-2'>
              <input
                className='w-3'
                type='checkbox'
                value="Sunglasses"
                checked={categories.includes("Sunglasses")}
                onChange={toggleCategory}
              />{" "}
              Sunglasses
            </p>
            <p className='flex gap-2'>
              <input
                className='w-3'
                type='checkbox'
                value="Contact Lenses"
                checked={categories.includes("Contact Lenses")}
                onChange={toggleCategory}
              />{" "}
              Contact Lenses
            </p>
          </div>
        </div>

        {/* -------subCategory filter----------- */}
        <div className={`border border-light-gray pl-5 py-3 mt-6 sm:block ${showFilters ? "" : "hidden"}`}>
          <p className='mb-3 text-sm font-arial-extrabold text-orange'>FOR</p>
          <div className='flex flex-col gap-2 text-sm text-gray'>
            <p className='flex gap-2'>
              <input
                className='w-3'
                type='checkbox'
                value="Men"
                checked={subCategories.includes("Men")}
                onChange={toggleSubCategory}
              />{" "}
              Men
            </p>
            <p className='flex gap-2'>
              <input
                className='w-3'
                type='checkbox'
                value="Women"
                checked={subCategories.includes("Women")}
                onChange={toggleSubCategory}
              />{" "}
              Women
            </p>
            <p className='flex gap-2'>
              <input
                className='w-3'
                type='checkbox'
                value="Kids"
                checked={subCategories.includes("Kids")}
                onChange={toggleSubCategory}
              />{" "}
              Kids
            </p>
            <p className='flex gap-2'>
              <input
                className='w-3'
                type='checkbox'
                value="Unisex"
                checked={subCategories.includes("Unisex")}
                onChange={toggleSubCategory}
              />{" "}
              Unisex
            </p>
          </div>
        </div>

        {/* -------Brand filter (dynamic)----------- */}
        <div className={`border border-light-gray pl-5 py-3 mt-6 sm:block ${showFilters ? "" : "hidden"}`}>
          <p className='mb-3 text-sm font-arial-extrabold text-pink'>BRAND</p>
          <div className='flex flex-col gap-2 text-sm text-gray'>
            {uniqueBrands.map((brand) => (
              <label key={brand} className='flex gap-2 items-center'>
                <input
                  className='w-3 accent-pink'
                  type='checkbox'
                  value={brand}
                  checked={brands.includes(brand)}
                  onChange={toggleBrand}
                />
                <span className={brands.includes(brand) ? 'text-primary-dark font-medium' : ''}>{brand}</span>
              </label>
            ))}
            {uniqueBrands.length === 0 && <p className='text-gray-500 text-sm'>No brand data</p>}
          </div>
        </div>

        {/* -------Frame Shape filter (dynamic)----------- */}
        <div className={`border border-light-gray pl-5 py-3 mt-6 sm:block ${showFilters ? "" : "hidden"}`}>
          <p className='mb-3 text-sm font-arial-extrabold text-primary-dark'>FRAME SHAPE</p>
          <div className='flex flex-col gap-2 text-sm text-gray'>
            {(uniqueFrameShapes.length ? uniqueFrameShapes : FRAME_SHAPES.map(s=>s.value)).map((shapeVal) => (
              <label key={shapeVal} className='flex gap-2 items-center'>
                <input
                  className='w-3 accent-orange'
                  type='checkbox'
                  value={shapeVal}
                  checked={frameShapes.includes(shapeVal)}
                  onChange={toggleFrameShape}
                />
                <span>{shapeVal}</span>
              </label>
            ))}
          </div>
        </div>

        {/* -------Frame Material filter (dynamic)----------- */}
        <div className={`border border-light-gray pl-5 py-3 mt-6 sm:block ${showFilters ? "" : "hidden"}`}>
          <p className='mb-3 text-sm font-arial-extrabold text-primary'>FRAME MATERIAL</p>
          <div className='flex flex-col gap-2 text-sm text-gray'>
            {uniqueMaterials.map((mat) => (
              <label key={mat} className='flex gap-2 items-center'>
                <input
                  className='w-3 accent-primary'
                  type='checkbox'
                  value={mat}
                  checked={frameMaterials.includes(mat)}
                  onChange={toggleFrameMaterial}
                />
                <span>{mat}</span>
              </label>
            ))}
            {uniqueMaterials.length === 0 && <p className='text-gray-500 text-sm'>No material data</p>}
          </div>
        </div>

        {/* -------Lens Type filter (dynamic)----------- */}
        <div className={`border border-light-gray pl-5 py-3 mt-6 sm:block ${showFilters ? "" : "hidden"}`}>
          <p className='mb-3 text-sm font-arial-extrabold text-secondary-dark'>LENS TYPE</p>
          <div className='flex flex-col gap-2 text-sm text-gray'>
            {uniqueLensTypes.map((lt) => (
              <label key={lt} className='flex gap-2 items-center'>
                <input
                  className='w-3 accent-secondary'
                  type='checkbox'
                  value={lt}
                  checked={lensTypes.includes(lt)}
                  onChange={toggleLensType}
                />
                <span>{lt}</span>
              </label>
            ))}
            {uniqueLensTypes.length === 0 && <p className='text-gray-500 text-sm'>No lens type data</p>}
          </div>
        </div>
      </div>

      {/* ------------filter products----------- */}
      {/* Right Side */}
      <div className='flex-1'>
        <div className='flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4'>
          <Title text1={"ALL"} text2={"COLLECTIONS"} />

          {/* -----product sort------- */}
          <select 
            onChange={(e) => setSortType(e.target.value)}
            className='input text-sm py-2'
            value={sortType}
          >
            <option value='relevant'>Sort by: Relevant</option>
            <option value='low-high'>Sort by: Low-High</option>
            <option value='high-low'>Sort by: High-Low</option>
            <option value='newest'>Sort by: Newest</option>
          </select>
        </div>

        {/* Active filter chips */}
        {(categories.length || subCategories.length || brands.length || frameShapes.length || frameMaterials.length || lensTypes.length) > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {[...categories.map(v=>({type:'Category', v})), ...subCategories.map(v=>({type:'For', v})), ...brands.map(v=>({type:'Brand', v})), ...frameShapes.map(v=>({type:'Shape', v})), ...frameMaterials.map(v=>({type:'Material', v})), ...lensTypes.map(v=>({type:'Lens', v}))].map((chip, idx) => (
              <span key={chip.type+chip.v+idx} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm border border-primary-200">
                <span className="font-medium">{chip.type}:</span> {chip.v}
                <button
                  className="ml-1 hover:text-primary-900"
                  onClick={() => {
                    const remove = (arrSetter, arr, value) => arrSetter(arr.filter(x => x !== value));
                    if (chip.type==='Category') remove(setCategories, categories, chip.v);
                    if (chip.type==='For') remove(setSubCategories, subCategories, chip.v);
                    if (chip.type==='Brand') remove(setBrands, brands, chip.v);
                    if (chip.type==='Shape') remove(setFrameShapes, frameShapes, chip.v);
                    if (chip.type==='Material') remove(setFrameMaterials, frameMaterials, chip.v);
                    if (chip.type==='Lens') remove(setLensTypes, lensTypes, chip.v);
                  }}
                  aria-label={`Remove ${chip.v}`}
                >
                  ✕
                </button>
              </span>
            ))}
            <button 
              onClick={() => { setCategories([]); setSubCategories([]); setBrands([]); setFrameShapes([]); setFrameMaterials([]); setLensTypes([]); }}
              className="button button-sm button-outline"
            >
              Clear All
            </button>
          </div>
        )}

        {/* ---------Map products=---------- */}
        {filterProducts && filterProducts.length > 0 ? (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            {filterProducts.map((item, index) => (
              <ProductItem key={index} {...item} />
            ))}
          </div>
        ) : (
          <div className="py-10 text-center bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <p className="text-error-dark font-arial-extrabold mb-2">No products found matching your criteria.</p>
            {(categories.length > 0 || subCategories.length > 0 || brands.length > 0 || 
              frameShapes.length > 0 || frameMaterials.length > 0 || lensTypes.length > 0) && (
              <button 
                onClick={() => {
                  setCategories([]);
                  setSubCategories([]);
                  setBrands([]);
                  setFrameShapes([]);
                  setFrameMaterials([]);
                  setLensTypes([]);
                }}
                className="mt-3 btn btn-primary btn-small"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>
    </main>
    </div>
  );
};

export default Collection;
