import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MessageSquare,
  Star,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  CheckCircle,
  Reply,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Camera
} from "lucide-react";

const reviews = [
  {
    id: "REV001",
    customer: "Priya Sharma",
    product: "Royal Blue Banarasi Saree",
    rating: 5,
    title: "Absolutely stunning saree!",
    comment: "The quality is exceptional and the embroidery work is beautiful. Perfect for my wedding ceremony. Highly recommend!",
    date: "2024-01-15",
    status: "approved",
    sentiment: "positive",
    helpful: 12,
    hasImages: true,
    response: null,
    verified: true
  },
  {
    id: "REV002",
    customer: "Ananya Reddy", 
    product: "Pink Bridal Lehenga Set",
    rating: 4,
    title: "Good quality but sizing issue",
    comment: "Beautiful lehenga but had to get it altered. The blouse was too tight. Otherwise satisfied with the purchase.",
    date: "2024-01-14",
    status: "pending",
    sentiment: "mixed",
    helpful: 8,
    hasImages: false,
    response: null,
    verified: true
  },
  {
    id: "REV003",
    customer: "Anonymous User",
    product: "Golden Thread Kurta Set",
    rating: 1,
    title: "Poor quality, looks cheap",
    comment: "The fabric feels very cheap and the stitching is poor. Not worth the price at all. Very disappointed.",
    date: "2024-01-13",
    status: "flagged",
    sentiment: "negative",
    helpful: 2,
    hasImages: false,
    response: null,
    verified: false
  },
  {
    id: "REV004",
    customer: "Meera Singh",
    product: "Emerald Silk Saree",
    rating: 5,
    title: "Exceeded expectations!",
    comment: "The color is exactly as shown and the silk quality is premium. Fast delivery and excellent packaging. Will definitely order again!",
    date: "2024-01-12",
    status: "approved",
    sentiment: "positive",
    helpful: 15,
    hasImages: true,
    response: "Thank you so much for your wonderful review! We're delighted you loved the saree.",
    verified: true
  }
];

export function ReviewManagement() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedReview, setSelectedReview] = useState<typeof reviews[0] | null>(null);
  const [responseText, setResponseText] = useState("");

  const getSentimentBadge = (sentiment: string) => {
    const config = {
      positive: { variant: "success" as const, icon: ThumbsUp },
      negative: { variant: "destructive" as const, icon: ThumbsDown },
      mixed: { variant: "warning" as const, icon: AlertTriangle }
    };
    
    const { variant, icon: Icon } = config[sentiment as keyof typeof config];
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {sentiment}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const config = {
      approved: { variant: "success" as const, label: "Approved" },
      pending: { variant: "warning" as const, label: "Pending" },
      flagged: { variant: "destructive" as const, label: "Flagged" },
      rejected: { variant: "destructive" as const, label: "Rejected" }
    };
    
    const { variant, label } = config[status as keyof typeof config];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
      />
    ));
  };

  const filteredReviews = reviews.filter(review => {
    if (activeTab === "all") return true;
    return review.status === activeTab;
  });

  const reviewCounts = {
    all: reviews.length,
    pending: reviews.filter(r => r.status === "pending").length,
    approved: reviews.filter(r => r.status === "approved").length,
    flagged: reviews.filter(r => r.status === "flagged").length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Review Management</h1>
          <p className="text-muted-foreground">Monitor and moderate customer reviews</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Review Analytics
          </Button>
          <Button variant="premium" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Advanced Filters
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">1,847</p>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Star className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold flex items-center gap-1">
                  4.6 <Star className="w-4 h-4 fill-primary text-primary" />
                </p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">23</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold flex items-center gap-1">
                  +12% <TrendingUp className="w-4 h-4 text-success" />
                </p>
                <p className="text-sm text-muted-foreground">Review Growth</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search reviews by customer, product, or content..."
                className="pl-10 bg-background"
              />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Rating Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Review Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-accent">
          <TabsTrigger value="all">All ({reviewCounts.all})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({reviewCounts.pending})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({reviewCounts.approved})</TabsTrigger>
          <TabsTrigger value="flagged">Flagged ({reviewCounts.flagged})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Reviews ({filteredReviews.length})</CardTitle>
              <CardDescription>Manage customer feedback and responses</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer & Product</TableHead>
                    <TableHead>Rating & Review</TableHead>
                    <TableHead>Sentiment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src="/placeholder.svg" alt={review.customer} />
                              <AvatarFallback>{review.customer.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{review.customer}</p>
                              {review.verified && <Badge variant="success" className="text-xs">Verified</Badge>}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.product}</p>
                          <p className="text-xs text-muted-foreground">{review.date}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2 max-w-md">
                          <div className="flex items-center gap-1">
                            {renderStars(review.rating)}
                            <span className="text-sm font-medium ml-1">{review.rating}.0</span>
                          </div>
                          <p className="font-medium text-sm">{review.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">{review.comment}</p>
                          {review.hasImages && (
                            <Badge variant="outline" className="text-xs flex items-center gap-1 w-fit">
                              <Camera className="w-3 h-3" />
                              Has Images
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getSentimentBadge(review.sentiment)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(review.status)}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <ThumbsUp className="w-3 h-3" />
                            <span>{review.helpful} helpful</span>
                          </div>
                          {review.response && (
                            <Badge variant="success" className="text-xs">Responded</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedReview(review)}>
                                <Reply className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Respond to Review</DialogTitle>
                                <DialogDescription>
                                  Provide a professional response to {review.customer}'s review
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="p-4 bg-accent rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    {renderStars(review.rating)}
                                    <span className="font-medium">{review.title}</span>
                                  </div>
                                  <p className="text-sm">{review.comment}</p>
                                </div>
                                <Textarea
                                  placeholder="Type your response here..."
                                  value={responseText}
                                  onChange={(e) => setResponseText(e.target.value)}
                                  className="min-h-[100px]"
                                />
                              </div>
                              <DialogFooter>
                                <Button variant="outline">Save Draft</Button>
                                <Button variant="premium">Send Response</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button variant="ghost" size="sm" className="text-success">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <AlertTriangle className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}