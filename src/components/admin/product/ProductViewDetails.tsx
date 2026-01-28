import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, IndianRupee, Package, AlertTriangle } from "lucide-react";
import AddProduct from "./AddProduct";

interface Variant {
  _id: string;
  color: string;
  price: number;
  stock: number;
  images: string[];
}

interface ProductViewDetailsProps {
  isOpen: boolean;
  product: any;
  onClose: () => void;
  setProduct: any;
}

export function ProductViewDetails({
  isOpen,
  product,
  onClose,
  setProduct,
}: ProductViewDetailsProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [mainImage, setMainImage] = useState<string>("");
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    if (product?.variants?.length) {
      setSelectedVariant(product.variants[0]);
      setMainImage(product.variants[0].images?.[0] || "");
    }
  }, [product]);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* HEADER */}
        <CardHeader className="border-b shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{product.name}</CardTitle>
              <CardDescription>SKU: {product._id}</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        {/* CONTENT */}
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* IMAGE SECTION */}
            <div className="w-full md:w-56 shrink-0 space-y-3">
              {/* MAIN IMAGE */}
              <div className="w-full  border rounded-lg overflow-hidden bg-muted">
                <img
                  src={mainImage || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* THUMBNAILS (SAFE SCROLL) */}
              <div className="flex gap-2  pb-2">
                {selectedVariant?.images?.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`min-w-[64px] w-20  border rounded overflow-hidden shrink-0 ${
                      mainImage === img ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <img
                      src={img}
                      alt="thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* PRODUCT INFO */}
            <div className="flex-1 space-y-5 ml-10">
              {/* BADGES */}
              <div className="flex gap-2 flex-wrap">
                <Badge>{product.category}</Badge>
                <Badge variant="outline">{product.subcategory}</Badge>
                {selectedVariant?.stock < 10 && (
                  <Badge
                    variant="destructive"
                    className="flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    Low Stock
                  </Badge>
                )}
              </div>

              {/* PRICE & STOCK */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoItem
                  icon={IndianRupee}
                  label="Price"
                  value={`₹ ${selectedVariant?.price ?? "-"}`}
                />
                <InfoItem
                  icon={Package}
                  label="Stock"
                  value={`${selectedVariant?.stock ?? 0} units`}
                />
              </div>

              {/* COLORS */}
              <div>
                <p className="text-sm font-medium mb-2">Available Colors</p>
                <div className="flex gap-2 flex-wrap">
                  {product.variants.map((variant: Variant) => (
                    <button
                      key={variant._id}
                      onClick={() => {
                        setSelectedVariant(variant);
                        setMainImage(variant.images?.[0] || "");
                      }}
                      className={`px-3 py-1 text-sm rounded border transition ${
                        selectedVariant?._id === variant._id
                          ? "bg-black text-white"
                          : "bg-background"
                      }`}
                    >
                      {variant.color}
                    </button>
                  ))}
                </div>
              </div>

              {/* SIZES */}
              <div>
                <p className="text-sm font-medium mb-2">Sizes</p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size: string) => (
                    <span
                      key={size}
                      className="px-3 py-1 border rounded text-sm"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <div className="bg-accent/40 p-4 rounded-lg text-sm text-muted-foreground max-h-40 overflow-y-auto">
              {product.description || "No description provided"}
            </div>
          </div>
        </CardContent>

        {/* FOOTER */}
        <div className="border-t p-4 flex justify-end gap-2 shrink-0">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => setAddOpen(true)}>Edit Product</Button>
        </div>
      </Card>

      {/* EDIT MODAL */}
      {addOpen && (
        <AddProduct
          isOpen={addOpen}
          onClose={() => setAddOpen(false)}
          editingProduct={product}
          setProduct={setProduct}
          closeParent={onClose}
        />
      )}
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-primary/10 rounded-lg">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
