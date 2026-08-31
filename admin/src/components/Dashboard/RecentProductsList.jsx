import { ChevronRight, Package } from 'lucide-react';
import PaginationControls from './PaginationControls';
import { formatDate, formatNaira } from './dashboardFormatters';

const RecentProductsList = ({ recentProducts, productsPage, onPaginate }) => (
  <div className="bg-white rounded-lg shadow border border-gray-100">
    <div className="p-6 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-700">Recent Products</h2>
        <div className="flex items-center text-blue-600 hover:text-blue-800 cursor-pointer">
          <span className="text-sm font-medium">View All</span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </div>
      </div>
    </div>
    <div className="p-6">
      <div className="flow-root">
        <ul className="divide-y divide-gray-200">
          {recentProducts.data.length > 0 ? (
            recentProducts.data.map((product) => (
              <li key={product.id} className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`p-2 rounded-full ${
                      product.action === 'Added' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      <Package className={`h-5 w-5 ${
                        product.action === 'Added' ? 'text-green-600' : 'text-blue-600'
                      }`} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {product.action} on {formatDate(product.date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{formatNaira(product.price)}</p>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="py-4 text-center text-gray-500">No products found</li>
          )}
        </ul>
      </div>
      <PaginationControls
        page={productsPage}
        totalPages={recentProducts.pagination.totalPages}
        onPaginate={onPaginate}
      />
    </div>
  </div>
);

export default RecentProductsList;