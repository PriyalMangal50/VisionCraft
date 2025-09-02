import React, { useState } from "react";
import api from "../api/http";
import { toast } from "react-toastify";

const AddFAQ = ({ token }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("General");
  const [isActive, setIsActive] = useState(true);
  const [order, setOrder] = useState(0);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = {
        question,
        answer,
        category,
        isActive,
        order: Number(order),
      };

      const response = await api.post(
        `/api/faq/add`,
        formData
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setQuestion("");
        setAnswer("");
        setCategory("General");
        setIsActive(true);
        setOrder(0);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to add FAQ");
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
      <div>
        <p className="mb-2">FAQ Question</p>
        <input
          onChange={(e) => setQuestion(e.target.value)}
          value={question}
          className="w-full max-w-[500px] px-3 py-2 border-2 border-gray-300"
          type="text"
          placeholder="Type FAQ question here"
          required
        />
      </div>

      <div>
        <p className="mb-2">FAQ Answer</p>
        <textarea
          onChange={(e) => setAnswer(e.target.value)}
          value={answer}
          className="w-full max-w-[500px] px-3 py-2 border-2 border-gray-300"
          placeholder="Type FAQ answer here"
          required
          rows={4}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">FAQ Category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="w-full px-3 py-2 border-2 border-gray-300"
          >
            <option value="General">General</option>
            <option value="Eyeglasses">Eyeglasses</option>
            <option value="Sunglasses">Sunglasses</option>
            <option value="Contact Lenses">Contact Lenses</option>
            <option value="Prescription">Prescription</option>
            <option value="Size &amp; Fit">Size &amp; Fit</option>
            <option value="Orders">Orders</option>
            <option value="Shipping">Shipping</option>
            <option value="Returns">Returns</option>
            <option value="Payment">Payment</option>
            <option value="Products">Products</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Display Order</p>
          <input
            onChange={(e) => setOrder(e.target.value)}
            value={order}
            className="w-full px-3 py-2 border-2 border-gray-300"
            type="number"
            placeholder="0"
            min="0"
          />
        </div>

        <div>
          <p className="mb-2">Status</p>
          <div className="flex gap-3">
            <div
              onClick={() => setIsActive(true)}
              className={`cursor-pointer px-3 py-2 border-2 ${
                isActive ? "bg-blue-100 border-blue-500" : "border-gray-300"
              }`}
            >
              <p>Active</p>
            </div>
            <div
              onClick={() => setIsActive(false)}
              className={`cursor-pointer px-3 py-2 border-2 ${
                !isActive ? "bg-red-100 border-red-500" : "border-gray-300"
              }`}
            >
              <p>Inactive</p>
            </div>
          </div>
        </div>
      </div>

      <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">
        ADD FAQ
      </button>
    </form>
  );
};

export default AddFAQ;
