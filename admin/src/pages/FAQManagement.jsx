import React, { useState } from "react";
import AddFAQ from "./AddFAQ";
import ListFAQ from "./ListFAQ";

const FAQManagement = ({ token }) => {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab("add")}
          className={`pb-2 px-4 font-medium ${
            activeTab === "add"
              ? "text-black border-b-2 border-black"
              : "text-gray-500"
          }`}
        >
          Add FAQ
        </button>
        <button
          onClick={() => setActiveTab("list")}
          className={`pb-2 px-4 font-medium ${
            activeTab === "list"
              ? "text-black border-b-2 border-black"
              : "text-gray-500"
          }`}
        >
          Manage FAQs
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "add" && <AddFAQ token={token} />}
        {activeTab === "list" && <ListFAQ token={token} />}
      </div>
    </div>
  );
};

export default FAQManagement;
