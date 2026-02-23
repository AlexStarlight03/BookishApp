
"use client";
import { useState } from "react";
import { useUser } from "@stackframe/stack";

type Review = {
  idReview: number;
  idUser: string;
  rating: number;
  full_review?: string;
  createdAt: string;
  user: {
    username: string | null;
    avatar?: string | null;
  };
};

export default function ReviewCard({ review, onEdit, onDelete }: { review: Review, onEdit?: (review: Review) => void, onDelete?: (id: number) => void }) {
  const [deleting, setDeleting] = useState(false);
  const user = useUser();

  const handleDelete = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette critique ?")) return;
    setDeleting(true);
    const { deleteReview } = await import("@/app/actions/review");
    await deleteReview({ id: review.idReview });
    setDeleting(false);
    if (onDelete) onDelete(review.idReview);
  };

  const isOwner = user && review.idUser && (user.id === review.idUser);

  return (
    <div className="bg-gradient-to-br from-white via-card to-gray-100 rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-2">
        <span className="font-semibold text-primary text-lg">
          {review.user?.username || "Anonyme"}
        </span>
        <div className="flex items-center gap-1">
          {[1,2,3,4,5].map(star => (
            <span key={star} className="text-xl" style={{ color: star <= review.rating ? '#FFD700' : '#E5E7EB', textShadow: star <= review.rating ? '0 2px 8px #facc15' : 'none' }}>
              ★
            </span>
          ))}
        </div>
        <span className="text-xs text-gray-400 ml-auto">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>
      <div className="text-gray-700 mt-2 text-base font-normal min-h-[2rem]">{review.full_review || <i>Aucun commentaire</i>}</div>
      { isOwner && (
        <div className="flex gap-2 mt-4 justify-end">
          <button
            className="book-button bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-xs shadow-md"
            onClick={() => onEdit && onEdit(review)}
          >
            Modifier
          </button>
          <button
            className="book-button bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-xs shadow-md"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      )}
    </div>
  );
}
