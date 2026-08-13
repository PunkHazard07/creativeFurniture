import { useEffect } from "react";
import { useOrderStore, selectFilteredOrders, getUserDisplayName } from "../stores/orderStore";
import OrderFilters from "../components/Orders/OrderFilters";
import FeedbackMessage from "../components/Orders/FeedbackMessage";
import OrderTableRow from "../components/Orders/OrderTableRow";
import OrderCard from "../components/Orders/OrderCard";

const Orders = () => {
  const filteredOrders = useOrderStore(selectFilteredOrders);
  const loading = useOrderStore((s) => s.loading);
  const error = useOrderStore((s) => s.error);
  const updateMessage = useOrderStore((s) => s.updateMessage);
  const filterStatus = useOrderStore((s) => s.filterStatus);
  const setFilterStatus = useOrderStore((s) => s.setFilterStatus);
  const showArchived = useOrderStore((s) => s.showArchived);
  const setShowArchived = useOrderStore((s) => s.setShowArchived);
  const updateStatus = useOrderStore((s) => s.updateStatus);
  const deleteOrder = useOrderStore((s) => s.deleteOrder);
  const archiveOrder = useOrderStore((s) => s.archiveOrder);
  const fetchOrders = useOrderStore((s) => s.fetchOrders);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) return <div className="p-4 text-center">Loading orders...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;


  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-semibold mb-4">All Orders</h2>

      <FeedbackMessage message={updateMessage} />

      <OrderFilters
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        showArchived={showArchived}
        setShowArchived={setShowArchived}
      />

      {filteredOrders.length === 0 ? (
        <div className="text-center p-4 bg-gray-50 rounded-xl">No orders found</div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="w-full table-auto border-collapse shadow-lg rounded-xl overflow-hidden">
              <thead className="bg-gray-100">
                <tr className="text-left">
                  <th className="p-4">User</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <OrderTableRow
                    key={order._id}
                    order={order}
                    userDisplayName={getUserDisplayName(order)}
                    onStatusChange={updateStatus}
                    onArchive={archiveOrder}
                    onDelete={deleteOrder}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                userDisplayName={getUserDisplayName(order)}
                onStatusChange={updateStatus}
                onArchive={archiveOrder}
                onDelete={deleteOrder}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Orders