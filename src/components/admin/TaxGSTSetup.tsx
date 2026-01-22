import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Calculator,
  Plus,
  Search,
  Edit,
  Download,
  FileText,
  AlertTriangle,
  CheckCircle,
  Calendar,
  TrendingUp,
  Receipt
} from "lucide-react";

const gstRates = [
  {
    id: "GST001",
    category: "Silk Sarees",
    hsnCode: "50071900",
    gstRate: 12,
    cgst: 6,
    sgst: 6,
    igst: 12,
    status: "active",
    effectiveFrom: "2023-01-01"
  },
  {
    id: "GST002",
    category: "Cotton Sarees", 
    hsnCode: "52083200",
    gstRate: 5,
    cgst: 2.5,
    sgst: 2.5,
    igst: 5,
    status: "active",
    effectiveFrom: "2023-01-01"
  },
  {
    id: "GST003",
    category: "Lehengas",
    hsnCode: "62046200",
    gstRate: 12,
    cgst: 6,
    sgst: 6,
    igst: 12,
    status: "active",
    effectiveFrom: "2023-01-01"
  },
  {
    id: "GST004",
    category: "Jewelry",
    hsnCode: "71131900",
    gstRate: 3,
    cgst: 1.5,
    sgst: 1.5,
    igst: 3,
    status: "active",
    effectiveFrom: "2023-01-01"
  }
];

const taxReports = [
  {
    period: "December 2024",
    totalSales: 2450000,
    taxableAmount: 2200000,
    totalTax: 264000,
    cgst: 132000,
    sgst: 132000,
    igst: 0,
    status: "pending",
    dueDate: "2024-01-20"
  },
  {
    period: "November 2024",
    totalSales: 2890000,
    taxableAmount: 2601000,
    totalTax: 312120,
    cgst: 156060,
    sgst: 156060,
    igst: 0,
    status: "filed",
    dueDate: "2023-12-20"
  }
];

export function TaxGSTSetup() {
  const [activeTab, setActiveTab] = useState("rates");

  const getStatusBadge = (status: string) => {
    const config = {
      active: { variant: "success" as const, label: "Active" },
      pending: { variant: "warning" as const, label: "Pending" },
      filed: { variant: "success" as const, label: "Filed" },
      overdue: { variant: "destructive" as const, label: "Overdue" }
    };
    
    const { variant, label } = config[status as keyof typeof config];
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tax & GST Management</h1>
          <p className="text-muted-foreground">Manage tax rates and GST compliance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download GSTR-1
          </Button>
          <Button variant="premium" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Tax Rate
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calculator className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹2.64L</p>
                <p className="text-sm text-muted-foreground">Current Month Tax</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹3.12L</p>
                <p className="text-sm text-muted-foreground">Last Month Filed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">Days to File</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">12.5%</p>
                <p className="text-sm text-muted-foreground">Effective Tax Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tax Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-accent">
          <TabsTrigger value="rates">GST Rates</TabsTrigger>
          <TabsTrigger value="reports">Tax Reports</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="rates" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>GST Rate Configuration</CardTitle>
              <CardDescription>Manage tax rates for different product categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input placeholder="Search by category or HSN code..." className="pl-10" />
                  </div>
                  <Button variant="premium" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add GST Rate
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>HSN Code</TableHead>
                      <TableHead>GST Rate</TableHead>
                      <TableHead>CGST</TableHead>
                      <TableHead>SGST</TableHead>
                      <TableHead>IGST</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gstRates.map((rate) => (
                      <TableRow key={rate.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{rate.category}</p>
                            <p className="text-sm text-muted-foreground">Effective: {rate.effectiveFrom}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{rate.hsnCode}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-lg">{rate.gstRate}%</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{rate.cgst}%</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{rate.sgst}%</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{rate.igst}%</span>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(rate.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Calculator className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Tax Return Reports</CardTitle>
              <CardDescription>Monthly GST return summaries and filing status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Select>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">Current Month</SelectItem>
                      <SelectItem value="last3">Last 3 Months</SelectItem>
                      <SelectItem value="last6">Last 6 Months</SelectItem>
                      <SelectItem value="yearly">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Export Reports
                    </Button>
                    <Button variant="premium" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Generate GSTR-1
                    </Button>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Total Sales</TableHead>
                      <TableHead>Taxable Amount</TableHead>
                      <TableHead>CGST</TableHead>
                      <TableHead>SGST</TableHead>
                      <TableHead>Total Tax</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taxReports.map((report, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <p className="font-medium">{report.period}</p>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">₹{report.totalSales.toLocaleString()}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">₹{report.taxableAmount.toLocaleString()}</span>
                        </TableCell>
                        <TableCell>
                          <span>₹{report.cgst.toLocaleString()}</span>
                        </TableCell>
                        <TableCell>
                          <span>₹{report.sgst.toLocaleString()}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-primary">₹{report.totalTax.toLocaleString()}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            {report.dueDate}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(report.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button variant="ghost" size="icon">
                              <Receipt className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="w-4 h-4" />
                            </Button>
                            {report.status === "pending" && (
                              <Button size="sm" variant="premium">
                                File Return
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Compliance Checklist</CardTitle>
                <CardDescription>Monthly compliance requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <span>GSTR-1 Filing</span>
                    </div>
                    <Badge variant="success">Completed</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-warning" />
                      <span>GSTR-3B Filing</span>
                    </div>
                    <Badge variant="warning">Due in 5 days</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calculator className="w-5 h-5 text-muted-foreground" />
                      <span>TDS Payment</span>
                    </div>
                    <Badge variant="secondary">Upcoming</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Business Details</CardTitle>
                <CardDescription>Registered business information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Business Name</Label>
                    <p className="text-sm text-muted-foreground">Pareenita Ethnic Wear Pvt Ltd</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">GSTIN</Label>
                    <p className="text-sm text-muted-foreground">27AABCP1234M1ZX</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">PAN</Label>
                    <p className="text-sm text-muted-foreground">AABCP1234M</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Registration Date</Label>
                    <p className="text-sm text-muted-foreground">July 15, 2020</p>
                  </div>
                  <Button variant="outline" size="sm">Update Details</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Tax Settings</CardTitle>
              <CardDescription>Configure tax calculation preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Include Tax in Product Prices</Label>
                    <p className="text-sm text-muted-foreground">Show prices inclusive of tax</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Automatic Tax Calculation</Label>
                    <p className="text-sm text-muted-foreground">Auto-calculate tax based on customer location</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Round Tax Amounts</Label>
                    <p className="text-sm text-muted-foreground">Round tax to nearest rupee</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}