import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Eye,
  Upload,
  Image as ImageIcon,
  Tag,
  DollarSign,
  Search,
  Calendar,
  Globe,
  Grid3x3,
} from "lucide-react";
import { ProductImageManager } from "./ProductImageManager";
import { EnhancedVariantMatrix } from "./EnhancedVariantMatrix";
import { BASE_URL } from "@/components/ui/config";
import { toast } from "sonner";

interface ProductWizardProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct?: any;
  setProduct?:any

}

export function ProductWizard({
  isOpen,
  onClose,
  editingProduct,
  setProduct
}: ProductWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    category: "",
    subcategory: "",
    brand: "Pareenita",
    stock: "",

  
    images: [],
    thumbnailIndex: 0,

   
    sizes: [] as string[],
    colors: [] as string[],

    
    variants: [],
    hasVariants: false,

   
    costPrice: "",
    price: "",
    comparePrice: "",
    profitMargin: "",

   
    metaTitle: "",
    metaDescription: "",
    urlSlug: "",
    keywords: [],


    status: "draft",
    publishDate: "",
    featured: false,

  
    fabric: "",
    occasion: "",
    style: "",
    careInstructions: "",
    origin: "",
    artisan: "",
  });

  const steps = [
    { id: 1, title: "Basic Info", icon: Tag },
    { id: 2, title: "Images", icon: ImageIcon },
    { id: 3, title: "Variants & Inventory", icon: Grid3x3 },
    { id: 4, title: "Pricing", icon: DollarSign },
    { id: 5, title: "Review", icon: Eye },
  ];

  const extractSizesAndColors = (variants: any[]) => {
    const sizes = Array.from(
      new Set(variants.map((v) => v.size).filter(Boolean)),
    );

    const colors = Array.from(
      new Set(variants.map((v) => v.color).filter(Boolean)),
    );

    setProductData((prev) => ({
      ...prev,
      sizes,
      colors,
      variants, // keep for UI only
    }));
  };

  const progress = (currentStep / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setProductData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const calculateProfitMargin = (cost: number, selling: number) => {
    if (cost && selling) {
      return (((selling - cost) / selling) * 100).toFixed(2);
    }
    return "0";
  };

const handleProduct = async () => {
  try {
    const token = localStorage.getItem("token");

    const {
      variants,
      hasVariants,
      ...payload
    } = productData;

   

    const res = await axios.post(`${BASE_URL}/products`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    if(res?.statusText==="Created"){
      toast.success(res.data.message)
      onClose()
      setProduct((prev)=>[...prev,res.data.product])
    }
  } catch (error) {
    console.error(error);
  }
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-elegant">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </CardTitle>
              <CardDescription>
                Step {currentStep} of {steps.length}:{" "}
                {steps[currentStep - 1].title}
              </CardDescription>
            </div>
            <Button variant="ghost" onClick={onClose}>
              ×
            </Button>
          </div>
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-1 ${currentStep >= step.id ? "text-primary" : ""}`}
                >
                  <step.icon className="w-4 h-4" />
                  {step.title}
                </div>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={productData.name}
                    onChange={(e) => {
                      handleInputChange("name", e.target.value);
                      handleInputChange(
                        "urlSlug",
                        generateSlug(e.target.value),
                      );
                    }}
                    placeholder="Royal Blue Banarasi Saree"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">stock</Label>
                  <Input
                    id="stock"
                    value={productData.stock}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                    placeholder="PRD001"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Product Description *</Label>
                <Textarea
                  id="description"
                  value={productData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={6}
                  placeholder="Detailed product description with styling tips and cultural significance..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  value={productData.shortDescription}
                  onChange={(e) =>
                    handleInputChange("shortDescription", e.target.value)
                  }
                  rows={2}
                  placeholder="Brief description for product listings..."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={productData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sarees">Sarees</SelectItem>
                      <SelectItem value="lehengas">Lehengas</SelectItem>
                      <SelectItem value="kurta-sets">Kurta Sets</SelectItem>
                      <SelectItem value="suits">Salwar Suits</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Subcategory</Label>
                  <Select
                    value={productData.subcategory}
                    onValueChange={(value) =>
                      handleInputChange("subcategory", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="silk-sarees">Silk Sarees</SelectItem>
                      <SelectItem value="cotton-sarees">
                        Cotton Sarees
                      </SelectItem>
                      <SelectItem value="designer-sarees">
                        Designer Sarees
                      </SelectItem>
                      <SelectItem value="wedding-sarees">
                        Wedding Sarees
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Ethnic Wear Specific Fields */}
              <Separator />
              <h3 className="text-lg font-semibold">Ethnic Wear Details</h3>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Fabric Type *</Label>
                  <Select
                    value={productData.fabric}
                    onValueChange={(value) =>
                      handleInputChange("fabric", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fabric" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pure-silk">Pure Silk</SelectItem>
                      <SelectItem value="banarasi">Banarasi Silk</SelectItem>
                      <SelectItem value="kanjivaram">
                        Kanjivaram Silk
                      </SelectItem>
                      <SelectItem value="cotton">Cotton</SelectItem>
                      <SelectItem value="georgette">Georgette</SelectItem>
                      <SelectItem value="chiffon">Chiffon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Occasion</Label>
                  <Select
                    value={productData.occasion}
                    onValueChange={(value) =>
                      handleInputChange("occasion", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select occasion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="festival">Festival</SelectItem>
                      <SelectItem value="party">Party</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Regional Style</Label>
                  <Select
                    value={productData.style}
                    onValueChange={(value) => handleInputChange("style", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="north-indian">North Indian</SelectItem>
                      <SelectItem value="south-indian">South Indian</SelectItem>
                      <SelectItem value="bengali">Bengali</SelectItem>
                      <SelectItem value="rajasthani">Rajasthani</SelectItem>
                      <SelectItem value="gujarati">Gujarati</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Origin/Source</Label>
                  <Input
                    value={productData.origin}
                    onChange={(e) =>
                      handleInputChange("origin", e.target.value)
                    }
                    placeholder="Varanasi, Uttar Pradesh"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Artisan/Weaver</Label>
                  <Input
                    value={productData.artisan}
                    onChange={(e) =>
                      handleInputChange("artisan", e.target.value)
                    }
                    placeholder="Traditional artisan name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Care Instructions</Label>
                <Textarea
                  value={productData.careInstructions}
                  onChange={(e) =>
                    handleInputChange("careInstructions", e.target.value)
                  }
                  rows={3}
                  placeholder="Dry clean only. Store in cool, dry place..."
                />
              </div>
            </div>
          )}

          {/* Step 2: Images */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Product Images</h3>
                <p className="text-muted-foreground mb-4">
                  Upload high-quality images showcasing your product from
                  different angles. First image will be the main thumbnail.
                </p>
              </div>
              <ProductImageManager
                images={productData.images}
                onImagesChange={(images) => handleInputChange("images", images)}
                thumbnailIndex={productData.thumbnailIndex}
                onThumbnailChange={(index) =>
                  handleInputChange("thumbnailIndex", index)
                }
              />
            </div>
          )}

          {/* Step 3: Variants & Inventory */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Product Variants & Inventory
                </h3>
                <div className="flex items-center space-x-2 mb-4">
                  <Switch
                    checked={productData.hasVariants}
                    onCheckedChange={(checked) =>
                      handleInputChange("hasVariants", checked)
                    }
                  />
                  <Label>This product has variants (size, color, etc.)</Label>
                </div>
              </div>

              {productData.hasVariants ? (
                <EnhancedVariantMatrix
                  variants={productData.variants}
                  onVariantsChange={extractSizesAndColors}
                />
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">
                      This product will have a single variant. You can set
                      pricing and inventory in the next steps.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 4: Pricing */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Pricing Information
                </h3>
                <p className="text-muted-foreground mb-4">
                  Set competitive pricing for your ethnic wear products.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="costPrice">Cost Price *</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    value={productData.costPrice}
                    onChange={(e) => {
                      handleInputChange("costPrice", e.target.value);
                      if (productData.price) {
                        handleInputChange(
                          "profitMargin",
                          calculateProfitMargin(
                            parseFloat(e.target.value),
                            parseFloat(productData.price),
                          ),
                        );
                      }
                    }}
                    placeholder="8000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Selling Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={productData.price}
                    onChange={(e) => {
                      handleInputChange("price", e.target.value);
                      if (productData.costPrice) {
                        handleInputChange(
                          "profitMargin",
                          calculateProfitMargin(
                            parseFloat(productData.costPrice),
                            parseFloat(e.target.value),
                          ),
                        );
                      }
                    }}
                    placeholder="12999"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="comparePrice">Compare at Price</Label>
                  <Input
                    id="comparePrice"
                    type="number"
                    value={productData.comparePrice}
                    onChange={(e) =>
                      handleInputChange("comparePrice", e.target.value)
                    }
                    placeholder="15999"
                  />
                  <p className="text-xs text-muted-foreground">
                    Show customers the discount value
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Profit Margin</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={productData.profitMargin}
                      readOnly
                      className="bg-muted"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </div>
              </div>

              {/* Price Preview */}
              <Card className="bg-accent/50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Price Preview</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary">
                      ₹{productData.price || "0"}
                    </span>
                    {productData.comparePrice &&
                      parseFloat(productData.comparePrice) >
                        parseFloat(productData.price) && (
                        <>
                          <span className="text-lg text-muted-foreground line-through">
                            ₹{productData.comparePrice}
                          </span>
                          <Badge variant="destructive">
                            {Math.round(
                              (1 -
                                parseFloat(productData.price) /
                                  parseFloat(productData.comparePrice)) *
                                100,
                            )}
                            % OFF
                          </Badge>
                        </>
                      )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Review & Publish</h3>
                <p className="text-muted-foreground mb-4">
                  Review all product details before publishing.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Publication Status</Label>
                  <Select
                    value={productData.status}
                    onValueChange={(value) =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {productData.status === "scheduled" && (
                  <div className="space-y-2">
                    <Label>Publish Date</Label>
                    <Input
                      type="datetime-local"
                      value={productData.publishDate}
                      onChange={(e) =>
                        handleInputChange("publishDate", e.target.value)
                      }
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={productData.featured}
                  onCheckedChange={(checked) =>
                    handleInputChange("featured", checked)
                  }
                />
                <Label>Featured Product</Label>
              </div>

              {/* Product Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        PRODUCT NAME
                      </Label>
                      <p className="font-medium">
                        {productData.name || "Untitled Product"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        CATEGORY
                      </Label>
                      <p className="font-medium">
                        {productData.category || "Not set"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        PRICE
                      </Label>
                      <p className="font-medium">₹{productData.price || "0"}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        STATUS
                      </Label>
                      <Badge
                        variant={
                          productData.status === "active"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {productData.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>

        <div className="border-t p-6 flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="ghost" className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Draft
            </Button>
            {currentStep === steps.length ? (
              <Button
                onClick={handleProduct}
                variant="premium"
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Publish Product
              </Button>
            ) : (
              <Button onClick={nextStep} className="flex items-center gap-2">
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
