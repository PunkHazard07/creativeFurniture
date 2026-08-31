import { PieChart, Pie, ResponsiveContainer, Tooltip, Legend, Cell } from 'recharts';

const StatusPieChart = ({ data, tooltipLabel }) => (
  <div className="h-60">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [value, tooltipLabel]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default StatusPieChart;