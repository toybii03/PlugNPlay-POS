import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";

interface ProductFormProps {
  product?: any;
  onSubmit: (formData: FormData) => Promise<void>;
  onClose: () => void;
}

const BASE_IMAGE_URL = "http://localhost:8000/storage/";

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onClose,
}) => {
  const [formValues, setFormValues] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    cost_price: "",
    quantity: "",
    alert_quantity: "",
    category_id: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEdit = Boolean(product);

  useEffect(() => {
    if (product) {
      setFormValues({
        name: product.name || "",
        sku: product.sku || "",
        description: product.description || "",
        price: product.price || "",
        cost_price: product.cost_price || "",
        quantity: product.quantity || "",
        alert_quantity: product.alert_quantity || "",
        category_id: product.category_id || "",
      });
      setImagePreview(product.image ? `${BASE_IMAGE_URL}${product.image}` : "");
    }
  }, [product]);

  const generateSku = (name: string) => {
    const random = Math.floor(1000 + Math.random() * 9000); // 4-digit number
    return (
      name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "")
        .substring(0, 10) +
      "-" +
      random
    );
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Automatically generate SKU on name change (only in add mode)
    if (name === "name" && !isEdit) {
      setFormValues((prev) => ({
        ...prev,
        name: value,
        sku: generateSku(value),
      }));
    } else {
      setFormValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData();
    formData.append("name", formValues.name);
    formData.append("sku", formValues.sku);
    formData.append("description", formValues.description);
    formData.append("price", formValues.price.toString());
    formData.append("cost_price", formValues.cost_price.toString());
    formData.append("quantity", formValues.quantity.toString());
    formData.append("alert_quantity", formValues.alert_quantity.toString());
    formData.append("category_id", formValues.category_id);
    formData.append("is_active", "1"); // always active

    if (imageFile) {
      formData.append("image", imageFile);
    }

    // Trick Laravel into accepting PUT/PATCH using POST
    if (isEdit) {
      formData.append("_method", "PUT");
    }

    try {
      await onSubmit(formData); // Your component decides the endpoint (e.g. `/api/products/${id}`)
      onClose();
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: "Failed to save product. Please try again." });
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      encType="multipart/form-data"
    >
      {errors.general && <div className="text-red-600">{errors.general}</div>}

      {/* Name */}
      <div>
        <label className="block font-medium">Name *</label>
        <input
          type="text"
          name="name"
          value={formValues.name}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          required
          readOnly={isEdit}
        />
        {errors.name && <p className="text-red-600">{errors.name}</p>}
      </div>

      {/* SKU (read-only) */}
      <div>
        <label className="block font-medium">SKU *</label>
        <input
          type="text"
          name="sku"
          value={formValues.sku}
          readOnly
          className="w-full border rounded px-2 py-1 bg-gray-100"
          required
        />
        {errors.sku && <p className="text-red-600">{errors.sku}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block font-medium">Description *</label>
        <textarea
          name="description"
          value={formValues.description}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          required
          readOnly={isEdit}
        />
        {errors.description && (
          <p className="text-red-600">{errors.description}</p>
        )}
      </div>

      {/* Price */}
      <div>
        <label className="block font-medium">Price *</label>
        <input
          type="number"
          name="price"
          value={formValues.price}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          step="0.01"
          min="0"
          required
          readOnly={isEdit}
        />
        {errors.price && <p className="text-red-600">{errors.price}</p>}
      </div>

      {/* Cost Price */}
      <div>
        <label className="block font-medium">Cost Price *</label>
        <input
          type="number"
          name="cost_price"
          value={formValues.cost_price}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          step="0.01"
          min="0"
          required
          readOnly={isEdit}
        />
        {errors.cost_price && (
          <p className="text-red-600">{errors.cost_price}</p>
        )}
      </div>

      {/* Quantity */}
      <div>
        <label className="block font-medium">Stock (Quantity) *</label>
        <input
          type="number"
          name="quantity"
          value={formValues.quantity}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          min="0"
          required
        />
        {errors.quantity && <p className="text-red-600">{errors.quantity}</p>}
      </div>

      {/* Alert Quantity */}
      <div>
        <label className="block font-medium">
          Minimum Stock (Alert Quantity) *
        </label>
        <input
          type="number"
          name="alert_quantity"
          value={formValues.alert_quantity}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          min="0"
          required
          readOnly={isEdit}
        />
        {errors.alert_quantity && (
          <p className="text-red-600">{errors.alert_quantity}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block font-medium">Category *</label>
        <select
          name="category_id"
          value={formValues.category_id}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          disabled={isEdit}
          required
        >
          <option value="">Select a category</option>
          <option value="1">Default Category</option>
        </select>
        {errors.category_id && (
          <p className="text-red-600">{errors.category_id}</p>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block font-medium">Product Image</label>
        {!isEdit && (
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
        )}
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Product Preview"
            className="mt-2 max-h-40 object-contain"
          />
        )}
        {errors.image && <p className="text-red-600">{errors.image}</p>}
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {isEdit ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
