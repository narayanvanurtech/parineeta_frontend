import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../ui/config";

export function ZivaForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  subject,
  setSubject,
}: any) {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    subject: "",
    message: "",
  });

  const [openAddSubject, setOpenAddSubject] = useState(false);
  const [newSubject, setNewSubject] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullname: initialData.fullname || "",
        email: initialData.email || "",
        subject: initialData.subject?._id || "",
        message: initialData.message || "",
      });
    } else {
      setFormData({
        fullname: "",
        email: "",
        subject: "",
        message: "",
      });
    }
  }, [initialData]);

  
  const addSubject = async () => {
    if (!newSubject.trim()) return;

    try {
      const res = await axios.post(
        `${BASE_URL}/ziba/addSubject`,
        { name: newSubject.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const created = res.data.subject;

      setSubject((prev: any[]) => [...prev, created]);
      setFormData((p) => ({ ...p, subject: created._id }));

      setNewSubject("");
      setOpenAddSubject(false);
    } catch (err) {
      console.error("Add subject error", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-6">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Ziva Customer" : "Add Ziva Customer"}
          </DialogTitle>
        </DialogHeader>

        {/* Full Name */}
        <Input
          placeholder="Full Name"
          value={formData.fullname}
          onChange={(e) =>
            setFormData({ ...formData, fullname: e.target.value })
          }
          className="mb-4"
        />

        {/* Email */}
        <Input
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          className="mb-4"
        />

        {/* SUBJECT SELECT */}
        <Select
          value={formData.subject}
          onValueChange={(val) => {
            if (val === "add") {
              setOpenAddSubject(true);
              return;
            }
            setFormData({ ...formData, subject: val });
          }}
        >
          <SelectTrigger className="mb-4">
            <SelectValue placeholder="Select subject" />
          </SelectTrigger>

          <SelectContent>
            {subject.map((s: any) => (
              <SelectItem key={s._id} value={s._id}>
                {s.name}
              </SelectItem>
            ))}

            <SelectItem value="add">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-orange-500" />
                Add Subject
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Message */}
        <Textarea
          placeholder="Message"
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          className="mb-4"
        />

        <Button onClick={() => onSubmit(formData)} className="w-full mb-4">
          {initialData ? "Update" : "Submit"}
        </Button>

        {/* ADD SUBJECT MODAL */}
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

            <Button onClick={addSubject}>Add</Button>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
