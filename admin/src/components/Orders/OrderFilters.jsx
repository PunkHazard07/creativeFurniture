const statusOptions = ["Pending", "Shipped", "Delivered", "Cancelled"];

const OrderFilters = ({ filterStatus, setFilterStatus, showArchived, setShowArchived }) => {
  return (
    <div className="mb-6 flex flex-wrap gap-3 items-center">
      <div>
        <label htmlFor="statusFilter" className="mr-2 text-sm font-medium">
          Filter by Status:
        </label>
        <select
          id="statusFilter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-white border rounded px-3 py-1"
        >
          <option value="All">All</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="showArchived"
          checked={showArchived}
          onChange={(e) => setShowArchived(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="showArchived" className="text-sm font-medium">
          Show Archived Orders
        </label>
      </div>
    </div>
  );
};

export default OrderFilters;