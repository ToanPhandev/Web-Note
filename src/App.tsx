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
import { Id } from "../convex/_generated/dataModel";

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
  const removeNote = useMutation(api.notes.remove);
  const [newNote, setNewNote] = useState("");

  async function handleAddNote(e: FormEvent) {
    e.preventDefault();
    if (newNote.trim() === "") {
      toast.error("Ghi chú không được để trống.");
      return;
    }
    try {
      await addNote({ text: newNote });
      setNewNote("");
      toast.success("Đã thêm ghi chú!");
    } catch (error) {
      toast.error("Không thể thêm ghi chú.");
      console.error(error);
    }
  }

  async function handleDeleteNote(id: Id<"notes">) {
    try {
      await removeNote({ id });
      toast.success("Đã xóa ghi chú!");
    } catch (error) {
      toast.error("Không thể xóa ghi chú.");
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
        <button
          type="submit"
          className="self-end px-6 py-2 bg-brand-primary text-brand-text font-semibold rounded-lg hover:bg-brand-primary-hover transition-colors disabled:opacity-50"
          disabled={!newNote.trim()}
        >
          Thêm Ghi Chú
        </button>
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
              <li
                key={note._id}
                className="bg-gray-50 p-4 rounded-lg flex justify-between items-start shadow-sm border"
              >
                <p className="flex-1 whitespace-pre-wrap break-words mr-4">
                  {note.text}
                </p>
                <button
                  onClick={() => handleDeleteNote(note._id)}
                  className="text-red-500 hover:text-red-700 font-bold transition-colors p-1 rounded-full"
                  aria-label="Xóa ghi chú"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
