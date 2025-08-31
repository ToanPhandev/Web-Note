import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

type NoteProps = {
  note: {
    _id: Id<"notes">;
    text: string;
    storageId?: Id<"_storage">;
    fileName?: string;
    fileType?: string;
  };
};

function NoteFile({ storageId, fileName, fileType }: { storageId: Id<"_storage">, fileName?: string, fileType?: string }) {
    const fileUrl = useQuery(api.notes.getFileUrl, { storageId });
    if (!fileUrl) {
        return null;
    }
    if (fileType?.startsWith("image/")) {
        return <img src={fileUrl} alt={fileName} className="w-full h-auto rounded-lg my-2" />;
    }
    if (fileType === "application/pdf") {
        return <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{fileName}</a>;
    }
    return <a href={fileUrl} target="_blank" rel="noopener noreferrer">{fileName}</a>;
}

export function Note({ note }: NoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(note.text);
  const [file, setFile] = useState<File | null>(null);
  const [removeFile, setRemoveFile] = useState(false);

  const updateNote = useMutation(api.notes.update);
  const removeNote = useMutation(api.notes.remove);
  const generateUploadUrl = useMutation(api.notes.generateUploadUrl);

  async function handleUpdateNote() {
    if (editedText.trim() === "") {
      toast.error("Ghi chú không được để trống.");
      return;
    }

    let storageId: Id<"_storage"> | undefined | null = note.storageId;
    let fileName: string | undefined | null = note.fileName;
    let fileType: string | undefined | null = note.fileType;

    if (removeFile) {
        storageId = null;
        fileName = null;
        fileType = null;
    } else if (file) {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId: newStorageId } = await result.json();
      storageId = newStorageId;
      fileName = file.name;
      fileType = file.type;
    }

    try {
      await updateNote({ id: note._id, text: editedText, storageId: storageId ?? undefined, fileName: fileName ?? undefined, fileType: fileType ?? undefined });
      setIsEditing(false);
      setFile(null);
      setRemoveFile(false);
      toast.success("Đã cập nhật ghi chú!");
    } catch (error) {
      toast.error("Không thể cập nhật ghi chú.");
      console.error(error);
    }
  }

  async function handleDeleteNote() {
    try {
      await removeNote({ id: note._id });
      toast.success("Đã xóa ghi chú!");
    } catch (error) {
      toast.error("Không thể xóa ghi chú.");
      console.error(error);
    }
  }

  return (
    <li className="bg-gray-50 p-4 rounded-lg flex flex-col gap-2 shadow-sm border">
      {isEditing ? (
        <div className="flex-1 flex flex-col gap-2">
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
            {note.storageId && !removeFile && (
                <div className="flex items-center gap-2">
                    <NoteFile storageId={note.storageId} fileName={note.fileName} fileType={note.fileType} />
                    <button onClick={() => setRemoveFile(true)} className="text-red-500 font-semibold flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                        </svg>
                        Remove
                    </button>
                </div>
            )}
            <input type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          <div className="flex gap-2 self-end">
            <button
              onClick={handleUpdateNote}
              className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              Lưu
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              Hủy
            </button>
          </div>
        </div>
      ) : (
        <>
            <div className="flex-1 flex justify-between items-start">
                <p className="flex-1 whitespace-pre-wrap break-words mr-4">
                    {note.text}
                </p>
                <div className="flex gap-2">
                    <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-500 hover:text-blue-700 font-bold transition-colors p-1 rounded-full"
                    aria-label="Chỉnh sửa ghi chú"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" />
                    </svg>
                    </button>
                    <button
                    onClick={handleDeleteNote}
                    className="text-red-500 hover:text-red-700 font-bold transition-colors p-1 rounded-full"
                    aria-label="Xóa ghi chú"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                    </svg>
                    </button>
                </div>
            </div>
            {note.storageId && <NoteFile storageId={note.storageId} fileName={note.fileName} fileType={note.fileType} />}
        </>
      )}
    </li>
  );
}
