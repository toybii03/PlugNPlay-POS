import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Plus, Edit, Trash2, Package } from "lucide-react";
import ProductForm from "@/components/products/ProductForm";
import { useProducts } from "@/hooks/useProducts";

const API_BASE_URL = "http://localhost:8000";

const ProductsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const { products, isLoading, createProduct, updateProduct, deleteProduct } =
    useProducts({
      search,
      // Removed low_stock filter to show all products by default
      // low_stock: true,
    });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // New state for delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);

  const categories = [
    "All",
    ...new Set(products.map((p) => p.category?.name || "")),
  ];

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  // Wrapper for createProduct to return a Promise
  const handleCreateProduct = (formData: FormData): Promise<void> => {
    return new Promise((resolve, reject) => {
      createProduct(formData, {
        onSuccess: () => resolve(),
        onError: (error) => reject(error),
      });
    });
  };

  // Wrapper for updateProduct to return a Promise
  const handleUpdateProduct = (formData: FormData): Promise<void> => {
    if (!editingProduct) return Promise.reject("No product selected");
    return new Promise((resolve, reject) => {
      updateProduct(
        { id: editingProduct.id, product: formData },
        {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        }
      );
    });
  };

  // Updated handleDelete to open modal
  const handleDeleteClick = (product: any) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  // Confirm delete handler
  const handleConfirmDelete = () => {
    if (!productToDelete) return;
    deleteProduct(productToDelete.id);
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  // Cancel delete handler
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const getStockStatus = (quantity: number, alert_quantity: number) => {
    if (quantity === 0)
      return { label: "Out of Stock", variant: "destructive" as const };
    if (quantity <= alert_quantity)
      return { label: "Low Stock", variant: "secondary" as const };
    return { label: "In Stock", variant: "default" as const };
  };

  return (
    <div
      className="space-y-6"
      data-id="lroeejyk6"
      data-path="src/pages/ProductsPage.tsx"
    >
      {/* Header */}
      <div
        className="flex justify-between items-center"
        data-id="z7sbwrl54"
        data-path="src/pages/ProductsPage.tsx"
      >
        <div data-id="xu4waojp6" data-path="src/pages/ProductsPage.tsx">
          <h1
            className="text-3xl font-bold text-gray-900 dark:text-white"
            data-id="2zwfy397e"
            data-path="src/pages/ProductsPage.tsx"
          >
            Products
          </h1>
          <p
            className="text-gray-600 dark:text-gray-400"
            data-id="ys66r0f07"
            data-path="src/pages/ProductsPage.tsx"
          >
            Manage your product inventory
          </p>
        </div>
        <div
          className="flex gap-4"
          data-id="tk5jwppoj"
          data-path="src/pages/ProductsPage.tsx"
        >
          <Input
            placeholder="Search products by name, barcode, or supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
            data-id="0zj2ymzg0"
            data-path="src/pages/ProductsPage.tsx"
          />
          <Button
            onClick={handleAdd}
            data-id="tk5jwppoj"
            data-path="src/pages/ProductsPage.tsx"
          >
            <Plus
              className="mr-2 h-4 w-4"
              data-id="0zj2ymzg0"
              data-path="src/pages/ProductsPage.tsx"
            />
            Add Product
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Deletion
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete{" "}
              <strong>{productToDelete?.name}</strong>? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancelDelete}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Deletion
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete{" "}
              <strong>{productToDelete?.name}</strong>? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancelDelete}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Deletion
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete{" "}
              <strong>{productToDelete?.name}</strong>? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancelDelete}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        data-id="ix4nw3shl"
        data-path="src/pages/ProductsPage.tsx"
      >
        <Card data-id="vbm9cgjew" data-path="src/pages/ProductsPage.tsx">
          <CardHeader
            className="flex flex-row items-center justify-between space-y-0 pb-2"
            data-id="84dxgszyh"
            data-path="src/pages/ProductsPage.tsx"
          >
            <CardTitle
              className="text-sm font-medium"
              data-id="tijlldw28"
              data-path="src/pages/ProductsPage.tsx"
            >
              Total Products
            </CardTitle>
            <Package
              className="h-4 w-4 text-muted-foreground"
              data-id="6htmxvauf"
              data-path="src/pages/ProductsPage.tsx"
            />
          </CardHeader>
          <CardContent
            data-id="30vkbxfob"
            data-path="src/pages/ProductsPage.tsx"
          >
            <div
              className="text-2xl font-bold"
              data-id="gbekvzwid"
              data-path="src/pages/ProductsPage.tsx"
            >
              {products.length}
            </div>
          </CardContent>
        </Card>
        <Card data-id="3mcrmxlbf" data-path="src/pages/ProductsPage.tsx">
          <CardHeader
            className="flex flex-row items-center justify-between space-y-0 pb-2"
            data-id="jnl4a2ai3"
            data-path="src/pages/ProductsPage.tsx"
          >
            <CardTitle
              className="text-sm font-medium"
              data-id="bubtxjdev"
              data-path="src/pages/ProductsPage.tsx"
            >
              Categories
            </CardTitle>
            <Package
              className="h-4 w-4 text-muted-foreground"
              data-id="alxz0i2ss"
              data-path="src/pages/ProductsPage.tsx"
            />
          </CardHeader>
          <CardContent
            data-id="tr3iew6om"
            data-path="src/pages/ProductsPage.tsx"
          >
            <div
              className="text-2xl font-bold"
              data-id="06tghil92"
              data-path="src/pages/ProductsPage.tsx"
            >
              {categories.length - 1}
            </div>
          </CardContent>
        </Card>
        <Card data-id="x1e0lw4v0" data-path="src/pages/ProductsPage.tsx">
          <CardHeader
            className="flex flex-row items-center justify-between space-y-0 pb-2"
            data-id="yb9oup6kk"
            data-path="src/pages/ProductsPage.tsx"
          >
            <CardTitle
              className="text-sm font-medium"
              data-id="sn0jmpi8x"
              data-path="src/pages/ProductsPage.tsx"
            >
              Low Stock Items
            </CardTitle>
            <Package
              className="h-4 w-4 text-muted-foreground"
              data-id="6l7l5g56i"
              data-path="src/pages/ProductsPage.tsx"
            />
          </CardHeader>
          <CardContent
            data-id="acu0pt40c"
            data-path="src/pages/ProductsPage.tsx"
          >
            <div
              className="text-2xl font-bold text-orange-600"
              data-id="0riswn5ch"
              data-path="src/pages/ProductsPage.tsx"
            >
              {products.filter((p) => p.quantity <= p.alert_quantity).length}
            </div>
          </CardContent>
        </Card>
        <Card data-id="bg9gu88du" data-path="src/pages/ProductsPage.tsx">
          <CardHeader
            className="flex flex-row items-center justify-between space-y-0 pb-2"
            data-id="r69dgtziu"
            data-path="src/pages/ProductsPage.tsx"
          >
            <CardTitle
              className="text-sm font-medium"
              data-id="6w6p3u6lx"
              data-path="src/pages/ProductsPage.tsx"
            >
              Total Value
            </CardTitle>
            <Package
              className="h-4 w-4 text-muted-foreground"
              data-id="rcn7x7zqt"
              data-path="src/pages/ProductsPage.tsx"
            />
          </CardHeader>
          <CardContent
            data-id="6lfr1iusy"
            data-path="src/pages/ProductsPage.tsx"
          >
            <div
              className="text-2xl font-bold"
              data-id="rvd2vlvwx"
              data-path="src/pages/ProductsPage.tsx"
            >
              ₱
              {products
                .reduce((sum, p) => sum + p.price * p.quantity, 0)
                .toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card data-id="gls6pxle1" data-path="src/pages/ProductsPage.tsx">
        <CardContent
          className="p-6"
          data-id="a616mumtb"
          data-path="src/pages/ProductsPage.tsx"
        >
          <div
            className="flex flex-col md:flex-row gap-4"
            data-id="js9nokka1"
            data-path="src/pages/ProductsPage.tsx"
          >
            <div
              className="relative flex-1"
              data-id="76yxc5n4d"
              data-path="src/pages/ProductsPage.tsx"
            >
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                data-id="a8cof9lah"
                data-path="src/pages/ProductsPage.tsx"
              />
              <Input
                placeholder="Search products by name, barcode, or supplier..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                data-id="rklf1y835"
                data-path="src/pages/ProductsPage.tsx"
              />
            </div>
            <div
              className="flex flex-wrap gap-2"
              data-id="u4ibxfw1b"
              data-path="src/pages/ProductsPage.tsx"
            >
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  data-id="se0shndoi"
                  data-path="src/pages/ProductsPage.tsx"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card data-id="frq1qtpp8" data-path="src/pages/ProductsPage.tsx">
        <CardHeader data-id="eor8nulld" data-path="src/pages/ProductsPage.tsx">
          <CardTitle data-id="rxokt4ojq" data-path="src/pages/ProductsPage.tsx">
            Product List
          </CardTitle>
        </CardHeader>
        <CardContent data-id="vndwxp00t" data-path="src/pages/ProductsPage.tsx">
          <Table data-id="su5mhhk8e" data-path="src/pages/ProductsPage.tsx">
            <TableHeader
              data-id="sn1v3juds"
              data-path="src/pages/ProductsPage.tsx"
            >
              <TableRow
                data-id="7xmoyo6fu"
                data-path="src/pages/ProductsPage.tsx"
              >
                <TableHead
                  data-id="5853zait9"
                  data-path="src/pages/ProductsPage.tsx"
                >
                  Product
                </TableHead>
                <TableHead
                  data-id="rl6ojcjla"
                  data-path="src/pages/ProductsPage.tsx"
                >
                  SKU
                </TableHead>
                <TableHead
                  data-id="hosn57mht"
                  data-path="src/pages/ProductsPage.tsx"
                >
                  Category
                </TableHead>
                <TableHead
                  data-id="gt01ib6vi"
                  data-path="src/pages/ProductsPage.tsx"
                >
                  Price
                </TableHead>
                <TableHead
                  data-id="bcp1h0zoy"
                  data-path="src/pages/ProductsPage.tsx"
                >
                  Stock
                </TableHead>
                <TableHead
                  data-id="04le5a2f8"
                  data-path="src/pages/ProductsPage.tsx"
                >
                  Status
                </TableHead>
                <TableHead
                  data-id="lg8mrf7c4"
                  data-path="src/pages/ProductsPage.tsx"
                >
                  {/* Supplier column removed */}
                </TableHead>
                <TableHead
                  className="text-right"
                  data-id="8jteh155f"
                  data-path="src/pages/ProductsPage.tsx"
                >
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody
              data-id="wls2lloif"
              data-path="src/pages/ProductsPage.tsx"
            >
              {products.map((product) => {
                const stockStatus = getStockStatus(
                  product.quantity,
                  product.alert_quantity
                );

                return (
                  <TableRow
                    key={product.id}
                    data-id="9hai70t5e"
                    data-path="src/pages/ProductsPage.tsx"
                  >
                    <TableCell
                      data-id="oiehuaps1"
                      data-path="src/pages/ProductsPage.tsx"
                    >
                      <div
                        className="flex items-center space-x-3"
                        data-id="u5sdrv9gp"
                        data-path="src/pages/ProductsPage.tsx"
                      >
                        <img
                          src={
                            product.image
                              ? `${API_BASE_URL}/storage/${product.image}`
                              : ""
                          }
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                          data-id="c2zvokx58"
                          data-path="src/pages/ProductsPage.tsx"
                        />

                        <div
                          data-id="0xi7a2xsw"
                          data-path="src/pages/ProductsPage.tsx"
                        >
                          <div
                            className="font-medium"
                            data-id="jke0700o8"
                            data-path="src/pages/ProductsPage.tsx"
                          >
                            {product.name}
                          </div>
                          <div
                            className="text-sm text-gray-500"
                            data-id="8pdl0dd23"
                            data-path="src/pages/ProductsPage.tsx"
                          >
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      className="font-mono text-sm"
                      data-id="p6l3dxicr"
                      data-path="src/pages/ProductsPage.tsx"
                    >
                      {product.sku}
                    </TableCell>
                    <TableCell
                      data-id="eo4xz1npo"
                      data-path="src/pages/ProductsPage.tsx"
                    >
                      <Badge
                        variant="outline"
                        data-id="jq9e9ylko"
                        data-path="src/pages/ProductsPage.tsx"
                      >
                        {product.category?.name || ""}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className="font-medium"
                      data-id="qnmerzkor"
                      data-path="src/pages/ProductsPage.tsx"
                    >
                      ₱{Number(product.price).toFixed(2)}
                    </TableCell>
                    <TableCell
                      data-id="5w1o68dx4"
                      data-path="src/pages/ProductsPage.tsx"
                    >
                      <div
                        className="text-sm"
                        data-id="or1dvvwoh"
                        data-path="src/pages/ProductsPage.tsx"
                      >
                        <div
                          data-id="q7xne8qoc"
                          data-path="src/pages/ProductsPage.tsx"
                        >
                          {product.quantity} units
                        </div>
                        <div
                          className="text-gray-500"
                          data-id="ag37l97mg"
                          data-path="src/pages/ProductsPage.tsx"
                        >
                          Min: {product.alert_quantity}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      data-id="imeungwbf"
                      data-path="src/pages/ProductsPage.tsx"
                    >
                      <Badge
                        variant={stockStatus.variant}
                        data-id="cw15eljqo"
                        data-path="src/pages/ProductsPage.tsx"
                      >
                        {stockStatus.label}
                      </Badge>
                    </TableCell>
                    <TableCell
                      data-id="srbqzbede"
                      data-path="src/pages/ProductsPage.tsx"
                    >
                      {/* Supplier cell removed */}
                    </TableCell>
                    <TableCell
                      className="text-right"
                      data-id="3a0uma1kh"
                      data-path="src/pages/ProductsPage.tsx"
                    >
                      <div
                        className="flex justify-end space-x-2"
                        data-id="ej22wys0y"
                        data-path="src/pages/ProductsPage.tsx"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          data-id="mopqs1u65"
                          data-path="src/pages/ProductsPage.tsx"
                        >
                          <Edit
                            className="h-4 w-4"
                            data-id="9d86frv71"
                            data-path="src/pages/ProductsPage.tsx"
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(product)}
                          className="text-red-600 hover:text-red-700"
                          data-id="pkx4swdod"
                          data-path="src/pages/ProductsPage.tsx"
                        >
                          <Trash2
                            className="h-4 w-4"
                            data-id="3ph1abs6i"
                            data-path="src/pages/ProductsPage.tsx"
                          />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Product Form Dialog */}
      <Dialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        data-id="ywjel4xvl"
        data-path="src/pages/ProductsPage.tsx"
      >
        <DialogContent
          className="max-w-2xl max-h-[80vh] overflow-auto"
          data-id="g3nymkg98"
          data-path="src/pages/ProductsPage.tsx"
        >
          <DialogHeader
            data-id="tvdy75b5a"
            data-path="src/pages/ProductsPage.tsx"
          >
            <DialogTitle
              data-id="uvmjzscrd"
              data-path="src/pages/ProductsPage.tsx"
            >
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            onClose={() => setIsFormOpen(false)}
            onSubmit={
              editingProduct ? handleUpdateProduct : handleCreateProduct
            }
            data-id="p64yoayku"
            data-path="src/pages/ProductsPage.tsx"
          />
        </DialogContent>
      </Dialog>
    </div>
  );

  {
    /* Delete Confirmation Modal */
  }
  {
    showDeleteModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Confirm Deletion
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Are you sure you want to delete{" "}
            <strong>{productToDelete?.name}</strong>? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    );
  }
};

export default ProductsPage;
