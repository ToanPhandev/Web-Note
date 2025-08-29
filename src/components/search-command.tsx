import { useEffect, useState } from "react";
import { File } from "lucide-react";
import { useQuery } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { useSearch } from "../hooks/use-search";

export const SearchCommand = () => {
  const navigate = useNavigate();
  const documents = useQuery(api.documents.getSearch);
  const [isMounted, setIsMounted] = useState(false);

  const toggle = useSearch((store) => store.toggle);
  const isOpen = useSearch((store) => store.isOpen);
  const onClose = useSearch((store) => store.onClose);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  const onSelect = (id: string) => {
    navigate(`/documents/${id}`);
    onClose();
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      {isOpen && (
        <div>
          <h2>Results</h2>
          {documents?.map((doc) => (
            <div key={doc._id} onClick={() => onSelect(doc._id)}>
              {doc.icon ? <p>{doc.icon}</p> : <File />}
              <span>{doc.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
