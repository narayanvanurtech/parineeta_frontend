import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Customers from "./pages/admin/Customers";
import Reviews from "./pages/admin/Reviews";
import Reports from "./pages/admin/Reports";
import Offers from "./pages/admin/Offers";
import CMS from "./pages/admin/CMS";
import Categories from "./pages/admin/Categories";
import Tax from "./pages/admin/Tax";
import Shipping from "./pages/admin/Shipping";
import NotFound from "./pages/NotFound";
import ZivaBoutique from "./pages/admin/ZivaBoutique";
import ZivaSubject from "./pages/admin/ZivaSubject";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<Index />} />
          <Route path="/admin/products" element={<Products />} />
          <Route path="/admin/categories" element={<Categories />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/customers" element={<Customers />} />
          <Route path="/admin/reviews" element={<Reviews />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/offers" element={<Offers />} />
          <Route path="/admin/cms" element={<CMS />} />
          <Route path="/admin/tax" element={<Tax />} />
          <Route path="/admin/shipping" element={<Shipping />} />
          <Route path="/admin/ziva" element={<ZivaBoutique/>} />
          <Route path="/admin/zivaSubject" element={<ZivaSubject />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
