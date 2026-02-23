"use client";
import { useState } from "react";
import ReviewBookForm from "./ReviewBookForm";

export default function ReadingUpdateForm({
  book,
  userBookshelves,
  onStatusChange,
  onClose,
}: {
  book: any;
  userBookshelves: any[];
  onStatusChange?: (status: string) => void;
  onClose?: () => void;
}) {

  let initialStartDate = "";
  if (book.dateStart) {
    if (typeof book.dateStart === "string") {
      initialStartDate = book.dateStart.slice(0, 10);
    } else if (book.dateStart instanceof Date) {
      initialStartDate = book.dateStart.toISOString().slice(0, 10);
    }
  }
  const [startDate, setStartDate] = useState<string>(initialStartDate);
  const [endDate, setEndDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(book.currPage || 0);
  const [showReview, setShowReview] = useState(false);

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      alert("La date de fin doit être après la date de début.");
      return;
    }
  }

  const terminesShelf = userBookshelves.find(shelf => shelf.name === "Terminés" || shelf.status === "Terminés");
  const enCoursShelf = userBookshelves.find(shelf => shelf.name === "En cours" || shelf.status === "En cours");


const moveToTermines = async () => {
  const idBookshelfTermines = terminesShelf?.idBookshelf;
  const idBookshelfCurrent = book.idBookshelf;
  const idBook = book.idBook;
  if (!idBookshelfTermines || !idBookshelfCurrent || !idBook) {
    alert("Impossible de terminer: identifiants manquants.");
    return;
  }
  const { modifyBookStatus } = await import("@/app/actions/bookStatus");
  await modifyBookStatus({ idBookshelf: idBookshelfCurrent, idBook }, {
    idBookshelf: idBookshelfTermines,
    dateEnd: new Date().toISOString(),
    currPage: book.nb_pages,
  });
  if (onStatusChange) onStatusChange("Terminés");
  if (typeof onClose === "function") onClose();
  setShowReview(true);
};
  const handleUpdate = async () => {
    const idBookshelf = book.idBookshelf;
    const idBook = book.idBook;
    if (!idBookshelf || !idBook) {
      alert("Impossible de mettre à jour: identifiants manquants.");
      return;
    }
    const { modifyBookStatus } = await import("@/app/actions/bookStatus");
    await modifyBookStatus({ idBookshelf, idBook }, {
      dateStart: startDate ? new Date(startDate).toISOString() : null,
      dateEnd: endDate && endDate.trim() !== "" ? new Date(endDate).toISOString() : null,
      currPage: currentPage,
    });
    if (currentPage === book.nb_pages) {
      await moveToTermines();
    } else {
      if (onStatusChange) onStatusChange("En cours");
      if (typeof onUpdate === "function") onUpdate();
      if (typeof onClose === "function") onClose();
    }
  };
  const handlePageChange = (value: number) => {
    const maxPages = book.nb_pages || 0;
    if (value > maxPages) {
      setCurrentPage(maxPages);
    } else if (value < 0) {
      setCurrentPage(0);
    } else {
      setCurrentPage(value);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative bg-gradient-to-br from-white via-card to-gray-100 rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-200">
        <button
          className="absolute top-2 right-2 text-xl font-bold text-gray-400 hover:text-gray-700 transition"
          onClick={onClose}
        >
          ×
        </button>
        <h4 className="font-bold text-2xl mb-6 text-primary">Mettre à jour la lecture</h4>
        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm mb-1 font-semibold text-gray-700">Date de début</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all bg-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 font-semibold text-gray-700">Date de fin</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all bg-white"
              placeholder="mm/dd/yyyy"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 font-semibold text-gray-700">Page actuelle</label>
            <input
              type="number"
              min={0}
              max={book.nb_pages}
              step={1}
              value={currentPage}
              onChange={e => handlePageChange(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all bg-white"
              autoFocus
              onFocus={e => e.target.select()}
              inputMode="numeric"
            />
            <div className="mt-1 text-xs text-gray-500">
              {currentPage} / {book.nb_pages} pages
            </div>
          </div>
          <div className="flex gap-3 mt-2 justify-end">
            <button className="book-button bg-gradient-to-r from-purple-500 via-pink-400 to-yellow-400 text-white font-bold px-6 py-2 rounded-full shadow-md hover:scale-105 transition-all" type="button" onClick={handleUpdate}>
              Mettre à jour
            </button>
          </div>
        </form>
        {showReview && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-40">
            <div className="relative bg-gradient-to-br from-white via-card to-gray-100 rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-200">
              <button
                className="absolute top-2 right-2 text-xl font-bold text-gray-400 hover:text-gray-700 transition"
                onClick={() => setShowReview(false)}
              >
                ×
              </button>
              <ReviewBookForm
                googleBooksId={book.googleBooksId}
                onClose={() => setShowReview(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}