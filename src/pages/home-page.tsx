import { useMutation } from "convex/react";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";

export const HomePage = () => {
  const navigate = useNavigate();
  const create = useMutation(api.documents.create);

  const onCreate = () => {
    const promise = create({ title: "Untitled" }).then((documentId) =>
      navigate(`/documents/${documentId}`)
    );

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <h2 className="text-lg font-medium">Welcome to your Notes</h2>
      <button onClick={onCreate}>
        <PlusCircle className="h-6 w-6 mr-2" />
        Create a note
      </button>
    </div>
  );
};
