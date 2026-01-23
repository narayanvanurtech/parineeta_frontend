import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Star,
  AlertTriangle,
  TrendingUp,
  Upload,
  Copy,
  BarChart3,
  History,
  Grid3x3,
  FileSpreadsheet,
} from "lucide-react";
import { ProductWizard } from "./product/ProductWizard";
import { BulkUploadWizard } from "./product/BulkUploadWizard";
import { BASE_URL } from "../ui/config";
import axios from "axios";
import { ProductViewDetails } from "./product/ProductViewDetails";
import { toast } from "sonner";



export function ProductManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showProductWizard, setShowProductWizard] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [viewProduct, setViewProduct] = useState<any>(null);

  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const getAllProduct = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setProducts(res.data.products);
      } catch (error) {
        console.error("FAILED TO FETCH PRODUCTS ", error);
      }
    };

    getAllProduct();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product._id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;

    

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string, stock: number) => {
    if (status === "low_stock" || stock < 10) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Low Stock
        </Badge>
      );
    }
    return (
      <Badge variant="default" className="bg-success text-success-foreground">
        Active
      </Badge>
    );
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p._id));
    }
  };


  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on products:`, selectedProducts);
    // Implement bulk actions here
    setSelectedProducts([]);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowProductWizard(true);
  };

  const productDelete=async (id)=>{
 if (!id) {
    toast.error("product ID is missing");
    return;
  }

  const token = localStorage.getItem("token");

  try {
    const res = await axios.delete(
      `${BASE_URL}/products/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    toast.success(res.data?.message || "product deleted successfully");

   
    setProducts((prev) => prev.filter((product) => product._id !== id));

  } catch (error: any) {
    console.error("DELETE ERROR:", error.response?.data);
    toast.error(error.response?.data?.message || "Failed to delete product");
  }
};
  

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Product Management
          </h1>
          <p className="text-muted-foreground">
            Manage your ethnic wear collection
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowBulkUpload(true)}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Bulk Upload
          </Button>
          <Button
            variant="premium"
            className="flex items-center gap-2"
            onClick={() => setShowProductWizard(true)}
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{products.length}</p>
                {/* <p className="text-2xl font-bold">1,247</p> */}
                <p className="text-sm text-muted-foreground">Total Products</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                {/* <p className="text-2xl font-bold">892</p> */}
                <p className="text-2xl font-bold">{products.length}</p>
                <p className="text-sm text-muted-foreground">Active Products</p>
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
                <p className="text-2xl font-bold">23</p>
                <p className="text-sm text-muted-foreground">Low Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <Star className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">4.7</p>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Actions */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search products by name, SKU, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="sarees">Sarees</SelectItem>
                  <SelectItem value="lehengas">Lehengas</SelectItem>
                  <SelectItem value="kurta-sets">Kurta Sets</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="rounded-r-none"
                >
                  <Package className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-l-none"
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
              </div>

              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <div className="mt-4 p-3 bg-accent/50 rounded-lg border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {selectedProducts.length} product
                  {selectedProducts.length > 1 ? "s" : ""} selected
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction("edit")}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction("duplicate")}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Duplicate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction("export")}
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleBulkAction("delete")}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products Display */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Products ({filteredProducts.length})</CardTitle>
              <CardDescription>
                Comprehensive list of your ethnic wear products
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <Button variant="outline" size="sm">
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedProducts.length === filteredProducts.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow
                  key={product._id}
                  className={
                    selectedProducts.includes(product._id) ? "bg-accent/50" : ""
                  }
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(product._id)}
                      onCheckedChange={() => handleSelectProduct(product._id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={product.image} alt={product.name} />
                        <AvatarFallback>
                          {product.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          SKU: {product._id}
                        </p>
                        <div className="flex gap-1 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {product.fabric}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {product.occasion}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{product.category}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.subcategory}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      ₹{product.price.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        product.stock < 10 ? "text-destructive font-medium" : ""
                      }
                    >
                      {product.stock} units
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-success" />
                      <span className="font-medium">{product.sales}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="font-medium">{product.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(product.status, product.stock)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => setViewProduct(product)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Analytics
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={()=>productDelete(product._id)} className="cursor-pointer text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modals */}
      <ProductWizard
        isOpen={showProductWizard}
        onClose={() => {
          setShowProductWizard(false);
          setEditingProduct(null);
        }}
        setProduct={setProducts}
        editingProduct={editingProduct}
      />

      <BulkUploadWizard
        isOpen={showBulkUpload}
        onClose={() => setShowBulkUpload(false)}
      />
      <ProductViewDetails
  isOpen={!!viewProduct}
  product={viewProduct}
  onClose={() => setViewProduct(null)}
/>

    </div>
  );
}
