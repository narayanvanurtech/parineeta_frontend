import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SizesInput = ({ sizes, setSizes }) => {
  const [sizeInput, setSizeInput] = useState("");

  const addSize = () => {
    const value = sizeInput.trim().toUpperCase();

    if (!value) return;
    if (sizes.includes(value)) return;

    setSizes([...sizes, value]);
    setSizeInput("");
  };

  const removeSize = (size) => {
    setSizes(sizes.filter((s) => s !== size));
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Sizes</label>

      <div className="flex gap-2">
        <Input
          placeholder="Enter size (S, M, L, XL)"
          value={sizeInput}
          onChange={(e) => setSizeInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSize();
            }
          }}
        />
        <Button type="button" onClick={addSize}>
          Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <Badge
            key={size}
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1"
          >
            {size}
            <button
              type="button"
              onClick={() => removeSize(size)}
              className="hover:text-destructive"
            >
              <X size={14} />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default SizesInput;
