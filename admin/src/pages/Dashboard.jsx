import { useDashboardData } from "../components/Dashboard/useDashboardData";
import DashboardLoading from "../components/Dashboard/DashboardLoading";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import MetricsOverview from "../components/Dashboard/MetricsOverview";
import SalesChart from "../components/Dashboard/SalesChart";
import PaymentAnalysisChart from "../components/Dashboard/PaymentAnalysisChart";
import RecentOrdersList from "../components/Dashboard/RecentOrdersList";
import RecentProductsList from "../components/Dashboard/RecentProductsList";

const Dashboard = () => {
  const {
    timePeriod,
    loading,
    error,
    dashboardData,
    ordersPage,
    productsPage,
    handleRefresh,
    handleTimePeriodChange,
    handleOrdersPagination,
    handleProductsPagination
  } = useDashboardData();

  if (loading && !dashboardData.salesMetrics.totalOrders) {
    return <DashboardLoading />;
  }

  if (error) {
    return <DashboardError error={error} onRetry={handleRefresh} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <DashboardHeader
        timePeriod={timePeriod}
        onTimePeriodChange={handleTimePeriodChange}
        onRefresh={handleRefresh}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MetricsOverview dashboardData={dashboardData} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SalesChart totalSales={dashboardData.salesMetrics.totalSales} />
          <PaymentAnalysisChart
            inventoryMetrics={dashboardData.inventoryMetrics}
            financeMetrics={dashboardData.financeMetrics}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentOrdersList
            recentOrders={dashboardData.recentActivity.recentOrders}
            ordersPage={ordersPage}
            onPaginate={handleOrdersPagination}
          />
          <RecentProductsList
            recentProducts={dashboardData.recentActivity.recentProducts}
            productsPage={productsPage}
            onPaginate={handleProductsPagination}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;