import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Clock,
  CheckCircle,
  Package,
  Truck,
  Home,
  MoreHorizontal,
  MapPin,
  Calendar,
  Phone,
  Mail
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
  avatar?: string;
}

interface OrderKanbanProps {
  orders: Order[];
  onStatusChange: (orderId: string, newStatus: string) => void;
}

const statusColumns = [
  { id: 'pending', title: 'Pending', icon: Clock, color: 'bg-secondary' },
  { id: 'confirmed', title: 'Confirmed', icon: CheckCircle, color: 'bg-primary' },
  { id: 'processing', title: 'Processing', icon: Package, color: 'bg-warning' },
  { id: 'packed', title: 'Packed', icon: Package, color: 'bg-success' },
  { id: 'shipped', title: 'Shipped', icon: Truck, color: 'bg-primary' },
  { id: 'delivered', title: 'Delivered', icon: Home, color: 'bg-success' }
];

export function OrderKanban({ orders, onStatusChange }: OrderKanbanProps) {
  const [draggedOrder, setDraggedOrder] = useState<string | null>(null);

  const handleDragStart = (orderId: string) => {
    setDraggedOrder(orderId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (draggedOrder) {
      onStatusChange(draggedOrder, newStatus);
      setDraggedOrder(null);
    }
  };

  const getOrdersByStatus = (status: string) => {
    return orders.filter(order => order.status === status);
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 h-full">
      {statusColumns.map((column) => {
        const Icon = column.icon;
        const columnOrders = getOrdersByStatus(column.id);
        
        return (
          <div
            key={column.id}
            className="flex flex-col min-h-[600px]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <Card className="mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <div className={`p-1.5 rounded-full ${column.color}`}>
                    <Icon className="w-3 h-3 text-white" />
                  </div>
                  {column.title}
                  <Badge variant="secondary" className="ml-auto">
                    {columnOrders.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
            </Card>

            <div className="flex-1 space-y-3 overflow-y-auto">
              {columnOrders.map((order) => (
                <Card
                  key={order.id}
                  className="cursor-move hover:shadow-lg transition-shadow border-l-4 border-l-primary"
                  draggable
                  onDragStart={() => handleDragStart(order.id)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Order Header */}
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{order.id}</p>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreHorizontal className="w-3 h-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Print Invoice</DropdownMenuItem>
                            <DropdownMenuItem>Track Shipment</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Cancel Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Customer Info */}
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={order.avatar} alt={order.customer} />
                          <AvatarFallback className="text-xs">
                            {order.customer.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{order.customer}</p>
                          <p className="text-xs text-muted-foreground truncate">{order.email}</p>
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="font-medium">₹{order.total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Items:</span>
                          <span>{order.items}</span>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{order.shippingAddress}</span>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{order.orderDate}</span>
                      </div>

                      {/* Status Badge */}
                      <div className="flex justify-center pt-2">
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}