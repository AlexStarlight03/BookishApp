import ReviewsClient from "./ReviewsClient";
import { getReviewsFromUser } from "@/app/actions/review";
import { getServerUser } from "@/lib/auth-utils";

export default async function ReviewsPage() {
  const user = await getServerUser();
  if (!user) {
    return (
      <div className="main-block bg-card">
        <h1 className="book-title mb-8 text-center">Non authentifié</h1>
      </div>
    );
  }
  const userId = user.id;
  const result = await getReviewsFromUser({ idUser: userId });
  const reviews = result?.data || [];
  return <ReviewsClient reviews={reviews} />;
}