import { useState, useEffect } from "react";
import api from "@/services/api";

interface SalesStats {
  todaySales: number;
  todayTransactions: number;
  totalProducts: number;
  lowStockItems: number;
  totalCustomers: number;
}

interface LowStockProduct {
  id: number;
  name: string;
  quantity: number;
  alert_quantity: number;
}

interface Feedback {
  id: number;
  customer: {
    id: number;
    name: string;
  };
  order: any;
  rating: number;
  comment: string;
  created_at: string;
}

interface DashboardData {
  sales_stats: SalesStats | null;
  low_stock_products: LowStockProduct[];
  recent_feedback: Feedback[];
  total_transactions?: number;
  total_products?: number;
  total_customers?: number;
  todays_sales_amount?: number;
}

export function useDashboardStats() {
  const [data, setData] = useState<DashboardData>({
    sales_stats: null,
    low_stock_products: [],
    recent_feedback: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        const response = await api.get("/analytics/dashboard");
        if (response.data.success) {
          setData(response.data.data);
        } else {
          setError("Failed to fetch dashboard stats");
        }
      } catch (err: any) {
        console.error("Dashboard stats fetch error:", err);
        setError(err.message || "Error fetching dashboard stats");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardStats();
  }, []);

  return { data, loading, error };
}
