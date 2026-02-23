"use client";
import { useState, useEffect } from "react";
import BookCard from "@/components/ui/BookCard";

export default function DashboardCurrentReadsClient({ initialBookshelves, initialBooks, userId }: { initialBookshelves: any[]; initialBooks: any[]; userId: string; }) {
  const [bookshelves, setBookshelves] = useState(initialBookshelves);
  const [books, setBooks] = useState(initialBooks);
  const [loading, setLoading] = useState(false);

  const reloadBooks = async () => {
    setLoading(true);
    const { getBookshelvesByUserId } = await import("@/app/actions/bookshelf");
    const bookshelvesData = await getBookshelvesByUserId({ idUser: userId });
    const bookshelvesNew = bookshelvesData?.data || [];
    setBookshelves(bookshelvesNew);
    const currentShelfNew = bookshelvesNew.find((shelf: any) => shelf.name === "En cours");
    const currentBookshelfNew =
      currentShelfNew && Array.isArray(currentShelfNew.booksBookshelf)
        ? currentShelfNew.booksBookshelf.map((bb: any) => ({
            ...bb,
            book: bb.book,
            bookshelf: currentShelfNew,
          }))
        : [];
    setBooks(currentBookshelfNew);
    setLoading(false);
  };

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {loading ? (
        <div>Chargement...</div>
      ) : books.length > 0 ? (
        books.map((book: any) => (
          <li key={book.book?.idBook || book.idBook || book.id}>
            <BookCard book={book} userBookshelves={bookshelves} onUpdate={reloadBooks} />
          </li>
        ))
      ) : (
        <div style={{ color: "var(--brown)", fontSize: "1.1rem", textAlign: "center" }}>
          Aucune lecture en cours.
        </div>
      )}
    </ul>
  );
}
