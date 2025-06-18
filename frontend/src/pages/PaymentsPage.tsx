import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/services/api";

const PaymentsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const response = await api.get("/payments");
        setPayments(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch payments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(
    (payment) =>
      payment.customer?.toLowerCase().includes(search.toLowerCase()) ||
      payment.id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payments</h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and manage all payment transactions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search by customer or transaction ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4"
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.id}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>{payment.customer}</TableCell>
                  <TableCell>
                    ₱
                    {payment.amount.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>{payment.method}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsPage;
