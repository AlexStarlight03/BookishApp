"use client";
import { getBookById } from "@/app/actions/book";
import { fetchGoogleBookById } from "@/app/actions/fetchGoogleBookById";
import ReviewCard from "@/components/ui/ReviewCard";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import StarsRating from "@/components/ui/StarsRating";
import ClientBookActions from "@/components/ClientBookActions";
import { getReviewsFromBook } from "@/app/actions/review";

const ReviewBookForm = dynamic(() => import("@/components/forms/ReviewBookForm"), { ssr: false });

import { use } from "react";

export default function BookDetailsPage({ params }: { params: { googleBooksId: string } | Promise<{ googleBooksId: string }> }) {
  let googleBooksId = "";
  if (typeof (params as any).then === "function") {
    const resolvedParams = use(params as Promise<{ googleBooksId: string }>);
    googleBooksId = resolvedParams.googleBooksId;
  } else {
    googleBooksId = (params as { googleBooksId: string }).googleBooksId;
  }
  const [editReview, setEditReview] = useState<any | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [book, setBook] = useState<any>(null);
  const [averageRating, setAverageRating] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
      let bookResult = await getBookById({ googleBooksId });
      let bookData = bookResult?.book || null;
      if (!bookData) {
        try {
          const googleBook = await fetchGoogleBookById(googleBooksId);
          if (googleBook && googleBook.volumeInfo) {
            bookData = {
              title: googleBook.volumeInfo.title || "Sans titre",
              authors: googleBook.volumeInfo.authors || [],
              cover_img_url: googleBook.volumeInfo.imageLinks?.thumbnail || googleBook.volumeInfo.imageLinks?.smallThumbnail || null,
              description: googleBook.volumeInfo.description || "",
              nb_pages: googleBook.volumeInfo.pageCount || null,
              editor: googleBook.volumeInfo.publisher || null,
              googleBooksId: googleBook.id,
            };
          }
        } catch (e) {
          // Optionally handle error
        }
      }
      setBook(bookData);
      const reviewsData = await getReviewsFromBook({ googleBooksId });
      setReviews(reviewsData?.reviews || []);
      setAverageRating((reviewsData && "averageRating" in reviewsData && typeof (reviewsData as any).averageRating === "number") ? (reviewsData as any).averageRating : 0);
    }
    fetchData();
  }, [googleBooksId]);

  if (!book) return <div>Chargement...</div>;

  const handleEdit = (review: any) => {
    setEditReview(review);
    setShowEditModal(true);
  };
  const handleCloseEdit = () => {
    setShowEditModal(false);
    setEditReview(null);
  };

  return (
    <div className="main-block bg-card">
      <div className="flex flex-col md:flex-row gap-6">
        <img src={book.cover_img_url || "/default-cover.png"} alt={book.title} className="h-100 rounded shadow" />
        <div>
          <h1 className="book-title">{book.title}</h1>
          <p className="book-author">
            {Array.isArray(book.authors)
              ? book.authors.map((ba: any) => ba.author?.name).filter(Boolean).join(", ")
              : book.authors}
          </p>
          <StarsRating googleBooksId={googleBooksId} />
          <p className="mt-2">{book.description}</p>
          <div className="mt-4">
            <div><b>Édition:</b> {book.editor || "N/A"}</div>
            <div><b>Nombre de pages:</b> {book.nb_pages|| "N/A"}</div>
          </div>
          <ClientBookActions googleBooksId={googleBooksId} />
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Avis des utilisateurs</h2>
        {reviews.length > 0 ? (
        reviews.map((review: any) => (
          <ReviewCard key={review.idReview} review={review} onEdit={handleEdit} />
        ))
        ) : (
          <div>Aucun avis pour ce livre.</div>
        )}
      </div>
      {showEditModal && editReview && (
        <ReviewBookForm
          googleBooksId={googleBooksId}
          onClose={handleCloseEdit}
          reviewId={editReview.idReview}
          initialRating={editReview.rating}
          initialReview={editReview.full_review}
        />
      )}
    </div>
  );
}