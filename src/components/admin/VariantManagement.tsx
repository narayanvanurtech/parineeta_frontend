import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../ui/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Layers,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AddProduct from "./product/AddProduct";
import VariantDialog from "./Dialog";
import { ProductViewDetails } from "./product/ProductViewDetails";
import { VariantViewDetails } from "./VariantView";
import VariantEditDialog from "./VariantEditDialog";

function VariantManagement() {
  const [products, setProducts] = useState<any[]>([]);
  const [isVariantOpen, setIsVariantOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState<any>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );

  const [viewOpen, setViewOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editVariant, setEditVariant] = useState<any>(null);
  const [editProductId, setEditProductId] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchProducts = async () => {
      const res = await axios.get(`${BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setProducts(res.data.products);
    };

    fetchProducts();
  }, []);

  // 🔢 Stats
  const totalProducts = products.length;
  const totalVariants = products.reduce(
    (acc, product) => acc + (product.variants?.length || 0),
    0,
  );

  // 🗑 Delete Variant
  const handleDeleteVariant = async (productId: string, variantId: string) => {
    const token = localStorage.getItem("token");

    console.log(productId, variantId);
    try {
      await axios.delete(
        `${BASE_URL}/products/${productId}/variants/${variantId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );

      // Update UI
      setProducts((prev) =>
        prev.map((product) =>
          product._id === productId
            ? {
                ...product,
                variants: product.variants.filter(
                  (v: any) => v._id !== variantId,
                ),
              }
            : product,
        ),
      );

      toast.success("Variant deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete variant");
    }
  };

  const openVariantForm = (productId: string) => {
    setSelectedProductId(productId);
    setIsVariantOpen(true);
  };

  const handleSaveVariant = async (variant: any) => {
    const token = localStorage.getItem("token");
    if (!selectedProductId) return;

    try {
      const formData = new FormData();
      formData.append("color", variant.color);
      formData.append("stock", String(variant.stock));
      formData.append("price", String(variant.price));

      variant.images.forEach((file: File) => formData.append("images", file));

      const res = await axios.post(
        `${BASE_URL}/products/${selectedProductId}/variants`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      } else {
        const savedVariant = res.data.variant;

        // ✅ Update products list
        setProducts((prev) =>
          prev.map((product) =>
            product._id === selectedProductId
              ? {
                  ...product,
                  variants: [...(product.variants || []), savedVariant],
                }
              : product,
          ),
        );

        // ✅ Update opened view dialog
        setViewProduct((prev: any) =>
          prev && prev._id === selectedProductId
            ? {
                ...prev,
                variants: [...(prev.variants || []), savedVariant],
              }
            : prev,
        );

        toast.success(res.data.message || "Variant added successfully");
        setIsVariantOpen(false);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save variant");
    }
  };

  const handleUpdateVariant = async ({
  color,
  stock,
  price,
  newImages,
  removedImages,
}: any) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("color", color);
  formData.append("stock", String(stock));
  formData.append("price", String(price));

  removedImages.forEach((img: string) =>
    formData.append("removedImages", img),
  );
  newImages.forEach((file: File) =>
    formData.append("images", file),
  );

  const res = await axios.put(
    `${BASE_URL}/products/${editProductId}/variants/${editVariant._id}`,
    formData,
    {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    },
  );

  const updatedVariant = res.data.variant; // 👈 backend should return updated variant

  // ✅ LIVE UPDATE PRODUCTS STATE
  setProducts((prev) =>
    prev.map((product) =>
      product._id === editProductId
        ? {
            ...product,
            variants: product.variants.map((v: any) =>
              v._id === updatedVariant._id ? updatedVariant : v,
            ),
          }
        : product,
    ),
  );

  // ✅ update opened view modal if same variant
  setSelectedVariant((prev: any) =>
    prev && prev._id === updatedVariant._id ? updatedVariant : prev,
  );

  toast.success("Variant updated successfully");
  setEditOpen(false);
};


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Variant Management</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Package className="w-6 h-6 text-primary" />
            <div>
              <p className="text-2xl font-bold">{totalProducts}</p>
              <p className="text-muted-foreground text-sm">Total Products</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Layers className="w-6 h-6 text-success" />
            <div>
              <p className="text-2xl font-bold">{totalVariants}</p>
              <p className="text-muted-foreground text-sm">Total Variants</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Variants Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products & Variants</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product / Variant</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {products.map((product) => (
                <>
                  {/* Product Row */}
                  <TableRow key={product._id} className="bg-muted/40">
                    <TableCell colSpan={5} className="font-semibold">
                      {product.name}
                      <Badge className="ml-2" variant="outline">
                        {product.variants?.length || 0} variants
                      </Badge>
                    </TableCell>

                    <TableCell className="h-full text-center">
                      <Button onClick={() => openVariantForm(product._id)}>
                        Add Variant
                      </Button>
                    </TableCell>
                  </TableRow>

                  {/* Variant Rows */}
                  {product.variants?.map((variant: any) => (
                    <TableRow key={variant._id}>
                      <TableCell className="pl-8 text-muted-foreground">
                        └ Variant
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{variant.color}</Badge>
                      </TableCell>
                      <TableCell>₹{variant.price}</TableCell>
                      <TableCell>
                        {variant.stock < 10 ? (
                          <span className="text-destructive font-medium">
                            {variant.stock}
                          </span>
                        ) : (
                          variant.stock
                        )}
                      </TableCell>

                      {/* 🔥 Actions */}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                              Variant Actions
                            </DropdownMenuLabel>

                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedVariant(variant);
                                setViewOpen(true);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => {
                                setEditVariant(variant);
                                setEditProductId(product._id);
                                setEditOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Variant
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() =>
                                handleDeleteVariant(product._id, variant._id)
                              }
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Variant
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <VariantDialog
        open={isVariantOpen}
        onClose={() => {
          setIsVariantOpen(false);
          setSelectedProductId(null);
        }}
        productId={selectedProductId}
        onSaveVariant={handleSaveVariant}
      />

      <ProductViewDetails
        isOpen={!!viewProduct}
        product={viewProduct}
        setProduct={setProducts}
        onClose={() => setViewProduct(null)}
      />
      <VariantViewDetails
        isOpen={viewOpen}
        product={products}
        variant={selectedVariant}
        onClose={() => setViewOpen(false)}
      />

      <VariantEditDialog
        open={editOpen}
        productId={editProductId}
        variant={editVariant}
        onClose={() => setEditOpen(false)}
        onUpdateVariant={handleUpdateVariant}
      />
    </div>
  );
}

export default VariantManagement;
