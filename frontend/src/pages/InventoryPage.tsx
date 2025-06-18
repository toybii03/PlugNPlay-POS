import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useProducts } from "@/hooks/useProducts";
import DashboardLayout from "@/components/layout/DashboardLayout";

const InventoryPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const { products, isLoading, refetch } = useProducts({ search });

  const totalProducts = products.length;
  const lowStock = products.filter(
    (p: any) => (p.stock ?? p.quantity) <= (p.minStock ?? p.alert_quantity)
  ).length;
  const outOfStock = products.filter(
    (p: any) => (p.stock ?? p.quantity) === 0
  ).length;

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0)
      return { label: "Out of Stock", variant: "destructive" as const };
    if (stock <= minStock)
      return { label: "Low Stock", variant: "secondary" as const };
    return { label: "In Stock", variant: "default" as const };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor your product stock levels
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStock}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStock}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-6">
          <Input
            placeholder="Search products by name, SKU, or supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Min Stock</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product: any) => {
                  const status = getStockStatus(
                    product.stock ?? product.quantity,
                    product.minStock ?? product.alert_quantity
                  );
                  return (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>{product.stock ?? product.quantity}</TableCell>
                      <TableCell>
                        {product.minStock ?? product.alert_quantity}
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryPage;
