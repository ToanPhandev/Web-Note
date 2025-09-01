import React, { useState, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

type NoteProps = {
  note: {
    _id: Id<"notes">;
    text: string;
    storageId?: Id<"_storage"> | null;
    fileName?: string | null;
    fileType?: string | null;
  };
};

function NoteFile({
  storageId,
  fileName,
  fileType,
}: {
  storageId: Id<"_storage">;
  fileName?: string | null;
  fileType?: string | null;
}) {
  const fileUrl = useQuery(api.notes.getFileUrl, { storageId });
  if (!fileUrl) {
    return null;
  }
  if (fileType?.startsWith("image/")) {
    return (
      <img
        src={fileUrl}
        alt={fileName ?? ""}
        className="w-full h-auto rounded-lg my-2 shadow-sm"
      />
    );
  }
  if (fileType === "application/pdf") {
    return (
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline flex items-center gap-2 bg-gray-100 p-2 rounded-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V8.828a2 2 0 00-.586-1.414l-4.828-4.828A2 2 0 0011.172 2H4zm3 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 100 2h8a1 1 0 100-2H7z"
            clipRule="evenodd"
          />
        </svg>
        {fileName}
      </a>
    );
  }
  return (
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline"
    >
      {fileName}
    </a>
  );
}

export function Note({ note }: NoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(note.text);
  const [file, setFile] = useState<File | null>(null);
  const [removeFile, setRemoveFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      await updateNote({
        id: note._id,
        text: editedText,
        storageId: storageId ?? undefined,
        fileName: fileName ?? undefined,
        fileType: fileType ?? undefined,
      });
      setIsEditing(false);
      setFile(null);
      setRemoveFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
    <li className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col gap-4">
      {isEditing ? (
        <div className="flex-1 flex flex-col gap-4">
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
          <div className="flex items-center gap-4">
            {note.storageId && !removeFile && (
              <div className="flex-shrink-0">
                <NoteFile
                  storageId={note.storageId}
                  fileName={note.fileName}
                  fileType={note.fileType}
                />
                <button
                  onClick={() => setRemoveFile(true)}
                  className="text-red-600 font-semibold flex items-center gap-1 mt-1 text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Xóa tệp
                </button>
              </div>
            )}
            <div className="flex-grow">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                ref={fileInputRef}
                className="hidden"
                id={`file-upload-${note._id}`}
              />
              <label
                htmlFor={`file-upload-${note._id}`}
                className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2 justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5.5 13.5a.5.5 0 01.5-.5h8a.5.5 0 010 1H6a.5.5 0 01-.5-.5z" />
                  <path d="M5 8a.5.5 0 01.5-.5h8a.5.5 0 010 1H5.5A.5.5 0 015 8z" />
                  <path
                    fillRule="evenodd"
                    d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm2-1a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-1-1H4z"
                    clipRule="evenodd"
                  />
                </svg>
                {file ? file.name : "Thay đổi tệp"}
              </label>
            </div>
          </div>
          <div className="flex gap-2 self-end mt-2">
            <button
              onClick={handleUpdateNote}
              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Lưu
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-colors flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Hủy
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 flex justify-between items-start">
            <p className="flex-1 whitespace-pre-wrap break-words mr-4 text-lg">
              {note.text}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-800 font-bold transition-colors p-2 rounded-full hover:bg-gray-200"
                aria-label="Chỉnh sửa ghi chú"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z"
                  />
                </svg>
              </button>
              <button
                onClick={handleDeleteNote}
                className="text-red-600 hover:text-red-800 font-bold transition-colors p-2 rounded-full hover:bg-gray-200"
                aria-label="Xóa ghi chú"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
          {note.storageId && (
            <NoteFile
              storageId={note.storageId}
              fileName={note.fileName}
              fileType={note.fileType}
            />
          )}
        </>
      )}
    </li>
  );
}

