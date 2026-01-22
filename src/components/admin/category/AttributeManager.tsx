import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Settings, 
  Filter, 
  Search,
  Tag,
  Type,
  Hash,
  Calendar,
  Upload,
  ToggleLeft,
  List,
  Palette
} from "lucide-react";

interface AttributeOption {
  id: string;
  label: string;
  value: string;
  order: number;
}

interface ProductAttribute {
  id: string;
  name: string;
  code: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean' | 'date' | 'file' | 'color';
  description?: string;
  isRequired: boolean;
  isFilterable: boolean;
  isSearchable: boolean;
  isVariant: boolean;
  options: AttributeOption[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  group: string;
  order: number;
  status: 'active' | 'inactive';
}

const ethnicWearAttributes: ProductAttribute[] = [
  {
    id: 'fabric',
    name: 'Fabric Type',
    code: 'fabric_type',
    type: 'select',
    description: 'Type of fabric used in the garment',
    isRequired: true,
    isFilterable: true,
    isSearchable: true,
    isVariant: false,
    group: 'Material',
    order: 1,
    status: 'active',
    options: [
      { id: '1', label: 'Pure Silk', value: 'pure_silk', order: 1 },
      { id: '2', label: 'Banarasi Silk', value: 'banarasi_silk', order: 2 },
      { id: '3', label: 'Kanjivaram Silk', value: 'kanjivaram_silk', order: 3 },
      { id: '4', label: 'Cotton', value: 'cotton', order: 4 },
      { id: '5', label: 'Georgette', value: 'georgette', order: 5 },
      { id: '6', label: 'Chiffon', value: 'chiffon', order: 6 },
      { id: '7', label: 'Crepe', value: 'crepe', order: 7 },
      { id: '8', label: 'Net', value: 'net', order: 8 }
    ]
  },
  {
    id: 'occasion',
    name: 'Occasion',
    code: 'occasion',
    type: 'multiselect',
    description: 'Suitable occasions for the garment',
    isRequired: false,
    isFilterable: true,
    isSearchable: true,
    isVariant: false,
    group: 'Usage',
    order: 2,
    status: 'active',
    options: [
      { id: '1', label: 'Wedding', value: 'wedding', order: 1 },
      { id: '2', label: 'Festival', value: 'festival', order: 2 },
      { id: '3', label: 'Party', value: 'party', order: 3 },
      { id: '4', label: 'Casual', value: 'casual', order: 4 },
      { id: '5', label: 'Office', value: 'office', order: 5 },
      { id: '6', label: 'Traditional', value: 'traditional', order: 6 }
    ]
  },
  {
    id: 'regional_style',
    name: 'Regional Style',
    code: 'regional_style',
    type: 'select',
    description: 'Regional style or origin of the design',
    isRequired: false,
    isFilterable: true,
    isSearchable: true,
    isVariant: false,
    group: 'Design',
    order: 3,
    status: 'active',
    options: [
      { id: '1', label: 'North Indian', value: 'north_indian', order: 1 },
      { id: '2', label: 'South Indian', value: 'south_indian', order: 2 },
      { id: '3', label: 'Bengali', value: 'bengali', order: 3 },
      { id: '4', label: 'Rajasthani', value: 'rajasthani', order: 4 },
      { id: '5', label: 'Gujarati', value: 'gujarati', order: 5 },
      { id: '6', label: 'Punjabi', value: 'punjabi', order: 6 }
    ]
  },
  {
    id: 'color',
    name: 'Color',
    code: 'color',
    type: 'color',
    description: 'Primary color of the garment',
    isRequired: true,
    isFilterable: true,
    isSearchable: false,
    isVariant: true,
    group: 'Variants',
    order: 4,
    status: 'active',
    options: []
  },
  {
    id: 'size',
    name: 'Size',
    code: 'size',
    type: 'select',
    description: 'Size of the garment',
    isRequired: true,
    isFilterable: true,
    isSearchable: false,
    isVariant: true,
    group: 'Variants',
    order: 5,
    status: 'active',
    options: [
      { id: '1', label: 'XS', value: 'xs', order: 1 },
      { id: '2', label: 'S', value: 's', order: 2 },
      { id: '3', label: 'M', value: 'm', order: 3 },
      { id: '4', label: 'L', value: 'l', order: 4 },
      { id: '5', label: 'XL', value: 'xl', order: 5 },
      { id: '6', label: 'XXL', value: 'xxl', order: 6 },
      { id: '7', label: 'Free Size', value: 'free_size', order: 7 }
    ]
  }
];

export function AttributeManager() {
  const [attributes, setAttributes] = useState<ProductAttribute[]>(ethnicWearAttributes);
  const [selectedAttribute, setSelectedAttribute] = useState<ProductAttribute | null>(null);
  const [showAttributeDialog, setShowAttributeDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");

  const attributeGroups = Array.from(new Set(attributes.map(attr => attr.group)));
  const filteredAttributes = attributes.filter(attr => {
    const matchesSearch = attr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         attr.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = groupFilter === "all" || attr.group === groupFilter;
    return matchesSearch && matchesGroup;
  });

  const getAttributeTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return <Type className="w-4 h-4" />;
      case 'number': return <Hash className="w-4 h-4" />;
      case 'select': return <List className="w-4 h-4" />;
      case 'multiselect': return <Tag className="w-4 h-4" />;
      case 'boolean': return <ToggleLeft className="w-4 h-4" />;
      case 'date': return <Calendar className="w-4 h-4" />;
      case 'file': return <Upload className="w-4 h-4" />;
      case 'color': return <Palette className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const handleSaveAttribute = (attributeData: any) => {
    if (selectedAttribute) {
      // Update existing attribute
      setAttributes(prev => prev.map(attr => 
        attr.id === selectedAttribute.id ? { ...attr, ...attributeData } : attr
      ));
    } else {
      // Add new attribute
      const newAttribute: ProductAttribute = {
        id: `attr_${Date.now()}`,
        ...attributeData,
        options: attributeData.options || []
      };
      setAttributes(prev => [...prev, newAttribute]);
    }
    setShowAttributeDialog(false);
    setSelectedAttribute(null);
  };

  const handleDeleteAttribute = (attributeId: string) => {
    setAttributes(prev => prev.filter(attr => attr.id !== attributeId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Attribute Management</h2>
          <p className="text-muted-foreground">
            Define and manage product attributes for better organization and filtering
          </p>
        </div>
        <Dialog open={showAttributeDialog} onOpenChange={setShowAttributeDialog}>
          <DialogTrigger asChild>
            <Button 
              variant="premium"
              onClick={() => setSelectedAttribute(null)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Attribute
            </Button>
          </DialogTrigger>
          <AttributeFormDialog
            attribute={selectedAttribute}
            onSave={handleSaveAttribute}
            onClose={() => setShowAttributeDialog(false)}
          />
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search attributes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={groupFilter} onValueChange={setGroupFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                {attributeGroups.map(group => (
                  <SelectItem key={group} value={group}>{group}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Attributes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product Attributes ({filteredAttributes.length})</CardTitle>
          <CardDescription>
            Manage attributes that can be applied to your products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Attribute</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Properties</TableHead>
                <TableHead>Options</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttributes.map((attribute) => (
                <TableRow key={attribute.id}>
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-2">
                        {getAttributeTypeIcon(attribute.type)}
                        <span className="font-medium">{attribute.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Code: {attribute.code}
                      </p>
                      {attribute.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {attribute.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {attribute.type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{attribute.group}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {attribute.isRequired && (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      )}
                      {attribute.isFilterable && (
                        <Badge variant="default" className="text-xs">Filterable</Badge>
                      )}
                      {attribute.isSearchable && (
                        <Badge variant="secondary" className="text-xs">Searchable</Badge>
                      )}
                      {attribute.isVariant && (
                        <Badge variant="warning" className="text-xs">Variant</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {attribute.options.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {attribute.options.slice(0, 3).map(option => (
                          <Badge key={option.id} variant="outline" className="text-xs">
                            {option.label}
                          </Badge>
                        ))}
                        {attribute.options.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{attribute.options.length - 3} more
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">No options</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={attribute.status === 'active' ? 'default' : 'secondary'}>
                      {attribute.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedAttribute(attribute);
                          setShowAttributeDialog(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAttribute(attribute.id)}
                      >
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
    </div>
  );
}

// Attribute Form Dialog Component
function AttributeFormDialog({ 
  attribute, 
  onSave, 
  onClose 
}: { 
  attribute: ProductAttribute | null; 
  onSave: (data: any) => void; 
  onClose: () => void; 
}) {
  const [formData, setFormData] = useState({
    name: attribute?.name || '',
    code: attribute?.code || '',
    type: attribute?.type || 'text',
    description: attribute?.description || '',
    group: attribute?.group || 'General',
    isRequired: attribute?.isRequired || false,
    isFilterable: attribute?.isFilterable || false,
    isSearchable: attribute?.isSearchable || false,
    isVariant: attribute?.isVariant || false,
    options: attribute?.options || [],
    status: attribute?.status || 'active'
  });

  const [newOption, setNewOption] = useState({ label: '', value: '' });

  const handleAddOption = () => {
    if (newOption.label && newOption.value) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, {
          id: `opt_${Date.now()}`,
          label: newOption.label,
          value: newOption.value,
          order: prev.options.length + 1
        }]
      }));
      setNewOption({ label: '', value: '' });
    }
  };

  const handleRemoveOption = (optionId: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter(opt => opt.id !== optionId)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {attribute ? 'Edit Attribute' : 'Add New Attribute'}
        </DialogTitle>
        <DialogDescription>
          Define the properties and behavior of this product attribute
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Attribute Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Fabric Type"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Attribute Code *</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
              placeholder="fabric_type"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe what this attribute represents"
            rows={2}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="type">Attribute Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="select">Select (Single)</SelectItem>
                <SelectItem value="multiselect">Multi-Select</SelectItem>
                <SelectItem value="boolean">Yes/No</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="file">File Upload</SelectItem>
                <SelectItem value="color">Color</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="group">Group</Label>
            <Input
              id="group"
              value={formData.group}
              onChange={(e) => setFormData(prev => ({ ...prev, group: e.target.value }))}
              placeholder="Material, Design, etc."
            />
          </div>
        </div>

        {/* Options for select/multiselect types */}
        {['select', 'multiselect'].includes(formData.type) && (
          <div className="space-y-4">
            <Label>Options</Label>
            <div className="space-y-2">
              {formData.options.map((option) => (
                <div key={option.id} className="flex items-center gap-2">
                  <Input value={option.label} readOnly className="flex-1" />
                  <Input value={option.value} readOnly className="flex-1" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveOption(option.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Option label"
                  value={newOption.label}
                  onChange={(e) => setNewOption(prev => ({ ...prev, label: e.target.value }))}
                />
                <Input
                  placeholder="Option value"
                  value={newOption.value}
                  onChange={(e) => setNewOption(prev => ({ ...prev, value: e.target.value }))}
                />
                <Button type="button" onClick={handleAddOption}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Properties */}
        <div className="space-y-4">
          <Label>Properties</Label>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.isRequired}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRequired: checked }))}
              />
              <Label>Required Field</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.isFilterable}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFilterable: checked }))}
              />
              <Label>Use in Filters</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.isSearchable}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isSearchable: checked }))}
              />
              <Label>Searchable</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.isVariant}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isVariant: checked }))}
              />
              <Label>Variant Attribute</Label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {attribute ? 'Update Attribute' : 'Add Attribute'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}