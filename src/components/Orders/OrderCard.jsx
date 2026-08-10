import React from "react";
import OrderItemRow from "./OrderItemRow";

const statusColors = {
  Pending: "text-yellow-500",
  Shipped: "text-indigo-500",
  Delivered: "text-green-600",
  Cancelled: "text-red-500",
};

const OrderCard = ({ order, isUpdated }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white shadow-md border rounded-2xl p-4 sm:p-6">
      <div className="flex justify-between items-center flex-wrap gap-2 mb-4">
        <div>
          <h3 className="text-lg font-semibold">Order #{order._id}</h3>
          <p className="text-sm text-gray-500">Placed on {formatDate(order.date)}</p>
        </div>
        <div
          className={`font-medium ${statusColors[order.status] || "text-gray-600"} ${
            isUpdated ? "animate-pulse" : ""
          }`}
        >
          {order.status}
          {isUpdated && (
            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              Updated
            </span>
          )}
        </div>
      </div>

      <div className="mb-4">
        <p className="font-medium text-gray-700">Shipping Address:</p>
        <p className="text-sm text-gray-600">
          {order.shippingDetails?.address || "Not available"}
        </p>
      </div>

      <div className="mb-4">
        <p className="font-medium text-gray-700 mb-2">Items:</p>
        <ul className="divide-y divide-gray-100">
          {order.items.map((item, idx) => (
            <OrderItemRow key={idx} item={item} />
          ))}
        </ul>
      </div>

      <div className="text-right font-semibold text-gray-800">
        Total: ₦{(order.amount || 0).toFixed(2)}
      </div>
    </div>
  );
};

export default OrderCard;