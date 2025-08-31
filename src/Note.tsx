import { useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

type NoteProps = {
  note: {
    _id: Id<"notes">;
    text: string;
  };
};

export function Note({ note }: NoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(note.text);

  const updateNote = useMutation(api.notes.update);
  const removeNote = useMutation(api.notes.remove);

  async function handleUpdateNote() {
    if (editedText.trim() === "") {
      toast.error("Ghi chú không được để trống.");
      return;
    }
    try {
      await updateNote({ id: note._id, text: editedText });
      setIsEditing(false);
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
    <li className="bg-gray-50 p-4 rounded-lg flex justify-between items-start shadow-sm border">
      {isEditing ? (
        <div className="flex-1 flex flex-col gap-2">
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
          <div className="flex gap-2 self-end">
            <button
              onClick={handleUpdateNote}
              className="px-4 py-1 bg-brand-primary text-brand-text font-semibold rounded-lg hover:bg-brand-primary-hover transition-colors"
            >
              Lưu
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-1 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      ) : (
        <>
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
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
               </svg>
            </button>
          </div>
        </>
      )}
    </li>
  );
}
