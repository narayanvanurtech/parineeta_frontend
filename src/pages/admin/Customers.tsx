import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Users,
  Search,
  UserPlus,
  Crown,
  Star,
  MapPin,
  Calendar,
  Eye,
  Filter,
  Download,
  AlertTriangle,
  UserCheck,
  MoreHorizontal,
  Edit,
  Mail,
  UserX,
  Trash2,
} from "lucide-react";

import { CustomerProfile } from "@/components/admin/customer/CustomerProfile";

import axios from "axios";
import { toast } from "sonner";
import { EditUser } from "@/components/admin/customer/CustomerUpdate";
import { BASE_URL } from "@/components/ui/config";

const Customers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allCustomer, setAllCustomer] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditProfile, setIsEditProfile] = useState(false);

  const handleViewProfile = (customer) => {
    setSelectedCustomer(customer);
    setIsProfileOpen(true);
  };
  const token = localStorage.getItem("token");

  useEffect(() => {
    const getAllCustomer = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setAllCustomer(res.data.users || []);
      } catch (error) {
        console.error("FAILED TO FETCH CUSTOMERS", error);
      }
    };

    getAllCustomer();
  }, []);

  const filteredCustomers = allCustomer.filter((customer) => {
    const fullName =
      `${customer.firstName || ""} ${customer.lastName || ""}`.toLowerCase();
    const email = (customer.email || "").toLowerCase();
    const phone = customer.phone || "";

    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      email.includes(searchQuery.toLowerCase()) ||
      phone.includes(searchQuery);

    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const HandleDeleteCategory = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.delete(`${BASE_URL}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (res.data.message === "User deleted successfully") {
        toast.success(res.data.message);

        setAllCustomer((prev) =>
          prev.filter((customer) => customer._id !== id),
        );
      }
    } catch (error) {
      console.error("DELETE FAILED", error);
      toast.error("Failed to delete user");
    }
  };

  const handleUpdateProfile = async (id, updatedData) => {
    try {
      const res = await axios.put(`${BASE_URL}/users/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      toast.success("User updated successfully");

      setAllCustomer((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, ...updatedData } : user,
        ),
      );

      setIsEditProfile(false);
    } catch (error) {
      console.error("UPDATE FAILED", error);

 
    const errMsg =
      error?.response?.data?.error || error?.response?.data?.message || 
      "Failed to update user";

    toast.error(errMsg);
    }
  };

  const openEditDialog = (customer) => {
    setIsEditProfile(true);
    setIsProfileOpen(false);
    setSelectedCustomer(customer);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Customer Management</h1>
            <p className="text-muted-foreground">
              Manage your valued customers
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="premium">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </div>

        {/* Search & Filter */}
        <Card>
          <CardContent className="p-4 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Search by name, email, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
            <CardDescription>Customer list with actions</CardDescription>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Phone No</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer._id}>
                    {/* Customer Info */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>
                            {customer.firstName?.[0]}
                            {customer.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {customer.firstName} {customer.lastName}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {customer.location || "—"}
                          </div>
                          <div>
                            <p>ID: {customer.id}</p>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Contact */}
                    <TableCell>
                      <p className="text-sm">{customer.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {customer.phone}
                      </p>
                    </TableCell>

                    {/* Spent */}
                    <TableCell>
                      ₹{customer.totalSpent?.toLocaleString() || 0}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        className={
                          customer.role === "admin"
                            ? "bg-red-100 text-red-700 border border-red-300"
                            : "bg-blue-100 text-blue-700 border border-blue-300"
                        }
                      >
                        {customer.role || "USER"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {customer.phone || "1234567890"}
                    </TableCell>

                    {/* Last Order */}
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-3 h-3" />
                        {customer.lastOrder || "—"}
                      </div>
                    </TableCell>

                    {/* Actions (THREE DOT MENU) */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>

                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault();
                              handleViewProfile(customer);
                            }}
                            className="cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault();
                              openEditDialog(customer);
                            }}
                            className="cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Customer
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault();
                              HandleDeleteCategory(customer.id);
                            }}
                            className="cursor-pointer text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Customer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Customer Profile Modal */}
        <CustomerProfile
          customer={selectedCustomer}
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          onCustomerUpdate={openEditDialog}
        />
        <EditUser
          customer={selectedCustomer}
          isOpen={isEditProfile}
          onClose={() => setIsEditProfile(false)}
          handleUpdateProfile={handleUpdateProfile}
        />
      </div>
    </AdminLayout>
  );
};

export default Customers;
