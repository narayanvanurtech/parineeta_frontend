import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Image,
  Calendar,
  Globe,
  Megaphone,
  BookOpen,
  Shield,
  Star,
  Upload,
  X,
  Loader2,
  Wand2,
} from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../ui/config";

const initialBanners = [
  {
    id: "BAN001",
    title: "Diwali Collection 2024",
    type: "hero",
    status: "active",
    startDate: "2024-10-15",
    endDate: "2024-11-15",
    clicks: 2847,
    conversions: 156,
    image: "/placeholder.svg",
  },
  {
    id: "BAN002",
    title: "Wedding Season Sale",
    type: "promotional",
    status: "scheduled",
    startDate: "2024-02-01",
    endDate: "2024-02-29",
    clicks: 0,
    conversions: 0,
    image: "/placeholder.svg",
  },
];

const policies = [
  {
    id: "POL001",
    title: "Return & Exchange Policy",
    type: "policy",
    status: "active",
    lastUpdated: "2024-01-01",
    version: "v2.1",
  },
  {
    id: "POL002",
    title: "Privacy Policy",
    type: "legal",
    status: "active",
    lastUpdated: "2023-12-15",
    version: "v1.8",
  },
  {
    id: "POL003",
    title: "Terms of Service",
    type: "legal",
    status: "active",
    lastUpdated: "2023-12-15",
    version: "v3.2",
  },
];

