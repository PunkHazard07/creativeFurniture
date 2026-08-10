import React from "react";
import OrderStatusSelect from "./OrderStatusSelect";

const OrderCard = ({ order, userDisplayName, onStatusChange, onArchive, onDelete }) => {
return (
    <div
            className={`bg-white shadow-md rounded-xl p-4 space-y-2 border ${
            order.isArchived ? "opacity-70" : ""
        }`}
    >
      <div>
        <strong>User:</strong> {userDisplayName}
      </div>
      <div>
        <strong>Address:</strong> {order.address}
      </div>
      <div>
        <strong>Total:</strong> ₦{order.amount ? order.amount.toFixed(2) : "0.00"}
      </div>
      <div>
        <strong>Status:</strong>
        <OrderStatusSelect
          value={order.status}
          onChange={(e) => onStatusChange(order._id, e.target.value)}
          className="block mt-1 w-full"
        />
      </div>
      <div>
        <strong>Payment Method:</strong> {order.paymentMethod}
      </div>
      <div>
        <strong>Date:</strong> {new Date(order.date).toLocaleDateString()}
      </div>
      <div className="flex gap-2 pt-2">
        {!order.isArchived && (
          <button
            onClick={() => onArchive(order._id)}
            className="flex-1 text-gray-500 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded text-sm"
          >
            Archive
          </button>
        )}
        <button
          onClick={() => onDelete(order._id)}
          className="flex-1 text-red-500 bg-red-100 hover:bg-red-200 px-3 py-2 rounded text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default OrderCard;