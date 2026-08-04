const OrdersSummary = ({ summary }) => {
  const cards = [
    { label: "Total Orders", count: summary?.totalOrders, bg: "bg-blue-50", text: "text-blue-500", iconBg: "bg-blue-100" },
    { label: "Pending", count: summary?.pendingOrders, bg: "bg-yellow-50", text: "text-yellow-500", iconBg: "bg-yellow-100" },
    { label: "Shipped", count: summary?.shippedOrders, bg: "bg-indigo-50", text: "text-indigo-500", iconBg: "bg-indigo-100" },
    { label: "Delivered", count: summary?.deliveredOrders, bg: "bg-green-50", text: "text-green-500", iconBg: "bg-green-100" },
    { label: "Cancelled", count: summary?.cancelledOrders, bg: "bg-red-50", text: "text-red-500", iconBg: "bg-red-100" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        Orders Summary
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <div key={idx} className={`${card.bg} rounded-lg p-4`}>
            <p className={`text-sm ${card.text} font-medium`}>{card.label}</p>
            <h3 className="text-2xl font-bold text-gray-800">{card.count ?? 0}</h3>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button className="inline-flex items-center text-blue-500 hover:text-blue-700 font-medium">
          View All Orders
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default OrdersSummary;