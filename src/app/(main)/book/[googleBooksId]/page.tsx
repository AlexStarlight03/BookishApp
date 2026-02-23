import { getBookById } from "@/app/actions/book";
import ReviewCard from "@/components/ui/ReviewCard";
import StarsRating from "@/components/ui/StarsRating";
import ClientBookActions from "@/components/ClientBookActions";
import { getReviewsFromBook } from "@/app/actions/review";

export default async function BookDetailsPage({ params }: { params: { googleBooksId: string } | Promise<{ googleBooksId: string }> }) {
  let googleBooksId: string;
  if (typeof (params as any).then === "function") {
    params = await params;
  }
  googleBooksId = (params as { googleBooksId: string }).googleBooksId;
  if (!googleBooksId) {
    return <div>Paramètre googleBooksId manquant ou invalide</div>;
  }
  const bookResult = await getBookById({ googleBooksId });
  const book = bookResult?.book || null;
  let reviews: any[] = [];
  let averageRating = 0;
  if (book) {
    const reviewsData = await getReviewsFromBook({ googleBooksId });
    reviews = reviewsData?.reviews || [];
    averageRating = (reviewsData && "averageRating" in reviewsData && typeof (reviewsData as any).averageRating === "number") ? (reviewsData as any).averageRating : 0;
  }

  if (!book) return <div>Chargement...</div>;

  return (
    <div className="main-block bg-card">
      <div className="flex flex-col md:flex-row gap-6">
        <img src={book.cover_img_url} alt={book.title} className="h-100 rounded shadow" />
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
            <ReviewCard key={review.idReview} review={review} />
        ))
        ) : (
          <div>Aucun avis pour ce livre.</div>
        )}
      </div>
    </div>
  );
}