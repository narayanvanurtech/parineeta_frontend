import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Percent,
  Plus,
  Search,
  Calendar,
  Target,
  Gift,
  TrendingUp,
  Users,
  ShoppingCart,
  Edit,
  Trash2,
  Copy,
  Eye,
  Star,
  BarChart3,
  Settings,
  Filter
} from "lucide-react";
import { AdvancedOfferCreator } from "./offer/AdvancedOfferCreator";

const offers = [
  {
    id: "OFF001",
    name: "Diwali Mega Sale",
    type: "percentage",
    value: 25,
    code: "DIWALI25",
    description: "Special discount for Diwali festival collection",
    category: "All Categories", 
    minOrder: 5000,
    maxDiscount: 10000,
    validFrom: "2024-10-20",
    validTo: "2024-11-05",
    usageLimit: 1000,
    usedCount: 347,
    status: "active",
    customerSegment: "All Customers"
  },
  {
    id: "OFF002",
    name: "New Customer Welcome",
    type: "fixed",
    value: 1500,
    code: "WELCOME1500",
    description: "Welcome offer for first-time customers",
    category: "All Categories",
    minOrder: 3000,
    maxDiscount: 1500,
    validFrom: "2024-01-01",
    validTo: "2024-12-31",
    usageLimit: 5000,
    usedCount: 1234,
    status: "active",
    customerSegment: "New Customers"
  },
  {
    id: "OFF003",
    name: "VIP Customer Exclusive",
    type: "percentage",
    value: 30,
    code: "VIP30",
    description: "Exclusive discount for VIP customers",
    category: "Premium Collection",
    minOrder: 15000,
    maxDiscount: 25000,
    validFrom: "2024-01-01",
    validTo: "2024-12-31",
    usageLimit: 200,
    usedCount: 89,
    status: "active",
    customerSegment: "VIP Customers"
  },
  {
    id: "OFF004",
    name: "Wedding Season Special",
    type: "percentage",
    value: 20,
    code: "WEDDING20",
    description: "Special discount on wedding collection",
    category: "Wedding Collection",
    minOrder: 10000,
    maxDiscount: 15000,
    validFrom: "2024-02-01",
    validTo: "2024-02-29",
    usageLimit: 500,
    usedCount: 456,
    status: "expired",
    customerSegment: "All Customers"
  }
];

export function OffersDiscounts() {
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAdvancedCreatorOpen, setIsAdvancedCreatorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [offerList, setOfferList] = useState(offers);
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);
  const [isOfferViewOpen, setIsOfferViewOpen] = useState(false);
  const [isOfferEditOpen, setIsOfferEditOpen] = useState(false);
  const [editableOffer, setEditableOffer] = useState<any | null>(null);
  const { toast } = useToast();

const handleOfferCreate = (offer: any) => {
  setOfferList((prev) => [{ ...offer, id: `OFF${prev.length + 100}` }, ...prev]);
  toast({ title: "Offer created", description: offer.name });
};

  const getStatusBadge = (status: string) => {
    const config = {
      active: { variant: "success" as const, label: "Active" },
      expired: { variant: "secondary" as const, label: "Expired" },
      scheduled: { variant: "warning" as const, label: "Scheduled" },
      paused: { variant: "destructive" as const, label: "Paused" }
    };
    
    const { variant, label } = config[status as keyof typeof config];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    return type === "percentage" ? <Percent className="w-4 h-4" /> : <Gift className="w-4 h-4" />;
  };

const filteredOffers = offerList.filter(offer => {
  const matchesTab = activeTab === "all" || offer.status === activeTab;
  const q = searchQuery.toLowerCase();
  const matchesSearch = !q || offer.name.toLowerCase().includes(q) || offer.code.toLowerCase().includes(q);
  return matchesTab && matchesSearch;
});

