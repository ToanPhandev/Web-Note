import { useMutation } from "convex/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import { ConfirmModal } from "./confirm-modal";

interface BannerProps {
  documentId: Id<"documents">;
}

export const Banner = ({ documentId }: BannerProps) => {
  const navigate = useNavigate();

  const remove = useMutation(api.documents.remove);
  const restore = useMutation(api.documents.restore);

  const onRemove = () => {
    const promise = remove({ id: documentId });

    toast.promise(promise, {
      loading: "Deleting note...",
      success: "Note deleted!",
      error: "Failed to delete note.",
    });

    navigate("/documents");
  };

  const onRestore = () => {
    const promise = restore({ id: documentId });

    toast.promise(promise, {
      loading: "Restoring note...",
      success: "Note restored!",
      error: "Failed to restore note.",
    });
  };

  return (
    <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
      <p>This page is in the Trash.</p>
      <button
        onClick={onRestore}
        className="border-white border p-1 px-2 rounded-md hover:bg-rose-600"
      >
        Restore page
      </button>
      <ConfirmModal onConfirm={onRemove}>
        <button className="border-white border p-1 px-2 rounded-md hover:bg-rose-600">
          Delete forever
        </button>
      </ConfirmModal>
    </div>
  );
};
