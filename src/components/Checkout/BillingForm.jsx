const BillingForm = ({ formData, onChange }) => {
  const fields = [
    { label: "First Name *", name: "firstName", type: "text" },
    { label: "Last Name *", name: "lastName", type: "text" },
    { label: "Phone Number *", name: "phone", type: "tel" },
    { label: "Country *", name: "country", type: "text" },
    { label: "Address *", name: "address", type: "text" },
    { label: "Email *", name: "email", type: "email" },
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Billing Details</h3>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        {fields.map(({ label, name, type }) => (
          <div key={name} className="flex flex-col">
            <label className="text-sm font-medium mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={onChange}
              placeholder={label.replace(" *", "")}
              className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        ))}
      </form>
    </div>
  );
};

export default BillingForm;