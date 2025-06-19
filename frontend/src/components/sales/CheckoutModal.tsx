import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import {
  CreditCard,
  DollarSign,
  Smartphone,
  Printer,
  CheckCircle,
} from "lucide-react";
import { recordPayment } from "@/services/paymentService";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { items, total, subtotal, tax, clearCart } = useCart();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "digital">("cash");
  const [cashReceived, setCashReceived] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [discountAmount, setDiscountAmount] = useState<string>("0");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("fixed");

  // Calculate discount value
  const calculateDiscount = () => {
    const discountValue = parseFloat(discountAmount) || 0;
    if (discountType === "percentage") {
      return (subtotal * discountValue) / 100;
    }
    return discountValue;
  };

  // Calculate final total with discount
  const discount = calculateDiscount();
  const finalSubtotal = subtotal - discount;
  const finalTax = (finalSubtotal * 0.08); // 8% tax
  const finalTotal = finalSubtotal + finalTax;

  const change = parseFloat(cashReceived) - finalTotal;

  const handlePayment = async () => {
    if (paymentMethod === "cash" && parseFloat(cashReceived) < finalTotal) {
      toast({
        title: "Insufficient Payment",
        description: "Cash received is less than the total amount.",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === "card" && cardNumber.length < 4) {
      toast({
        title: "Invalid Card",
        description: "Please enter a valid card number.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Save customer first
      let customerId = null;
      if (customerName || customerPhone || customerEmail) {
        const customerResponse = await fetch("/api/customers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: customerName,
            phone: customerPhone,
            email: customerEmail,
          }),
        });
        const customerData = await customerResponse.json();
        customerId = customerData.id;
      }

      const paymentResponse = await recordPayment({
        subtotal: finalSubtotal,
        tax: finalTax,
        discount,
        total: finalTotal,
        paid_amount: paymentMethod === "cash" ? parseFloat(cashReceived) : finalTotal,
        due_amount: paymentMethod === "cash" ? parseFloat(cashReceived) - finalTotal : 0,
        payment_method: paymentMethod === "digital" ? "gcash" : paymentMethod,
        customer_id: customerId,
        status: "completed",
        notes: `Customer: ${customerName || "N/A"}, Phone: ${customerPhone || "N/A"}, Email: ${customerEmail || "N/A"}, Customer ID: ${customerId || "N/A"}`,
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
        })),
      });

      // Send receipt data to Make.com webhook
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        
        if (!paymentResponse.data || !paymentResponse.data.id) {
          console.error("Invalid payment response:", paymentResponse);
          throw new Error("Payment response is missing data or ID");
        }

        // Format currency for better display
        const formatCurrency = (amount: number) => {
          return Number(amount).toFixed(2);
        };

        // Calculate change amount
        const changeAmount = paymentMethod === "cash" 
          ? Math.max(0, parseFloat(cashReceived) - finalTotal)
          : 0;

        const itemsList = items.map(item => ({
          name: item.name,
          qty: item.quantity,
          price: formatCurrency(Number(item.price)),
          total: formatCurrency(Number(item.quantity) * Number(item.price))
        }));

        const webhookData = {
          transaction_id: paymentResponse.data.id,
          date: new Date().toLocaleString(),
          cashier_name: user.name || "Super Vincent",
          payment_method: paymentMethod.toUpperCase(),
          amount_paid: formatCurrency(paymentMethod === "cash" ? parseFloat(cashReceived) : finalTotal),
          change_amount: formatCurrency(changeAmount),
          customer_name: customerName || "N/A",
          customer_email: customerEmail || "N/A",
          customer_phone: customerPhone || "N/A",
          items: itemsList,
          subtotal: formatCurrency(subtotal),
          discount_type: discountType,
          discount_amount: formatCurrency(parseFloat(discountAmount) || 0),
          discount_value: formatCurrency(discount),
          tax: formatCurrency(finalTax),
          total: formatCurrency(finalTotal),
          to_email: customerEmail || "*",
          subject: `Receipt for Transaction #${paymentResponse.data.id}`
        };

        console.log("Sending webhook data:", webhookData);

        const webhookResponse = await fetch("https://hook.us2.make.com/v73220t1pq8in6cctxbb8noh3g1wl2uc", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(webhookData),
        });

        const responseText = await webhookResponse.text();
        console.log("Webhook response status:", webhookResponse.status);
        console.log("Webhook response body:", responseText);

        if (!webhookResponse.ok) {
          throw new Error(`Webhook failed with status: ${webhookResponse.status}, response: ${responseText}`);
        }

        toast({
          title: "Payment Successful",
          description: `Transaction #${paymentResponse.data.id} completed. Receipt sent to ${customerEmail || "system"}`,
        });

        console.log("Receipt sent successfully");
      } catch (error) {
        console.error("Failed to send receipt to Make.com:", error);
        toast({
          title: "Warning",
          description: "Payment successful but failed to send receipt. Please check the system logs.",
          variant: "destructive",
        });
      }

      toast({
        title: "Payment Successful",
        description: `Transaction ID: ${paymentResponse.data.id}. Receipt printed.`,
      });

      clearCart();
      onClose();
      resetForm();
    } catch (error) {
      toast({
        title: "Payment Failed",
        description:
          error.response?.data?.message ||
          "An error occurred while processing payment.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setCashReceived("");
    setCardNumber("");
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setPaymentMethod("cash");
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
      resetForm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Checkout
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Summary */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Order Summary</h3>

            <div className="space-y-3 max-h-60 overflow-y-auto border rounded-lg p-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">${Number(item.price).toFixed(2)} × {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium">₱{(Number(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-3 border-t">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>₱{subtotal.toFixed(2)}</span>
              </div>

              {/* Discount Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <select 
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as "percentage" | "fixed")}
                    className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="fixed">Fixed (₱)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                  <Input
                    type="number"
                    min="0"
                    step={discountType === "percentage" ? "1" : "0.01"}
                    max={discountType === "percentage" ? "100" : undefined}
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(e.target.value)}
                    placeholder={discountType === "percentage" ? "Discount %" : "Discount amount"}
                    className="flex-1"
                  />
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-₱{discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Tax (8%):</span>
                <span>₱{finalTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span className="text-gray-600">Total:</span>
                <span>₱{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Payment Method</h3>

            <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="cash">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Cash
                </TabsTrigger>
                <TabsTrigger value="card">
                  <CreditCard className="h-4 w-4 mr-1" />
                  Card
                </TabsTrigger>
                <TabsTrigger value="digital">
                  <Smartphone className="h-4 w-4 mr-1" />
                  Digital
                </TabsTrigger>
              </TabsList>

              <TabsContent value="cash" className="space-y-4">
                <div>
                  <Label htmlFor="cashReceived">Cash Received</Label>
                  <Input
                    id="cashReceived"
                    type="number"
                    step="0.01"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    placeholder="Enter amount received"
                    className="text-lg h-12"
                  />
                </div>
                {cashReceived && parseFloat(cashReceived) >= finalTotal && (
                  <div className="p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-green-800 dark:text-green-200 font-medium">Change:</span>
                      <span className="text-lg font-bold text-green-800 dark:text-green-200">₱{change.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="card" className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="**** **** **** 1234"
                    className="text-lg h-12"
                  />
                </div>
                <Badge variant="outline" className="w-full justify-center py-2">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Card Terminal Ready
                </Badge>
              </TabsContent>

              <TabsContent value="digital" className="space-y-4">
                <div className="text-center space-y-4">
                  <div className="p-8 border-2 border-dashed rounded-lg">
                    <Smartphone className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Show QR code to customer</p>
                  </div>
                  <Badge variant="outline" className="w-full justify-center py-2">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Digital Payment Ready
                  </Badge>
                </div>
              </TabsContent>
            </Tabs>

            {/* Customer Information */}
            <div className="space-y-3">
              <h4 className="font-medium">Customer Information (Optional)</h4>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label htmlFor="customerName">Name</Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Customer name"
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Phone</Label>
                  <Input
                    id="customerPhone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Customer phone"
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Customer email"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button variant="outline" onClick={handleClose} disabled={isProcessing} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handlePayment} disabled={isProcessing || items.length === 0} className="flex-1">
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Printer className="h-4 w-4 mr-2" />
                    Complete Sale
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
