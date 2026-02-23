"use client";
import { useState } from "react";
import { useUser } from "@stackframe/stack";

function StarDisplay({ rating }: { rating: number }) {

  return (
    <div className="flex items-center mb-2">
      {[...Array(5)].map((_, i) => {
        const fill =
          rating >= i + 1
            ? 1
            : rating > i
            ? rating - i
            : 0;
        return (
          <span key={i} style={{ position: "relative", fontSize: "2.5rem", marginRight: 4 }}>
            <span style={{ color: "#d1d5db" }}>★</span>
            <span
              style={{
                color: "#facc15",
                position: "absolute",
                left: 0,
                top: 0,
                width: `${fill * 100}%`,
                overflow: "hidden",
              }}
            >
              ★
            </span>
          </span>
        );
      })}
      <span className="ml-3 text-xl font-semibold">{rating.toFixed(2)}</span>
    </div>
  );
}

export default function ReviewBookForm({
  googleBooksId,
  onClose,
  reviewId,
  initialRating = 0,
  initialReview = "",
}: {
  googleBooksId: string,
  onClose: () => void,
  reviewId?: number,
  initialRating?: number,
  initialReview?: string,
}) {
    const [rating, setRating] = useState(initialRating);
    const [review, setReview] = useState(initialReview);
    const user = useUser();
    if (!user) return null
    const idUser = user.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleBooksId || !idUser) {
      alert("Livre ou utilisateur introuvable.");
      return;
    }
    const { createReview, modifyReview } = await import("@/app/actions/review");
    if (reviewId) {
      await modifyReview({ id: reviewId, googleBooksId, idUser, rating, full_review: review });
    } else {
      await createReview({ googleBooksId, idUser, rating, full_review: review });
    }
    if (typeof onClose === "function") {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-white via-card to-gray-100 rounded-2xl p-8 w-full max-w-md shadow-xl relative border border-gray-200">
        <button className="absolute top-2 right-2 text-xl font-bold text-gray-400 hover:text-gray-700 transition" onClick={onClose}>×</button>
        <h2 className="text-2xl font-bold mb-6 text-primary">Ajouter une critique</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="block mb-1 font-semibold text-sm text-gray-700">Note (0-5):</label>
          <div className="flex items-center gap-2">
            <StarDisplay rating={rating} />
            <input
              type="range"
              min={0}
              max={5}
              step={0.1}
              value={rating}
              onChange={e => setRating(Number(e.target.value))}
              className="w-32 accent-yellow-400"
            />
          </div>
          <label className="block mb-1 font-semibold text-sm text-gray-700">Critique:</label>
          <textarea
            className="review-content border border-gray-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all bg-white min-h-[80px]"
            value={review}
            onChange={e => setReview(e.target.value)}
            placeholder="Votre avis..."
          />
          <button type="submit" className="book-button bg-gradient-to-r from-purple-500 via-pink-400 to-yellow-400 text-white font-bold px-6 py-2 rounded-full shadow-md mt-2 hover:scale-105 transition-all">
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
}