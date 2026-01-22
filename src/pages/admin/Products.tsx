import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductManagement } from "@/components/admin/ProductManagement";

const Products = () => {
  return (
    <AdminLayout>
      <ProductManagement />
    </AdminLayout>
  );
};

export default Products;