import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CalendarIcon,
  Plus,
  Target,
  Settings,
  BarChart3,
  Users,
  ShoppingCart,
  Percent,
  Gift,
  Clock,
  Globe,
  Smartphone,
  Mail,
  MessageSquare,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface AdvancedOfferCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onOfferCreate: (offer: any) => void;
}

export function AdvancedOfferCreator({ isOpen, onClose, onOfferCreate }: AdvancedOfferCreatorProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    type: "percentage",
    value: "",
    minOrder: "",
    maxDiscount: "",
    validFrom: undefined as Date | undefined,
    validTo: undefined as Date | undefined,
    usageLimit: "",
    customerSegment: "all",
    categories: [] as string[],
    products: [] as string[],
    stackable: false,
    autoApply: false,
    channels: [] as string[],
    regions: [] as string[],
    abTestEnabled: false,
    abVariantB: {
      name: "",
      value: "",
      description: ""
    }
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  const categories = [
    "Sarees", "Lehengas", "Kurta Sets", "Dupattas", "Blouses", 
    "Wedding Collection", "Festival Collection", "Premium Silk", "Cotton Collection"
  ];

  const channels = ["Website", "Mobile App", "Social Media", "Email Campaign", "WhatsApp"];
  const regions = ["North India", "South India", "West India", "East India", "Metro Cities", "Tier 2 Cities"];

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleChannelToggle = (channel: string) => {
    setSelectedChannels(prev => 
      prev.includes(channel) 
        ? prev.filter(c => c !== channel)
        : [...prev, channel]
    );
  };

  const handleRegionToggle = (region: string) => {
    setSelectedRegions(prev => 
      prev.includes(region) 
        ? prev.filter(r => r !== region)
        : [...prev, region]
    );
  };

  const handleSubmit = () => {
    const offer = {
      ...formData,
      categories: selectedCategories,
      channels: selectedChannels,
      regions: selectedRegions,
      id: `OFF${Date.now()}`,
      status: "active",
      usedCount: 0
    };
    onOfferCreate(offer);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Advanced Offer Campaign</DialogTitle>
          <DialogDescription>
            Design a comprehensive promotional campaign with advanced targeting and analytics
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Basic
            </TabsTrigger>
            <TabsTrigger value="targeting" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Targeting
            </TabsTrigger>
            <TabsTrigger value="channels" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Channels
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Advanced
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="offerName">Campaign Name *</Label>
                    <Input 
                      id="offerName" 
                      placeholder="e.g., Diwali Mega Sale 2024"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="offerCode">Coupon Code *</Label>
                    <Input 
                      id="offerCode" 
                      placeholder="e.g., DIWALI25"
                      value={formData.code}
                      onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Campaign Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe your promotional campaign..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Discount Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Discount Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">
                          <div className="flex items-center gap-2">
                            <Percent className="w-4 h-4" />
                            Percentage Off
                          </div>
                        </SelectItem>
                        <SelectItem value="fixed">
                          <div className="flex items-center gap-2">
                            <Gift className="w-4 h-4" />
                            Fixed Amount Off
                          </div>
                        </SelectItem>
                        <SelectItem value="bogo">Buy One Get One</SelectItem>
                        <SelectItem value="shipping">Free Shipping</SelectItem>
                        <SelectItem value="bundle">Bundle Deal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountValue">
                      Discount Value {formData.type === "percentage" ? "(%)" : "(₹)"}
                    </Label>
                    <Input 
                      id="discountValue" 
                      type="number" 
                      placeholder={formData.type === "percentage" ? "25" : "1500"}
                      value={formData.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minOrder">Minimum Order (₹)</Label>
                    <Input 
                      id="minOrder" 
                      type="number" 
                      placeholder="5000"
                      value={formData.minOrder}
                      onChange={(e) => setFormData(prev => ({ ...prev, minOrder: e.target.value }))}
                    />
                  </div>
                </div>
                {formData.type === "percentage" && (
                  <div className="space-y-2">
                    <Label htmlFor="maxDiscount">Maximum Discount Amount (₹)</Label>
                    <Input 
                      id="maxDiscount" 
                      type="number" 
                      placeholder="10000"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxDiscount: e.target.value }))}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Duration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Valid From</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.validFrom && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.validFrom ? format(formData.validFrom, "PPP") : <span>Pick start date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.validFrom}
                          onSelect={(date) => setFormData(prev => ({ ...prev, validFrom: date }))}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Valid To</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.validTo && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.validTo ? format(formData.validTo, "PPP") : <span>Pick end date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.validTo}
                          onSelect={(date) => setFormData(prev => ({ ...prev, validTo: date }))}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usageLimit">Usage Limit</Label>
                  <Input 
                    id="usageLimit" 
                    type="number" 
                    placeholder="1000"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="targeting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Targeting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Customer Segment</Label>
                  <Select value={formData.customerSegment} onValueChange={(value) => setFormData(prev => ({ ...prev, customerSegment: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Customers</SelectItem>
                      <SelectItem value="new">New Customers (First Purchase)</SelectItem>
                      <SelectItem value="returning">Returning Customers</SelectItem>
                      <SelectItem value="vip">VIP Customers</SelectItem>
                      <SelectItem value="inactive">Inactive Customers (No order in 90 days)</SelectItem>
                      <SelectItem value="high-value">High Value Customers (&gt;₹50,000 LTV)</SelectItem>
                      <SelectItem value="frequent">Frequent Buyers (&gt;5 orders)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Targeting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Apply to Categories</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => handleCategoryToggle(category)}
                        />
                        <Label htmlFor={category} className="text-sm">{category}</Label>
                      </div>
                    ))}
                  </div>
                  {selectedCategories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedCategories.map((category) => (
                        <Badge key={category} variant="secondary" className="cursor-pointer" onClick={() => handleCategoryToggle(category)}>
                          {category} <X className="w-3 h-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Targeting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Target Regions</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {regions.map((region) => (
                      <div key={region} className="flex items-center space-x-2">
                        <Checkbox
                          id={region}
                          checked={selectedRegions.includes(region)}
                          onCheckedChange={() => handleRegionToggle(region)}
                        />
                        <Label htmlFor={region} className="text-sm">{region}</Label>
                      </div>
                    ))}
                  </div>
                  {selectedRegions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedRegions.map((region) => (
                        <Badge key={region} variant="secondary" className="cursor-pointer" onClick={() => handleRegionToggle(region)}>
                          {region} <X className="w-3 h-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="channels" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribution Channels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Available On</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {channels.map((channel) => (
                      <div key={channel} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {channel === "Website" && <Globe className="w-5 h-5 text-primary" />}
                          {channel === "Mobile App" && <Smartphone className="w-5 h-5 text-primary" />}
                          {channel === "Social Media" && <Users className="w-5 h-5 text-primary" />}
                          {channel === "Email Campaign" && <Mail className="w-5 h-5 text-primary" />}
                          {channel === "WhatsApp" && <MessageSquare className="w-5 h-5 text-primary" />}
                          <Label htmlFor={`channel-${channel}`} className="font-medium">{channel}</Label>
                        </div>
                        <Checkbox
                          id={`channel-${channel}`}
                          checked={selectedChannels.includes(channel)}
                          onCheckedChange={() => handleChannelToggle(channel)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Stackable with Other Offers</Label>
                    <p className="text-sm text-muted-foreground">Allow this offer to be combined with other promotions</p>
                  </div>
                  <Switch
                    checked={formData.stackable}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, stackable: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Auto-Apply</Label>
                    <p className="text-sm text-muted-foreground">Automatically apply when conditions are met</p>
                  </div>
                  <Switch
                    checked={formData.autoApply}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, autoApply: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Enable A/B Testing</Label>
                    <p className="text-sm text-muted-foreground">Test two different offer variations</p>
                  </div>
                  <Switch
                    checked={formData.abTestEnabled}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, abTestEnabled: checked }))}
                  />
                </div>
                {formData.abTestEnabled && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">A/B Testing Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Variant B Name</Label>
                          <Input 
                            placeholder="Alternative offer name"
                            value={formData.abVariantB.name}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              abVariantB: { ...prev.abVariantB, name: e.target.value } 
                            }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Variant B Value</Label>
                          <Input 
                            type="number"
                            placeholder="Different discount value"
                            value={formData.abVariantB.value}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              abVariantB: { ...prev.abVariantB, value: e.target.value } 
                            }))}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Variant B Description</Label>
                        <Textarea 
                          placeholder="Description for variant B"
                          value={formData.abVariantB.description}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            abVariantB: { ...prev.abVariantB, description: e.target.value } 
                          }))}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border-2 border-primary/20 rounded-lg bg-primary/5">
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-primary">{formData.name || "Campaign Name"}</h3>
                    <div className="flex items-center justify-center gap-2">
                      {formData.type === "percentage" ? <Percent className="w-5 h-5" /> : <Gift className="w-5 h-5" />}
                      <span className="text-2xl font-bold">
                        {formData.type === "percentage" ? `${formData.value}% OFF` : `₹${formData.value} OFF`}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{formData.description || "Campaign description"}</p>
                    <div className="inline-block px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-mono">
                      {formData.code || "COUPONCODE"}
                    </div>
                    {formData.minOrder && (
                      <p className="text-xs text-muted-foreground">
                        *Minimum order value: ₹{formData.minOrder}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-medium">Target Audience</h4>
                    <Badge variant="secondary">{formData.customerSegment.replace('-', ' ').toUpperCase()}</Badge>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Usage Limit</h4>
                    <p className="text-sm">{formData.usageLimit || "Unlimited"} uses</p>
                  </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Categories</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedCategories.length > 0 ? selectedCategories.map((cat) => (
                          <Badge key={cat} variant="outline" className="text-xs">{cat}</Badge>
                        )) : <Badge variant="outline" className="text-xs">All Categories</Badge>}
                      </div>
                    </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Channels</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedChannels.length > 0 ? selectedChannels.map((channel) => (
                        <Badge key={channel} variant="outline" className="text-xs">{channel}</Badge>
                      )) : <Badge variant="outline" className="text-xs">All Channels</Badge>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary">
              Save as Draft
            </Button>
            <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}