const offerCounts = {
  all: offerList.length,
  active: offerList.filter(o => o.status === "active").length,
  expired: offerList.filter(o => o.status === "expired").length,
  scheduled: offerList.filter(o => o.status === "scheduled").length
};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Offers & Discount Management</h1>
          <p className="text-muted-foreground">Create and manage promotional campaigns</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Performance Analytics
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Advanced Filters
          </Button>
          <Button 
            variant="secondary" 
            className="flex items-center gap-2"
            onClick={() => setIsAdvancedCreatorOpen(true)}
          >
            <Settings className="w-4 h-4" />
            Advanced Creator
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="premium" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Offer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Offer</DialogTitle>
                <DialogDescription>Set up a new promotional campaign</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="offerName">Offer Name</Label>
                    <Input id="offerName" placeholder="e.g., Diwali Special" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="offerCode">Offer Code</Label>
                    <Input id="offerCode" placeholder="e.g., DIWALI25" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe your offer..." />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Discount Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                        <SelectItem value="bogo">Buy One Get One</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountValue">Discount Value</Label>
                    <Input id="discountValue" type="number" placeholder="25" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minOrder">Minimum Order</Label>
                    <Input id="minOrder" type="number" placeholder="5000" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="validFrom">Valid From</Label>
                    <Input id="validFrom" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="validTo">Valid To</Label>
                    <Input id="validTo" type="date" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Customer Segment</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select segment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Customers</SelectItem>
                        <SelectItem value="new">New Customers</SelectItem>
                        <SelectItem value="vip">VIP Customers</SelectItem>
                        <SelectItem value="inactive">Inactive Customers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="usageLimit">Usage Limit</Label>
                    <Input id="usageLimit" type="number" placeholder="1000" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="premium">Create Offer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Percent className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Active Offers</p>
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
              <div>
                <p className="text-2xl font-bold">2,134</p>
                <p className="text-sm text-muted-foreground">Total Redemptions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Target className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹3.2L</p>
                <p className="text-sm text-muted-foreground">Discount Given</p>
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
                <p className="text-2xl font-bold">₹12.8L</p>
                <p className="text-sm text-muted-foreground">Additional Revenue</p>
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
              placeholder="Search offers by name or code..."
              className="pl-10 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Offers Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-accent">
          <TabsTrigger value="all">All ({offerCounts.all})</TabsTrigger>
          <TabsTrigger value="active">Active ({offerCounts.active})</TabsTrigger>
          <TabsTrigger value="expired">Expired ({offerCounts.expired})</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled ({offerCounts.scheduled})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Offers ({filteredOffers.length})</CardTitle>
              <CardDescription>Manage your promotional campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Offer Details</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Validity</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOffers.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(offer.type)}
                            <p className="font-medium">{offer.name}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">Code: {offer.code}</p>
                          <p className="text-xs text-muted-foreground">{offer.description}</p>
                          <Badge variant="outline" className="text-xs">{offer.customerSegment}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {offer.type === "percentage" ? `${offer.value}%` : `₹${offer.value}`}
                          </p>
                          <p className="text-sm text-muted-foreground">Min: ₹{offer.minOrder}</p>
                          {offer.maxDiscount && (
                            <p className="text-xs text-muted-foreground">Max: ₹{offer.maxDiscount}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="w-3 h-3" />
                            {offer.validFrom}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            to {offer.validTo}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{offer.usedCount}/{offer.usageLimit}</p>
                          <div className="w-full bg-secondary rounded-full h-2 mt-1">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${(offer.usedCount / offer.usageLimit) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {Math.round((offer.usedCount / offer.usageLimit) * 100)}% used
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-primary text-primary" />
                          <span className="text-sm font-medium">
                            {offer.status === "active" ? "4.2" : "3.8"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {offer.usedCount} redemptions
                        </p>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(offer.status)}
                      </TableCell>
                      <TableCell className="text-right">
<div className="flex gap-1 justify-end">
  <Button variant="ghost" size="icon" onClick={() => { setSelectedOffer(offer); setIsOfferViewOpen(true); }}>
    <Eye className="w-4 h-4" />
  </Button>
  <Button variant="ghost" size="icon" onClick={() => { setEditableOffer({ ...offer }); setIsOfferEditOpen(true); }}>
    <Edit className="w-4 h-4" />
  </Button>
  <Button variant="ghost" size="icon" onClick={() => { setOfferList((prev) => [{ ...offer, id: `COPY-${offer.id}` }, ...prev]); toast({ title: "Offer duplicated", description: offer.name }); }}>
    <Copy className="w-4 h-4" />
  </Button>
  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { setOfferList(prev => prev.filter(o => o.id !== offer.id)); toast({ title: "Offer deleted", description: offer.name }); }}>
    <Trash2 className="w-4 h-4" />
  </Button>
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

      {/* Advanced Offer Creator */}
      <AdvancedOfferCreator
        isOpen={isAdvancedCreatorOpen}
        onClose={() => setIsAdvancedCreatorOpen(false)}
        onOfferCreate={handleOfferCreate}
/>

{/* View Offer */}
<Dialog open={isOfferViewOpen} onOpenChange={setIsOfferViewOpen}>
  <DialogContent className="max-w-xl">
    <DialogHeader>
      <DialogTitle>Offer Details - {selectedOffer?.name}</DialogTitle>
      <DialogDescription>Code: {selectedOffer?.code}</DialogDescription>
    </DialogHeader>
    <div className="space-y-3">
      <p className="text-sm">{selectedOffer?.description}</p>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <p><strong>Type:</strong> {selectedOffer?.type}</p>
        <p><strong>Value:</strong> {selectedOffer?.type === 'percentage' ? `${selectedOffer?.value}%` : `₹${selectedOffer?.value}`}</p>
        <p><strong>Validity:</strong> {selectedOffer?.validFrom} to {selectedOffer?.validTo}</p>
        <p><strong>Segment:</strong> {selectedOffer?.customerSegment}</p>
        <p><strong>Status:</strong> {selectedOffer?.status}</p>
      </div>
    </div>
  </DialogContent>
</Dialog>

{/* Edit Offer */}
<Dialog open={isOfferEditOpen} onOpenChange={setIsOfferEditOpen}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Edit Offer</DialogTitle>
    </DialogHeader>
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={editableOffer?.name || ''} onChange={(e) => setEditableOffer((p:any)=>({...p, name:e.target.value}))} />
        </div>
        <div className="space-y-2">
          <Label>Code</Label>
          <Input value={editableOffer?.code || ''} onChange={(e) => setEditableOffer((p:any)=>({...p, code:e.target.value}))} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea value={editableOffer?.description || ''} onChange={(e) => setEditableOffer((p:any)=>({...p, description:e.target.value}))} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={editableOffer?.type} onValueChange={(v)=>setEditableOffer((p:any)=>({...p, type:v}))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="fixed">Fixed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Value</Label>
          <Input type="number" value={editableOffer?.value ?? 0} onChange={(e) => setEditableOffer((p:any)=>({...p, value:Number(e.target.value)}))} />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={editableOffer?.status} onValueChange={(v)=>setEditableOffer((p:any)=>({...p, status:v}))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Valid From</Label>
          <Input type="date" value={editableOffer?.validFrom || ''} onChange={(e) => setEditableOffer((p:any)=>({...p, validFrom:e.target.value}))} />
        </div>
        <div className="space-y-2">
          <Label>Valid To</Label>
          <Input type="date" value={editableOffer?.validTo || ''} onChange={(e) => setEditableOffer((p:any)=>({...p, validTo:e.target.value}))} />
        </div>
      </div>
    </div>
    <DialogFooter>
      <Button variant="outline" onClick={()=>setIsOfferEditOpen(false)}>Cancel</Button>
      <Button onClick={()=>{ setOfferList((prev)=>prev.map(o=>o.id===editableOffer.id? editableOffer : o)); setIsOfferEditOpen(false); toast({ title:'Offer updated', description: editableOffer?.name }); }}>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

</div>
  );
}
