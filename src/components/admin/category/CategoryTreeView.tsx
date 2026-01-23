import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Plus,
  Edit,
  Trash2,
  Move,
  Eye,
  Settings,
} from "lucide-react";

interface Category {
  _id: string;

  // For subtitles (child categories)
  categoryId?: string;

  name: string;
  description?: string;

  // Tree structure
  subtitles?: Category[];
  children?: Category[];

  productCount?: number;
  status?: "active" | "inactive";
}




interface CategoryTreeViewProps {
  categories: Category[];

  onCategorySelect: (category: {
    _id: string;
    categoryId?: string;
  }) => void;

  onAddCategory: (parentId?: string) => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;

  addSubTitle: (category: {
    _id: string;
    categoryId: string;
    name: string;
  }) => void;

  selectedCategoryId?: string;
}

export function CategoryTreeView({
  categories,
  onCategorySelect,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,

  selectedCategoryId,
  addSubTitle,
}: CategoryTreeViewProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [draggedCategory, setDraggedCategory] = useState<string | null>(null);

  const toggleExpanded = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const renderCategory = (category: any, level: number = 0) => {
    const isExpanded = expandedCategories.includes(category._id);

    const children = category.subtitles || category.children || [];
    const hasChildren = children.length > 0;
    const isSelected = selectedCategoryId === category._id;

    return (
      <div key={category._id} className="w-full">
        <div
          className={`
          flex items-center gap-2 p-2 rounded-lg cursor-pointer group
          hover:bg-accent/50 transition-colors
          ${isSelected ? "bg-primary/10 border border-primary/20" : ""}
          ${level > 0 ? "ml-6" : ""}
        `}
          style={{ paddingLeft: `${level * 24 + 8}px` }}
          onClick={() =>
            onCategorySelect({
              _id: category._id,
              categoryId: category.categoryId,
            })
          }
        >
          {/* Expand/Collapse Button */}
          <Button
            variant="ghost"
            size="sm"
            className="w-6 h-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              if (hasChildren) toggleExpanded(category._id);
            }}
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )
            ) : (
              <div className="w-4 h-4" />
            )}
          </Button>

          {/* Category Icon */}
          {hasChildren ? (
            isExpanded ? (
              <FolderOpen className="w-4 h-4 text-primary" />
            ) : (
              <Folder className="w-4 h-4 text-primary" />
            )
          ) : (
            <div className="w-4 h-4 rounded bg-muted" />
          )}

          {/* Category Info */}
          <div
            className="flex-1 min-w-0"
            onClick={(e) => {
              e.stopPropagation();
              if (hasChildren) toggleExpanded(category._id);
            }}
          >
            <div className="flex items-center gap-2">
              <span className="font-medium truncate">{category.name}</span>
              <Badge variant="secondary" className="text-xs">
                {category.productCount}
              </Badge>
              {category.status === "inactive" && (
                <Badge variant="outline" className="text-xs">
                  Inactive
                </Badge>
              )}
            </div>
            {category.description && (
              <p className="text-sm text-muted-foreground truncate">
                {category.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0"
              onClick={(e) => {
                e.stopPropagation();

                addSubTitle({
                  _id: category._id,
                  categoryId: category.categoryId || category._id,
                  name: category.name,
                });
              }}
            >
              <Plus className="w-3 h-3" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onEditCategory({
                  _id: category._id,
                  categoryId: category.categoryId,
                  name: category.name,
                  description: category.description,
                });
              }}
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteCategory(category);
              }}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 cursor-move"
              onMouseDown={() => setDraggedCategory(category._id)}
            >
              <Move className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Children */}
        {isExpanded && hasChildren && (
          <div className="ml-4">
            {children.map((child: any) => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Category Hierarchy</CardTitle>
            <CardDescription>
              Manage your product category structure
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpandedCategories(categories.map((c) => c._id))}
            >
              Expand All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpandedCategories([])}
            >
              Collapse All
            </Button>
            <Button variant="premium" size="sm" onClick={() => onAddCategory()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {categories.map((category) => renderCategory(category))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-8">
            <Folder className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground mb-4">No categories found</p>
            <Button onClick={() => onAddCategory()}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Category
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
