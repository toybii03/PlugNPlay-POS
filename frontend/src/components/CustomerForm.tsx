import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";

interface CustomerFormProps {
  customer?: any;
  onSubmit: (data: { phone: string }) => void;
  onCancel: () => void;
  readOnlyName?: string;
  readOnlyEmail?: string;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  customer,
  onSubmit,
  onCancel,
  readOnlyName,
  readOnlyEmail,
}) => {
  const [phone, setPhone] = useState(customer?.phone || "");
  const [error, setError] = useState("");

  useEffect(() => {
    setPhone(customer?.phone || "");
    setError("");
  }, [customer]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError("Phone number is required");
      return;
    }
    onSubmit({ phone });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h2 className="text-xl font-semibold">
        {customer ? "Edit Customer Phone" : "Add Customer Phone"}
      </h2>
      {readOnlyName && (
        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={readOnlyName}
            readOnly
            className="w-full border rounded px-2 py-1 bg-gray-100 cursor-not-allowed"
          />
        </div>
      )}
      {readOnlyEmail && (
        <div>
          <label htmlFor="email" className="block font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={readOnlyEmail}
            readOnly
            className="w-full border rounded px-2 py-1 bg-gray-100 cursor-not-allowed"
          />
        </div>
      )}
      <div>
        <label htmlFor="phone" className="block font-medium mb-1">
          Phone Number *
        </label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={phone}
          onChange={handleChange}
          className={`w-full border rounded px-2 py-1 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          required
        />
        {error && <p className="text-red-600 mt-1">{error}</p>}
      </div>
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {customer ? "Update" : "Add"}
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;
