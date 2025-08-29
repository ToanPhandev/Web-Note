import { useMutation, useQuery } from "convex/react";
import { useParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Toolbar } from "../components/toolbar";
import { Cover } from "../components/cover";
import { Editor } from "../components/editor";

export const DocumentPage = () => {
  const { documentId } = useParams();
  const document = useQuery(api.documents.getById, {
    documentId: documentId as Id<"documents">,
  });

  const coverImageUrl = useQuery(
    api.files.getUrl,
    document?.coverImage ? { storageId: document.coverImage } : "skip"
  );

  const update = useMutation(api.documents.update);

  const onChange = (content: string) => {
    update({
      id: documentId as Id<"documents">,
      content,
    });
  };

  if (document === undefined) {
    return <div>Loading...</div>;
  }

  if (document === null) {
    return <div>Not found</div>;
  }

  return (
    <div className="pb-40">
      <Cover url={coverImageUrl ?? undefined} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={document} />
        <Editor onChange={onChange} initialContent={document.content} />
      </div>
    </div>
  );
};
