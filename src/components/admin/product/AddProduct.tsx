import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SizesInput from "./SizesInput";
import axios from "axios";
import { BASE_URL } from "@/components/ui/config";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface AddProductProps {
  isOpen: boolean;
  onClose: () => void;
  setProduct:any
  closeParent?: () => void;
}

const AddProduct = ({ isOpen, onClose, setProduct, editingProduct = null,closeParent }) => {
  const [categories, setCategories] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const token = localStorage.getItem("token");

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    stock: "",
    price: "",
    sizes: [],
  });

  // Reset modal on close
  useEffect(() => {
    if (!isOpen) {
      setProductData({
        name: "",
        description: "",
        category: "",
        subcategory: "",
        stock: "",
        price: "",
        sizes: [],
      });
      setSubCategory([]);
    }
  }, [isOpen]);

  // Fetch all categories
  useEffect(() => {
    const getAllCategory = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setCategories(res.data.categories);
      } catch (error) {
        console.error("FAILED TO FETCH CATEGORIES ", error);
      }
    };
    getAllCategory();
  }, []);

  // When editing, populate form
  useEffect(() => {
    if (editingProduct && categories.length > 0) {
      setProductData({
        name: editingProduct.name || "",
        description: editingProduct.description || "",
        category: editingProduct.category || "",
        subcategory: editingProduct.subcategory || "",
        stock: editingProduct.stock || "",
        price: editingProduct.price || "",
        sizes: editingProduct.sizes || [],
      });
    }
  }, [editingProduct, categories]);

  // Update subcategories when category changes
  useEffect(() => {
    if (!productData.category) {
      setSubCategory([]);
      return;
    }
    const selectedCategory = categories.find(
      (category) => category.name === productData.category
    );
    setSubCategory(selectedCategory?.subtitles || []);
  }, [productData.category, categories]);

  const handleChange = (field, value) => {
    setProductData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: productData.name,
      description: productData.description,
      category: productData.category,
      subcategory: productData.subcategory,
      stock: Number(productData.stock),
      price: Number(productData.price),
      sizes: productData.sizes,
    };

    try {
      let res;
      if (editingProduct) {
        // UPDATE PRODUCT
        res = await axios.put(`${BASE_URL}/products/${editingProduct._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        toast.success("Product updated successfully");
     
  setProduct((prev) =>
    prev.map((p) => (p._id === editingProduct._id ? res.data.product : p))
  );

      } else {
        // CREATE PRODUCT
        res = await axios.post(`${BASE_URL}/products`, payload, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        toast.success("Product created successfully");
       
  setProduct((prev) => [...prev, res.data.product]);
      }

      onClose();
      if (typeof closeParent === "function") {
      closeParent(); 
    }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save product");
    }
  };

  console.log(productData)
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>

        <Card className="border-none shadow-none">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* BASIC INFO */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label>Product Name *</Label>
                  <Input
                    value={productData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Women's Cotton Saree"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label>Description</Label>
                  <Textarea
                    value={productData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Soft cotton saree with elegant border"
                    rows={3}
                  />
                </div>
              </div>

              {/* CATEGORY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Category *</Label>
                  <Select
                    key={productData.category || "category"}
                    value={productData.category}
                    onValueChange={(value) =>
                      setProductData((prev) => ({
                        ...prev,
                        category: value,
                        subcategory: "",
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label>Sub Category *</Label>
                  <Select
                    key={productData.subcategory || "subcategory"}
                    value={productData.subcategory}
                    onValueChange={(value) => handleChange("subcategory", value)}
                    disabled={!productData.category}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sub category" />
                    </SelectTrigger>
                    <SelectContent>
                      {subCategory.map((sub) => (
                        <SelectItem key={sub._id} value={sub.name}>
                          {sub.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* PRICING */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Base Price *</Label>
                  <Input
                    type="number"
                    value={productData.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    placeholder="₹2100"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label>Total Stock *</Label>
                  <Input
                    type="number"
                    value={productData.stock}
                    onChange={(e) => handleChange("stock", e.target.value)}
                    placeholder="150"
                    required
                  />
                </div>
              </div>

              {/* SIZES */}
              <SizesInput
                sizes={productData.sizes}
                setSizes={(sizes) => handleChange("sizes", sizes)}
              />

              {/* ACTIONS */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProduct ? "Update Product" : "Save Product"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default AddProduct;
