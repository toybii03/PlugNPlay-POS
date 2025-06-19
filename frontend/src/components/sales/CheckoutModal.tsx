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
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "card" | "digital"
  >("cash");
  const [cashReceived, setCashReceived] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const change = parseFloat(cashReceived) - total;

  const handlePayment = async () => {
    if (paymentMethod === "cash" && parseFloat(cashReceived) < total) {
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
        subtotal,
        tax,
        discount: 0,
        total,
        paid_amount:
          paymentMethod === "cash" ? parseFloat(cashReceived) : total,
        due_amount:
          paymentMethod === "cash" ? parseFloat(cashReceived) - total : 0,
        payment_method: paymentMethod === "digital" ? "gcash" : paymentMethod,
        customer_id: customerId,
        status: "completed",
        notes: `Customer: ${customerName || "N/A"}, Phone: ${
          customerPhone || "N/A"
        }, Email: ${customerEmail || "N/A"}, Customer ID: ${
          customerId || "N/A"
        }`,
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
          return Number(amount).toFixed(2);  // Return just the number for Make.com
        };

        // Calculate change amount
        const changeAmount = paymentMethod === "cash" 
          ? Math.max(0, parseFloat(cashReceived) - total)
          : 0;

        // Create items array first for debugging
        const itemsList = items.map(item => ({
          name: item.name,
          qty: item.quantity,
          price: formatCurrency(Number(item.price)),
          total: formatCurrency(Number(item.quantity) * Number(item.price))
        }));

        console.log("Items list:", itemsList);

        const webhookData = {
          transaction_id: paymentResponse.data.id,
          date: new Date().toLocaleString(),
          cashier_name: user.name || "Unknown",
          payment_method: paymentMethod.toUpperCase(),
          amount_paid: formatCurrency(paymentMethod === "cash" ? parseFloat(cashReceived) : total),
          change_amount: formatCurrency(changeAmount),
          customer_name: customerName || "N/A",
          customer_email: customerEmail || "N/A",
          customer_phone: customerPhone || "N/A",
          items: itemsList,
          subtotal: formatCurrency(subtotal),
          tax: formatCurrency(tax),
          total: formatCurrency(total),
          to_email: customerEmail || "*",  // Use customer email or fallback
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
    <Dialog
      open={isOpen}
      onOpenChange={handleClose}
      data-id="7bd6tx1gp"
      data-path="src/components/sales/CheckoutModal.tsx"
    >
      <DialogContent
        className="max-w-2xl"
        data-id="bz9rhi0ir"
        data-path="src/components/sales/CheckoutModal.tsx"
      >
        <DialogHeader
          data-id="2ah8g7g27"
          data-path="src/components/sales/CheckoutModal.tsx"
        >
          <DialogTitle
            className="flex items-center"
            data-id="pwlo7iir3"
            data-path="src/components/sales/CheckoutModal.tsx"
          >
            <CreditCard
              className="mr-2 h-5 w-5"
              data-id="140su75ky"
              data-path="src/components/sales/CheckoutModal.tsx"
            />
            Checkout
          </DialogTitle>
        </DialogHeader>

        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          data-id="g5grwljys"
          data-path="src/components/sales/CheckoutModal.tsx"
        >
          {/* Order Summary */}
          <div
            className="space-y-4"
            data-id="uxewg15cl"
            data-path="src/components/sales/CheckoutModal.tsx"
          >
            <h3
              className="font-semibold text-lg"
              data-id="1m3k9276a"
              data-path="src/components/sales/CheckoutModal.tsx"
            >
              Order Summary
            </h3>

            <div
              className="space-y-3 max-h-60 overflow-y-auto border rounded-lg p-3"
              data-id="w012lejuy"
              data-path="src/components/sales/CheckoutModal.tsx"
            >
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                  data-id="ce9ag2aks"
                  data-path="src/components/sales/CheckoutModal.tsx"
                >
                  <div
                    data-id="8hun6e0at"
                    data-path="src/components/sales/CheckoutModal.tsx"
                  >
                    <p
                      className="text-sm font-medium"
                      data-id="cd3ig9xsg"
                      data-path="src/components/sales/CheckoutModal.tsx"
                    >
                      {item.name}
                    </p>
                    <p
                      className="text-xs text-gray-500"
                      data-id="43gju72fx"
                      data-path="src/components/sales/CheckoutModal.tsx"
                    >
                      ${Number(item.price).toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <span
                    className="text-sm font-medium"
                    data-id="774794igj"
                    data-path="src/components/sales/CheckoutModal.tsx"
                  >
                    ₱{(Number(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="space-y-2 pt-3 border-t"
              data-id="dxhw41vyq"
              data-path="src/components/sales/CheckoutModal.tsx"
            >
              <div
                className="flex justify-between"
                data-id="ghayvnjms"
                data-path="src/components/sales/CheckoutModal.tsx"
              >
                <span
                  className="text-gray-600"
                  data-id="ly4y9vp27"
                  data-path="src/components/sales/CheckoutModal.tsx"
                >
                  Subtotal:
                </span>
                <span
                  data-id="sazjphsyc"
                  data-path="src/components/sales/CheckoutModal.tsx"
                >
                  ₱{subtotal.toFixed(2)}
                </span>
              </div>
              <div
                className="flex justify-between"
                data-id="ijnppbowl"
                data-path="src/components/sales/CheckoutModal.tsx"
              >
                <span
                  className="text-gray-600"
                  data-id="gamqqodu6"
                  data-path="src/components/sales/CheckoutModal.tsx"
                >
                  Tax (8%):
                </span>
                <span
                  data-id="v9ia0tjk0"
                  data-path="src/components/sales/CheckoutModal.tsx"
                >
                  ₱{tax.toFixed(2)}
                </span>
              </div>
              <div
                className="flex justify-between text-lg font-bold"
                data-id="dqs5zvztg"
                data-path="src/components/sales/CheckoutModal.tsx"
              >
                <span
                  className="text-gray-600"
                  data-id="12yypjcu9"
                  data-path="src/components/sales/CheckoutModal.tsx"
                >
                  Total:
                </span>
                <span
                  data-id="a0z8h8nfd"
                  data-path="src/components/sales/CheckoutModal.tsx"
                >
                  ₱{total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div
            className="space-y-4"
            data-id="3q6cllrxz"
            data-path="src/components/sales/CheckoutModal.tsx"
          >
            <h3
              className="font-semibold text-lg"
              data-id="ws9b5pwri"
              data-path="src/components/sales/CheckoutModal.tsx"
            >
              Payment Method
            </h3>

            <Tabs
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as any)}
              data-id="czqu95kol"
              data-path="src/components/sales/CheckoutModal.tsx"
            >
              <TabsList
                className="grid w-full grid-cols-3"
                data-id="8euxeq9n5"
                data-path="src/components/sales/CheckoutModal.tsx"
              >
                <TabsTrigger
                  value="cash"
                  data-id="1z4lg9p44"
                  data-path="src/components/sales/CheckoutModal.tsx"
                >
                  <DollarSign
                    className="h-4 w-4 mr-1"
                    data-id="zlvsisebq"
                    data-path="src/components/sales/CheckoutModal.tsx"
                  />
                  Cash
                </TabsTrigger>
                <TabsTrigger
                  value="card"
                  data-id="bz3do6uam"
                  data-path="src/components/sales/CheckoutModal.tsx"
                >
                  <CreditCard
                    className="h-4 w-4 mr-1"
                    data-id="gvovfwdzr"
                    data-path="src/components/sales/CheckoutModal.tsx"
                  />
                  Card
                </TabsTrigger>
                <TabsTrigger
                  value="digital"
                  data-id="mrmr6tkt4"
                  data-path="src/components/sales/CheckoutModal.tsx"
                >
                  <Smartphone
                    className="h-4 w-4 mr-1"
                    data-id="0iw3s9pgv"
                    data-path="src/components/sales/CheckoutModal.tsx"
                  />
                  Digital
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="cash"
                className="space-y-4"
                data-id="bvrdgmhnn"
                data-path="src/components/sales/CheckoutModal.tsx"
              >
                <div
                  data-id="nghglghnb"
                  data-path="src/components/sales/CheckoutModal.tsx"
                >
                  <Label
                    htmlFor="cashReceived"
                    data-id="x6duaa1d0"
                    data-path="src/components/sales/CheckoutModal.tsx"
                  >
                    Cash Received
                  </Label>
                  <Input
                    id="cashReceived"
                    type="number"
                    step="0.01"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    placeholder="Enter amount received"
                    className="text-lg h-12"
                    data-id="da2yn3fcv"
                    data-path="src/components/sales/CheckoutModal.tsx"
                  />
                </div>
                {cashReceived && parseFloat(cashReceived) >= total && (
                  <div
                    className="p-3 bg-green-50 dark:bg-green-900 rounded-lg"
                    data-id="fev10xzhe"
                    data-path="src/components/sales/CheckoutModal.tsx"
                  >
                    <div
                      className="flex justify-between items-center"
                      data-id="yttvfhq8t"
                      data-path="src/components/sales/CheckoutModal.tsx"
                    >
                      <span
                        className="text-green-800 dark:text-green-200 font-medium"
                        data-id="r81iymszf"
                        data-path="src/components/sales/CheckoutModal.tsx"
                      >
                        Change:
                      </span>
                      <span
                        className="text-lg font-bold text-green-800 dark:text-green-200"
                        data-id="29e200p0e"
                        data-path="src/components/sales/CheckoutModal.tsx"
                      >
                        ₱{change.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent
                value="card"
                className="space-y-4"
                data-id="p7fvwr4y6"
                data-path="src/components/sales/CheckoutModal.tsx"
              >
                <div
                  data-id="xpiraq9dh"
                  data-path="src/components/sales/CheckoutModal.tsx"
                >
                  <Label
                    htmlFor="cardNumber"
                    data-id="ihuzojv41"
                    data-path="src/components/sales/CheckoutModal.tsx"
                  >
                    Card Number
                  </Label>
                  <Input
                    id="cardNumber"
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="**** **** **** 1234"
                    className="text-lg h-12"
                    data-id="uernsma6k"
                    data-path="src/components/sales/CheckoutModal.tsx"
                  />
                </div>
                <Badge
                  variant="outline"
                  className="w-full justify-center py-2"
                  data-id="gnh4b0pw5"
                  data-path="src/components/sales/CheckoutModal.tsx"
                >
                  <CheckCircle
                    className="h-4 w-4 mr-2"
                    data-id="r6gb4b0vr"
                    data-path="src/components/sales/CheckoutModal.tsx"
                  />
                  Card Terminal Ready
                </Badge>
              </TabsContent>

              <TabsContent
                value="digital"
                className="space-y-4"
                data-id="jrss3qyki"
                data-path="src/components/sales/CheckoutModal.tsx"
              >
                <div
                  className="text-center space-y-4"
                  data-id="gmk8dqx5k"
                  data-path="src/components/sales/CheckoutModal.tsx"
                >
                  <div
                    className="p-8 border-2 border-dashed rounded-lg"
                    data-id="cm6ftacng"
                    data-path="src/components/sales/CheckoutModal.tsx"
                  >
                    <Smartphone
                      className="h-12 w-12 mx-auto mb-4 text-gray-400"
                      data-id="z7fstgqys"
                      data-path="src/components/sales/CheckoutModal.tsx"
                    />
                    <p
                      className="text-gray-600"
                      data-id="qadnywjyk"
                      data-path="src/components/sales/CheckoutModal.tsx"
                    >
                      Show QR code to customer
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="w-full justify-center py-2"
                    data-id="5el03wh5t"
                    data-path="src/components/sales/CheckoutModal.tsx"
                  >
                    <CheckCircle
                      className="h-4 w-4 mr-2"
                      data-id="6cwgqbg2x"
                      data-path="src/components/sales/CheckoutModal.tsx"
                    />
                    Digital Payment Ready
                  </Badge>
                </div>
              </TabsContent>
            </Tabs>

            {/* Customer Information */}
            <div
              className="space-y-3"
              data-id="3oo4xwlj4"
              data-path="src/components/sales/CheckoutModal.tsx"
            >
              <h4
                className="font-medium"
                data-id="kopfvxq99"
                data-path="src/components/sales/CheckoutModal.tsx"
              >
                Customer Information (Optional)
              </h4>
              <div
                className="grid grid-cols-1 gap-3"
                data-id="joljkwk87"
                data-path="src/components/sales/CheckoutModal.tsx"
              >
                <div
                  data-id="2ovvfgbya"
                  data-path="src/components/sales/CheckoutModal.tsx"
                >
                  <Label
                    htmlFor="customerName"
                    data-id="11n45avfw"
                    data-path="src/components/sales/CheckoutModal.tsx"
                  >
                    Name
                  </Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Customer name"
                    data-id="vz19hrusr"
                    data-path="src/components/sales/CheckoutModal.tsx"
                  />
                </div>
                <div
                  data-id="itwfs7nq0"
                  data-path="src/components/sales/CheckoutModal.tsx"
                >
                  <Label
                    htmlFor="customerPhone"
                    data-id="djim815bc"
                    data-path="src/components/sales/CheckoutModal.tsx"
                  >
                    Phone
                  </Label>
                  <Input
                    id="customerPhone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Customer phone"
                    data-id="u18bi50fq"
                    data-path="src/components/sales/CheckoutModal.tsx"
                  />
                </div>
                <div
                  data-id="newemailfield"
                  data-path="src/components/sales/CheckoutModal.tsx"
                >
                  <Label
                    htmlFor="customerEmail"
                    data-id="newemailfieldlabel"
                    data-path="src/components/sales/CheckoutModal.tsx"
                  >
                    Email
                  </Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Customer email"
                    data-id="newemailfieldinput"
                    data-path="src/components/sales/CheckoutModal.tsx"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              className="flex space-x-3 pt-4"
              data-id="hztaa9rp8"
              data-path="src/components/sales/CheckoutModal.tsx"
            >
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isProcessing}
                className="flex-1"
                data-id="be54b9jd3"
                data-path="src/components/sales/CheckoutModal.tsx"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePayment}
                disabled={isProcessing || items.length === 0}
                className="flex-1"
                data-id="4sldamcuj"
                data-path="src/components/sales/CheckoutModal.tsx"
              >
                {isProcessing ? (
                  <>
                    <div
                      className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                      data-id="oryjr6t3s"
                      data-path="src/components/sales/CheckoutModal.tsx"
                    ></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Printer
                      className="h-4 w-4 mr-2"
                      data-id="rdrhdq6f1"
                      data-path="src/components/sales/CheckoutModal.tsx"
                    />
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
