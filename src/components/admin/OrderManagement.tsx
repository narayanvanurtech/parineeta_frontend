import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ShoppingCart,
  Search,
  Filter,
  MoreHorizontal,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Grid3X3,
  List,
  Eye
} from "lucide-react";
import { OrderKanban } from "./order/OrderKanban";
import { OrderDetailsModal } from "./order/OrderDetailsModal";

const initialOrders = [
  {
    id: "ORD-2024-001",
    customer: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 98765 43210",
    items: 3,
    total: 45999,
    status: "confirmed",
    paymentStatus: "paid",
    shippingAddress: "Mumbai, Maharashtra",
    orderDate: "2024-01-15",
    estimatedDelivery: "2024-01-22",
    products: ["Royal Blue Banarasi Saree", "Matching Blouse", "Gold Jewelry Set"]
  },
  {
    id: "ORD-2024-002", 
    customer: "Ananya Reddy",
    email: "ananya.reddy@email.com",
    phone: "+91 87654 32109",
    items: 1,
    total: 25999,
    status: "packed",
    paymentStatus: "paid",
    shippingAddress: "Hyderabad, Telangana",
    orderDate: "2024-01-14",
    estimatedDelivery: "2024-01-20",
    products: ["Pink Bridal Lehenga Set"]
  },
  {
    id: "ORD-2024-003",
    customer: "Kavya Patel",
    email: "kavya.patel@email.com", 
    phone: "+91 76543 21098",
    items: 2,
    total: 7998,
    status: "shipped",
    paymentStatus: "paid",
    shippingAddress: "Ahmedabad, Gujarat",
    orderDate: "2024-01-13",
    estimatedDelivery: "2024-01-19",
    products: ["Golden Thread Kurta Set", "Matching Dupatta"]
  },
  {
    id: "ORD-2024-004",
    customer: "Meera Singh",
    email: "meera.singh@email.com",
    phone: "+91 65432 10987", 
    items: 1,
    total: 8999,
    status: "pending",
    paymentStatus: "pending",
    shippingAddress: "Delhi, India",
    orderDate: "2024-01-16",
    estimatedDelivery: "2024-01-23",
    products: ["Emerald Silk Saree"]
  }
];

export function OrderManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderList, setOrderList] = useState(initialOrders);
  const { toast } = useToast();

const handleStatusChange = (orderId: string, newStatus: string) => {
  setOrderList((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
  if (selectedOrder?.id === orderId) {
    setSelectedOrder((prev: any) => (prev ? { ...prev, status: newStatus } : prev));
  }
  toast({ title: "Status updated", description: `${orderId} → ${newStatus}` });
};

const handleOrderUpdate = (orderId: string, updates: any) => {
  setOrderList((prev) => prev.map((o) => (o.id === orderId ? { ...o, ...updates } : o)));
  if (selectedOrder?.id === orderId) {
    setSelectedOrder((prev: any) => (prev ? { ...prev, ...updates } : prev));
  }
  toast({ title: "Order updated", description: `${orderId} details saved` });
};

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, icon: Clock, label: "Pending" },
      confirmed: { variant: "default" as const, icon: CheckCircle, label: "Confirmed" },
      packed: { variant: "warning" as const, icon: Package, label: "Packed" },
      shipped: { variant: "default" as const, icon: Truck, label: "Shipped" },
      delivered: { variant: "success" as const, icon: CheckCircle, label: "Delivered" },
      cancelled: { variant: "destructive" as const, icon: AlertCircle, label: "Cancelled" }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    return status === "paid" 
      ? <Badge variant="success">Paid</Badge>
      : <Badge variant="destructive">Pending</Badge>;
  };

const filteredOrders = orderList.filter(order => {
  const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       order.customer.toLowerCase().includes(searchQuery.toLowerCase());
  const matchesTab = activeTab === "all" || order.status === activeTab;
  
  return matchesSearch && matchesTab;
});

const orderCounts = {
  all: orderList.length,
  pending: orderList.filter(o => o.status === "pending").length,
  confirmed: orderList.filter(o => o.status === "confirmed").length,
  packed: orderList.filter(o => o.status === "packed").length,
  shipped: orderList.filter(o => o.status === "shipped").length,
  delivered: orderList.filter(o => o.status === "delivered").length
};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Order Management</h1>
          <p className="text-muted-foreground">Track and manage customer orders</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-accent rounded-lg p-1">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="flex items-center gap-2"
            >
              <List className="w-4 h-4" />
              Table
            </Button>
            <Button
              variant={viewMode === "kanban" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("kanban")}
              className="flex items-center gap-2"
            >
              <Grid3X3 className="w-4 h-4" />
              Kanban
            </Button>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Advanced Filters
          </Button>
          <Button variant="premium" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Bulk Actions
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">143</p>
                <p className="text-sm text-muted-foreground">Total Orders Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">28</p>
                <p className="text-sm text-muted-foreground">Pending Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Truck className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">89</p>
                <p className="text-sm text-muted-foreground">Shipped Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CheckCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹2.4L</p>
                <p className="text-sm text-muted-foreground">Revenue Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search orders by ID or customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>
        </CardContent>
      </Card>

      {/* Orders Content */}
      {viewMode === "kanban" ? (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Order Pipeline</CardTitle>
            <CardDescription>Drag and drop to update order status</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
<OrderKanban orders={filteredOrders} onStatusChange={handleStatusChange} />
          </CardContent>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 bg-accent">
            <TabsTrigger value="all">All ({orderCounts.all})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({orderCounts.pending})</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed ({orderCounts.confirmed})</TabsTrigger>
            <TabsTrigger value="packed">Packed ({orderCounts.packed})</TabsTrigger>
            <TabsTrigger value="shipped">Shipped ({orderCounts.shipped})</TabsTrigger>
            <TabsTrigger value="delivered">Delivered ({orderCounts.delivered})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Orders ({filteredOrders.length})</CardTitle>
                <CardDescription>Manage your customer orders efficiently</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.id}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <MapPin className="w-3 h-3" />
                              {order.shippingAddress}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.customer}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              {order.email}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              {order.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.items} items</p>
                            <p className="text-xs text-muted-foreground">
                              {order.products[0]}
                              {order.items > 1 && ` +${order.items - 1} more`}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-lg">₹{order.total.toLocaleString()}</span>
                        </TableCell>
                        <TableCell>
                          <Select value={order.status} onValueChange={(v) => handleStatusChange(order.id, v)}>
                            <SelectTrigger className="h-8 w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="packed">Packed</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {getPaymentStatusBadge(order.paymentStatus)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            {order.orderDate}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Est. delivery: {order.estimatedDelivery}
                          </p>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleViewOrder(order)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem 
                                  className="cursor-pointer"
                                  onClick={() => handleViewOrder(order)}
                                >
                                  View Order Details
                                </DropdownMenuItem>
<DropdownMenuItem className="cursor-pointer" onClick={() => handleViewOrder(order)}>
  Update Status
</DropdownMenuItem>
<DropdownMenuItem className="cursor-pointer" onClick={() => window.open((order as any).trackingNumber ? `https://www.aftership.com/track/${(order as any).trackingNumber}` : `https://www.aftership.com`, '_blank') }>
  Track Shipment
</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer text-destructive">
                                  Cancel Order
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onStatusUpdate={handleStatusChange}
        onOrderUpdate={handleOrderUpdate}
      />
    </div>
  );
}