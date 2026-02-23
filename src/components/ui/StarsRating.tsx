"use client";

import { useEffect, useState } from "react";

export default function StarsRating({ googleBooksId }: { googleBooksId: string }) {
  if (!googleBooksId) return <div>Pas de note pour l'instant</div>;

  const [rating, setRating] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getRating() {
      setLoading(true);
      const { getReviewsFromBook } = await import("@/app/actions/review");
      const result = await getReviewsFromBook({ googleBooksId });
      const ratings = Array.isArray(result.reviews)
        ? result.reviews
        : [];
      if (ratings.length > 0) {
        const avg = ratings.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / ratings.length;
        setRating(avg);
        setCount(ratings.length);
      } else {
        setRating(0);
        setCount(0);
      }
      setLoading(false);
    }
    getRating();
  }, [googleBooksId]);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-200 via-pink-100 to-purple-100 rounded-full px-4 py-2 shadow-md">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className="text-2xl"
            style={{
              color: star <= Math.round(rating) ? "#FFD700" : "#E5E7EB",
              textShadow: star <= Math.round(rating) ? "0 2px 8px #facc15" : "none",
              filter: star <= Math.round(rating) ? "drop-shadow(0 0 2px #facc15)" : "none",
            }}
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-lg font-semibold text-primary">{rating.toFixed(2)}</span>
      <span className="text-xs text-gray-500">({count})</span>
    </div>
  );
}