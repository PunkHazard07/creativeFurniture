import StatusPieChart from './StatusPieChart';

const PaymentAnalysisChart = ({ inventoryMetrics, financeMetrics }) => {
  const inventoryData = [
    {
      name: 'In Stock',
      value: inventoryMetrics.totalProducts - inventoryMetrics.outOfStockProducts,
      fill: '#10b981'
    },
    {
      name: 'Out of Stock',
      value: inventoryMetrics.outOfStockProducts,
      fill: '#ef4444'
    }
  ];

  const paymentData = [
    {
      name: 'Successful',
      value: financeMetrics.successfulPayments,
      fill: '#3b82f6'
    },
    {
      name: 'Failed',
      value: financeMetrics.failedPayments,
      fill: '#f59e0b'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
      <h2 className="text-lg font-medium text-gray-700 mb-4">Payment Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatusPieChart data={paymentData} tooltipLabel="Payments" />
        <StatusPieChart data={inventoryData} tooltipLabel="Products" />
      </div>
    </div>
  );
};

export default PaymentAnalysisChart;