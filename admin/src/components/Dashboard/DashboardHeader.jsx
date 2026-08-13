import { LayoutDashboard, RefreshCcw } from 'lucide-react';

const DashboardHeader = ({ timePeriod, onTimePeriodChange, onRefresh }) => (
  <div className="bg-white shadow-sm border-b">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <LayoutDashboard className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
        </div>
        <div className="flex flex-col xs:flex-row gap-3">
          <select
            value={timePeriod}
            onChange={onTimePeriodChange}
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="daily">Today</option>
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
            <option value="yearly">This Year</option>
            <option value="all">All Time</option>
          </select>
          <button
            onClick={onRefresh}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardHeader;