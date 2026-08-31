import { useEffect } from "react";
import { useDashboardStore } from "../stores/dashboardStore";
import DashboardLoading from "../components/Dashboard/DashboardLoading";
import DashboardError from "../components/Dashboard/DashboardError";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import MetricsOverview from "../components/Dashboard/MetricsOverview";
import SalesChart from "../components/Dashboard/SalesChart";
import PaymentAnalysisChart from "../components/Dashboard/PaymentAnalysisChart";
import RecentOrdersList from "../components/Dashboard/RecentOrdersList";
import RecentProductsList from "../components/Dashboard/RecentProductsList";

const Dashboard = () => {
  const timePeriod = useDashboardStore((s) => s.timePeriod);
  const loading = useDashboardStore((s) => s.loading);
  const error = useDashboardStore((s) => s.error);
  const dashboardData = useDashboardStore((s) => s.dashboardData);
  const ordersPage = useDashboardStore((s) => s.ordersPage);
  const productsPage = useDashboardStore((s) => s.productsPage);
  const salesChartData = useDashboardStore((s) => s.salesChartData);
  const handleRefresh = useDashboardStore((s) => s.handleRefresh);
  const handleTimePeriodChange = useDashboardStore((s) => s.handleTimePeriodChange);
  const handleOrdersPagination = useDashboardStore((s) => s.handleOrdersPagination);
  const handleProductsPagination = useDashboardStore((s) => s.handleProductsPagination);
  const fetchDashboardData = useDashboardStore((s) => s.fetchDashboardData);
  const fetchSalesChart = useDashboardStore((s) => s.fetchSalesChart);
  const initSocketListeners = useDashboardStore((s) => s.initSocketListeners);
  const teardownSocketListeners = useDashboardStore((s) => s.teardownSocketListeners);

  useEffect(() => {
    fetchDashboardData();
    fetchSalesChart();
    initSocketListeners();

    return () => teardownSocketListeners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <SalesChart data={salesChartData} />
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