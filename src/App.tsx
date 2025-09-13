import React, { FormEvent, useState, useRef } from "react";
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { api } from "../convex/_generated/api";
import { LoginForm } from "./components/login-form";
import { SignOutButton } from "./SignOutButton";
import { Toaster, toast } from "sonner";
import { Note } from "./Note";
import { Id } from "../convex/_generated/dataModel";
// mới

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-800">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">Ghi Chú Nhanh</h1>
        <SignOutButton />
      </header>
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Authenticated>
            <NotesPage />
          </Authenticated>
          <Unauthenticated>
            <div className="text-center py-16">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">
                Chào mừng bạn!
              </h2>
              <p className="text-lg mb-8 text-gray-600">
                Vui lòng đăng nhập để bắt đầu ghi chú.
              </p>
              <div className="max-w-sm mx-auto">
                <LoginForm />
              </div>
            </div>
          </Unauthenticated>
        </div>
      </main>
      <Toaster position="top-center" />
    </div>
  );
}

function NotesPage() {
  const notes = useQuery(api.notes.get);
  const addNote = useMutation(api.notes.add);
  const generateUploadUrl = useMutation(api.notes.generateUploadUrl);
  const [newNote, setNewNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleAddNote(e: FormEvent) {
    e.preventDefault();
    if (newNote.trim() === "") {
      toast.error("Ghi chú không được để trống.");
      return;
    }

     let storageId: Id<"_storage"> | undefined = undefined;
    let fileName: string | undefined = undefined;
    let fileType: string | undefined = undefined;

    if (file) {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId: newStorageId } = await result.json();
      storageId = newStorageId as Id<"_storage">;
      fileName = file.name;
      fileType = file.type;
    }

    try {
      await addNote({ text: newNote,storageId,fileName, fileType });
      setNewNote("");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success("Đã thêm ghi chú!");
    } catch (error) {
      toast.error("Không thể thêm ghi chú.");
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <form
        onSubmit={handleAddNote}
        className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md"
      >
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Viết ghi chú của bạn ở đây..."
          className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 text-lg"
        />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              ref={fileInputRef}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm3 2a1 1 0 00-1 1v4a1 1 0 001 1h8a1 1 0 001-1V8a1 1 0 00-1-1H6z"
                  clipRule="evenodd"
                />
                <path d="M6.5 12a.5.5 0 000 1h7a.5.5 0 000-1h-7z" />
              </svg>
              {file ? file.name : "Đính kèm tệp"}
            </label>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            disabled={!newNote.trim()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Thêm Ghi Chú
          </button>
        </div>
      </form>

      {notes === undefined && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      )}

      {notes && notes.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          <p className="text-xl">Chưa có ghi chú nào.</p>
          <p>Hãy tạo ghi chú đầu tiên của bạn!</p>
        </div>
      )}

      {notes && notes.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold text-gray-900">
            Ghi chú của bạn
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <Note key={note._id} note={note} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
