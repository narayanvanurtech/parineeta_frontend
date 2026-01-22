import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Truck, Package, RefreshCw, CheckCircle, AlertCircle, Plus, Printer, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ShippingManagement() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("shipments");
  const [carriers] = useState([
    { id: "c1", name: "Shiprocket", serviceLevels: ["Standard", "Express"], trackingBase: "https://www.shiprocket.in/shipment-tracking/" },
    { id: "c2", name: "Delhivery", serviceLevels: ["Surface", "Air"], trackingBase: "https://www.delhivery.com/track/package/" },
    { id: "c3", name: "BlueDart", serviceLevels: ["Ground", "Air"], trackingBase: "https://bluedart.com/track?trackno=" },
  ]);

  const [pendingLabels, setPendingLabels] = useState([
    { orderId: "ORD-2024-005", customer: "Rahul Verma", address: "Pune, MH", carrier: "Shiprocket", service: "Standard", weight: 1.2 },
    { orderId: "ORD-2024-006", customer: "Aditi Rao", address: "Bengaluru, KA", carrier: "Delhivery", service: "Air", weight: 0.8 },
  ]);

  const [trackingInput, setTrackingInput] = useState("");
  const [selectedCarrier, setSelectedCarrier] = useState(carriers[0].id);

  const handleGenerateLabels = () => {
    if (!pendingLabels.length) {
      toast({ title: "No shipments", description: "There are no pending labels to generate." });
      return;
    }
    toast({ title: "Labels generated", description: `${pendingLabels.length} shipping labels generated.` });
    setPendingLabels([]);
  };

  const handleTrack = () => {
    const carrier = carriers.find(c => c.id === selectedCarrier)!;
    if (!trackingInput.trim()) {
      toast({ title: "Tracking ID required", description: "Enter a tracking number to continue." });
      return;
    }
    window.open(`${carrier.trackingBase}${encodeURIComponent(trackingInput.trim())}`, "_blank");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Shipping Management</h1>
        <p className="text-muted-foreground">Generate labels, track shipments, and manage carriers</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg"><Package className="w-5 h-5 text-primary"/></div>
            <div>
              <p className="text-2xl font-bold">{pendingLabels.length}</p>
              <p className="text-sm text-muted-foreground">Pending Labels</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg"><CheckCircle className="w-5 h-5 text-success"/></div>
            <div>
              <p className="text-2xl font-bold">94%</p>
              <p className="text-sm text-muted-foreground">On-time Delivery</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg"><AlertCircle className="w-5 h-5 text-warning"/></div>
            <div>
              <p className="text-2xl font-bold">7</p>
              <p className="text-sm text-muted-foreground">Exceptions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-accent">
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="labels">Label Queue</TabsTrigger>
          <TabsTrigger value="carriers">Carriers</TabsTrigger>
        </TabsList>

        <TabsContent value="shipments">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Track Shipment</CardTitle>
              <CardDescription>Quickly open the carrier's tracking page</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Carrier</Label>
                <Select value={selectedCarrier} onValueChange={setSelectedCarrier}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {carriers.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Tracking Number</Label>
                <div className="flex gap-2">
                  <Input placeholder="Enter tracking number" value={trackingInput} onChange={(e) => setTrackingInput(e.target.value)} />
                  <Button onClick={handleTrack}>
                    <Truck className="w-4 h-4 mr-2"/> Track
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labels">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Label Queue</CardTitle>
              <CardDescription>Generate and print shipping labels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Button variant="outline" className="flex items-center gap-2"><Upload className="w-4 h-4"/> Import Orders</Button>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-2"><Printer className="w-4 h-4"/> Print</Button>
                  <Button variant="premium" onClick={handleGenerateLabels}><RefreshCw className="w-4 h-4 mr-2"/>Generate Labels</Button>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Carrier</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Weight</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingLabels.map(row => (
                    <TableRow key={row.orderId}>
                      <TableCell className="font-medium">{row.orderId}</TableCell>
                      <TableCell>{row.customer}</TableCell>
                      <TableCell>{row.address}</TableCell>
                      <TableCell>{row.carrier}</TableCell>
                      <TableCell>{row.service}</TableCell>
                      <TableCell>{row.weight} kg</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="carriers">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Carriers</CardTitle>
              <CardDescription>Supported shipping partners</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {carriers.map(c => (
                  <Card key={c.id} className="shadow-card">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Truck className="w-4 h-4"/> {c.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">Service Levels</p>
                      <div className="flex flex-wrap gap-2">
                        {c.serviceLevels.map(s => (
                          <Badge key={s} variant="outline">{s}</Badge>
                        ))}
                      </div>
                      <Button variant="outline" className="mt-3" onClick={() => window.open(c.trackingBase, "_blank")}>
                        Open Tracking Portal
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
