import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  User,
  Tags,
  Plus,
  Eye,
  Trash2,
  MoreHorizontal,
  Edit,
  TrendingUp,
  User2,
  Users,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { BASE_URL } from "../ui/config";
import { ViewZivaBoutique } from "./ZivaBoutique/ViewZivaBoutique";
import { toast } from "sonner";
import { ZivaForm } from "./ZivaForm";

const ZivaBoutiqueManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [zivaCustomers, setZivaCustomers] = useState<any[]>([]);
  const [selectedZiva, setSelectedZiva] = useState<any>(null);
  const [openZivaEdit, setOpenZivaEdit] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const [subject,setSubject]=useState([])

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchZiva();
    fetchSubject();
  }, []);

  const fetchZiva = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/ziba`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setZivaCustomers(res.data.ziba);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSubject = async ()=>{
        try {
      const res = await axios.get(`${BASE_URL}/ziba/allSubject`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setSubject(res.data.subjects);
      }
    } catch (error) {
      console.error(error);
    }
  }
  

  const openEdit = (customer: any) => {
    setInitialData(customer);
    setOpenZivaEdit(true);
  };

const handleSubmitZiva = async (formData: any) => {
  try {
    let res;

    // 🆕 ADD MODE
    if (!initialData) {
      res = await axios.post(
        `${BASE_URL}/ziba`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setZivaCustomers((prev) => [res.data.data, ...prev]);
      toast.success("Ziva added successfully");
       setInitialData(null); 
       formData.fullname = "";
      formData.email = "";
      formData.subject = "";
      formData.message = "";
    }

    // ✏️ EDIT MODE
    else {
      res = await axios.put(
        `${BASE_URL}/ziba/${initialData._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updated = res.data.data;
      setZivaCustomers((prev) =>
        prev.map((i) => (i._id === updated._id ? updated : i))
      );

      toast.success("Ziva updated successfully");
    }

    setOpenZivaEdit(false);
    setInitialData(null);
  } catch (error) {
    console.error(error);
    toast.error("Operation failed");
  }
};




  const handleDelete = async (id: string) => {
    console.log(id)
    try {
      await axios.delete(`${BASE_URL}/ziba/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setZivaCustomers((prev) => prev.filter((i) => i._id !== id));
      toast.success("Deleted successfully");
    } catch {
      toast.error("Delete failed");
    }
  };

  const filteredCustomers = zivaCustomers.filter((item) =>
    `${item.fullname} ${item.email} ${item.subject?.name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ziva Boutique Management</h1>
          <p className="text-muted-foreground">
            Track and manage customer inquiries
          </p>
        </div>
       <Button
  variant="premium"
  onClick={() => {
    setInitialData(null);      
    setOpenZivaEdit(true);    
  }}
>
  <Plus className="w-4 h-4 mr-1" /> Add Ziva
</Button>

      </div>
      <div className="grid gap-4 md:grid-cols-4">
      <Card className="shadow-card">
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-warning/10 rounded-lg">
          <BookOpen className="w-5 h-5 text-warning" />
        </div>
        <div>
          <p className="text-2xl font-bold">{subject.length}</p>
          <p className="text-sm text-muted-foreground">Total Subjects</p>
        </div>
      </div>
    </CardContent>
  </Card>

  {/* Total Ziva Customers */}
  <Card className="shadow-card">
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-info/10 rounded-lg">
          <Users className="w-5 h-5 text-info" />
        </div>
        <div>
          <p className="text-2xl font-bold">{zivaCustomers.length}</p>
          <p className="text-sm text-muted-foreground">Ziva Customers</p>
        </div>
      </div>
    </CardContent>
  </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ziva Customers</CardTitle>
          <CardDescription>All inquiries</CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead />
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredCustomers.map((c) => (
                <TableRow key={c._id}>
                  <TableCell><Checkbox /></TableCell>
                  <TableCell>{c.fullname}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{c.subject?.name}</Badge>
                  </TableCell>
                  <TableCell className="truncate max-w-xs">
                    {c.message}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedZiva(c)}>
                          <Eye className="mr-2 h-4 w-4" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEdit(c)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(c._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
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

      <ViewZivaBoutique
        isOpen={!!selectedZiva}
        ziva={selectedZiva}
        onClose={() => setSelectedZiva(null)}
      />

     <ZivaForm
  isOpen={openZivaEdit}
  onClose={() => setOpenZivaEdit(false)}
  initialData={initialData || null}
  onSubmit={handleSubmitZiva}
  subject={subject}
  setSubject={setSubject} 
/>
    </div>
  );
};

export default ZivaBoutiqueManagement;
