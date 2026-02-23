"use client";
import { useState } from "react";
import ReviewBookForm from "../forms/ReviewBookForm";

export default function AddReviewButton({ googleBooksId, onUpdate }: { googleBooksId: string, onUpdate?: () => void }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <button
        className="book-button bg-gradient-to-r from-purple-500 via-pink-400 to-yellow-400 text-white font-bold px-6 py-2 rounded-full shadow-md mt-2 hover:scale-105 transition-all"
        onClick={() => setShow(true)}
      >
        Ajouter une critique
      </button>
      {show && (
        <ReviewBookForm
          googleBooksId={googleBooksId}
          onClose={() => {
            setShow(false);
            if (typeof onUpdate === "function") onUpdate();
          }}
        />
      )}
    </div>
  );
}