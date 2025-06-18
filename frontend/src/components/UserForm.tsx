import React, { useState, useEffect } from "react";
import { User, CreateUserData, UpdateUserData } from "../services/UserService";

interface UserFormProps {
  user?: User;
  onSubmit: (data: CreateUserData | UpdateUserData) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
  const initialFormData: CreateUserData | UpdateUserData = user
    ? {
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role as "admin" | "cashier",
        password: "",
      }
    : {
        name: "",
        username: "",
        email: "",
        role: "cashier",
        password: "",
      };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(initialFormData);
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";

    if (!user) {
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto space-y-6 p-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {user ? "Edit User" : "Add New User"}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={!!user}
          className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
            errors.username ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.username && (
          <p className="text-sm text-red-500">{errors.username}</p>
        )}
      </div>

      {!user && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          disabled={!!user}
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="cashier">Cashier</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
        </select>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {user ? "Update" : "Create"} User
        </button>
      </div>
    </form>
  );
};

export default UserForm;
