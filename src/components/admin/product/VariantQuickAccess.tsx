import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Package, 
  AlertTriangle, 
  Filter, 
  Settings,
  Calendar,
  Bell,
  Download
} from "lucide-react";

interface Variant {
  id: string;
  size: string;
  color: string;
  sku: string;
  price: number;
  stock: number;
  outOfStock: boolean;
  priceOverride?: number;
  restockDate?: string;
}

interface VariantQuickAccessProps {
  variants: Variant[];
  onVariantsChange: (variants: Variant[]) => void;
  productName: string;
}

export function VariantQuickAccess({ variants, onVariantsChange, productName }: VariantQuickAccessProps) {
  const [filterBy, setFilterBy] = useState<'all' | 'oos' | 'low' | 'zero' | 'coming_soon'>('all');
  const [restockDate, setRestockDate] = useState('');

  const updateVariant = (variantId: string, field: string, value: any) => {
    const updatedVariants = variants.map(variant =>
      variant.id === variantId ? { ...variant, [field]: value } : variant
    );
    onVariantsChange(updatedVariants);
  };

  const bulkToggleOOS = (value: boolean) => {
    const filteredVariants = getFilteredVariants();
    const updatedVariants = variants.map(variant =>
      filteredVariants.includes(variant) ? { ...variant, outOfStock: value } : variant
    );
    onVariantsChange(updatedVariants);
  };

  const bulkSetRestockDate = () => {
    if (!restockDate) return;
    const filteredVariants = getFilteredVariants();
    const updatedVariants = variants.map(variant =>
      filteredVariants.includes(variant) ? { ...variant, restockDate } : variant
    );
    onVariantsChange(updatedVariants);
    setRestockDate('');
  };

  const getFilteredVariants = () => {
    return variants.filter(variant => {
      switch (filterBy) {
        case 'oos':
          return variant.outOfStock;
        case 'low':
          return variant.stock > 0 && variant.stock < 5;
        case 'zero':
          return variant.stock === 0;
        case 'coming_soon':
          return variant.restockDate && new Date(variant.restockDate) > new Date();
        default:
          return true;
      }
    });
  };

  const filteredVariants = getFilteredVariants();
  const oosCount = variants.filter(v => v.outOfStock).length;
  const lowStockCount = variants.filter(v => v.stock > 0 && v.stock < 5).length;
  const zeroStockCount = variants.filter(v => v.stock === 0).length;
  const comingSoonCount = variants.filter(v => v.restockDate && new Date(v.restockDate) > new Date()).length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Manage Variants
          {oosCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {oosCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[600px] sm:w-[800px]">
        <SheetHeader>
          <SheetTitle>Variant Quick Access</SheetTitle>
          <SheetDescription>
            Quick management for {productName} variants
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Out of Stock</p>
                    <p className="text-lg font-bold text-destructive">{oosCount}</p>
                  </div>
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Low Stock</p>
                    <p className="text-lg font-bold text-warning">{lowStockCount}</p>
                  </div>
                  <Package className="w-4 h-4 text-warning" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Zero Stock</p>
                    <p className="text-lg font-bold">{zeroStockCount}</p>
                  </div>
                  <Package className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Coming Soon</p>
                    <p className="text-lg font-bold text-primary">{comingSoonCount}</p>
                  </div>
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters & Bulk Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Variants</SelectItem>
                      <SelectItem value="oos">Out of Stock</SelectItem>
                      <SelectItem value="low">Low Stock</SelectItem>
                      <SelectItem value="zero">Zero Stock</SelectItem>
                      <SelectItem value="coming_soon">Coming Soon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-muted-foreground">
                  Showing {filteredVariants.length} variants
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={() => bulkToggleOOS(true)} 
                  variant="outline" 
                  size="sm"
                >
                  Mark Selected OOS
                </Button>
                <Button 
                  onClick={() => bulkToggleOOS(false)} 
                  variant="outline" 
                  size="sm"
                >
                  Mark Available
                </Button>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={restockDate}
                    onChange={(e) => setRestockDate(e.target.value)}
                    className="w-40"
                    placeholder="Restock date"
                  />
                  <Button onClick={bulkSetRestockDate} variant="outline" size="sm">
                    Set Restock Date
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Variant List */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {filteredVariants.map(variant => (
              <Card key={variant.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{variant.size}</span>
                        <span className="text-muted-foreground">•</span>
                        <span>{variant.color}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {variant.sku}
                      </Badge>
                      {variant.stock > 0 ? (
                        <Badge variant={variant.stock < 5 ? "destructive" : "default"}>
                          {variant.stock} in stock
                        </Badge>
                      ) : (
                        <Badge variant="outline">No stock</Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {variant.restockDate && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date(variant.restockDate).toLocaleDateString()}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs">OOS</span>
                        <Switch
                          checked={variant.outOfStock}
                          onCheckedChange={(checked) => updateVariant(variant.id, 'outOfStock', checked)}
                        />
                      </div>

                      <Input
                        type="number"
                        value={variant.stock}
                        onChange={(e) => updateVariant(variant.id, 'stock', parseInt(e.target.value) || 0)}
                        className="w-16 h-8"
                        min="0"
                      />

                      {variant.outOfStock && !variant.restockDate && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const date = new Date();
                            date.setDate(date.getDate() + 7); // Default to 1 week from now
                            updateVariant(variant.id, 'restockDate', date.toISOString().split('T')[0]);
                          }}
                        >
                          <Bell className="w-3 h-3 mr-1" />
                          Notify
                        </Button>
                      )}
                    </div>
                  </div>

                  {variant.outOfStock && variant.restockDate && (
                    <div className="mt-2 p-2 bg-accent/50 rounded text-xs">
                      <div className="flex items-center justify-between">
                        <span>Expected back: {new Date(variant.restockDate).toLocaleDateString()}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateVariant(variant.id, 'restockDate', undefined)}
                        >
                          Clear Date
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}