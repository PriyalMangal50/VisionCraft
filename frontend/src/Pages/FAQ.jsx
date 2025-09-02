import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Helper function to decode HTML entities
const decodeHTML = (html) => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
};

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "General",
    "Eyeglasses",
    "Sunglasses",
    "Contact Lenses",
    "Prescription",
    "Size & Fit",
    "Orders",
    "Shipping",
    "Returns",
    "Payment",
    "Products"
  ];

  const fetchFAQs = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/faq/list`);
      
      if (response.data.success) {
        // Filter only active FAQs and sort by order
        const activeFAQs = response.data.faqs.filter(faq => faq.isActive);
        setFaqs(activeFAQs);
      } else {
        toast.error("Failed to load FAQs");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const filteredFAQs = selectedCategory === "All" 
    ? faqs 
    : faqs.filter(faq => decodeHTML(faq.category) === selectedCategory);

  useEffect(() => {
    fetchFAQs();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 font-arial">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray">Loading FAQs...</p>
      </div>
    );
  }

  return (
    <div className="py-10 font-arial">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-arial-extrabold text-primary-dark mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-gray max-w-2xl mx-auto">
          Find answers to common questions about our products, orders, shipping, and more.
        </p>
      </div>

      {/* Category Filter */}
      <div className="max-w-5xl mx-auto px-4 mb-8">
        <h3 className="text-center text-lg font-arial-extrabold text-primary mb-3">Filter by Category</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-white"
                  : "bg-light-gray text-gray hover:bg-gray"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ List */}
      <div className="max-w-4xl mx-auto">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray">No FAQs found for the selected category.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <div
                key={faq._id}
                className="border border-light-gray rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleFAQ(faq._id)}
                  className="w-full px-6 py-4 text-left bg-white hover:bg-light-gray focus:outline-none focus:bg-light-gray transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className={`inline-block text-xs px-2 py-1 rounded-full mr-2 ${
                        decodeHTML(faq.category) === "General" ? "bg-light-gray text-gray" :
                        decodeHTML(faq.category) === "Eyeglasses" ? "bg-primary bg-opacity-10 text-primary" :
                        decodeHTML(faq.category) === "Sunglasses" ? "bg-primary-dark bg-opacity-10 text-primary-dark" :
                        decodeHTML(faq.category) === "Contact Lenses" ? "bg-orange bg-opacity-10 text-orange" :
                        decodeHTML(faq.category) === "Prescription" ? "bg-pink bg-opacity-20 text-pink" :
                        decodeHTML(faq.category) === "Size & Fit" ? "bg-primary bg-opacity-20 text-primary-dark" :
                        decodeHTML(faq.category) === "Orders" ? "bg-orange bg-opacity-20 text-orange" :
                        decodeHTML(faq.category) === "Shipping" ? "bg-light-gray text-primary" :
                        decodeHTML(faq.category) === "Returns" ? "bg-pink bg-opacity-10 text-pink" :
                        decodeHTML(faq.category) === "Payment" ? "bg-primary bg-opacity-10 text-primary-dark" :
                        decodeHTML(faq.category) === "Products" ? "bg-orange bg-opacity-20 text-orange" :
                        "bg-light-gray text-gray"
                      }`}>
                        {decodeHTML(faq.category)}
                      </span>
                      <h3 className="inline text-lg font-arial-extrabold text-primary-dark pr-4">
                        {faq.question}
                      </h3>
                    </div>
                    <div className="flex-shrink-0">
                      <svg
                        className={`w-5 h-5 text-primary transform transition-transform ${
                          openFAQ === faq._id ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
                
                {openFAQ === faq._id && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {decodeHTML(faq.answer)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Section */}
      <div className="text-center mt-12 p-6 bg-gray-50 rounded-lg max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
        <p className="text-gray-600 mb-4">
          Can't find the answer you're looking for? Please chat with our friendly team.
        </p>
        <a
          href="/contact"
          className="inline-block bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
};

export default FAQ;
