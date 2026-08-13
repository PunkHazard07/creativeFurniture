import { ChevronRight, ShoppingBag } from 'lucide-react';
import PaginationControls from './PaginationControls';
import { formatDate, formatNaira } from './dashboardFormatters';

const statusStyles = {
  completed: { bg: 'bg-green-100', icon: 'text-green-600' },
  processing: { bg: 'bg-blue-100', icon: 'text-blue-600' }
};
const defaultStatusStyle = { bg: 'bg-red-100', icon: 'text-red-600' };

const RecentOrdersList = ({ recentOrders, ordersPage, onPaginate }) => (
  <div className="bg-white rounded-lg shadow border border-gray-100">
    <div className="p-6 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-700">Recent Orders</h2>
        <div className="flex items-center text-blue-600 hover:text-blue-800 cursor-pointer">
          <span className="text-sm font-medium">View All</span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </div>
      </div>
    </div>
    <div className="p-6">
      <div className="flow-root">
        <ul className="divide-y divide-gray-200">
          {recentOrders.data.length > 0 ? (
            recentOrders.data.map((order) => {
              const { bg, icon } = statusStyles[order.status] || defaultStatusStyle;
              return (
                <li key={order.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`p-2 rounded-full ${bg}`}>
                        <ShoppingBag className={`h-5 w-5 ${icon}`} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Order #{order.id}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-sm font-semibold text-gray-900">{formatNaira(order.amount)}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.date)}</p>
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <li className="py-4 text-center text-gray-500">No orders found</li>
          )}
        </ul>
      </div>
      <PaginationControls
        page={ordersPage}
        totalPages={recentOrders.pagination.totalPages}
        onPaginate={onPaginate}
      />
    </div>
  </div>
);

export default RecentOrdersList;