import api from "./api";

export interface PaymentData {
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paid_amount: number;
  due_amount: number;
  payment_method: "cash" | "card" | "gcash";
  customer_id?: number | null;
  status: "pending" | "completed" | "failed";
  notes?: string;
}

export async function recordPayment(
  paymentData: PaymentData & { items: any[] }
) {
  try {
    const response = await api.post("/payments", {
      subtotal: paymentData.subtotal,
      tax: paymentData.tax,
      discount: paymentData.discount,
      total: paymentData.total,
      paid_amount: paymentData.paid_amount,
      due_amount: paymentData.due_amount,
      payment_method: paymentData.payment_method,
      customer_id: paymentData.customer_id || null,
      status: paymentData.status,
      notes: paymentData.notes || null,
      items: paymentData.items,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
