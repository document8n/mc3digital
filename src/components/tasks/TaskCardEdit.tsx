import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TaskCardEditProps {
  title: string;
  description: string;
  dueDate: string | null;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onDueDateChange: (value: string | null) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
}

export function TaskCardEdit({
  title,
  description,
  dueDate,
  onTitleChange,
  onDescriptionChange,
  onDueDateChange,
  onSave,
  onCancel,
  isSaving,
}: TaskCardEditProps) {
  return (
    <div className="space-y-4">
      <Input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Task title"
      />
      <Textarea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Task description"
      />
      <div className="flex items-center gap-2">
        <Input
          type="date"
          value={dueDate || ""}
          onChange={(e) => onDueDateChange(e.target.value || null)}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDueDateChange(null)}
          disabled={!dueDate}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex gap-2">
        <Button 
          onClick={onSave} 
          disabled={isSaving}
          size="sm"
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}