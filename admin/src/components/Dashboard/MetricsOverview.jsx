import { Users, Package, CreditCard, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import MetricCard from './MetricCard';
import { formatNaira } from './dashboardFormatters';

const MetricsOverview = ({ dashboardData }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <MetricCard
      title="Sales"
      iconBgClass="bg-blue-50"
      icon={<span className="h-5 w-5 text-blue-600 font-bold">₦</span>}
      value={formatNaira(dashboardData.salesMetrics.totalSales)}
      subtitle={`${dashboardData.salesMetrics.totalOrders} orders`}
      trendColorClass="text-green-600"
      trend={
        <>
          <TrendingUp className="h-4 w-4 mr-1" />
          <span>12% increase</span>
        </>
      }
    />

    <MetricCard
      title="Customers"
      iconBgClass="bg-green-50"
      icon={<Users className="h-5 w-5 text-green-600" />}
      value={dashboardData.customerMetrics.registeredUsers}
      subtitle="Registered users"
      trendColorClass="text-green-600"
      trend={
        <>
          <TrendingUp className="h-4 w-4 mr-1" />
          <span>8.5% increase</span>
        </>
      }
    />

    <MetricCard
      title="Inventory"
      iconBgClass="bg-purple-50"
      icon={<Package className="h-5 w-5 text-purple-600" />}
      value={dashboardData.inventoryMetrics.totalProducts}
      subtitle={`${dashboardData.inventoryMetrics.outOfStockProducts} out of stock`}
      trendColorClass="text-amber-600"
      trend={
        <>
          <AlertTriangle className="h-4 w-4 mr-1" />
          <span>{dashboardData.inventoryMetrics.stockLevel} in stock</span>
        </>
      }
    />

    <MetricCard
      title="Payments"
      iconBgClass="bg-amber-50"
      icon={<CreditCard className="h-5 w-5 text-amber-600" />}
      value={dashboardData.financeMetrics.successfulPayments}
      subtitle={`${dashboardData.financeMetrics.failedPayments} failed payments`}
      trendColorClass="text-blue-600"
      trend={
        <>
          <Activity className="h-4 w-4 mr-1" />
          <span>{dashboardData.financeMetrics.paymentSuccessRate} success rate</span>
        </>
      }
    />
  </div>
);

export default MetricsOverview;