import { useMutation } from "convex/react";
import { MoreHorizontal, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";

interface MenuProps {
  documentId: Id<"documents">;
}

export const Menu = ({ documentId }: MenuProps) => {
  const navigate = useNavigate();
  const archive = useMutation(api.documents.archive);

  const onArchive = () => {
    const promise = archive({ id: documentId });

    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash!",
      error: "Failed to archive note.",
    });

    navigate("/documents");
  };

  return (
    <div>
      <button onClick={onArchive}>
        <Trash className="h-4 w-4" />
        Delete
      </button>
    </div>
  );
};

Menu.Skeleton = function MenuSkeleton() {
  return <div className="h-8 w-8 bg-neutral-200 rounded-md" />;
};
