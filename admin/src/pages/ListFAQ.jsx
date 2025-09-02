import api from "../api/http";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ListFAQ = ({ token }) => {
  const [list, setList] = useState([]);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [editForm, setEditForm] = useState({
    question: "",
    answer: "",
    category: "General",
    isActive: true,
    order: 0,
  });

  const fetchList = async () => {
    try {
  const response = await api.get(`/api/faq/list`);

      if (response.data.success) {
        setList(response.data.faqs);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch FAQs");
    }
  };

  const removeFAQ = async (id) => {
    try {
      const response = await api.post(
        `/api/faq/remove`,
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
      toast.error(error.response?.data?.message || "Failed to remove FAQ");
    }
  };

  const updateFAQ = async (id) => {
    try {
      const response = await api.post(
        `/api/faq/update`,
        { id, ...editForm }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setEditingFAQ(null);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update FAQ");
    }
  };

  const startEditing = (faq) => {
    setEditingFAQ(faq._id);
    setEditForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      isActive: faq.isActive,
      order: faq.order,
    });
  };

  const cancelEditing = () => {
    setEditingFAQ(null);
    setEditForm({
      question: "",
      answer: "",
      category: "General",
      isActive: true,
      order: 0,
    });
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2">All FAQs List</p>
      <div className="flex flex-col gap-2">
        {/* Headers */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_2fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Order</b>
          <b>Question</b>
          <b>Category</b>
          <b>Status</b>
          <b>Date</b>
          <b>Action</b>
          <b>Remove</b>
        </div>

        {/* FAQ List */}
        {list.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_2fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
            key={index}
          >
            {editingFAQ === item._id ? (
              <>
                {/* Edit Mode */}
                <input
                  type="number"
                  value={editForm.order}
                  onChange={(e) =>
                    setEditForm({ ...editForm, order: Number(e.target.value) })
                  }
                  className="border px-2 py-1 w-16"
                />
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={editForm.question}
                    onChange={(e) =>
                      setEditForm({ ...editForm, question: e.target.value })
                    }
                    className="border px-2 py-1"
                  />
                  <textarea
                    value={editForm.answer}
                    onChange={(e) =>
                      setEditForm({ ...editForm, answer: e.target.value })
                    }
                    className="border px-2 py-1"
                    rows={2}
                  />
                </div>
                <select
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm({ ...editForm, category: e.target.value })
                  }
                  className="border px-2 py-1"
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
                <select
                  value={editForm.isActive}
                  onChange={(e) =>
                    setEditForm({ ...editForm, isActive: e.target.value === "true" })
                  }
                  className="border px-2 py-1"
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
                <p>{new Date(item.date).toLocaleDateString()}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateFAQ(item._id)}
                    className="text-green-600 cursor-pointer text-lg"
                  >
                    ✓
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="text-red-600 cursor-pointer text-lg"
                  >
                    ✗
                  </button>
                </div>
                <p
                  onClick={() => removeFAQ(item._id)}
                  className="text-right md:text-center cursor-pointer text-lg"
                >
                  🗑️
                </p>
              </>
            ) : (
              <>
                {/* View Mode */}
                <p>{item.order}</p>
                <div>
                  <p className="font-medium">{item.question}</p>
                  <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                    {item.answer}
                  </p>
                </div>
                <p>{item.category}</p>
                <p className={item.isActive ? "text-green-600" : "text-red-600"}>
                  {item.isActive ? "Active" : "Inactive"}
                </p>
                <p>{new Date(item.date).toLocaleDateString()}</p>
                <p
                  onClick={() => startEditing(item)}
                  className="text-right md:text-center cursor-pointer text-lg"
                >
                  ✏️
                </p>
                <p
                  onClick={() => removeFAQ(item._id)}
                  className="text-right md:text-center cursor-pointer text-lg"
                >
                  🗑️
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default ListFAQ;
