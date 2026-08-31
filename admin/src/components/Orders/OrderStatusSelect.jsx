const statusOptions = ["Pending", "Shipped", "Delivered", "Cancelled"];

const OrderStatusSelect = ({ value, onChange, className = "" }) => {
  const getStatusColorClass = (status) => {
    switch (status) {
    case "Pending":
        return "border-yellow-400 text-yellow-500";
    case "Shipped":
        return "border-indigo-400 text-indigo-500";
    case "Delivered":
        return "border-green-400 text-green-600";
    case "Cancelled":
        return "border-red-400 text-red-500";
    default:
        return "border-gray-300";
    }
};

return (
    <select
        value={value}
        onChange={onChange}
        className={`bg-white border rounded px-2 py-1 ${getStatusColorClass(value)} ${className}`}
    >
    {statusOptions.map((status) => (
        <option key={status} value={status}>
            {status}
        </option>
    ))}
    </select>
  );
};

export default OrderStatusSelect;