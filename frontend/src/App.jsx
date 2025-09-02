import React, { Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
const Collection = React.lazy(() => import("./Pages/Collection"));
const About = React.lazy(() => import("./Pages/About"));
const Contact = React.lazy(() => import("./Pages/Contact"));
const FAQ = React.lazy(() => import("./Pages/FAQ"));
const Blogs = React.lazy(() => import("./Pages/Blogs"));
const BlogTest = React.lazy(() => import("./Pages/BlogTest"));
const SizeGuide = React.lazy(() => import("./Pages/SizeGuide"));
const Wishlist = React.lazy(() => import("./Pages/Wishlist"));
const Product = React.lazy(() => import("./Pages/Product"));
const ProductFixed = React.lazy(() => import("./Pages/ProductFixed"));
const Cart = React.lazy(() => import("./Pages/Cart"));
const Login = React.lazy(() => import("./Pages/Login"));
const PlaceOrder = React.lazy(() => import("./Pages/PlaceOrder"));
const Orders = React.lazy(() => import("./Pages/Orders"));
const Profile = React.lazy(() => import("./Pages/Profile"));
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Verify = React.lazy(() => import("./Pages/Verify"));
const FrameFinder = React.lazy(() => import("./Pages/FrameFinder"));
import ErrorBoundary from "./components/ErrorBoundary";


const App = () => {
  const location = useLocation();

  // Log all errors globally
  useEffect(() => {
    window.onerror = function(message, source, lineno, colno, error) {
      console.error("Global Error:", { message, source, lineno, colno, error });
    };
    window.addEventListener('unhandledrejection', function(event) {
      console.error("Unhandled Promise Rejection:", event.reason);
    });
    return () => {
      window.onerror = null;
      window.removeEventListener('unhandledrejection', () => {});
    };
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Prefetch popular route chunks when idle (speeds first navigation)
  useEffect(() => {
    const idle = (cb) => {
      if ('requestIdleCallback' in window) return window.requestIdleCallback(cb);
      return setTimeout(cb, 500);
    };
    const cancel = (id) => {
      if ('cancelIdleCallback' in window) return window.cancelIdleCallback(id);
      return clearTimeout(id);
    };
    const id = idle(() => {
      import("./Pages/Collection");
    });
    return () => cancel(id);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="!rounded-lg !shadow-lg"
      />

      {/* Navigation */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-grow pt-20">
        <div className="content-container">
          <SearchBar />
          <Suspense fallback={<div className="py-16 text-center text-gray-500">Loading…</div>}>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/collection' element={<Collection/>} />
              <Route path='/about' element={<About />} />
              <Route path='/contact' element={<Contact />} />
              <Route path='/faq' element={<FAQ />} />
              <Route path='/blogs' element={<Blogs />} />
              <Route path='/blog-test' element={<BlogTest />} />
              <Route path='/frame-finder' element={<FrameFinder />} />
              <Route path='/product/:productId' element={<ErrorBoundary><ProductFixed /></ErrorBoundary>} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/login' element={<Login />} />
              <Route path='/place-order' element={<PlaceOrder />} />
              <Route path='/orders' element={<Orders />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/verify' element={<Verify/>} />
              <Route path='/size-guide' element={<SizeGuide />} />
              <Route path='/wishlist' element={<Wishlist />} />
              {/* Catch-all fallback route */}
              <Route path='*' element={
                <div className="min-h-[60vh] flex flex-col items-center justify-center">
                  <h1 className="text-3xl font-bold text-red-600 mb-4">404 - Page Not Found</h1>
                  <p className="text-gray-600 mb-6">The page you are looking for does not exist.</p>
                  <a href="/" className="bg-primary-700 text-white py-2 px-6 rounded-md hover:bg-primary-800 transition-colors">Go to Home</a>
                </div>
              } />
            </Routes>
          </Suspense>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
