import React from "react";

const OrderItemRow = ({ item }) => {
  const imageSrc = item.productId?.images?.[0];
  const name = item.productId?.name || "Unnamed Product";

  return (
    <li className="flex items-center gap-4 py-3">
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={name}
          className="w-16 h-16 object-cover rounded-lg"
        />
      ) : (
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-gray-400 text-xs">No image</span>
        </div>
      )}
      <div className="flex-1">
        <p className="font-medium text-gray-800">{name}</p>
        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
      </div>
    </li>
  );
};

export default OrderItemRow;