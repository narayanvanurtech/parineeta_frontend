import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  X, 
  Star, 
  Image as ImageIcon, 
  Move, 
  Crop, 
  Maximize,
  Download
} from "lucide-react";

interface ImageData {
  id: string;
  url: string;
  altText: string;
  caption?: string;
  isMain?: boolean;
}

interface ProductImageManagerProps {
  images: ImageData[];
  onImagesChange: (images: ImageData[]) => void;
  thumbnailIndex: number;
  onThumbnailChange: (index: number) => void;
}

export function ProductImageManager({ 
  images, 
  onImagesChange, 
  thumbnailIndex, 
  onThumbnailChange 
}: ProductImageManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage: ImageData = {
            id: `img_${Date.now()}_${index}`,
            url: e.target?.result as string,
            altText: `Product image ${images.length + index + 1}`,
            caption: '',
            isMain: images.length === 0 && index === 0
          };
          
          onImagesChange([...images, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const removeImage = (imageId: string) => {
    const newImages = images.filter(img => img.id !== imageId);
    onImagesChange(newImages);
    
    // Adjust thumbnail index if needed
    const removedIndex = images.findIndex(img => img.id === imageId);
    if (removedIndex === thumbnailIndex && newImages.length > 0) {
      onThumbnailChange(0);
    } else if (removedIndex < thumbnailIndex) {
      onThumbnailChange(thumbnailIndex - 1);
    }
  };

  const updateImageData = (imageId: string, field: string, value: string) => {
    const updatedImages = images.map(img => 
      img.id === imageId ? { ...img, [field]: value } : img
    );
    onImagesChange(updatedImages);
  };

  const setAsMainImage = (index: number) => {
    onThumbnailChange(index);
    const updatedImages = images.map((img, i) => ({
      ...img,
      isMain: i === index
    }));
    onImagesChange(updatedImages);
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    onImagesChange(newImages);
    
    // Update thumbnail index
    if (fromIndex === thumbnailIndex) {
      onThumbnailChange(toIndex);
    } else if (fromIndex < thumbnailIndex && toIndex >= thumbnailIndex) {
      onThumbnailChange(thumbnailIndex - 1);
    } else if (fromIndex > thumbnailIndex && toIndex <= thumbnailIndex) {
      onThumbnailChange(thumbnailIndex + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className={`transition-colors duration-200 ${dragOver ? 'border-primary bg-primary/5' : ''}`}>
        <CardContent className="p-6">
          <div
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload Product Images</h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop images here, or click to browse
            </p>
            <p className="text-sm text-muted-foreground">
              Supported formats: JPG, PNG, WEBP (Max 5MB each)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <Card key={image.id} className={`relative group ${index === thumbnailIndex ? 'ring-2 ring-primary' : ''}`}>
              <CardContent className="p-4">
                {/* Image Preview */}
                <div className="relative aspect-square mb-3 bg-muted rounded-lg overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.altText}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => setSelectedImage(image.id)}
                  />
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setSelectedImage(image.id)}
                    >
                      <Maximize className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                    >
                      <Crop className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Main Image Badge */}
                  {index === thumbnailIndex && (
                    <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                      <Star className="w-3 h-3 mr-1" />
                      Main
                    </Badge>
                  )}

                  {/* Remove Button */}
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(image.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>

                  {/* Drag Handle */}
                  <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="secondary">
                      <Move className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Image Details */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Alt Text</Label>
                    <Input
                      value={image.altText}
                      onChange={(e) => updateImageData(image.id, 'altText', e.target.value)}
                      placeholder="Describe this image"
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Caption (Optional)</Label>
                    <Input
                      value={image.caption || ''}
                      onChange={(e) => updateImageData(image.id, 'caption', e.target.value)}
                      placeholder="Image caption"
                      className="text-sm"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {index !== thumbnailIndex && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setAsMainImage(index)}
                        className="flex-1 text-xs"
                      >
                        Set as Main
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs"
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <img
              src={images.find(img => img.id === selectedImage)?.url}
              alt="Preview"
              className="w-full h-full object-contain"
            />
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Upload Guidelines */}
      <Card className="bg-accent/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <ImageIcon className="w-5 h-5 text-primary mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Image Guidelines</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use high-resolution images (minimum 1000x1000 pixels)</li>
                <li>• First image will be used as the main product thumbnail</li>
                <li>• Include multiple angles: front, back, side, and detail shots</li>
                <li>• Show the product in use or styled appropriately</li>
                <li>• Ensure good lighting and neutral backgrounds</li>
                <li>• Add descriptive alt text for accessibility</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}