"use client";
import { useState, useEffect } from "react";
import ReadingUpdateForm from "../forms/ReadingUpdateForm";
import { useUser } from "@stackframe/stack";

export default function UpdateReadingButton({
  googleBooksId,
  userBookshelves,
  onUpdate,
}: {
  googleBooksId: string;
  userBookshelves: any[];
  onUpdate?: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [book, setBook] = useState<any>(null);
  const user = useUser();

  useEffect(() => {
    async function getBook() {
      if (showForm && googleBooksId) {
        const { getBookById } = await import("@/app/actions/book");
        const data = await getBookById({ googleBooksId });
        const bookData = data.book;
        if (!bookData) {
          alert("Impossible de trouver les informations du livre.");
          setShowForm(false);
          return;
        }
        const bookshelfEntry = userBookshelves
          .flatMap(shelf =>
            (shelf.booksBookshelf || []).map((bookShelfEntry: any) => ({
              ...bookShelfEntry,
              idBookshelf: shelf.idBookshelf,
              shelfName: shelf.name,
              shelfStatus: shelf.name,
            }))
          )
          .find(entry => String(entry.idBook) === String(bookData.idBook));
        if (!bookshelfEntry) {
          alert("Ce livre n'est pas dans votre étagère.");
          setShowForm(false);
          return;
        }
        setBook({ ...bookData, ...bookshelfEntry });
      }
    }
    getBook();
  }, [showForm, googleBooksId, userBookshelves]);

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="book-button w-full py-3 px-6 rounded-full shadow-lg bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-white font-bold text-lg flex items-center justify-center gap-3 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:from-yellow-300 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
      >
        <span className="inline-flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M12 4v16m8-8H4" />
          </svg>
          Avancer la lecture
        </span>
      </button>
      {showForm && book && user && (
        <ReadingUpdateForm
          book={book}
          userBookshelves={userBookshelves}
          onClose={() => setShowForm(false)}
          onStatusChange={() => {
            if (onUpdate) onUpdate();
          }}
        />
      )}
    </>
  );
}