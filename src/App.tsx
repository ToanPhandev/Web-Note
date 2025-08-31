import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster, toast } from "sonner";
import { FormEvent, useState } from "react";
import { Note } from "./Note";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-background text-brand-text">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b px-4">
        <h1 className="text-2xl font-bold text-brand-text">Ghi Chú Nhanh</h1>
        <SignOutButton />
      </header>
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-3xl mx-auto">
          <Authenticated>
            <NotesPage />
          </Authenticated>
          <Unauthenticated>
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Chào mừng bạn!</h2>
              <p className="text-lg mb-8">
                Vui lòng đăng nhập để bắt đầu ghi chú.
              </p>
              <div className="max-w-sm mx-auto">
                <SignInForm />
              </div>
            </div>
          </Unauthenticated>
        </div>
      </main>
      <Toaster />
    </div>
  );
}

function NotesPage() {
  const notes = useQuery(api.notes.get);
  const addNote = useMutation(api.notes.add);
  const generateUploadUrl = useMutation(api.notes.generateUploadUrl);
  const [newNote, setNewNote] = useState("");
  const [file, setFile] = useState<File | null>(null);

  async function handleAddNote(e: FormEvent) {
    e.preventDefault();
    if (newNote.trim() === "") {
      toast.error("Ghi chú không được để trống.");
      return;
    }

    let storageId: string | undefined = undefined;
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
      storageId = newStorageId;
      fileName = file.name;
      fileType = file.type;
    }

    try {
      await addNote({ text: newNote, storageId, fileName, fileType });
      setNewNote("");
      setFile(null);
      toast.success("Đã thêm ghi chú!");
    } catch (error) {
      toast.error("Không thể thêm ghi chú.");
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleAddNote} className="flex flex-col gap-4">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Viết ghi chú của bạn ở đây..."
          className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary h-32 text-lg"
        />
        <div className="flex justify-between items-center">
            <input type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            <button
              type="submit"
              className="self-end px-6 py-2 bg-brand-primary text-brand-text font-semibold rounded-lg hover:bg-brand-primary-hover transition-colors disabled:opacity-50 flex items-center gap-2"
              disabled={!newNote.trim()}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              Thêm Ghi Chú
            </button>
        </div>
      </form>

      {notes === undefined && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      )}

      {notes && notes.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p className="text-lg">Chưa có ghi chú nào.</p>
          <p>Hãy tạo ghi chú đầu tiên của bạn!</p>
        </div>
      )}

      {notes && notes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Ghi chú của bạn</h2>
          <ul className="space-y-4">
            {notes.map((note) => (
              <Note key={note._id} note={note} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
