import { useNavigate } from "react-router-dom";

const ProfileOrderSummary = ({ summary }) => {
  const navigate = useNavigate();

  const cards = [
    { label: "Total Orders", count: summary?.totalOrders, bg: "bg-blue-50", text: "text-blue-500" },
    { label: "Pending", count: summary?.pendingOrders, bg: "bg-yellow-50", text: "text-yellow-500" },
    { label: "Shipped", count: summary?.shippedOrders, bg: "bg-indigo-50", text: "text-indigo-500" },
    { label: "Delivered", count: summary?.deliveredOrders, bg: "bg-green-50", text: "text-green-500" },
    { label: "Cancelled", count: summary?.cancelledOrders, bg: "bg-red-50", text: "text-red-500" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:col-span-2 w-full min-w-0 overflow-hidden">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
        Orders Summary
      </h2>

      {/* 1 col on phone, 2 cols on small tablets, 3 on md, 5 on lg */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`${card.bg} rounded-lg p-3 sm:p-4 min-w-0`}
          >
            <p className={`text-xs sm:text-sm ${card.text} font-medium truncate`}>
              {card.label}
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
              {card.count ?? 0}
            </h3>
          </div>
        ))}
      </div>

      <div className="mt-6 sm:mt-8">
        <button
          onClick={() => navigate("/order")}
          className="inline-flex items-center text-sm sm:text-base text-blue-500 hover:text-blue-700 font-medium"
        >
          View All Orders
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProfileOrderSummary;
