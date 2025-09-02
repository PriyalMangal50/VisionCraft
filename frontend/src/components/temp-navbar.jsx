import React, { useContext, useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const dropdownRef = useRef(null);
    const location = useLocation();
    
    const {
        setShowSearch,
        setToken,
        setCartItems,
        getCartCount,
        token,
        navigate,
    } = useContext(ShopContext);

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    // Handle scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    
    // Handle click outside of dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    // Prevent body scrolling when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    const toggleDropdown = (dropdown) => {
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };

    const logout = () => {
        navigate("/login");
        localStorage.removeItem("token");
        setToken("");
        setCartItems({});
    };
    
    return (
        <header 
            className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
                scrolled 
                    ? "bg-white shadow-md py-2" 
                    : "bg-gradient-to-r from-primary-50 to-white py-3"
            }`}
        >
            <nav className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] max-w-screen-2xl mx-auto flex items-center justify-between font-medium">
                {/* Logo */}
                <Link to="/" className="flex items-center">
                    <img 
                        className="w-32 md:w-36 transition-transform hover:scale-105 duration-300" 
                        src={assets.logo} 
                        alt="VisionCraft Logo"
                    />
                </Link>
                
                {/* Desktop Navigation */}
                <ul className="hidden lg:flex text-sm gap-6 text-gray-700">
                    <li>
                        <NavLink to="/" className={({isActive}) => 
                            `nav-link flex flex-col items-center relative px-3 py-2 hover:text-primary-700 transition-colors ${
                                isActive ? "text-primary-700 font-medium" : ""
                            }`
                        }>
                            <span className="tracking-wide">HOME</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/collection" className={({isActive}) => 
                            `nav-link flex flex-col items-center relative px-3 py-2 hover:text-primary-700 transition-colors ${
                                isActive ? "text-primary-700 font-medium" : ""
                            }`
                        }>
                            <span className="tracking-wide">COLLECTIONS</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/about" className={({isActive}) => 
                            `nav-link flex flex-col items-center relative px-3 py-2 hover:text-primary-700 transition-colors ${
                                isActive ? "text-primary-700 font-medium" : ""
                            }`
                        }>
                            <span className="tracking-wide">ABOUT</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/contact" className={({isActive}) => 
                            `nav-link flex flex-col items-center relative px-3 py-2 hover:text-primary-700 transition-colors ${
                                isActive ? "text-primary-700 font-medium" : ""
                            }`
                        }>
                            <span className="tracking-wide">CONTACT</span>
                        </NavLink>
                    </li>

                    <li className="relative" ref={dropdownRef}>
                        <button 
                            onClick={() => toggleDropdown("more")}
                            className={`nav-link flex flex-col items-center px-3 py-2 hover:text-primary-700 transition-colors ${
                                activeDropdown === "more" ? "text-primary-700 font-medium" : ""
                            }`}
                            aria-expanded={activeDropdown === "more"}
                            aria-haspopup="true"
                        >
                            <div className="flex items-center gap-1">
                                <span className="tracking-wide">MORE</span>
                                <svg 
                                    className={`w-4 h-4 transition-transform duration-200 ${
                                        activeDropdown === "more" ? "rotate-180" : ""
                                    }`} 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </button>
                        
                        {/* Dropdown Menu */}
                        {activeDropdown === "more" && (
                            <div className="absolute dropdown-menu right-0 pt-3 z-50 animate-fade-in">
                                <div className="flex flex-col gap-2 w-56 py-4 px-3 bg-white text-gray-700 rounded-xl shadow-dropdown border border-gray-100">
                                    <Link to="/blogs" className="px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
                                        <svg className="w-5 h-5 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                        </svg>
                                        <span className="font-medium">Our Blog</span>
                                    </Link>
                                    <Link to="/faq" className="px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
                                        <svg className="w-5 h-5 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="font-medium">FAQ</span>
                                    </Link>
                                    <Link to="/size-guide" className="px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
                                        <svg className="w-5 h-5 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                        </svg>
                                        <span className="font-medium">Size Guide</span>
                                    </Link>
                                    <Link to="/wishlist" className="px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
                                        <svg className="w-5 h-5 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                        <span className="font-medium">Wishlist</span>
                                    </Link>
                                    <Link to="/frame-finder" className="px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
                                        <svg className="w-5 h-5 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="font-medium">Frame Finder</span>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </li>
                </ul>
                
                {/* Right side: Search, Account, Cart, Mobile Menu */}
                <div className="flex items-center gap-1 md:gap-2">
                    {/* Search button */}
                    <button 
                        onClick={() => setShowSearch(true)} 
                        className="w-10 h-10 rounded-full hover:bg-primary-50 flex items-center justify-center transition-colors"
                        aria-label="Search"
                    >
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </button>
                    
                    {/* Account */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => toggleDropdown("account")}
                            className="w-10 h-10 rounded-full hover:bg-primary-50 flex items-center justify-center transition-colors"
                            aria-label="Account"
                        >
                            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </button>
                        
                        {/* Account Dropdown */}
                        {activeDropdown === "account" && (
                            <div className="absolute dropdown-menu right-0 pt-3 z-50 animate-fade-in">
                                <div className="w-48 py-4 px-3 bg-white text-gray-700 rounded-xl shadow-dropdown border border-gray-100">
                                    {token ? (
                                        <>
                                            <Link to="/profile" className="cursor-pointer hover:text-primary-700 transition-colors flex items-center gap-2 py-1.5">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                </svg>
                                                <span>My Profile</span>
                                            </Link>
                                            <Link to="/orders" className="cursor-pointer hover:text-primary-700 transition-colors flex items-center gap-2 py-1.5">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                                                </svg>
                                                <span>My Orders</span>
                                            </Link>
                                            <Link to="/wishlist" className="cursor-pointer hover:text-primary-700 transition-colors flex items-center gap-2 py-1.5">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                                </svg>
                                                <span>Wishlist</span>
                                            </Link>
                                            <button
                                                onClick={logout}
                                                className="cursor-pointer hover:text-red-600 transition-colors flex items-center gap-2 py-1.5 mt-1 border-t border-gray-100 pt-3 w-full text-left"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                                </svg>
                                                <span>Logout</span>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/login" className="cursor-pointer hover:text-primary-700 transition-colors flex items-center gap-2 py-1.5">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                                                </svg>
                                                <span>Login</span>
                                            </Link>
                                            <Link to="/register" className="cursor-pointer hover:text-primary-700 transition-colors flex items-center gap-2 py-1.5">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                                                </svg>
                                                <span>Register</span>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Cart */}
                    <Link to="/cart" className="relative">
                        <button className="w-10 h-10 rounded-full hover:bg-primary-50 flex items-center justify-center transition-colors" aria-label="Cart">
                            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                            </svg>
                            {getCartCount() > 0 && (
                                <span className="absolute right-1 top-1 w-5 h-5 flex items-center justify-center bg-primary-700 text-white rounded-full text-xs font-bold">
                                    {getCartCount()}
                                </span>
                            )}
                        </button>
                    </Link>
                    
                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="lg:hidden w-10 h-10 rounded-full hover:bg-primary-50 flex items-center justify-center transition-colors"
                        aria-label="Menu"
                    >
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>

                {/* Mobile menu slide-in panel */}
                <div
                    className={`fixed top-0 right-0 z-50 h-full w-full max-w-xs overflow-y-auto bg-white shadow-xl transition-transform duration-300 ease-in-out ${
                        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                    <div className="flex flex-col h-full">
                        {/* Mobile menu header */}
                        <div className="flex items-center justify-between p-5 border-b border-gray-200">
                            <div className="flex items-center">
                                <img className="w-28" src={assets.logo} alt="VisionCraft Logo" />
                            </div>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                                aria-label="Close menu"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        
                        {/* Mobile menu content */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-1">
                            <p className="text-xs uppercase text-gray-500 font-semibold px-2 mb-1">Navigation</p>
                            
                            <NavLink
                                onClick={() => setMobileMenuOpen(false)}
                                to="/"
                                className={({isActive}) => `py-3 px-4 rounded-lg text-gray-700 font-medium flex items-center ${
                                    isActive ? "bg-primary-50 text-primary-700" : "hover:bg-gray-50"
                                }`}
                            >
                                <svg className="w-5 h-5 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                                </svg>
                                HOME
                            </NavLink>
                            
                            <NavLink
                                onClick={() => setMobileMenuOpen(false)}
                                to="/collection"
                                className={({isActive}) => `py-3 px-4 rounded-lg text-gray-700 font-medium flex items-center ${
                                    isActive ? "bg-primary-50 text-primary-700" : "hover:bg-gray-50"
                                }`}
                            >
                                <svg className="w-5 h-5 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h18v18H3zM12 8v8m-4-4h8"></path>
                                </svg>
                                COLLECTIONS
                            </NavLink>
                            
                            <NavLink
                                onClick={() => setMobileMenuOpen(false)}
                                to="/about"
                                className={({isActive}) => `py-3 px-4 rounded-lg text-gray-700 font-medium flex items-center ${
                                    isActive ? "bg-primary-50 text-primary-700" : "hover:bg-gray-50"
                                }`}
                            >
                                <svg className="w-5 h-5 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                ABOUT
                            </NavLink>
                            
                            <NavLink
                                onClick={() => setMobileMenuOpen(false)}
                                to="/contact"
                                className={({isActive}) => `py-3 px-4 rounded-lg text-gray-700 font-medium flex items-center ${
                                    isActive ? "bg-primary-50 text-primary-700" : "hover:bg-gray-50"
                                }`}
                            >
                                <svg className="w-5 h-5 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                                CONTACT
                            </NavLink>
                            
                            {/* Mobile menu section divider */}
                            <div className="my-3 border-t border-gray-200"></div>
                            <p className="text-xs uppercase text-gray-500 font-semibold px-2 mb-1">More</p>
                            
                            <NavLink
                                onClick={() => setMobileMenuOpen(false)}
                                to="/blogs"
                                className={({isActive}) => `py-3 px-4 rounded-lg text-gray-700 flex items-center ${
                                    isActive ? "bg-primary-50 text-primary-700" : "hover:bg-gray-50"
                                }`}
                            >
                                <svg className="w-5 h-5 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                                </svg>
                                BLOG
                            </NavLink>
                            
                            <NavLink
                                onClick={() => setMobileMenuOpen(false)}
                                to="/faq"
                                className={({isActive}) => `py-3 px-4 rounded-lg text-gray-700 flex items-center ${
                                    isActive ? "bg-primary-50 text-primary-700" : "hover:bg-gray-50"
                                }`}
                            >
                                <svg className="w-5 h-5 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                FAQ
                            </NavLink>
                            
                            <NavLink
                                onClick={() => setMobileMenuOpen(false)}
                                to="/size-guide"
                                className={({isActive}) => `py-3 px-4 rounded-lg text-gray-700 flex items-center ${
                                    isActive ? "bg-primary-50 text-primary-700" : "hover:bg-gray-50"
                                }`}
                            >
                                <svg className="w-5 h-5 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
                                </svg>
                                SIZE GUIDE
                            </NavLink>
                            
                            <NavLink
                                onClick={() => setMobileMenuOpen(false)}
                                to="/wishlist"
                                className={({isActive}) => `py-3 px-4 rounded-lg text-gray-700 flex items-center ${
                                    isActive ? "bg-primary-50 text-primary-700" : "hover:bg-gray-50"
                                }`}
                            >
                                <svg className="w-5 h-5 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                </svg>
                                WISHLIST
                            </NavLink>
                            
                            <NavLink
                                onClick={() => setMobileMenuOpen(false)}
                                to="/frame-finder"
                                className={({isActive}) => `py-3 px-4 rounded-lg text-gray-700 flex items-center ${
                                    isActive ? "bg-primary-50 text-primary-700" : "hover:bg-gray-50"
                                }`}
                            >
                                <svg className="w-5 h-5 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                FRAME FINDER
                            </NavLink>
                        </div>
                        
                        {/* Mobile menu footer - account actions */}
                        <div className="border-t border-gray-200 p-5">
                            {token ? (
                                <button 
                                    onClick={() => {
                                        logout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary-50 text-primary-700 rounded-lg font-medium hover:bg-primary-100 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                    </svg>
                                    Logout
                                </button>
                            ) : (
                                <div className="flex gap-3">
                                    <Link 
                                        to="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-primary-50 text-primary-700 rounded-lg font-medium hover:bg-primary-100 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                                        </svg>
                                        Login
                                    </Link>
                                    <Link 
                                        to="/register"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-primary-700 text-white rounded-lg font-medium hover:bg-primary-800 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                                        </svg>
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Overlay for mobile menu */}
                {mobileMenuOpen && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setMobileMenuOpen(false)}
                    ></div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;
