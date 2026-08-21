import Spinner from "../Spinner";

const DashboardLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="flex justify-center">
        <Spinner size="lg" />
      </div>
      <p className="mt-4 text-gray-600">Loading dashboard data...</p>
    </div>
  </div>
);

export default DashboardLoading;