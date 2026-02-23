"use client";

import Link from "next/link";
import AddReviewButton from "./AddReviewButton";
import AddToBookshelfButton from "./AddToBookshelfButton";
import UpdateReadingButton from "./UpdateReadingButton";

export default function BookCard({
  book,
  userBookshelves,
  onUpdate,
}: {
  book: any;
  userBookshelves: any[];
  onUpdate?: () => void;
}) {
  const bookInfo = book.book || book;
  const bookshelfName = book.bookshelf?.name || null;
  const currentPage = book.currPage || 0;
  const totalPages = bookInfo.nb_pages || 0;
  const progress =
    totalPages > 0 ? Math.min(100, Math.round((currentPage / totalPages) * 100)) : 0;
  const currentBookshelfId = book.idBookshelf;
  const bookId = bookInfo.googleBooksId || bookInfo.idBook;

  const handleRemoveFromBookshelf = async () => {
    if (!currentBookshelfId || !bookInfo.idBook) return;
    if (!confirm("Retirer ce livre de l'étagère ?")) return;
    const { deleteBookStatus } = await import("@/app/actions/bookStatus");
    await deleteBookStatus({ idBookshelf: currentBookshelfId, idBook: bookInfo.idBook });
    if (onUpdate) onUpdate();
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden flex flex-col h-full border border-[var(--accent)] hover:shadow-xl hover:border-[var(--accent-dark)] transition-all">
      <div className="flex flex-col items-center p-5">
        {bookInfo.cover_img_url || bookInfo.cover || bookInfo.thumbnail || bookInfo.imageUrl ? (
          <Link href={`/book/${bookId}`}>
            <img
              src={
                bookInfo.cover_img_url ||
                bookInfo.cover ||
                bookInfo.thumbnail ||
                bookInfo.imageUrl
              }
              alt={bookInfo.title}
              className="w-28 h-40 object-cover rounded-lg mb-4 cursor-pointer hover:opacity-90 transition-opacity"
            />
          </Link>
        ) : (
          <div className="w-28 h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400 text-sm">
            Pas d'image
          </div>
        )}

        <div className="w-full">
          <div
            className="font-bold text-lg mb-1 truncate"
            style={{ color: "var(--accent)" }}
          >
            {bookInfo.title}
          </div>
          <div className="text-sm mb-2 truncate" style={{ color: "var(--brown)" }}>
            {(() => {
              if (Array.isArray(bookInfo.authors) && bookInfo.authors.length > 0) {
                if (typeof bookInfo.authors[0] === "object" && bookInfo.authors[0].author) {
                  return bookInfo.authors.map((ba: any) => ba.author?.name).filter(Boolean).join(", ");
                }
                return bookInfo.authors.join(", ");
              } else if (
                typeof bookInfo.authors === "string" &&
                bookInfo.authors.trim()
              ) {
                return bookInfo.authors;
              } else if (bookInfo.author && bookInfo.author.trim()) {
                return bookInfo.author;
              } else {
                return "Auteur inconnu";
              }
            })()}
          </div>

          {bookInfo.description && (
            <div className="text-xs text-gray-400 mb-3 line-clamp-3">
              {bookInfo.description}
            </div>
          )}

          {book.bookshelf && bookshelfName !== "Terminés" && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span
                  className="text-xs font-semibold"
                  style={{ color: "var(--accent)" }}
                >
                  Progression
                </span>
                <span
                  className="text-xs"
                  style={{ color: "var(--accent-dark)" }}
                >
                  {progress}% ({currentPage}/{totalPages} pages)
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="mt-auto px-4 pb-4 flex flex-col gap-2">
            {!book.bookshelf || bookshelfName === "Terminés" ? (
              <AddToBookshelfButton
                googleBooksId={bookInfo.googleBooksId}
                onUpdate={onUpdate}
                currentBookshelfId={currentBookshelfId}
              />
            ) : (
              <>
                <UpdateReadingButton
                  googleBooksId={bookInfo.googleBooksId}
                  userBookshelves={userBookshelves}
                  onUpdate={onUpdate}
                />
                <AddToBookshelfButton
                  googleBooksId={bookInfo.googleBooksId}
                  onUpdate={onUpdate}
                  currentBookshelfId={currentBookshelfId}
                />
                <AddReviewButton
                  googleBooksId={bookInfo.googleBooksId}
                  onUpdate={onUpdate}
                />
                <button
                  className="book-button bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-2"
                  onClick={handleRemoveFromBookshelf}
                  type="button"
                >
                  Retirer de l'étagère
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}