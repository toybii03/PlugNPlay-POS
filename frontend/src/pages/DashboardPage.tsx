import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import api from "@/services/api";

const DashboardPage: React.FC = () => {
  const { data, loading, error } = useDashboardStats();

  const [recentSales, setRecentSales] = useState<
    {
      id: string;
      customer: string;
      amount: number;
      time: string;
      status: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchRecentSales = async () => {
      try {
        const response = await api.get("/payments");
        const payments = response.data.data || [];
        const mappedSales = payments.map((payment: any) => {
          const dateObj = new Date(payment.date);
          const timeString = dateObj.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
          return {
            id: payment.id.toString(),
            customer: payment.customer,
            amount: Number(payment.amount) || 0,
            time: timeString,
            status:
              payment.method === "cash" ||
              payment.method === "card" ||
              payment.method === "gcash"
                ? "completed"
                : "pending",
          };
        });
        setRecentSales(mappedSales);
      } catch (error) {
        console.error("Failed to fetch recent sales:", error);
      }
    };
    fetchRecentSales();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div>Error loading dashboard data: {error}</div>;
  }

  const stats = {
    todaySales: Number(data.todays_sales_amount) || 0,
    todayTransactions: data.total_transactions || 0,
    totalProducts: data.total_products || 0,
    lowStockItems: data.low_stock_products ? data.low_stock_products.length : 0,
    totalCustomers: data.total_customers || 0,
  };

  const lowStockProducts = data.low_stock_products || [];
  const filteredLowStockProducts = lowStockProducts.filter(
    (product) => product.quantity <= product.alert_quantity
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Overview of your store performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <span className="text-lg font-bold text-green-600">₱</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₱{stats.todaySales.toFixed(2)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              +12.5% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayTransactions}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              +8.2% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {stats.lowStockItems} low stock items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              +5.1% this month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Recent Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {sale.status === "completed" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {sale.customer}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {sale.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      ₱{sale.amount.toFixed(2)}
                    </p>
                    <p
                      className={`text-xs ${
                        sale.status === "completed"
                          ? "text-green-600 dark:text-green-400"
                          : "text-yellow-600 dark:text-yellow-400"
                      }`}
                    >
                      {sale.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-orange-600">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredLowStockProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Min stock: {product.alert_quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      {product.quantity} left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
