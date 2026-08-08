import Spinner from "../Spinner";
import ErrorAlert from "../ErrorAlert";

const CheckOrderSummary = ({
  cartItems,
  totalPrice,
  stockErrors,
  isSubmitting,
  error,
  clearError,
  onSubmit,
}) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Your Order</h3>
      <div className="border rounded-lg p-4 space-y-4">
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => {
            const itemId = item.id || item.productId;
            const hasIssue = stockErrors.some(
              (err) => err.includes(itemId) || (item.name && err.includes(item.name))
            );

            return (
              <div
                key={index}
                className={`flex justify-between items-center border-b pb-2 ${
                  hasIssue ? "bg-red-50 p-2 rounded border border-red-200" : ""
                }`}
              >
                <div className={hasIssue ? "text-red-700" : "text-gray-700"}>
                  <span>{item.name} × {item.quantity}</span>
                  {hasIssue && (
                    <span className="block text-xs text-red-600 font-medium">Stock issue</span>
                  )}
                </div>
                <div className="font-medium">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">Your cart is empty.</p>
        )}

        <div className="flex justify-between items-center font-semibold pt-4 border-t">
          <span>Subtotal:</span>
          <span>₦{totalPrice.toLocaleString()}</span>
        </div>

        {/* Payment Method */}
        <div className="pt-6">
          <h4 className="text-lg font-semibold mb-2">Payment Method</h4>
          <p className="text-gray-700">Pay with Paystack</p>
        </div>

        <ErrorAlert message={error} onClose={clearError} />

        <button
          onClick={onSubmit}
          disabled={isSubmitting || cartItems.length === 0}
          className={`w-full mt-6 py-2.5 rounded-lg flex justify-center items-center font-medium transition ${
            isSubmitting || cartItems.length === 0
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <Spinner size="sm" color="white" />
              <span>Processing Order...</span>
            </div>
          ) : (
            "Place Order"
          )}
        </button>
      </div>
    </div>
  );
};

export default CheckOrderSummary;