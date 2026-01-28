import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Variant = {
  color: string;
  stock: number;
  price: number;
  images: File[];
};

type VariantDialogProps = {
  productId: string | null;
  open: boolean;
  onClose: () => void;
  onSaveVariant: (variant: Variant) => Promise<void>;
};

const VariantDialog = ({
  open,
  onClose,
  productId,
  onSaveVariant,
}: VariantDialogProps) => {
  const [variant, setVariant] = useState<Variant>({
    color: "",
    stock: 0,
    price: 0,
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // 🧹 Cleanup previews (avoid memory leaks)
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));

    setVariant((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);

    setVariant((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!variant.color.trim()) {
      toast.error("Color is required");
      return;
    }
    if (variant.stock <= 0) {
      toast.error("Stock must be greater than 0");
      return;
    }
    if (variant.price <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }
    if (variant.images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    await onSaveVariant(variant);

    // Reset only after success
    setVariant({ color: "", stock: 0, price: 0, images: [] });
    setImagePreviews([]);
    onClose();
  };

  return (
   <Dialog open={open} onOpenChange={onClose}>
  <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-0">
    {/* Header */}
    <DialogHeader className="px-6 pt-6">
      <DialogTitle className="text-lg font-semibold">
        Add Variant
      </DialogTitle>
      <p className="text-sm text-muted-foreground">
        Product ID: <span className="font-medium">{productId}</span>
      </p>
    </DialogHeader>

    {/* Scrollable content */}
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
      {/* Color */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Color</label>
        <Input
          placeholder="e.g. Red"
          value={variant.color}
          onChange={(e) =>
            setVariant({ ...variant, color: e.target.value })
          }
        />
      </div>

      {/* Stock & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Stock</label>
          <Input
            type="number"
            min={0}
            value={variant.stock}
            onChange={(e) =>
              setVariant({
                ...variant,
                stock: Number(e.target.value) || 0,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Price</label>
          <Input
            type="number"
            min={0}
            value={variant.price}
            onChange={(e) =>
              setVariant({
                ...variant,
                price: Number(e.target.value) || 0,
              })
            }
          />
        </div>
      </div>

      {/* Images */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Images</label>

        <label className="flex flex-col items-center justify-center gap-2 border border-dashed rounded-lg p-4 cursor-pointer hover:bg-muted transition">
          <span className="text-sm text-muted-foreground">
            Click to upload images
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageSelect}
          />
        </label>

        {imagePreviews.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {imagePreviews.map((img, idx) => (
              <div
                key={idx}
                className="relative w-20  rounded-lg overflow-hidden border"
              >
                <img
                  src={img}
                  alt="preview"
                  className="w-full  object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* Footer */}
    <DialogFooter className="px-6 py-4 border-t">
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button onClick={handleSave}>
        Save Variant
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

  );
};

export default VariantDialog;
