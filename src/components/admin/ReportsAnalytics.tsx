import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Download,
  Calendar,
  Filter,
  Eye,
  MapPin
} from "lucide-react";

const salesTrendData = [
  { month: 'Jan', sales: 245000, orders: 89, customers: 67 },
  { month: 'Feb', sales: 289000, orders: 102, customers: 78 },
  { month: 'Mar', sales: 356000, orders: 134, customers: 95 },
  { month: 'Apr', sales: 298000, orders: 98, customers: 72 },
  { month: 'May', sales: 412000, orders: 156, customers: 123 },
  { month: 'Jun', sales: 489000, orders: 187, customers: 145 }
];

const categoryPerformance = [
  { category: 'Sarees', revenue: 1250000, orders: 456, growth: 15.2 },
  { category: 'Lehengas', revenue: 980000, orders: 234, growth: 22.8 },
  { category: 'Kurta Sets', revenue: 567000, orders: 189, growth: -3.1 },
  { category: 'Accessories', revenue: 234000, orders: 67, growth: 8.7 }
];

const topRegions = [
  { state: 'Maharashtra', orders: 234, revenue: 567000 },
  { state: 'Karnataka', orders: 189, revenue: 456000 },
  { state: 'Tamil Nadu', orders: 167, revenue: 398000 },
  { state: 'Gujarat', orders: 145, revenue: 345000 },
  { state: 'Delhi', orders: 134, revenue: 298000 }
];

const inventoryData = [
  { product: 'Royal Blue Banarasi', stock: 15, reorderPoint: 20, status: 'low' },
  { product: 'Pink Bridal Lehenga', stock: 8, reorderPoint: 15, status: 'critical' },
  { product: 'Golden Thread Kurta', stock: 32, reorderPoint: 25, status: 'good' },
  { product: 'Emerald Silk Saree', stock: 3, reorderPoint: 10, status: 'critical' }
];

export function ReportsAnalytics() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("last30days");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive business intelligence dashboard</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">Last 7 Days</SelectItem>
              <SelectItem value="last30days">Last 30 Days</SelectItem>
              <SelectItem value="last90days">Last 90 Days</SelectItem>
              <SelectItem value="lastyear">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button variant="premium" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Custom Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold">₹24.5L</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-success" />
                  <span className="text-xs text-success">+18.2%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold">1,435</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-success" />
                  <span className="text-xs text-success">+12.8%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Users className="w-5 h-5 text-warning" />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold">847</p>
                <p className="text-sm text-muted-foreground">New Customers</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="w-3 h-3 text-destructive" />
                  <span className="text-xs text-destructive">-3.1%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <Package className="w-5 h-5 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold">₹17,089</p>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-success" />
                  <span className="text-xs text-success">+5.4%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 bg-accent">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
                <CardDescription>Monthly revenue and order progression</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesTrendData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [`₹${value.toLocaleString()}`, name]} />
                    <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Revenue breakdown by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryPerformance.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                      <div>
                        <p className="font-medium">{category.category}</p>
                        <p className="text-sm text-muted-foreground">{category.orders} orders</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{(category.revenue / 1000).toFixed(0)}K</p>
                        <div className="flex items-center gap-1">
                          {category.growth > 0 ? (
                            <TrendingUp className="w-3 h-3 text-success" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-destructive" />
                          )}
                          <span className={`text-xs ${category.growth > 0 ? 'text-success' : 'text-destructive'}`}>
                            {category.growth > 0 ? '+' : ''}{category.growth}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Top Performing Regions</CardTitle>
                <CardDescription>Sales performance by state</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topRegions.map((region, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{region.state}</p>
                          <p className="text-sm text-muted-foreground">{region.orders} orders</p>
                        </div>
                      </div>
                      <p className="font-bold">₹{(region.revenue / 1000).toFixed(0)}K</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Inventory Alerts</CardTitle>
                <CardDescription>Products requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inventoryData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                      <div>
                        <p className="font-medium">{item.product}</p>
                        <p className="text-sm text-muted-foreground">Reorder at: {item.reorderPoint}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{item.stock} units</p>
                        <Badge variant={item.status === 'critical' ? 'destructive' : item.status === 'low' ? 'warning' : 'success'}>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Detailed Sales Analytics</CardTitle>
              <CardDescription>In-depth sales performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={salesTrendData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={3} />
                  <Line type="monotone" dataKey="orders" stroke="hsl(var(--success))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add more tab contents for products, customers, inventory */}
        <TabsContent value="products">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>Detailed product analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Product analytics content will be displayed here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Customer Analytics</CardTitle>
              <CardDescription>Customer behavior and segmentation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Customer analytics content will be displayed here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Inventory Analytics</CardTitle>
              <CardDescription>Stock levels and turnover analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Inventory analytics content will be displayed here...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}