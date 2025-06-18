import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import api from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DashboardStats {
  sales_stats: {
    total_sales: number;
    total_orders: number;
    average_order_value: number;
  };
  low_stock_products: Array<{
    id: string;
    name: string;
    quantity: number;
    alert_quantity: number;
  }>;
  recent_feedback: Array<{
    id: string;
    rating: number;
    comment: string;
    customer: {
      name: string;
    };
  }>;
}

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, [dateRange]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get("/analytics/dashboard", {
        params: {
          start_date: dateRange.from.toISOString(),
          end_date: dateRange.to.toISOString(),
        },
      });
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!stats) {
    return <div>No data available</div>;
  }

  const salesData = {
    labels: ["Total Sales", "Total Orders", "Average Order Value"],
    datasets: [
      {
        label: "Sales Metrics",
        data: [
          stats.sales_stats.total_sales,
          stats.sales_stats.total_orders,
          stats.sales_stats.average_order_value,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
      },
    ],
  };

  const feedbackData = {
    labels: stats.recent_feedback.map((f) => f.customer.name),
    datasets: [
      {
        label: "Customer Ratings",
        data: stats.recent_feedback.map((f) => f.rating),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={salesData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <Pie data={feedbackData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.low_stock_products.map((product) => (
                <div
                  key={product.id}
                  className="flex justify-between items-center p-2 bg-red-50 rounded"
                >
                  <span>{product.name}</span>
                  <span className="text-red-600">
                    {product.quantity} / {product.alert_quantity}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
