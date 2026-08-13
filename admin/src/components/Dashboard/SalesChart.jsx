import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { formatNaira } from './dashboardFormatters';

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const SalesChart = ({ totalSales }) => {
  // Generate chart data from the API data.
  // For simplicity, we're generating sample data for the chart.
  // In a real app, you might want to add a dedicated endpoint for chart data.
  const salesData = Array(7).fill(0).map((_, index) => {
    const randomValue = totalSales / 7 * (0.7 + Math.random() * 0.6);
    return {
      name: weekdays[index],
      value: randomValue
    };
  });

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
      <h2 className="text-lg font-medium text-gray-700 mb-4">Sales Overview</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [formatNaira(value), 'Revenue']} />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;