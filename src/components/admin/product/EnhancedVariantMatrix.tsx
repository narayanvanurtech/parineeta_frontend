import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  X, 
  Palette, 
  Ruler, 
  Package, 
  AlertTriangle, 
  MoreHorizontal,
  Copy,
  Trash2,
  BarChart3,
  Filter,
  Download,
  Upload,
  Save,
  RefreshCw
} from "lucide-react";

interface Variant {
  id: string;
  size: string;
  color: string;
  sku: string;
  price: number;
  stock: number;
  weight?: number;
  barcode?: string;
  enabled: boolean;
  outOfStock: boolean;
  priceOverride?: number;
  restockDate?: string;
}

interface VariantMatrixProps {
  variants: Variant[];
  onVariantsChange: (variants: Variant[]) => void;
}

export function EnhancedVariantMatrix({ variants, onVariantsChange }: VariantMatrixProps) {
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
  const [bulkWeight, setBulkWeight] = useState('');
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [filterBy, setFilterBy] = useState<'all' | 'oos' | 'low' | 'zero'>('all');
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingCell) {
        if (e.key === 'Escape') {
          setEditingCell(null);
        } else if (e.key === 'Enter') {
          // Move to next row
          const variantIndex = variants.findIndex(v => v.id === editingCell.id);
          if (variantIndex < variants.length - 1) {
            setEditingCell({ id: variants[variantIndex + 1].id, field: editingCell.field });
          } else {
            setEditingCell(null);
          }
        }
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        // Auto-save functionality would go here
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editingCell, variants]);

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
            enabled: true,
            outOfStock: false
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
    }
  };

  const removeColor = (colorName: string) => {
    setColors(colors.filter(c => c.name !== colorName));
    const filteredVariants = variants.filter(v => v.color !== colorName);
    onVariantsChange(filteredVariants);
  };

  const updateVariant = (variantId: string, field: string, value: any) => {
    const updatedVariants = variants.map(variant => {
      if (variant.id === variantId) {
        const updated = { ...variant, [field]: value };
        // Auto-generate SKU if not manually set
        if (field === 'size' || field === 'color') {
          updated.sku = `PRD-${updated.size}-${updated.color.toUpperCase()}`;
        }
        return updated;
      }
      return variant;
    });
    onVariantsChange(updatedVariants);
  };

  const applyBulkAction = (action: string, value: string) => {
    if (!value) return;
    
    const targetVariants = selectedVariants.length > 0 
      ? variants.filter(v => selectedVariants.includes(v.id))
      : variants.filter(v => v.enabled);

    const updatedVariants = variants.map(variant => {
      if (targetVariants.includes(variant)) {
        switch (action) {
          case 'price':
            return { ...variant, price: parseFloat(value) };
          case 'priceOverride':
            return { ...variant, priceOverride: parseFloat(value) };
          case 'stock':
            return { ...variant, stock: parseInt(value) };
          case 'weight':
            return { ...variant, weight: parseFloat(value) };
          case 'oos':
            return { ...variant, outOfStock: value === 'true' };
          default:
            return variant;
        }
      }
      return variant;
    });
    
    onVariantsChange(updatedVariants);
    
    // Clear inputs
    setBulkPrice('');
    setBulkStock('');
    setBulkWeight('');
  };

  const toggleVariantSelection = (variantId: string) => {
    setSelectedVariants(prev => 
      prev.includes(variantId)
        ? prev.filter(id => id !== variantId)
        : [...prev, variantId]
    );
  };

  const selectAllVariants = (checked: boolean) => {
    setSelectedVariants(checked ? filteredVariants.map(v => v.id) : []);
  };

  const duplicateVariant = (variant: Variant) => {
    const newVariant = {
      ...variant,
      id: `variant_${variant.size}_${variant.color}_${Date.now()}`,
      sku: `${variant.sku}-COPY`
    };
    onVariantsChange([...variants, newVariant]);
  };

  const deleteVariant = (variantId: string) => {
    onVariantsChange(variants.filter(v => v.id !== variantId));
  };

  // Filter variants
  const filteredVariants = variants.filter(variant => {
    switch (filterBy) {
      case 'oos':
        return variant.outOfStock;
      case 'low':
        return variant.stock > 0 && variant.stock < 5;
      case 'zero':
        return variant.stock === 0;
      default:
        return true;
    }
  });

  const enabledVariants = variants.filter(v => v.enabled);
  const totalStock = enabledVariants.reduce((sum, v) => sum + v.stock, 0);
  const lowStockVariants = enabledVariants.filter(v => v.stock < 5 && v.stock > 0);
  const oosVariants = variants.filter(v => v.outOfStock);

  const exportToCSV = () => {
    const headers = ['Product ID', 'Size', 'Color', 'SKU', 'Price', 'Price Override', 'Stock', 'OOS Flag', 'Barcode', 'Weight'];
    const rows = variants.map(v => [
      'PRD001', // This would be the actual product ID
      v.size,
      v.color,
      v.sku,
      v.price,
      v.priceOverride || '',
      v.stock,
      v.outOfStock,
      v.barcode || '',
      v.weight || ''
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-variants.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Size Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Size Options</CardTitle>
          </div>
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
        </CardContent>
      </Card>

      {/* Color Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Color Options</CardTitle>
          </div>
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

      {/* Bulk Actions & Controls */}
      {variants.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Bulk Actions & Controls</CardTitle>
                <CardDescription>Apply changes to multiple variants at once</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={exportToCSV} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Import CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Set price"
                  type="number"
                  value={bulkPrice}
                  onChange={(e) => setBulkPrice(e.target.value)}
                />
                <Button 
                  onClick={() => applyBulkAction('price', bulkPrice)} 
                  variant="outline"
                  size="sm"
                >
                  Apply
                </Button>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Set stock"
                  type="number"
                  value={bulkStock}
                  onChange={(e) => setBulkStock(e.target.value)}
                />
                <Button 
                  onClick={() => applyBulkAction('stock', bulkStock)} 
                  variant="outline"
                  size="sm"
                >
                  Apply
                </Button>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Set weight (g)"
                  type="number"
                  value={bulkWeight}
                  onChange={(e) => setBulkWeight(e.target.value)}
                />
                <Button 
                  onClick={() => applyBulkAction('weight', bulkWeight)} 
                  variant="outline"
                  size="sm"
                >
                  Apply
                </Button>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => applyBulkAction('oos', 'true')} 
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Mark OOS
                </Button>
                <Button 
                  onClick={() => applyBulkAction('oos', 'false')} 
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Mark Available
                </Button>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {selectedVariants.length > 0 
                ? `Actions will apply to ${selectedVariants.length} selected variants`
                : "Actions will apply to all enabled variants"}
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
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="oos">OOS Only</SelectItem>
                      <SelectItem value="low">Low Stock</SelectItem>
                      <SelectItem value="zero">Zero Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span>{enabledVariants.length} Active</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Stock: {totalStock}</span>
                  </div>
                  {oosVariants.length > 0 && (
                    <div className="flex items-center gap-1 text-destructive">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{oosVariants.length} OOS</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto" ref={tableRef}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedVariants.length === filteredVariants.length}
                        onCheckedChange={selectAllVariants}
                      />
                    </TableHead>
                    <TableHead>Variant</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Price (₹)</TableHead>
                    <TableHead>Override (₹)</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Weight (g)</TableHead>
                    <TableHead>Barcode</TableHead>
                    <TableHead>OOS</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVariants.map(variant => (
                    <TableRow 
                      key={variant.id} 
                      className={!variant.enabled ? 'opacity-50' : ''}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedVariants.includes(variant.id)}
                          onCheckedChange={() => toggleVariantSelection(variant.id)}
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
                          className="w-28"
                          disabled={!variant.enabled}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={variant.price}
                          onChange={(e) => updateVariant(variant.id, 'price', parseFloat(e.target.value) || 0)}
                          className="w-20"
                          disabled={!variant.enabled}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={variant.priceOverride || ''}
                          onChange={(e) => updateVariant(variant.id, 'priceOverride', parseFloat(e.target.value) || undefined)}
                          className="w-20"
                          disabled={!variant.enabled}
                          placeholder="Override"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={variant.stock}
                          onChange={(e) => updateVariant(variant.id, 'stock', parseInt(e.target.value) || 0)}
                          className="w-16"
                          disabled={!variant.enabled}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={variant.weight || ''}
                          onChange={(e) => updateVariant(variant.id, 'weight', parseFloat(e.target.value) || undefined)}
                          className="w-16"
                          placeholder="500"
                          disabled={!variant.enabled}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={variant.barcode || ''}
                          onChange={(e) => updateVariant(variant.id, 'barcode', e.target.value)}
                          className="w-24"
                          placeholder="123456789"
                          disabled={!variant.enabled}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={variant.outOfStock}
                          onCheckedChange={(checked) => updateVariant(variant.id, 'outOfStock', checked)}
                          disabled={!variant.enabled}
                        />
                      </TableCell>
                      <TableCell>
                        {variant.enabled ? (
                          variant.outOfStock ? (
                            <Badge variant="destructive">Out of Stock</Badge>
                          ) : variant.stock < 5 ? (
                            <Badge variant="destructive">Low Stock</Badge>
                          ) : variant.stock === 0 ? (
                            <Badge variant="outline">Zero Stock</Badge>
                          ) : (
                            <Badge variant="default">In Stock</Badge>
                          )
                        ) : (
                          <Badge variant="secondary">Disabled</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => duplicateVariant(variant)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BarChart3 className="w-4 h-4 mr-2" />
                              View Analytics
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => deleteVariant(variant.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Variant
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Matrix Overview */}
            <div className="mt-4 p-4 bg-accent/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Matrix Overview</h4>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate Matrix
                  </Button>
                  <Button size="sm" variant="outline">
                    <Save className="w-4 h-4 mr-2" />
                    Auto-save: On
                  </Button>
                </div>
              </div>
              <div className="grid gap-2 md:grid-cols-5 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Variants:</span>
                  <span className="font-medium ml-2">{variants.length}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Active:</span>
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
                      Math.round(enabledVariants.reduce((sum, v) => sum + (v.priceOverride || v.price), 0) / enabledVariants.length) : 0
                    }
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Low Stock:</span>
                  <span className="font-medium ml-2">{lowStockVariants.length}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}