"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import ReviewCard from "@/components/ui/ReviewCard";
import BookCard from "@/components/ui/BookCard";
const ReviewBookForm = dynamic(() => import("@/components/forms/ReviewBookForm"));


import { useEffect } from "react";

export default function ReviewsClient({ reviews: initialReviews }: { reviews: any[] }) {
  const [reviews, setReviews] = useState<any[]>(initialReviews);
  const [editing, setEditing] = useState<null | any>(null);
  // Helper to reload reviews from server
  const reloadReviews = async () => {
    const { getReviewsFromUser } = await import("@/app/actions/review");
    // You may want to get the user id from the first review or from context
    const idUser = reviews[0]?.idUser;
    if (!idUser) return;
    const result = await getReviewsFromUser({ idUser });
    setReviews(result?.data || []);
  };

  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  return (
    <div className="main-block bg-card">
      <h1 className="book-title mb-8 text-center">Mes critiques</h1>
      {reviews.length === 0 ? (
        <div className="text-gray-400">Aucune critique trouvée.</div>
      ) : (
        <ul className="flex flex-col gap-6">
          {reviews.map((review: any) => (
            <li key={review.idReview}>
              <div className="flex flex-col md:flex-row gap-4 items-stretch bg-white rounded-xl shadow-lg p-4">
                <div className="flex-1">
                  <ReviewCard
                    review={review}
                    onEdit={() => setEditing(review)}
                    onDelete={reloadReviews}
                  />
                </div>
                <div className="flex-1">
                  <BookCard book={{
                    ...review.book,
                    ...review.bookStatus,
                    bookshelf: review.bookStatus?.bookshelf,
                  }} userBookshelves={[]} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {editing && (
        <ReviewBookForm
          googleBooksId={editing.book?.googleBooksId || ""}
          reviewId={editing.idReview}
          initialRating={editing.rating}
          initialReview={editing.full_review}
          onClose={() => {
            setEditing(null);
            reloadReviews();
          }}
        />
      )}
    </div>
  );
}