import { Button } from "@/components/ui/button";

interface ProjectFormSubmitProps {
  isEditing: boolean;
}

export function ProjectFormSubmit({ isEditing }: ProjectFormSubmitProps) {
  return (
    <div className="flex justify-end gap-4 pt-4">
      <Button type="submit">
        {isEditing ? "Update Project" : "Create Project"}
      </Button>
    </div>
  );
}