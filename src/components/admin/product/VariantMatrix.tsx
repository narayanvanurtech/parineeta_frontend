import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Plus, X, Palette, Ruler, Package, AlertTriangle } from "lucide-react";

interface Variant {
  id: string;
  size: string;
  color: string;
  sku: string;
  price: number;
  stock: number;
  weight?: number;
  enabled: boolean;
}

interface VariantMatrixProps {
  variants: Variant[];
  onVariantsChange: (variants: Variant[]) => void;
}

export function VariantMatrix({ variants, onVariantsChange }: VariantMatrixProps) {
  const [sizes, setSizes] = useState(['XS', 'S', 'M', 'L', 'XL', 'XXL']);
  const [colors, setColors] = useState([
    { name: 'Red', hex: '#dc2626' },
    { name: 'Blue', hex: '#2563eb' },
    { name: 'Green', hex: '#16a34a' },
    { name: 'Gold', hex: '#d4af37' },
    { name: 'Pink', hex: '#ec4899' },
    { name: 'Purple', hex: '#9333ea' }
  ]);
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState({ name: '', hex: '#000000' });
  const [bulkPrice, setBulkPrice] = useState('');
  const [bulkStock, setBulkStock] = useState('');

  // Generate variant matrix
  const generateVariants = () => {
    const newVariants: Variant[] = [];
    sizes.forEach(size => {
      colors.forEach(color => {
        const existingVariant = variants.find(v => v.size === size && v.color === color.name);
        if (existingVariant) {
          newVariants.push(existingVariant);
        } else {
          newVariants.push({
            id: `variant_${size}_${color.name}_${Date.now()}`,
            size,
            color: color.name,
            sku: `PRD-${size}-${color.name.toUpperCase()}`,
            price: 0,
            stock: 0,
            enabled: true
          });
        }
      });
    });
    onVariantsChange(newVariants);
  };

  const addSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize]);
      setNewSize('');
      generateVariants();
    }
  };

  const removeSize = (size: string) => {
    setSizes(sizes.filter(s => s !== size));
    const filteredVariants = variants.filter(v => v.size !== size);
    onVariantsChange(filteredVariants);
  };

  const addColor = () => {
    if (newColor.name && !colors.find(c => c.name === newColor.name)) {
      setColors([...colors, newColor]);
      setNewColor({ name: '', hex: '#000000' });
      generateVariants();
    }
  };

  const removeColor = (colorName: string) => {
    setColors(colors.filter(c => c.name !== colorName));
    const filteredVariants = variants.filter(v => v.color !== colorName);
    onVariantsChange(filteredVariants);
  };

  const updateVariant = (variantId: string, field: string, value: any) => {
    const updatedVariants = variants.map(variant =>
      variant.id === variantId ? { ...variant, [field]: value } : variant
    );
    onVariantsChange(updatedVariants);
  };

  const applyBulkPrice = () => {
    if (bulkPrice) {
      const updatedVariants = variants.map(variant =>
        variant.enabled ? { ...variant, price: parseFloat(bulkPrice) } : variant
      );
      onVariantsChange(updatedVariants);
      setBulkPrice('');
    }
  };

  const applyBulkStock = () => {
    if (bulkStock) {
      const updatedVariants = variants.map(variant =>
        variant.enabled ? { ...variant, stock: parseInt(bulkStock) } : variant
      );
      onVariantsChange(updatedVariants);
      setBulkStock('');
    }
  };

  const enabledVariants = variants.filter(v => v.enabled);
  const totalStock = enabledVariants.reduce((sum, v) => sum + v.stock, 0);
  const lowStockVariants = enabledVariants.filter(v => v.stock < 5);

  return (
    <div className="space-y-6">
      {/* Size Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Size Options</CardTitle>
          </div>
          <CardDescription>
            Define available sizes for this product
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {sizes.map(size => (
              <Badge key={size} variant="secondary" className="flex items-center gap-1">
                {size}
                <button
                  onClick={() => removeSize(size)}
                  className="hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add size (e.g., 3XL)"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSize()}
              className="max-w-xs"
            />
            <Button onClick={addSize} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Tip: Use standard sizing (XS, S, M, L, XL) or custom sizes specific to your product
          </div>
        </CardContent>
      </Card>

      {/* Color Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Color Options</CardTitle>
          </div>
          <CardDescription>
            Define available colors for this product
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {colors.map(color => (
              <Badge key={color.name} variant="secondary" className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full border"
                  style={{ backgroundColor: color.hex }}
                />
                {color.name}
                <button
                  onClick={() => removeColor(color.name)}
                  className="hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Color name"
              value={newColor.name}
              onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
              className="max-w-xs"
            />
            <Input
              type="color"
              value={newColor.hex}
              onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
              className="w-16"
            />
            <Button onClick={addColor} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generate Matrix Button */}
      {variants.length === 0 && (
        <div className="text-center p-6">
          <Button onClick={generateVariants} size="lg" className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Generate Variant Matrix
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            This will create all possible size × color combinations
          </p>
        </div>
      )}

      {/* Bulk Actions */}
      {variants.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bulk Actions</CardTitle>
            <CardDescription>Apply changes to multiple variants at once</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Set price for all enabled variants"
                  type="number"
                  value={bulkPrice}
                  onChange={(e) => setBulkPrice(e.target.value)}
                />
                <Button onClick={applyBulkPrice} variant="outline">
                  Apply Price
                </Button>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Set stock for all enabled variants"
                  type="number"
                  value={bulkStock}
                  onChange={(e) => setBulkStock(e.target.value)}
                />
                <Button onClick={applyBulkStock} variant="outline">
                  Apply Stock
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Variant Matrix Table */}
      {variants.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Variant Matrix</CardTitle>
                <CardDescription>
                  Manage pricing and inventory for each variant
                </CardDescription>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span>{enabledVariants.length} Active</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Total Stock: {totalStock}</span>
                </div>
                {lowStockVariants.length > 0 && (
                  <div className="flex items-center gap-1 text-warning">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{lowStockVariants.length} Low Stock</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Enabled</TableHead>
                    <TableHead>Variant</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Price (₹)</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Weight (g)</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {variants.map(variant => (
                    <TableRow key={variant.id} className={!variant.enabled ? 'opacity-50' : ''}>
                      <TableCell>
                        <Checkbox
                          checked={variant.enabled}
                          onCheckedChange={(checked) => 
                            updateVariant(variant.id, 'enabled', checked)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border"
                            style={{ 
                              backgroundColor: colors.find(c => c.name === variant.color)?.hex || '#000'
                            }}
                          />
                          <span className="font-medium">{variant.size}</span>
                          <span className="text-muted-foreground">•</span>
                          <span>{variant.color}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          value={variant.sku}
                          onChange={(e) => updateVariant(variant.id, 'sku', e.target.value)}
                          className="w-32"
                          disabled={!variant.enabled}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={variant.price}
                          onChange={(e) => updateVariant(variant.id, 'price', parseFloat(e.target.value) || 0)}
                          className="w-24"
                          disabled={!variant.enabled}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={variant.stock}
                          onChange={(e) => updateVariant(variant.id, 'stock', parseInt(e.target.value) || 0)}
                          className="w-20"
                          disabled={!variant.enabled}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={variant.weight || ''}
                          onChange={(e) => updateVariant(variant.id, 'weight', parseFloat(e.target.value) || undefined)}
                          className="w-20"
                          placeholder="500"
                          disabled={!variant.enabled}
                        />
                      </TableCell>
                      <TableCell>
                        {variant.enabled ? (
                          variant.stock < 5 ? (
                            <Badge variant="destructive">Low Stock</Badge>
                          ) : variant.stock === 0 ? (
                            <Badge variant="outline">Out of Stock</Badge>
                          ) : (
                            <Badge variant="default">In Stock</Badge>
                          )
                        ) : (
                          <Badge variant="secondary">Disabled</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Matrix Overview */}
            <div className="mt-4 p-4 bg-accent/50 rounded-lg">
              <h4 className="font-semibold mb-2">Matrix Overview</h4>
              <div className="grid gap-2 md:grid-cols-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Variants:</span>
                  <span className="font-medium ml-2">{variants.length}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Active Variants:</span>
                  <span className="font-medium ml-2">{enabledVariants.length}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Stock:</span>
                  <span className="font-medium ml-2">{totalStock} units</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Avg Price:</span>
                  <span className="font-medium ml-2">
                    ₹{enabledVariants.length > 0 ? 
                      Math.round(enabledVariants.reduce((sum, v) => sum + v.price, 0) / enabledVariants.length) : 0
                    }
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}