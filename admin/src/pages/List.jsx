import api from "../api/http";
import React, { useEffect, useState } from "react";
import { currency } from "../App";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");

  const fetchList = async () => {
    try {
  const response = await api.get(`/api/product/list`);

      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch products");
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await api.post(
        `/api/product/remove`,
        { id }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to remove product");
    }
  };

  // Filter products based on selected category
  const filteredProducts = filterCategory
    ? list.filter((item) => item.category === filterCategory)
    : list;

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <main className="flex flex-col gap-2">
      <div className="flex justify-between items-center mb-4">
        <p className="font-semibold">All Products List</p>

        <div className="flex gap-2">
          <button
            onClick={() => setFilterCategory("")}
            className={`px-3 py-1 text-sm rounded ${
              !filterCategory ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterCategory("Eyeglasses")}
            className={`px-3 py-1 text-sm rounded ${
              filterCategory === "Eyeglasses" ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            Eyeglasses
          </button>
          <button
            onClick={() => setFilterCategory("Sunglasses")}
            className={`px-3 py-1 text-sm rounded ${
              filterCategory === "Sunglasses" ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            Sunglasses
          </button>
          <button
            onClick={() => setFilterCategory("Contact Lenses")}
            className={`px-3 py-1 text-sm rounded ${
              filterCategory === "Contact Lenses" ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            Contacts
          </button>
        </div>
      </div>

      {/* List Table Title */}
      <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr] items-center py-2 px-4 border-b border-gray-200 text-sm font-bold">
        <p>Image</p>
        <p>Name</p>
        <p>Category</p>
        <p>For</p>
        <p>Brand</p>
        <p>Price</p>
        <p className="text-center">Action</p>
      </div>

      {/* List All Products */}
      {filteredProducts.length > 0 ? (
        filteredProducts.map((item, index) => (
          <div
            key={index}
            className="md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr] items-center py-2 px-4 border-b border-gray-100 text-sm"
          >
            <img
              className="w-12 h-12 object-cover"
              src={item.image[0]}
              alt={item.name}
              onError={(e) => {
                const fallbackPng = '/images/no_image.svg';
                const inlineSvg = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"48\" height=\"48\" viewBox=\"0 0 64 64\"><rect width=\"100%\" height=\"100%\" fill=\"#f3f4f6\"/><text x=\"50%\" y=\"50%\" dominant-baseline=\"middle\" text-anchor=\"middle\" font-size=\"10\" fill=\"#9ca3af\" font-family=\"Arial, Helvetica, sans-serif\">No image</text></svg>`);
                if (!e.currentTarget.dataset.fallbackTried) {
                  e.currentTarget.dataset.fallbackTried = '1';
                  e.currentTarget.src = fallbackPng;
                } else {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = inlineSvg;
                }
              }}
            />
            <p
              title={item.name}
              className="overflow-hidden text-ellipsis"
            >
              {item.name}
            </p>
            <p>{item.category}</p>
            <p>{item.subCategory}</p>
            <p>{item.brand || "-"}</p>
            <p>{currency}
              {item.price}
            </p>
            <div className="text-right md:text-center">
              <button
                className="cursor-pointer text-lg text-red-500 hover:text-red-700 transition"
                onClick={() => removeProduct(item._id)}
                title="Delete Product"
              >
                ✖
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center py-4">
          {filterCategory
            ? `No ${filterCategory} products available`
            : "No products available"}
        </p>
      )}

      <div className="mt-4 text-sm text-gray-500">
        <p>Total Products: {filteredProducts.length}</p>
        {filterCategory && (
          <p>
            Showing: {filterCategory} ({filteredProducts.length}/{list.length})
          </p>
        )}
      </div>
    </main>
  );
};

export default List;
