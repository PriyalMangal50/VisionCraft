import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl,currency} from "../App";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }

    try {
      const res = await axios.post(backendUrl +"/api/order/list",{}, {headers: { token }});
      
      if (res.data.success) {
        setOrders(res.data.orders.reverse());
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleStatus = async (e, orderId) => {
    try {
      const res = await axios.post(backendUrl + "/api/order/status",{ orderId, status: e.target.value },{ headers: { token } });

      if (res.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  
  // Format prescription details for display
  const formatPrescription = (prescription) => {
    if (!prescription) return null;
    
    // For eyeglasses/sunglasses prescription
    if (prescription.rightEye || prescription.leftEye) {
      return (
        <div className="mt-2 text-xs border-t border-gray-200 pt-2">
          <p className="font-medium">Prescription Details:</p>
          {prescription.rightEye && (
            <div>
              <p className="font-medium">Right Eye:</p>
              <ul className="list-disc pl-4">
                <li>SPH: {prescription.rightEye.sphere || 'N/A'}</li>
                <li>CYL: {prescription.rightEye.cylinder || 'N/A'}</li>
                <li>Axis: {prescription.rightEye.axis || 'N/A'}</li>
                {prescription.rightEye.add && <li>Add: {prescription.rightEye.add}</li>}
              </ul>
            </div>
          )}
          
          {prescription.leftEye && (
            <div className="mt-2">
              <p className="font-medium">Left Eye:</p>
              <ul className="list-disc pl-4">
                <li>SPH: {prescription.leftEye.sphere || 'N/A'}</li>
                <li>CYL: {prescription.leftEye.cylinder || 'N/A'}</li>
                <li>Axis: {prescription.leftEye.axis || 'N/A'}</li>
                {prescription.leftEye.add && <li>Add: {prescription.leftEye.add}</li>}
              </ul>
            </div>
          )}
          
          {prescription.pd && (
            <p className="mt-2"><span className="font-medium">PD:</span> {prescription.pd}mm</p>
          )}
          
          {prescription.notes && (
            <p className="mt-2"><span className="font-medium">Notes:</span> {prescription.notes}</p>
          )}
        </div>
      );
    }
    
    // For contact lens prescription
    if (prescription.power || prescription.baseCurve || prescription.diameter) {
      return (
        <div className="mt-2 text-xs border-t border-gray-200 pt-2">
          <p className="font-medium">Contact Lens Prescription:</p>
          <ul className="list-disc pl-4">
            {prescription.power && <li>Power: {prescription.power}</li>}
            {prescription.baseCurve && <li>Base Curve: {prescription.baseCurve}</li>}
            {prescription.diameter && <li>Diameter: {prescription.diameter}</li>}
          </ul>
          
          {prescription.notes && (
            <p className="mt-2"><span className="font-medium">Notes:</span> {prescription.notes}</p>
          )}
        </div>
      );
    }
    
    return null;
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <main>
      <h1 className="text-2xl font-medium mb-6">Orders</h1>
      <div className="grid gap-6">
        {orders.map((order, i) => (
          <div key={i} className="border p-4 rounded-md bg-white shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-medium">Order ID: {order._id}</p>
                <p className="text-sm text-gray-600">
                  Date: {new Date(order.date).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  Payment: {order.payment ? "Completed" : "Pending"} ({order.paymentMethod})
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  Amount: {currency}{order.amount}
                </p>
                <select
                  className="mt-2 px-3 py-1 border rounded"
                  value={order.status}
                  onChange={(e) => handleStatus(e, order._id)}
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </div>
            </div>
            
            <div className="border-t pt-2">
              <button
                className="flex items-center gap-2 text-blue-600 text-sm"
                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
              >
                <span>{expandedOrder === order._id ? "Hide" : "View"} Order Details</span>
                <svg className={`w-4 h-4 transition-transform ${expandedOrder === order._id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {expandedOrder === order._id && (
                <div className="mt-4 space-y-4">
                  <div className="border-t border-b py-3">
                    <h3 className="font-medium mb-2">Customer Information</h3>
                    <p>{order.address.firstName} {order.address.lastName}</p>
                    <p>{order.address.email}</p>
                    <p>{order.address.phone}</p>
                    <p>{order.address.street}, {order.address.city}</p>
                    <p>{order.address.state}, {order.address.zipcode}</p>
                    <p>{order.address.country}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Items</h3>
                    {order.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="border p-2 mb-2 rounded">
                        <div className="flex items-start gap-2">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover"
                              onError={(e) => {
                                const fallbackPng = '/images/no_image.svg';
                                const inlineSvg = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="10" fill="#9ca3af" font-family="Arial, Helvetica, sans-serif">No image</text></svg>`);
                                if (!e.currentTarget.dataset.fallbackTried) {
                                  e.currentTarget.dataset.fallbackTried = '1';
                                  e.currentTarget.src = fallbackPng;
                                } else {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = inlineSvg;
                                }
                              }}
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <div className="flex gap-4 text-sm">
                              <p>Quantity: {item.quantity}</p>
                              <p>Price: {currency}{item.price}</p>
                              {item.size && <p>Size: {item.size}</p>}
                            </div>
                            
                            {/* Prescription button if available */}
                            {item.prescription && (
                              <div>
                                <button
                                  className="text-xs text-blue-600 mt-1"
                                  onClick={() => setExpandedItem(expandedItem === `${order._id}-${itemIdx}` ? null : `${order._id}-${itemIdx}`)}
                                >
                                  {expandedItem === `${order._id}-${itemIdx}` ? 'Hide' : 'View'} Prescription
                                </button>
                                
                                {expandedItem === `${order._id}-${itemIdx}` && (
                                  formatPrescription(item.prescription)
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {orders.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No orders found
          </div>
        )}
      </div>
    </main>
  );
};

export default Orders;
