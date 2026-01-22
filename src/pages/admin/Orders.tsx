import { AdminLayout } from "@/components/admin/AdminLayout";
import { OrderManagement } from "@/components/admin/OrderManagement";

const Orders = () => {
  return (
    <AdminLayout>
      <OrderManagement />
    </AdminLayout>
  );
};

export default Orders;