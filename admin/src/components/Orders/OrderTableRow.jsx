import OrderStatusSelect from "./OrderStatusSelect";

const OrderTableRow = ({ order, userDisplayName, onStatusChange, onArchive, onDelete }) => {
  const shippingAddress = order.shippingDetails?.address ?? "—";

  // Order model doesn't store a payment method; derive a friendly label from isPaid.
  const paymentMethodLabel = order.paymentMethod
    ? order.paymentMethod
    : order.isPaid
    ? "Paid"
    : "Pending payment";

  return (
    <tr
      className={`border-b hover:bg-gray-50 ${
        order.isArchived ? "bg-gray-50 opacity-70" : ""
      }`}
    >
      <td className="p-4">{userDisplayName}</td>
      <td className="p-4">{shippingAddress}</td>
      <td className="p-4">₦{order.amount ? order.amount.toFixed(2) : "0.00"}</td>
      <td className="p-4">
        <OrderStatusSelect
          value={order.status}
          onChange={(e) => onStatusChange(order._id, e.target.value)}
        />
      </td>
      <td className="p-4">{paymentMethodLabel}</td>
      <td className="p-4">{new Date(order.date).toLocaleDateString()}</td>
      <td className="p-4">
        <div className="flex gap-2">
          {!order.isArchived && (
            <button
              onClick={() => onArchive(order._id)}
              className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-sm"
              title="Archive Order"
            >
              Archive
            </button>
          )}
          <button
            onClick={() => onDelete(order._id)}
            className="text-red-500 hover:text-red-700 bg-red-100 hover:bg-red-200 px-2 py-1 rounded text-sm"
            title="Delete Order"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default OrderTableRow;