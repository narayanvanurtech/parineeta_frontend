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
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { BASE_URL } from "../ui/config";
import { toast } from "sonner";

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [newName, setNewName] = useState("");

  const [openAddSubject, setOpenAddSubject] = useState(false);
  const [newSubject, setNewSubject] = useState("");

  const token = localStorage.getItem("token");

  /* ---------------- FETCH SUBJECTS ---------------- */
  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/ziba/allSubject`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setSubjects(res.data.subjects);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /* ---------------- ADD SUBJECT ---------------- */
  const addSubject = async () => {
    if (!newSubject.trim()) {
      toast.error("Subject name is required");
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/ziba/addSubject`,
        { name: newSubject },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const created = res.data.subject || res.data.data;

      setSubjects((prev) => [...prev, created]);
      toast.success(res.data.message || "Subject added successfully");

      setNewSubject("");
      setOpenAddSubject(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Add failed");
    }
  };

  /* ---------------- EDIT SUBJECT ---------------- */
  const handleEdit = (subject: any) => {
    setEditingSubject(subject);
    setNewName(subject.name);
  };

  const handleUpdate = async () => {
    if (!newName.trim()) {
      toast.error("Subject name is required");
      return;
    }

    try {
      const res = await axios.put(
        `${BASE_URL}/ziba/editSubject/${editingSubject._id}`,
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updated = res.data.subject || res.data.data;

      setSubjects((prev) =>
        prev.map((s) => (s._id === updated._id ? updated : s))
      );

      toast.success(res.data.message || "Subject updated successfully");
      setEditingSubject(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Update failed");
    }
  };

  /* ---------------- DELETE SUBJECT ---------------- */
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/ziba/deleteSubject/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSubjects((prev) => prev.filter((s) => s._id !== id));
      toast.success("Deleted successfully");
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ---------------- FILTER ---------------- */
  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subject Management</h1>
          <p className="text-muted-foreground">
            Manage inquiry subjects
          </p>
        </div>

        <Button
          variant="premium"
          onClick={() => setOpenAddSubject(true)}
        >
          <Plus className="w-4 h-4 mr-1" /> Add Subject
        </Button>
      </div>

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <BookOpen className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{subjects.length}</p>
                <p className="text-sm text-muted-foreground">
                  Total Subjects
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEARCH */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Subjects</CardTitle>
          <CardDescription>All available subjects</CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject ID</TableHead>
                <TableHead>Subject Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredSubjects.map((s) => (
                <TableRow key={s._id}>
                  <TableCell>{s._id}</TableCell>

                  <TableCell className="font-medium">
                    {editingSubject?._id === s._id ? (
                      <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                      />
                    ) : (
                      s.name
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    {editingSubject?._id === s._id ? (
                      <Button size="sm" onClick={handleUpdate}>
                        Save
                      </Button>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>

                          <DropdownMenuItem onClick={() => handleEdit(s)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(s._id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ADD SUBJECT DIALOG */}
      <Dialog open={openAddSubject} onOpenChange={setOpenAddSubject}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Subject</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Subject name"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            className="mb-4"
          />

          <Button onClick={addSubject} className="w-full">
            Add Subject
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubjectManagement;
