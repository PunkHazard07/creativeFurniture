const StockErrorsAlert = ({ errors }) => {
  if (!errors || errors.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
      <h4 className="font-semibold mb-2">Stock Issues:</h4>
      <ul className="list-disc pl-5 text-sm space-y-1">
        {errors.map((err, index) => (
          <li key={index}>{err}</li>
        ))}
      </ul>
      <p className="mt-2 text-xs font-medium">Please adjust your cart before continuing.</p>
    </div>
  );
};

export default StockErrorsAlert;