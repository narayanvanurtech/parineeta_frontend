import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  MapPin,
  Truck,
  Edit,
  Save,
  X,
  MessageSquare,
  FileText,
  Printer,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";
import { BASE_URL } from "@/components/ui/config";

const orderTimeline = [
  { label: "Order Placed", time: "Jan 15, 2024 • 10:30 AM", completed: true },
  { label: "Order Confirmed", time: "Jan 15, 2024 • 11:15 AM", completed: true },
  { label: "Processing", time: "Jan 15, 2024 • 2:00 PM", completed: true },
  { label: "Packed", time: "Pending", completed: false },
  { label: "Shipped", time: "Pending", completed: false },
  { label: "Delivered", time: "Pending", completed: false },
];



const dummyMessages = [
  {
    sender: "Customer",
    message: "When will my order be shipped?",
  },
  {
    sender: "Admin",
    message: "Your order will be shipped within 24 hours.",
  },
];

const dummyRefunds = [
  {
    amount: 499,
    status: "Processed",
    date: "Jan 16, 2024",
  },
];

const dummyDocuments = [
  { name: "Invoice.pdf" },
  { name: "Shipping_Label.pdf" },
];


export function OrderDetailsModal({
  order,
  isOpen,
  onClose,
  onStatusUpdate,
}: any) {
  if (!order) return null;

  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [tempStatus, setTempStatus] = useState(order.status);
  const [currentStatus, setCurrentStatus] = useState(order.status);

  useEffect(() => {
    setCurrentStatus(order.status);
    setTempStatus(order.status);
  }, [order.status]);

  const totalItems = order.items.reduce(
    (sum: number, item: any) => sum + item.quantity,
    0
  );

  const handleUpdateStatus = async (id: string) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${BASE_URL}/orders/admin/${id}/status`,
        { status: tempStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCurrentStatus(tempStatus);
      onStatusUpdate?.(id, tempStatus);
      setIsEditingStatus(false);
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Order Details – {order.trackingNumber}
          </DialogTitle>
          <DialogDescription>
            Placed on {new Date(order.orderDate).toLocaleString()} •{" "}
            <Badge className="capitalize">{currentStatus}</Badge>
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="refunds">Refunds</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          {/* DETAILS */}
          <TabsContent value="details" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2 items-center">
                    <Mail className="w-4 h-4" />
                    <span>{order.user?.email}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <MapPin className="w-4 h-4" />
                    <span>{order.shippingAddress}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Status</Label>

                    {!isEditingStatus ? (
                      <div className="flex items-center justify-between">
                        <Badge className="capitalize">
                          {currentStatus}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setTempStatus(currentStatus);
                            setIsEditingStatus(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Select
                          value={tempStatus}
                          onValueChange={setTempStatus}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="packed">Packed</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button
                          size="icon"
                          onClick={() => handleUpdateStatus(order._id)}
                        >
                          <Save className="w-4 h-4" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setIsEditingStatus(false)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Total</Label>
                    <p className="text-xl font-bold">
                      ₹{order.total.toLocaleString()}
                    </p>
                  </div>

                  {order.trackingNumber && (
                    <div className="flex gap-2 items-center">
                      <Truck className="w-4 h-4" />
                      <span className="font-mono">
                        {order.trackingNumber}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Products ({totalItems} items)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex gap-4 p-3 bg-accent rounded-lg"
                  >
                    <img
                      src={item.variant.image}
                      className="w-32 rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ₹{item.variant.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Subtotal: ₹
                        {(item.variant.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{order.total.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
       <TabsContent value="timeline" className="space-y-4">
            {orderTimeline.map((step, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-3 bg-accent rounded-lg"
              >
                <span className="font-medium">{step.label}</span>
                <span className="text-sm text-muted-foreground">
                  {step.time}
                </span>
              </div>
            ))}
          </TabsContent>

          {/* COMMUNICATION */}
          <TabsContent value="communication" className="space-y-3">
            {dummyMessages.map((msg, idx) => (
              <Card key={idx}>
                <CardContent className="p-4">
                  <div className="flex gap-2 items-center mb-1">
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-medium">{msg.sender}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {msg.message}
                  </p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* REFUNDS */}
          <TabsContent value="refunds" className="space-y-3">
            {dummyRefunds.length ? (
              dummyRefunds.map((refund, idx) => (
                <Card key={idx}>
                  <CardContent className="p-4 space-y-1">
                    <p>Amount: ₹{refund.amount}</p>
                    <p>Status: {refund.status}</p>
                    <p className="text-sm text-muted-foreground">
                      {refund.date}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex gap-2 items-center text-muted-foreground">
                <AlertTriangle className="w-4 h-4" />
                No refunds issued.
              </div>
            )}
          </TabsContent>

          {/* DOCUMENTS */}
          <TabsContent value="documents" className="flex gap-3">
            {dummyDocuments.map((doc, idx) => (
              <Button key={idx} variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                {doc.name}
              </Button>
            ))}
          </TabsContent>
          {/* Other tabs unchanged */}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
