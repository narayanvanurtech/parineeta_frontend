import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Star,
  AlertTriangle,
  Package,
  IndianRupee,
  Layers,
  Palette,
  Calendar
} from "lucide-react";

interface ProductViewDetailsProps {
  isOpen: boolean;
  product: any;
  onClose: () => void;
}

export function ProductViewDetails({
  isOpen,
  product,
  onClose
}: ProductViewDetailsProps) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-elegant">
        
        {/* Header */}
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{product.name}</CardTitle>
              <CardDescription>
                SKU: {product._id}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
          
          {/* Product Image */}
          <div className="flex gap-6">
            <div className="w-64 h-64 rounded-lg border overflow-hidden bg-muted">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Basic Info */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge>{product.category}</Badge>
                <Badge variant="outline">{product.subcategory}</Badge>
                {product.stock < 10 && (
                  <Badge variant="destructive" className="flex gap-1 items-center">
                    <AlertTriangle className="w-3 h-3" />
                    Low Stock
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InfoItem icon={IndianRupee} label="Price" value={`₹${product.price}`} />
                <InfoItem icon={Package} label="Stock" value={`${product.stock} units`} />
                <InfoItem icon={Star} label="Rating" value={product.rating || "N/A"} />
                <InfoItem icon={Layers} label="Sales" value={product.sales || 0} />
              </div>
            </div>
          </div>

          {/* Description */}
          <Section title="Description">
            <p className="text-muted-foreground">
              {product.description || "No description provided"}
            </p>
          </Section>

          {/* Attributes */}
          <Section title="Product Attributes">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Attribute label="Fabric" value={product.fabric} icon={Palette} />
              <Attribute label="Occasion" value={product.occasion} icon={Calendar} />
              <Attribute label="Status" value={product.status} />
            </div>
          </Section>

          {/* SEO */}
          <Section title="SEO Information">
            <div className="space-y-2">
              <p><span className="font-medium">SEO Title:</span> {product.seoTitle || "-"}</p>
              <p><span className="font-medium">SEO Description:</span> {product.seoDescription || "-"}</p>
            </div>
          </Section>
        </CardContent>

        {/* Footer */}
        <div className="border-t p-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            Edit Product
          </Button>
        </div>
      </Card>
    </div>
  );
}



function Section({ title, children }: any) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="bg-accent/40 rounded-lg p-4">
        {children}
      </div>
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

function Attribute({ label, value, icon: Icon }: any) {
  return (
    <div className="flex items-center gap-3">
      {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value || "-"}</p>
      </div>
    </div>
  );
}
