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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TreePine, Folder, Settings, Eye, Plus } from "lucide-react";
import { CategoryTreeView } from "./category/CategoryTreeView";
import { AttributeManager } from "./category/AttributeManager";
import { BASE_URL } from "../ui/config";
import axios from "axios";
import { toast } from "sonner";
import { log } from "console";

export function CategoryManagement() {
  
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [addingCategory, setAddingCategory] = useState<boolean>(false);
  const [mode, setMode] = useState<"add" | "edit" | "subtitle" | null>(null);
  const [categoryName,setCategoryName]=useState<any>("")
 const [selectedCategory, setSelectedCategory] = useState<any>(null);
 const [countSubCategory,setCountSubCategory]=useState<any>(0)


 

  const [newCategory, setNewCategory] = useState<any>({
    name: "",
    description: "",
  });

 const [subtitleContext, setSubtitleContext] = useState<{
  categoryId: string;
  parentSubtitleId: string | null;
} | null>(null);





  const token = localStorage.getItem("token");

 
  useEffect(() => {
    const token = localStorage.getItem("token");

    const getAllProduct = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/products`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setProducts(res.data.products);
      } catch (error) {
        console.error("FAILED TO FETCH PRODUCTS ", error);
      }
    };

    getAllProduct();
  }, []);

  // Fetch categories
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



const onCategorySelect = (category: any) => {
  setSelectedCategory(category); 
  setMode("edit"); 
  setAddingCategory(true); 
  setNewCategory({
    ...category, 
  });
  setCategoryName(category.name); 
};


  const onAddCategory = () => {
    setMode("add");
    setAddingCategory(true);
    setNewCategory({
      name: "",
      description: "",
    });
  };

 const onDeleteCategory = async (item: any) => {
  console.log("DELETE ITEM:", item);

  const isCategory = !item.categoryId;

  try {
    // 🟥 DELETE MAIN CATEGORY
    if (isCategory) {
      await axios.delete(
        `${BASE_URL}/categories/${item._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );

      toast.success("Category deleted");

      setCategories(prev =>
        prev.filter(cat => cat._id !== item._id)
      );
    }

    // 🟦 DELETE SUBTITLE (ANY LEVEL)
    else {
      const res = await axios.delete(
        `${BASE_URL}/subtitles/delete`,
        {
          data: {
            categoryId: item.categoryId, // ROOT CATEGORY
            subtitleId: item._id         // SUBTITLE TO DELETE
          },
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );

      toast.success("Subtitle deleted");

      // backend returns updated category
      setCategories(prev =>
        prev.map(cat =>
          cat._id === item.categoryId ? res.data : cat
        )
      );
    }

  } catch (err: any) {
    console.error("DELETE ERROR:", err.response?.data);
    toast.error(err.response?.data?.message || "Delete failed");
  }
};

  const onEditCategory = (category: any) => {
    setMode("edit");
    setAddingCategory(true);
    setNewCategory(category);
    setCategoryName(category.name)
  };

  const handleCancel = () => {
    setMode(null);
    setNewCategory({
      name: "",
      description: "",
    });
  };

 const handleUpdateCategory = async () => {
  const token = localStorage.getItem("token");

  if (!newCategory._id) {
    toast.error("ID is missing");
    return;
  }

  const isCategory = !newCategory.categoryId;

  try {
    let res;

    // 🔹 UPDATE CATEGORY
    if (isCategory) {
      res = await axios.put(
        `${BASE_URL}/categories/${newCategory._id}`,
        newCategory,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success("Category updated");

      setCategories(prev =>
        prev.map(cat =>
          cat._id === newCategory._id ? res.data.category : cat
        )
      );
    }

    // 🔹 UPDATE SUBTITLE
    else {
      res = await axios.put(
        `${BASE_URL}/subtitles/update`,
        {
          categoryId: newCategory.categoryId,
          subtitleId: newCategory._id,
          name: newCategory.name,
          description: newCategory.description,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success("Subtitle updated");

      setCategories(prev =>
        prev.map(cat =>
          cat._id === newCategory.categoryId ? res.data : cat
        )
      );
    }

    // 🔹 Reset state
    setMode("edit");
    setAddingCategory(false);
    setNewCategory({ name: "", description: "" });

  } catch (error: any) {
    console.error("UPDATE ERROR:", error.response?.data);
    toast.error(error.response?.data?.message || "Update failed");
  }
};



  const handleSaveCategory = async () => {
    const token = localStorage.getItem("token");

    if (!newCategory.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/categories`, newCategory, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (res.data?.message === "Category created successfully") {
        toast.success(res.data.message);
        setNewCategory({ name: "", description: "" });
        setCategories((prev) => [...prev, res.data.category]);
      }
    } catch (error: any) {
      console.error(error.response?.data);
      toast.error(error.response?.data.error || "Failed to create category");
    }
  };

//nested subcategory
const addSubTitle = (item: any) => {
  console.log("ADD SUBTITLE ITEM:", item);

  setMode("subtitle");
  setAddingCategory(true);
  setCategoryName(item)
  setNewCategory({ name: "", description: "" });
  
  const isCategory = !item.categoryId; 
  const isSubtitle =  item._id ===item.categoryId   

  setSubtitleContext({
    categoryId: isCategory
      ? item._id            
      : item.categoryId,    

    parentSubtitleId: isSubtitle
      ? undefined         
      : item._id           
  });
};

const handleSubtitle = async () => {
  console.log("SUBTITLE CONTEXT:", subtitleContext);

  if (!subtitleContext?.categoryId) {
    toast.error("Category ID is required");
    return;
  }

  try {
    const res = await axios.post(
      `${BASE_URL}/subtitles/add`,
      {
        categoryId: subtitleContext.categoryId,
        parentSubtitleId: subtitleContext.parentSubtitleId || undefined,
        subtitle: {
          name: newCategory.name,
          description: newCategory.description
        }
      },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      }
    );

    const updatedCategory = res.data;

   
    setCategories(prev =>
      prev.map(cat =>
        cat._id === updatedCategory._id ? updatedCategory : cat
      )
    );

    toast.success("Subtitle added successfully");

 
    setNewCategory({ name: "", description: "" });
    setSubtitleContext(null);
    setAddingCategory(false);
    setMode(null);

  } catch (error: any) {
    console.error("SUBTITLE ERROR:", error.response?.data);
    toast.error(error.response?.data?.message || "Failed to add subtitle");
  }
};



//count subcategory
useEffect(()=>{
  const countSubtitles = (subtitles: any[] = []): number => {
  let count = 0;

  for (const sub of subtitles) {
    count += 1; // count this subtitle

    if (sub.subtitles && sub.subtitles.length > 0) {
      count += countSubtitles(sub.subtitles); // count nested subtitles
    }
  }

  return count;
};


const totalSubtitles = categories.reduce((total, category) => {
  return total + countSubtitles(category.subtitles);
}, 0);
setCountSubCategory(totalSubtitles)

},[categories])


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Category & Attribute Management
          </h1>
          <p className="text-muted-foreground">
            Organize your product taxonomy and attributes
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TreePine className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{categories.length}</p>
              <p className="text-sm text-muted-foreground">Main Categories</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Folder className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {countSubCategory}
              </p>
              <p className="text-sm text-muted-foreground">Subcategories</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Settings className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">26</p>
              <p className="text-sm text-muted-foreground">Attributes</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <Eye className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{products.length}</p>
              <p className="text-sm text-muted-foreground">Total Products</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="categories" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <TreePine className="w-4 h-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="attributes" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Attributes
            </TabsTrigger>
          </TabsList>
          <Button
            variant="premium"
            className="flex items-center gap-2"
            onClick={onAddCategory}
          >
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        </div>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <CategoryTreeView
              categories={categories}
              onCategorySelect={onCategorySelect}
              onAddCategory={onAddCategory}
              onEditCategory={onEditCategory}
              onDeleteCategory={onDeleteCategory}
              addSubTitle={addSubTitle}
             

            />

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>
                  {" "}
                  {mode === "add" && "Add New Category"}
                  {mode === "edit" && `Edit Category   (${categoryName.name})`}
                  {mode === "subtitle" && `Add Subtitle  (${categoryName.name})`}
                </CardTitle>
                <CardDescription>
                  {addingCategory
                    ? "Fill the form below to add a new category"
                    : "Select a category to view details"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {addingCategory ? (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">
                        Category Name
                      </Label>
                      <Input
                        value={newCategory.name}
                        onChange={(e) =>
                          setNewCategory({
                            ...newCategory,
                            name: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">URL Slug</Label>
                      <Input
                        value={newCategory.slug}
                        onChange={(e) =>
                          setNewCategory({
                            ...newCategory,
                            slug: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Description</Label>
                      <Textarea
                        value={newCategory.description}
                        onChange={(e) =>
                          setNewCategory({
                            ...newCategory,
                            description: e.target.value,
                          })
                        }
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label className="text-sm font-medium">
                          Product Count
                        </Label>
                        <Input
                          value={newCategory.productCount}
                          readOnly
                          className="mt-1 bg-muted"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Status</Label>
                        <Select
                          value={newCategory.status}
                          onValueChange={(value) =>
                            setNewCategory({ ...newCategory, status: value })
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {mode && (
                      <div className="flex gap-2 pt-4">
                        <Button
                          variant="default"
                          onClick={
                            mode === "add"
                              ? handleSaveCategory
                              : mode === "subtitle"
                                ? handleSubtitle
                                : handleUpdateCategory
                          }
                        >
                          {mode === "add"
                            ? "New Category"
                            : mode === "subtitle"
                              ? `Add Subtitle `
                              : "Update Category"}
                        </Button>

                        <Button variant="outline" onClick={handleCancel}>
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Folder className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      Select a category from the tree to view and edit its
                      details
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attributes" className="space-y-6">
          <AttributeManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
