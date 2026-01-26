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
  setProduct: any; // pass setProducts from parent
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

  // initialize variant on open
  useEffect(() => {
    if (product?.variants?.length) {
      setSelectedVariant(product.variants[0]);
      setMainImage(product.variants[0].images[0]);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* HEADER */}
        <CardHeader className="border-b">
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
        <CardContent className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* IMAGE + BASIC INFO */}
          <div className="flex gap-6">
            {/* IMAGE SECTION */}
            <div className="space-y-3">
              <div className="w-44 border rounded-lg overflow-hidden">
                <img
                  src={mainImage || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* THUMBNAILS */}
              <div className="flex gap-2 flex-wrap">
                {selectedVariant?.images?.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`w-16 border rounded cursor-pointer overflow-hidden ${
                      mainImage === img ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <img
                      src={img}
                      alt="thumb"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* PRODUCT INFO */}
            <div className="flex-1 space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Badge>{product.category}</Badge>
                <Badge variant="outline">{product.subcategory}</Badge>
                {selectedVariant?.stock < 10 && (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Low Stock
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InfoItem
                  icon={IndianRupee}
                  label="Price"
                  value={`₹ ${selectedVariant?.price}`}
                />
                <InfoItem
                  icon={Package}
                  label="Stock"
                  value={`${selectedVariant?.stock} units`}
                />
              </div>

              {/* COLORS */}
              <div>
                <p className="text-sm font-medium mb-2">Available Colors</p>
                <div className="flex gap-2">
                  {product.variants.map((variant: Variant) => (
                    <button
                      key={variant._id}
                      onClick={() => {
                        setSelectedVariant(variant);
                        setMainImage(variant.images[0]);
                      }}
                      className={`px-3 py-1 rounded border text-sm ${
                        selectedVariant?._id === variant._id
                          ? "bg-black text-white"
                          : "bg-white"
                      }`}
                    >
                      {variant.color}
                    </button>
                  ))}
                </div>
              </div>

              {/* SIZES */}
              <div className="flex gap-3">
                {product.sizes.map((size: string) => (
                  <button key={size} className="px-3 py-1 border rounded">
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <div className="bg-accent/40 p-4 rounded-lg text-muted-foreground">
              {product.description || "No description provided"}
            </div>
          </div>
        </CardContent>

        {/* FOOTER */}
        <div className="border-t p-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {/* Pass product directly */}
          <Button onClick={() => setAddOpen(true)}>Edit Product</Button>
        </div>
      </Card>

      {/* ADD PRODUCT MODAL */}
      {addOpen && (
        <AddProduct
          isOpen={addOpen}
          onClose={() => setAddOpen(false)}
          editingProduct={product} // pass current product directly
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
