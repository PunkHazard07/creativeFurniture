const MetricCard = ({ title, iconBgClass, icon, value, subtitle, trend, trendColorClass }) => (
  <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-medium text-gray-700">{title}</h2>
      <div className={`p-2 rounded-full ${iconBgClass}`}>
        {icon}
      </div>
    </div>
    <div className="flex flex-col">
      <p className="text-3xl font-bold text-gray-800 text-left">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      {trend && (
        <div className={`mt-2 flex items-center text-sm ${trendColorClass}`}>
          {trend}
        </div>
      )}
    </div>
  </div>
);

export default MetricCard;