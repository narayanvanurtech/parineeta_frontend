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
import VariantEditDialog from "./VariantEditDialog";
import axios from "axios";
import { BASE_URL } from "../ui/config";
import { toast } from "sonner";

interface Variant {
  _id: string;
  color: string;
  price: number;
  stock: number;
  images: string[];
}

interface VariantViewDetailsProps {
  isOpen: boolean;
  product: any;
  variant: Variant | null;
  onClose: () => void;
  onVariantUpdated?: (variant: Variant) => void; // 🔥 IMPORTANT
}

export function VariantViewDetails({
  isOpen,
  product,
  variant,
  onClose,
}: VariantViewDetailsProps) {
  const [mainImage, setMainImage] = useState("");


  useEffect(() => {
    if (variant?.images?.length) {
      setMainImage(variant.images[0]);
    }
  }, [variant]);

 




  if (!isOpen || !variant) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* HEADER */}
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                {product.name} — {variant.color}
              </CardTitle>
              <CardDescription>Variant ID: {variant._id}</CardDescription>
            </div>

            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        {/* CONTENT */}
        <CardContent className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          <div className="flex gap-6">
            {/* IMAGE */}
            <div className="space-y-3">
              <div className="w-44 border rounded-lg overflow-hidden">
                <img
                  src={mainImage || "/placeholder.svg"}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                {variant.images.map((img) => (
                  <div
                    key={img}
                    onClick={() => setMainImage(img)}
                    className={`w-16 border rounded cursor-pointer ${
                      mainImage === img ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <img src={img} className="object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* INFO */}
            <div className="flex-1 space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Badge>{product.category}</Badge>
                <Badge variant="outline">{product.subcategory}</Badge>
                <Badge variant="secondary">{variant.color}</Badge>

                {variant.stock < 10 && (
                  <Badge variant="destructive">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Low Stock
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InfoItem
                  icon={IndianRupee}
                  label="Price"
                  value={`₹ ${variant.price}`}
                />
                <InfoItem
                  icon={Package}
                  label="Stock"
                  value={`${variant.stock} units`}
                />
              </div>

              <div className="flex gap-3">
                {product.sizes?.map((size: string) => (
                  <span key={size} className="px-3 py-1 border rounded text-sm">
                    {size}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>

        {/* FOOTER */}
        <div className="border-t p-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </Card>

    
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
