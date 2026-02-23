"use client";

import { useState, useEffect } from "react";
import AddBookForm from "@/components/forms/AddBookForm";
import { useUser } from "@stackframe/stack";
import { getBookshelvesByUserId } from "@/app/actions/bookshelf";

export default function AddToBookshelfButton({
  googleBooksId,
  onUpdate,
  currentBookshelfId,
}: {
  googleBooksId: string;
  onUpdate?: () => void;
  currentBookshelfId?: number;
}) {
  const [showForm, setShowForm] = useState(false);
  const [bookshelves, setBookshelves] = useState<any[]>([]);
  const user = useUser();

  useEffect(() => {
    if (user?.id) {
      getBookshelvesByUserId({ idUser: user.id }).then((res) => {
        setBookshelves(res?.data || []);
      });
    }
  }, [user?.id]);

  return (
    <>
      <button
        className="w-full py-2 px-4 bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 text-white font-bold rounded-xl shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => setShowForm(true)}
      >
        <span className="inline-flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M12 4v16m8-8H4" />
          </svg>
          {currentBookshelfId ? "Déplacer le livre d'étagère" : "Ajouter à une étagère"}
        </span>
      </button>
      {showForm && (
        <AddBookForm
          googleBooksId={googleBooksId}
          onUpdate={onUpdate}
          onClose={() => setShowForm(false)}
          currentBookshelfId={currentBookshelfId}
          bookshelves={bookshelves}
        />
      )}
    </>
  );
}