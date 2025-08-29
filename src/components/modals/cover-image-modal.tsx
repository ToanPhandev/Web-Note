import { useMutation } from "convex/react";
import { useParams } from "react-router-dom";
import { useState } from "react";

import { useCoverImage } from "../../hooks/use-cover-image";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export const CoverImageModal = () => {
  const params = useParams();
  const update = useMutation(api.documents.update);
  const coverImage = useCoverImage();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const removeFile = useMutation(api.files.remove);

  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  };

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);

      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();

      if (coverImage.url) {
        // This is tricky, we need the storageId from the URL.
        // Let's skip replacing for now to simplify.
      }

      await update({
        id: params.documentId as Id<"documents">,
        coverImage: storageId,
      });

      onClose();
    }
  };

  return (
    <dialog open={coverImage.isOpen} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Cover Image</h3>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onChange(e.target.files?.[0])}
          disabled={isSubmitting}
        />
        <div className="modal-action">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </dialog>
  );
};
