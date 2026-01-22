import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
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
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Package,
  Truck,
  Edit,
  Save,
  X,
  MessageSquare,
  FileText,
  Printer,
  RefreshCw,
  AlertTriangle
} from "lucide-react";

interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  items: number;
  total: number;
  status: string;
  paymentStatus: string;
  shippingAddress: string;
  orderDate: string;
  estimatedDelivery: string;
  products: string[];
  trackingNumber?: string;
  notes?: string;
  refundAmount?: number;
}

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (orderId: string, newStatus: string) => void;
  onOrderUpdate: (orderId: string, updates: Partial<Order>) => void;
}

const orderTimeline = [
  { status: 'pending', label: 'Order Placed', time: '2024-01-15 10:30 AM', completed: true },
  { status: 'confirmed', label: 'Order Confirmed', time: '2024-01-15 11:15 AM', completed: true },
  { status: 'processing', label: 'Processing', time: '2024-01-15 2:00 PM', completed: true },
  { status: 'packed', label: 'Packed', time: '2024-01-16 9:00 AM', completed: false },
  { status: 'shipped', label: 'Shipped', time: '', completed: false },
  { status: 'delivered', label: 'Delivered', time: '', completed: false }
];

export function OrderDetailsModal({ 
  order, 
  isOpen, 
  onClose, 
  onStatusUpdate, 
  onOrderUpdate 
}: OrderDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);
  const [newNote, setNewNote] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refundAmount, setRefundAmount] = useState("");

  if (!order) return null;

  const handleEdit = () => {
    setIsEditing(true);
    setEditedOrder({ ...order });
  };

  const handleSave = () => {
    if (editedOrder) {
      onOrderUpdate(order.id, editedOrder);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedOrder(null);
  };

  const handleStatusChange = (newStatus: string) => {
    onStatusUpdate(order.id, newStatus);
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { variant: "secondary" as const, label: "Pending" },
      confirmed: { variant: "default" as const, label: "Confirmed" },
      processing: { variant: "warning" as const, label: "Processing" },
      packed: { variant: "success" as const, label: "Packed" },
      shipped: { variant: "default" as const, label: "Shipped" },
      delivered: { variant: "success" as const, label: "Delivered" }
    };
    
    const { variant, label } = config[status as keyof typeof config] || config.pending;
    return <Badge variant={variant}>{label}</Badge>;
  };

return (
  <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">Order Details - {order.id}</DialogTitle>
              <DialogDescription>
                Placed on {order.orderDate} • {getStatusBadge(order.status)}
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button variant="outline" onClick={handleEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Order
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="refunds">Refunds</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Customer Name</Label>
                    {isEditing ? (
                      <Input 
                        value={editedOrder?.customer || ""} 
                        onChange={(e) => setEditedOrder(prev => prev ? {...prev, customer: e.target.value} : null)}
                      />
                    ) : (
                      <p className="text-sm bg-accent p-2 rounded">{order.customer}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{order.email}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{order.phone}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Shipping Address</Label>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{order.shippingAddress}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Order Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Order Status</Label>
                    <Select 
                      value={isEditing ? editedOrder?.status : order.status}
                      onValueChange={(value) => isEditing ? setEditedOrder(prev => prev ? {...prev, status: value} : null) : handleStatusChange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="packed">Packed</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Status</Label>
                    <Badge variant={order.paymentStatus === "paid" ? "success" : "destructive"}>
                      {order.paymentStatus.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label>Total Amount</Label>
                    <p className="text-2xl font-bold">₹{order.total.toLocaleString()}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Estimated Delivery</Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{order.estimatedDelivery}</span>
                    </div>
                  </div>
{order.trackingNumber && (
  <div className="space-y-2">
    <Label>Tracking Number</Label>
    <div className="flex items-center gap-2">
      <Truck className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm font-mono">{order.trackingNumber}</span>
      <Button variant="outline" size="sm" onClick={() => window.open(`https://www.aftership.com/track/${order.trackingNumber}`, '_blank')}>
        Track Package
      </Button>
      <Button variant="ghost" size="sm">
        <RefreshCw className="w-3 h-3" />
      </Button>
    </div>
  </div>
)}
                </CardContent>
              </Card>
            </div>

            {/* Products */}
            <Card>
              <CardHeader>
                <CardTitle>Products ({order.items} items)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {order.products.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                      <div>
                        <p className="font-medium">{product}</p>
                        <p className="text-sm text-muted-foreground">Qty: 1</p>
                      </div>
                      <p className="font-medium">₹{(order.total / order.items).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between items-center">
                  <p className="font-semibold">Total Amount</p>
                  <p className="text-xl font-bold">₹{order.total.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                {order.notes ? (
                  <p className="text-sm bg-accent p-3 rounded">{order.notes}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">No notes added</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderTimeline.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${item.completed ? 'bg-primary' : 'bg-muted'}`} />
                      <div className="flex-1">
                        <p className={`font-medium ${item.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {item.label}
                        </p>
                        {item.time && (
                          <p className="text-sm text-muted-foreground">{item.time}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communication" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Customer Communication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Add Note</Label>
                  <Textarea 
                    placeholder="Add internal note or customer communication..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                  <Button>Add Note</Button>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="p-3 bg-accent rounded-lg">
                    <p className="text-sm"><strong>Admin:</strong> Order confirmed and being processed.</p>
                    <p className="text-xs text-muted-foreground mt-1">2024-01-15 11:15 AM</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm"><strong>Customer:</strong> When will this be delivered?</p>
                    <p className="text-xs text-muted-foreground mt-1">2024-01-15 3:20 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="refunds" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Refund Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Refund Amount</Label>
                    <Input 
                      type="number" 
                      placeholder="Enter refund amount"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Refund Reason</Label>
                    <Select value={refundReason} onValueChange={setRefundReason}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="damaged">Damaged Product</SelectItem>
                        <SelectItem value="wrong-item">Wrong Item Sent</SelectItem>
                        <SelectItem value="customer-request">Customer Request</SelectItem>
                        <SelectItem value="quality-issue">Quality Issue</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="destructive">Process Full Refund</Button>
                  <Button variant="outline">Process Partial Refund</Button>
                </div>
                
                {order.refundAmount && (
                  <div className="mt-4 p-4 bg-destructive/10 rounded-lg">
                    <p className="font-medium text-destructive">
                      Refund Processed: ₹{order.refundAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Refunded on 2024-01-16 • Will reflect in 5-7 business days
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Order Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2 md:grid-cols-2">
                  <Button variant="outline" className="justify-start">
                    <Printer className="w-4 h-4 mr-2" />
                    Print Invoice
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Package className="w-4 h-4 mr-2" />
                    Print Packing Slip
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Truck className="w-4 h-4 mr-2" />
                    Print Shipping Label
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Export Order Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}