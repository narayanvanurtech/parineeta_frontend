import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  Package,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Calendar,
  ArrowUpRight,
  Filter
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import adminHero from "@/assets/admin-hero.jpg";
import axios from "axios";
import { BASE_URL } from "../ui/config";

const salesData = [
  { name: 'Mon', sales: 24000, orders: 45 },
  { name: 'Tue', sales: 31000, orders: 52 },
  { name: 'Wed', sales: 28000, orders: 48 },
  { name: 'Thu', sales: 35000, orders: 61 },
  { name: 'Fri', sales: 42000, orders: 73 },
  { name: 'Sat', sales: 58000, orders: 89 },
  { name: 'Sun', sales: 47000, orders: 67 },
];

const categoryData = [
  { name: 'Sarees', value: 45, color: '#D4AF37' },
  { name: 'Lehengas', value: 30, color: '#800020' },
  { name: 'Kurta Sets', value: 15, color: '#FFA500' },
  { name: 'Accessories', value: 10, color: '#8B4513' },
];

const criticalAlerts = [
  { id: 1, type: 'stock', message: 'Banarasi Silk Sarees - Only 3 units left', priority: 'high', time: '2 min ago' },
  { id: 2, type: 'order', message: 'Wedding order #WD2024-089 requires custom alteration', priority: 'medium', time: '15 min ago' },
  { id: 3, type: 'review', message: 'Negative review on Premium Lehenga needs response', priority: 'high', time: '1 hour ago' },
  { id: 4, type: 'seasonal', message: 'Diwali collection launch in 7 days - Prepare inventory', priority: 'medium', time: '2 hours ago' },
];

const topProducts = [
  { name: 'Royal Blue Banarasi Saree', sales: 89, revenue: '₹2,67,000' },
  { name: 'Pink Bridal Lehenga Set', sales: 67, revenue: '₹4,02,000' },
  { name: 'Golden Thread Kurta Set', sales: 54, revenue: '₹1,62,000' },
  { name: 'Emerald Silk Saree', sales: 43, revenue: '₹1,29,000' },
];

export function Dashboard() {
  const [timeView, setTimeView] = useState('daily');
 

 

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-gold p-8 text-primary-foreground">
        <div className="absolute inset-0 opacity-20">
          <img src={adminHero} alt="Admin Dashboard" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome to Pareenita Admin</h1>
          <p className="text-lg opacity-90 mb-4">Your comprehensive business intelligence center</p>
          <div className="flex gap-4">
            <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0">
              Live Dashboard
            </Badge>
            <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0">
              Real-time Updates
            </Badge>
          </div>
        </div>
      </div>

      {/* Time View Tabs */}
      <Tabs value={timeView} onValueChange={setTimeView} className="w-full">
        <TabsList className="grid w-fit grid-cols-3 bg-accent">
          <TabsTrigger value="daily">Daily View</TabsTrigger>
          <TabsTrigger value="monthly">Monthly View</TabsTrigger>
          <TabsTrigger value="yearly">Yearly View</TabsTrigger>
        </TabsList>

        <TabsContent value={timeView} className="space-y-6">
          {/* KPI Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹2,45,390</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span className="text-success">+12.5%</span> from yesterday
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Order Volume</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">143</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span className="text-success">+8.2%</span> from yesterday
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingDown className="h-3 w-3 text-destructive" />
                  <span className="text-destructive">-2.1%</span> from yesterday
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Health</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <Progress value={87} className="mt-2 h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-success">Healthy</span> inventory levels
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2 shadow-card">
              <CardHeader>
                <CardTitle>Sales & Orders Trend</CardTitle>
                <CardDescription>Daily performance over the last week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'sales' ? `₹${value.toLocaleString()}` : value,
                        name === 'sales' ? 'Sales' : 'Orders'
                      ]}
                    />
                    <Bar dataKey="sales" fill="hsl(var(--primary))" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>Sales distribution by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {categoryData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Critical Alerts & Top Products */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Critical Alerts
                </CardTitle>
                <CardDescription>Items requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {criticalAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-accent/50">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        alert.priority === 'high' ? 'bg-destructive' : 'bg-warning'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{alert.time}</span>
                          <Badge variant={alert.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                            {alert.priority}
                          </Badge>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Top Performing Products
                </CardTitle>
                <CardDescription>Best sellers this {timeView === 'daily' ? 'week' : timeView === 'monthly' ? 'month' : 'year'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{product.name}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-muted-foreground">{product.sales} units sold</span>
                          <span className="text-xs font-medium text-success">{product.revenue}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}