import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingCart,
  Package,
  Users,
  DollarSign,
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
        // Map payments to recentSales format
        const mappedSales = payments.map((payment: any) => {
          // Format time from date string to "hh:mm AM/PM"
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
    <div
      className="space-y-6"
      data-id="8x9bxykb2"
      data-path="src/pages/DashboardPage.tsx"
    >
      {/* Header */}
      <div data-id="6xhup0lpp" data-path="src/pages/DashboardPage.tsx">
        <h1
          className="text-3xl font-bold text-gray-900 dark:text-white"
          data-id="t5iov2lyj"
          data-path="src/pages/DashboardPage.tsx"
        >
          Dashboard
        </h1>
        <p
          className="text-gray-600 dark:text-gray-400"
          data-id="nyv0xokrg"
          data-path="src/pages/DashboardPage.tsx"
        >
          Overview of your store performance
        </p>
      </div>

      {/* Stats Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        data-id="e7ogxq9ka"
        data-path="src/pages/DashboardPage.tsx"
      >
        <Card data-id="bm4z4lslk" data-path="src/pages/DashboardPage.tsx">
          <CardHeader
            className="flex flex-row items-center justify-between space-y-0 pb-2"
            data-id="6og1oovut"
            data-path="src/pages/DashboardPage.tsx"
          >
            <CardTitle
              className="text-sm font-medium"
              data-id="royd7z1ek"
              data-path="src/pages/DashboardPage.tsx"
            >
              Today's Sales
            </CardTitle>
            <DollarSign
              className="h-4 w-4 text-green-600"
              data-id="i29plo93f"
              data-path="src/pages/DashboardPage.tsx"
            />
          </CardHeader>
          <CardContent
            data-id="ya9e3i7zz"
            data-path="src/pages/DashboardPage.tsx"
          >
            <div
              className="text-2xl font-bold"
              data-id="t1p0gwlmb"
              data-path="src/pages/DashboardPage.tsx"
            >
              ₱{stats.todaySales.toFixed(2)}
            </div>
            <p
              className="text-xs text-gray-500 dark:text-gray-400"
              data-id="2aaqxlkcg"
              data-path="src/pages/DashboardPage.tsx"
            >
              +12.5% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card data-id="vduhj3stw" data-path="src/pages/DashboardPage.tsx">
          <CardHeader
            className="flex flex-row items-center justify-between space-y-0 pb-2"
            data-id="ono307yp3"
            data-path="src/pages/DashboardPage.tsx"
          >
            <CardTitle
              className="text-sm font-medium"
              data-id="y4qbz241r"
              data-path="src/pages/DashboardPage.tsx"
            >
              Transactions
            </CardTitle>
            <ShoppingCart
              className="h-4 w-4 text-blue-600"
              data-id="h8hzfkpby"
              data-path="src/pages/DashboardPage.tsx"
            />
          </CardHeader>
          <CardContent
            data-id="f68p8ggr6"
            data-path="src/pages/DashboardPage.tsx"
          >
            <div
              className="text-2xl font-bold"
              data-id="uiji4krz8"
              data-path="src/pages/DashboardPage.tsx"
            >
              {stats.todayTransactions}
            </div>
            <p
              className="text-xs text-gray-500 dark:text-gray-400"
              data-id="qfbyzvuva"
              data-path="src/pages/DashboardPage.tsx"
            >
              +8.2% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card data-id="bd76dmvmd" data-path="src/pages/DashboardPage.tsx">
          <CardHeader
            className="flex flex-row items-center justify-between space-y-0 pb-2"
            data-id="sew4m7h3s"
            data-path="src/pages/DashboardPage.tsx"
          >
            <CardTitle
              className="text-sm font-medium"
              data-id="sehdnnid5"
              data-path="src/pages/DashboardPage.tsx"
            >
              Total Products
            </CardTitle>
            <Package
              className="h-4 w-4 text-purple-600"
              data-id="tfz5k8q34"
              data-path="src/pages/DashboardPage.tsx"
            />
          </CardHeader>
          <CardContent
            data-id="ya7uviyfr"
            data-path="src/pages/DashboardPage.tsx"
          >
            <div
              className="text-2xl font-bold"
              data-id="vhhz9kzw2"
              data-path="src/pages/DashboardPage.tsx"
            >
              {stats.totalProducts}
            </div>
            <p
              className="text-xs text-gray-500 dark:text-gray-400"
              data-id="d6x5hso8x"
              data-path="src/pages/DashboardPage.tsx"
            >
              {stats.lowStockItems} low stock items
            </p>
          </CardContent>
        </Card>

        <Card data-id="tgkkj61j7" data-path="src/pages/DashboardPage.tsx">
          <CardHeader
            className="flex flex-row items-center justify-between space-y-0 pb-2"
            data-id="eoihpzzuf"
            data-path="src/pages/DashboardPage.tsx"
          >
            <CardTitle
              className="text-sm font-medium"
              data-id="r5u585n8x"
              data-path="src/pages/DashboardPage.tsx"
            >
              Customers
            </CardTitle>
            <Users
              className="h-4 w-4 text-orange-600"
              data-id="zys3a90bb"
              data-path="src/pages/DashboardPage.tsx"
            />
          </CardHeader>
          <CardContent
            data-id="m66quzjs7"
            data-path="src/pages/DashboardPage.tsx"
          >
            <div
              className="text-2xl font-bold"
              data-id="7023pfcdb"
              data-path="src/pages/DashboardPage.tsx"
            >
              {stats.totalCustomers}
            </div>
            <p
              className="text-xs text-gray-500 dark:text-gray-400"
              data-id="74xfj06du"
              data-path="src/pages/DashboardPage.tsx"
            >
              +5.1% this month
            </p>
          </CardContent>
        </Card>
      </div>

      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        data-id="fvio2mxpq"
        data-path="src/pages/DashboardPage.tsx"
      >
        {/* Recent Sales */}
        <Card data-id="4vw5s7ryg" data-path="src/pages/DashboardPage.tsx">
          <CardHeader
            data-id="9epfwrrek"
            data-path="src/pages/DashboardPage.tsx"
          >
            <CardTitle
              className="flex items-center"
              data-id="b9c6xkvw9"
              data-path="src/pages/DashboardPage.tsx"
            >
              <Clock
                className="mr-2 h-5 w-5"
                data-id="qgi6u9edj"
                data-path="src/pages/DashboardPage.tsx"
              />
              Recent Sales
            </CardTitle>
          </CardHeader>
          <CardContent
            data-id="65cqijh1r"
            data-path="src/pages/DashboardPage.tsx"
          >
            <div
              className="space-y-4"
              data-id="rtmpdjoio"
              data-path="src/pages/DashboardPage.tsx"
            >
              {recentSales.map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between"
                  data-id="rhw56usih"
                  data-path="src/pages/DashboardPage.tsx"
                >
                  <div
                    className="flex items-center space-x-3"
                    data-id="6p3fuk5nt"
                    data-path="src/pages/DashboardPage.tsx"
                  >
                    <div
                      className="flex-shrink-0"
                      data-id="5xm6eivcf"
                      data-path="src/pages/DashboardPage.tsx"
                    >
                      {sale.status === "completed" ? (
                        <CheckCircle
                          className="h-5 w-5 text-green-500"
                          data-id="7ibkz3p28"
                          data-path="src/pages/DashboardPage.tsx"
                        />
                      ) : (
                        <Clock
                          className="h-5 w-5 text-yellow-500"
                          data-id="j0fq6h3mg"
                          data-path="src/pages/DashboardPage.tsx"
                        />
                      )}
                    </div>
                    <div
                      data-id="eephrxxd1"
                      data-path="src/pages/DashboardPage.tsx"
                    >
                      <p
                        className="text-sm font-medium text-gray-900 dark:text-white"
                        data-id="d0qc3u2e3"
                        data-path="src/pages/DashboardPage.tsx"
                      >
                        {sale.customer}
                      </p>
                      <p
                        className="text-xs text-gray-500 dark:text-gray-400"
                        data-id="a73phsjel"
                        data-path="src/pages/DashboardPage.tsx"
                      >
                        {sale.time}
                      </p>
                    </div>
                  </div>
                  <div
                    className="text-right"
                    data-id="4ykxoihqr"
                    data-path="src/pages/DashboardPage.tsx"
                  >
                    <p
                      className="text-sm font-medium text-gray-900 dark:text-white"
                      data-id="erv8g4v3j"
                      data-path="src/pages/DashboardPage.tsx"
                    >
                      ₱{sale.amount.toFixed(2)}
                    </p>
                    <p
                      className={`text-xs ${
                        sale.status === "completed"
                          ? "text-green-600 dark:text-green-400"
                          : "text-yellow-600 dark:text-yellow-400"
                      }`}
                      data-id="zfd6s09ie"
                      data-path="src/pages/DashboardPage.tsx"
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
        <Card data-id="iyr87xb7t" data-path="src/pages/DashboardPage.tsx">
          <CardHeader
            data-id="8yn7o5p28"
            data-path="src/pages/DashboardPage.tsx"
          >
            <CardTitle
              className="flex items-center text-orange-600"
              data-id="q0k5spqk6"
              data-path="src/pages/DashboardPage.tsx"
            >
              <AlertTriangle
                className="mr-2 h-5 w-5"
                data-id="zqwveudvj"
                data-path="src/pages/DashboardPage.tsx"
              />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent
            data-id="z15879c4d"
            data-path="src/pages/DashboardPage.tsx"
          >
            <div
              className="space-y-4"
              data-id="0nb69y60v"
              data-path="src/pages/DashboardPage.tsx"
            >
              {filteredLowStockProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between"
                  data-id="8ediqulxl"
                  data-path="src/pages/DashboardPage.tsx"
                >
                  <div
                    data-id="g1kkpo3j9"
                    data-path="src/pages/DashboardPage.tsx"
                  >
                    <p
                      className="text-sm font-medium text-gray-900 dark:text-white"
                      data-id="66wmphn61"
                      data-path="src/pages/DashboardPage.tsx"
                    >
                      {product.name}
                    </p>
                    <p
                      className="text-xs text-gray-500 dark:text-gray-400"
                      data-id="wa9g23qfw"
                      data-path="src/pages/DashboardPage.tsx"
                    >
                      Min stock: {product.alert_quantity}
                    </p>
                  </div>
                  <div
                    className="text-right"
                    data-id="ssk2yxdg2"
                    data-path="src/pages/DashboardPage.tsx"
                  >
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      data-id="0f1m0x1ha"
                      data-path="src/pages/DashboardPage.tsx"
                    >
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