export function ContentManagement() {
  const [blogImages, setBlogImages] = useState([]);
  const [blogImagePreviews, setBlogImagePreviews] = useState([]);

  const [activeTab, setActiveTab] = useState("banners");
  const [selectedBanner, setSelectedBanner] = useState<any | null>(null);
  const [isBannerEditOpen, setIsBannerEditOpen] = useState(false);
  const [bannerDraft, setBannerDraft] = useState<any | null>(null);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [isPostPreviewOpen, setIsPostPreviewOpen] = useState(false);
  const [bannerList, setBannerList] = useState(initialBanners);
  const [postList, setPostList] = useState([]);
  const [isArticleDialogOpen, setIsArticleDialogOpen] = useState(false);
  const [postDraft, setPostDraft] = useState<any | null>(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedImages, setUploadedImages] = useState<{
    [key: string]: string;
  }>({});
  const [isProcessingBg, setIsProcessingBg] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!isArticleDialogOpen || !postDraft?._id) return;

    // only when edit dialog opens
    if (Array.isArray(postDraft.image)) {
      setBlogImagePreviews(postDraft.image);
    } else if (postDraft.image) {
      setBlogImagePreviews([postDraft.image]);
    } else {
      setBlogImagePreviews([]);
    }

    setBlogImages([]); // existing images are URLs
  }, [isArticleDialogOpen]);

  useEffect(() => {
    async function fetchBlogs() {
      const res = await axios.get(`${BASE_URL}/blogs/getBlogs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (res.data.success) {
        console.log(res.data.message);
        setPostList(res.data?.blogs);
      } else {
        console.log(res.data.message);
      }
    }
    fetchBlogs();
  }, []);

  const removeBackground = async (imageFile: File): Promise<string> => {
    setIsProcessingBg(true);
    try {
      // Dynamic import to avoid loading the heavy library until needed
      const { pipeline, env } = await import("@huggingface/transformers");

      env.allowLocalModels = false;
      env.useBrowserCache = false;

      const segmenter = await pipeline(
        "image-segmentation",
        "Xenova/segformer-b0-finetuned-ade-512-512",
        {
          device: "webgpu",
        },
      );

      // Create image element
      const img = document.createElement("img") as HTMLImageElement;
      const imageUrl = URL.createObjectURL(imageFile);
      img.src = imageUrl;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Create canvas and resize if needed
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      const MAX_SIZE = 1024;
      let { width, height } = img;

      if (width > MAX_SIZE || height > MAX_SIZE) {
        if (width > height) {
          height = Math.round((height * MAX_SIZE) / width);
          width = MAX_SIZE;
        } else {
          width = Math.round((width * MAX_SIZE) / height);
          height = MAX_SIZE;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const imageData = canvas.toDataURL("image/jpeg", 0.8);
      const result = await segmenter(imageData);

      if (
        !result ||
        !Array.isArray(result) ||
        result.length === 0 ||
        !result[0].mask
      ) {
        throw new Error("Invalid segmentation result");
      }

      // Apply mask
      const outputCanvas = document.createElement("canvas");
      outputCanvas.width = width;
      outputCanvas.height = height;
      const outputCtx = outputCanvas.getContext("2d")!;

      outputCtx.drawImage(canvas, 0, 0);
      const outputImageData = outputCtx.getImageData(0, 0, width, height);
      const data = outputImageData.data;

      for (let i = 0; i < result[0].mask.data.length; i++) {
        const alpha = Math.round((1 - result[0].mask.data[i]) * 255);
        data[i * 4 + 3] = alpha;
      }

      outputCtx.putImageData(outputImageData, 0, 0);

      return new Promise((resolve) => {
        outputCanvas.toBlob(
          (blob) => {
            if (blob) {
              const processedUrl = URL.createObjectURL(blob);
              resolve(processedUrl);
            }
          },
          "image/png",
          1.0,
        );
      });
    } catch (error) {
      console.error("Background removal failed:", error);
      toast({
        title: "Background removal failed",
        description: "Using original image",
        variant: "destructive",
      });
      return URL.createObjectURL(imageFile);
    } finally {
      setIsProcessingBg(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: { variant: "success" as const, label: "Active" },
      scheduled: { variant: "warning" as const, label: "Scheduled" },
      draft: { variant: "secondary" as const, label: "Draft" },
      published: { variant: "success" as const, label: "Published" },
      expired: { variant: "destructive" as const, label: "Expired" },
    };

    const { variant, label } = config[status as keyof typeof config];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const handleBlog = async () => {
    try {
      if (!postDraft?.title || !postDraft?.category || !postDraft?.content) {
        toast({ title: "All fields are required" });
        return;
      }

      const fd = new FormData();

      fd.append("title", postDraft.title);
      fd.append("category", postDraft.category);
      fd.append("status", postDraft.status);
      fd.append("publishDate", postDraft.publishDate || "");
      fd.append("content", postDraft.content);
      fd.append("author", postDraft.author);

      blogImages.forEach((img) => {
        fd.append("image", img); // backend expects `images`
      });

      const res = await axios.post(`${BASE_URL}/blogs/addBlogs`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast({ title: res.data.message });

        setIsArticleDialogOpen(false);
        setPostDraft(null);
        setBlogImages([]);
        setBlogImagePreviews([]);

        setPostList((prev) => [res.data.blog, ...prev]);
      }
    } catch (error) {
      toast({
        title: error?.response?.data?.message || "Failed to create blog",
      });
    }
  };

  const handleImageUpload = (file:any,data) => {};

  const handleBlogDelete = async (id) => {
    const res = await axios.delete(`${BASE_URL}/blogs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    if (res.data?.success) {
      toast({
        title: res.data?.message,
      });
      console.log(res.data.blogs);
      setPostList((prev) => prev.filter((p) => p._id !== id));
    } else {
      toast({
        title: res.data?.message,
      });
    }
  };

  const handleBlogImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setBlogImages((prev) => [...prev, ...files]);

    const previews = files.map((file) => URL.createObjectURL(file));
    setBlogImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleBlogUpdate = async (id) => {
    try {
      if (!postDraft?.title || !postDraft?.category || !postDraft?.content) {
        toast({ title: "Title, category & content are required" });
        return;
      }

      const fd = new FormData();
      fd.append("title", postDraft.title);
      fd.append("category", postDraft.category);
      fd.append("status", postDraft.status);
      fd.append("publishDate", postDraft.publishDate || "");
      fd.append("content", postDraft.content);

      // ✅ Only send old image URLs
      if (Array.isArray(postDraft.image)) {
        postDraft.image.forEach((url) => {
          // Make sure it's a URL, not a blob preview
          if (typeof url === "string" && !url.startsWith("blob:")) {
            fd.append("oldImages[]", url);
          }
        });
      }

      // ✅ Send newly added files
      blogImages.forEach((file) => {
        fd.append("image", file);
      });

      const res = await axios.put(`${BASE_URL}/blogs/${id}`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast({ title: res.data.message });

        // 🔥 Update list
        setPostList((prev) =>
          prev.map((p) => (p._id === id ? res.data.blog : p)),
        );

        // 🔥 Update state with the saved blog
        setPostDraft(res.data.blog);

        setPostDraft(null); // clear current draft
        setBlogImages([]); // clear temporary files
        setBlogImagePreviews([]); // clear previews
        setSelectedPost(null); // clear preview selection
        setIsArticleDialogOpen(false); // close dialog
      }
    } catch (error) {
      toast({
        title: error?.response?.data?.message || "Failed to update blog",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Content Management System
          </h1>
          <p className="text-muted-foreground">
            Manage banners, blogs, and site content
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => window.open("/", "_blank")}
          >
            <Globe className="w-4 h-4" />
            Preview Site
          </Button>
          <Button
            variant="premium"
            className="flex items-center gap-2"
            onClick={() => {
              if (activeTab === "blog") {
                setPostDraft({
                  id: undefined,
                  title: "",
                  author: "",
                  status: "draft",
                  publishDate: null,
                  views: 0,
                  category: "",
                  featured: false,
                  content: "",
                });
                setIsArticleDialogOpen(true);
              } else if (activeTab === "banners") {
                setSelectedBanner(null);
                setBannerDraft({
                  id: undefined,
                  title: "",
                  type: "hero",
                  status: "active",
                  startDate: "",
                  endDate: "",
                  clicks: 0,
                  conversions: 0,
                  image: "",
                });
                setIsBannerEditOpen(true);
              } else {
                toast({
                  title: "Action unavailable",
                  description: "Use the Add button in this tab.",
                });
              }
            }}
          >
            <Plus className="w-4 h-4" />
            Create Content
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Image className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-muted-foreground">Active Banners</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <BookOpen className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{postList.length}</p>
                <p className="text-sm text-muted-foreground">Blog Articles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Shield className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Policy Pages</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <Eye className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">89.2K</p>
                <p className="text-sm text-muted-foreground">
                  Monthly Page Views
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-accent">
          <TabsTrigger value="banners">Banners & Media</TabsTrigger>
          <TabsTrigger value="blog">Blog Management</TabsTrigger>
          <TabsTrigger value="policies">Policies & Legal</TabsTrigger>
          <TabsTrigger value="seo">SEO Management</TabsTrigger>
        </TabsList>

        <TabsContent value="banners" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Banner Management</CardTitle>
              <CardDescription>
                Manage homepage and promotional banners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input placeholder="Search banners..." className="pl-10" />
                  </div>
                  <Button
                    variant="premium"
                    className="flex items-center gap-2"
                    onClick={() => {
                      setSelectedBanner(null);
                      setBannerDraft({
                        id: undefined,
                        title: "",
                        type: "hero",
                        status: "active",
                        startDate: "",
                        endDate: "",
                        clicks: 0,
                        conversions: 0,
                        image: "",
                      });
                      setIsBannerEditOpen(true);
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Banner
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Banner</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bannerList.map((banner) => (
                      <TableRow key={banner.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-12 bg-accent rounded overflow-hidden">
                              <img
                                src={banner.image}
                                alt={banner.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{banner.title}</p>
                              <p className="text-sm text-muted-foreground">
                                ID: {banner.id}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{banner.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{banner.startDate}</p>
                            <p className="text-muted-foreground">
                              to {banner.endDate}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium">
                              {banner.clicks.toLocaleString()} clicks
                            </p>
                            <p className="text-muted-foreground">
                              {banner.conversions} conversions
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(banner.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedBanner(banner);
                                setBannerDraft({ ...banner });
                                setIsBannerEditOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() =>
                                setBannerList((prev) =>
                                  prev.filter((b) => b.id !== banner.id),
                                )
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Banner Edit Dialog */}
          <Dialog open={isBannerEditOpen} onOpenChange={setIsBannerEditOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {bannerDraft?.id ? "Edit Banner" : "Add Banner"}
                </DialogTitle>
                <DialogDescription>
                  Update banner content and schedule
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={bannerDraft?.title || ""}
                      onChange={(e) =>
                        setBannerDraft((p: any) => ({
                          ...p,
                          title: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={bannerDraft?.type}
                      onValueChange={(v) =>
                        setBannerDraft((p: any) => ({ ...p, type: v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hero">Hero</SelectItem>
                        <SelectItem value="promotional">Promotional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={bannerDraft?.startDate || ""}
                      onChange={(e) =>
                        setBannerDraft((p: any) => ({
                          ...p,
                          startDate: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={bannerDraft?.endDate || ""}
                      onChange={(e) =>
                        setBannerDraft((p: any) => ({
                          ...p,
                          endDate: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Banner Image</Label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter image URL or upload below"
                        value={bannerDraft?.image || ""}
                        onChange={(e) =>
                          setBannerDraft((p: any) => ({
                            ...p,
                            image: e.target.value,
                          }))
                        }
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Upload
                      </Button>
                    </div>

                    {bannerDraft?.image && (
                      <div className="relative">
                        <img
                          src={bannerDraft.image}
                          alt="Banner preview"
                          className="w-28 object-cover rounded border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() =>
                            setBannerDraft((prev) => ({ ...prev, image: "" }))
                          }
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          await handleImageUpload(file, "banner");
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsBannerEditOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (!bannerDraft) return;
                    setBannerList((prev) => {
                      const existsIdx = bannerDraft.id
                        ? prev.findIndex((b) => b.id === bannerDraft.id)
                        : -1;
                      if (existsIdx >= 0) {
                        const copy = [...prev];
                        copy[existsIdx] = {
                          ...copy[existsIdx],
                          ...bannerDraft,
                        };
                        return copy;
                      }
                      const nextId = `BAN${String(prev.length + 1).padStart(3, "0")}`;
                      return [
                        ...prev,
                        {
                          ...bannerDraft,
                          id: nextId,
                          clicks: bannerDraft.clicks || 0,
                          conversions: bannerDraft.conversions || 0,
                        },
                      ];
                    });
                    setIsBannerEditOpen(false);
                    setBannerDraft(null);
                    setSelectedBanner(null);
                    toast({
                      title: bannerDraft?.id
                        ? "Banner updated"
                        : "Banner added",
                    });
                  }}
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="blog" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Blog Management</CardTitle>
              <CardDescription>Create and manage blog articles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input placeholder="Search articles..." className="pl-10" />
                  </div>
                  <Button
                    variant="premium"
                    className="flex items-center gap-2"
                    onClick={() => {
                      setPostDraft({
                        id: undefined,
                        title: "",
                        author: "",
                        status: "draft",
                        publishDate: null,
                        views: 0,
                        category: "",
                        featured: false,
                        content: "",
                      });
                      setIsArticleDialogOpen(true);
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    New Article
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Article</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {postList.map((post) => (
                      <TableRow key={post._id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{post.title}</p>
                              {post.featured && (
                                <Star className="w-4 h-4 fill-primary text-primary" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {post.publishDate
                                ? `Published: ${post.publishDate}`
                                : "Draft"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{post.author}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{post.category}</Badge>
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedPost(post);
                                setIsPostPreviewOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setPostDraft(post);
                                setIsArticleDialogOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => handleBlogDelete(post._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Article Create/Edit Dialog */}
          <Dialog
            open={isArticleDialogOpen}
            onOpenChange={setIsArticleDialogOpen}
          >
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>
                  {postDraft?._id ? "Edit Article" : "New Article"}
                </DialogTitle>
                <DialogDescription>
                  Create and preview your blog article
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={postDraft?.title || ""}
                      onChange={(e) =>
                        setPostDraft((p: any) => ({
                          ...p,
                          title: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Author</Label>
                    <Input
                      value={postDraft?.author || ""}
                      onChange={(e) =>
                        setPostDraft((p: any) => ({
                          ...p,
                          author: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input
                      value={postDraft?.category || ""}
                      onChange={(e) =>
                        setPostDraft((p: any) => ({
                          ...p,
                          category: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={postDraft?.status || "draft"}
                      onValueChange={(v) =>
                        setPostDraft((p: any) => ({ ...p, status: v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Publish Date</Label>
                    <Input
                      type="date"
                      value={postDraft?.publishDate || ""}
                      onChange={(e) =>
                        setPostDraft((p: any) => ({
                          ...p,
                          publishDate: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Featured Image : </Label>

                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleBlogImageSelect}
                      />

                      {blogImagePreviews.length > 0 && (
                        <div className="flex gap-2 flex-wrap mt-3">
                          {blogImagePreviews.map((img, idx) => (
                            <div key={idx} className="relative">
                              <img
                                src={img}
                                alt={`preview-${idx}`}
                                className="w-28 object-cover rounded"
                              />

                              <button
                                type="button"
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                                onClick={() => {
                                  setBlogImages((prev) =>
                                    prev.filter((_, i) => i !== idx),
                                  );

                                  setBlogImagePreviews((prev) =>
                                    prev.filter((_, i) => i !== idx),
                                  );

                                  setPostDraft((prev) => ({
                                    ...prev,
                                    image: Array.isArray(prev.image)
                                      ? prev.image.filter((_, i) => i !== idx)
                                      : [],
                                  }));
                                }}
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Content</Label>
                    <Textarea
                      rows={8}
                      value={postDraft?.content || ""}
                      onChange={(e) =>
                        setPostDraft((p: any) => ({
                          ...p,
                          content: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsArticleDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (postDraft) {
                      setSelectedPost(postDraft);
                      setIsPostPreviewOpen(true);
                    }
                  }}
                >
                  Preview
                </Button>
                <Button
                  type="button"
                  onClick={() =>
                    postDraft?._id
                      ? handleBlogUpdate(postDraft._id)
                      : handleBlog()
                  }
                >
                  {postDraft?._id ? "Update Blog" : "Publish Blog"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Blog Preview Dialog */}
          <Dialog open={isPostPreviewOpen} onOpenChange={setIsPostPreviewOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>{selectedPost?.title}</DialogTitle>
                <DialogDescription>
                  By {selectedPost?.author} •{" "}
                  {selectedPost?.publishDate
                    ? new Date(selectedPost.publishDate).toLocaleDateString()
                    : "Draft"}
                </DialogDescription>
              </DialogHeader>
              <div className="prose prose-sm max-w-none  dark:prose-invert">
                <div className="flex flex-wrap gap-3">
                  {selectedPost?.image?.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      className="h-40  object-cover rounded mb-2"
                    />
                  ))}
                </div>
                <p>
                  <strong>Category:</strong> {selectedPost?.category}
                </p>
                {selectedPost?.content ? (
                  <div className="mt-2 whitespace-pre-wrap">
                    {selectedPost.content}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    This is a preview area. Integrate your rich text editor
                    content here. Supports images, headings, and embeds.
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Policies & Legal Pages</CardTitle>
              <CardDescription>
                Manage legal documents and policies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input placeholder="Search policies..." className="pl-10" />
                  </div>
                  <Button variant="premium" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Policy
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Policy Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {policies.map((policy) => (
                      <TableRow key={policy.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{policy.title}</p>
                            <p className="text-sm text-muted-foreground">
                              ID: {policy.id}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{policy.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{policy.version}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            {policy.lastUpdated}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(policy.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button variant="ghost" size="icon">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>SEO Management</CardTitle>
              <CardDescription>
                Optimize search engine performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                SEO management tools will be displayed here...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
