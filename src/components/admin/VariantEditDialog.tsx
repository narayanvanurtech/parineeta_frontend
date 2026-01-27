import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export type Variant = {
  _id: string;
  color: string;
  stock: number;
  price: number;
  images: string[];
};

type Props = {
  open: boolean;
  productId: string;
  variant: Variant | null;
  onClose: () => void;
  onUpdateVariant: (data: {
    color: string;
    stock: number;
    price: number;
    newImages: File[];
    removedImages: string[];
  }) => Promise<void>;
};

const VariantEditDialog = ({
  open,
  productId,
  variant,
  onClose,
  onUpdateVariant,
}: Props) => {
  const [color, setColor] = useState("");
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  console.log(open, productId, variant, onClose);

  useEffect(() => {
    if (!variant) return;

    setColor(variant.color);
    setStock(variant.stock);
    setPrice(variant.price);
    setExistingImages(variant.images || []);

    setRemovedImages([]);
    setNewImages([]);
    setNewPreviews([]);
  }, [variant]);

  useEffect(() => {
    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newPreviews]);

  const handleNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const previews = files.map((f) => URL.createObjectURL(f));

    setNewImages((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [...prev, ...previews]);

    e.target.value = "";
  };

  const removeExistingImage = (img: string) => {
    setExistingImages((prev) => prev.filter((i) => i !== img));
    setRemovedImages((prev) => [...prev, img]);
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(newPreviews[index]);

    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    if (!color.trim()) return toast.error("Color is required");
    if (stock < 0) return toast.error("Stock cannot be negative");
    if (price <= 0) return toast.error("Price must be greater than 0");

    await onUpdateVariant({
      color,
      stock,
      price,
      newImages,
      removedImages,
    });

    onClose();
  };

  if (!variant) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
        {/* HEADER */}
        <DialogHeader>
          <DialogTitle>Edit Variant</DialogTitle>
        </DialogHeader>

        {/* BODY (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
          <p className="text-sm text-muted-foreground">
            Product ID: <span className="font-medium">{productId}</span>
          </p>

          {/* COLOR */}
          <div>
            <label className="text-sm font-medium">Color</label>
            <Input value={color} onChange={(e) => setColor(e.target.value)} />
          </div>

          {/* STOCK */}
          <div>
            <label className="text-sm font-medium">Stock</label>
            <Input
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value) || 0)}
            />
          </div>

          {/* PRICE */}
          <div>
            <label className="text-sm font-medium">Price</label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value) || 0)}
            />
          </div>

          {/* EXISTING IMAGES */}
          {existingImages.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Existing Images</p>
              <div className="flex gap-2 flex-wrap">
                {existingImages.map((img) => (
                  <div key={img} className="relative">
                    <img
                      src={img}
                      className="w-20 h-20 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NEW IMAGES */}
          <div>
            <label className="text-sm font-medium">Add New Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleNewImages}
            />

            {newPreviews.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-3">
                {newPreviews.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={img}
                      className="w-20 h-20 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdate}>Update Variant</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VariantEditDialog;
