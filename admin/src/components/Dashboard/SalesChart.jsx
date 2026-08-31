import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { formatNaira } from './dashboardFormatters';

const SalesChart = ({ data }) => {
    return (
      <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Sales Overview</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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