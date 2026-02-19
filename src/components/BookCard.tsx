"use client";

export default function BookCard({ book }: { book: any }) {
  return (
    <div className="bg-card rounded-lg shadow p-2 flex flex-col items-center">
      <img src={book.cover_img_url || "/placeholder.png"} alt={book.title} className="h-70 object-cover mb-2 rounded" />
      <h3 className="font-bold text-md text-center">{book.title}</h3>
      <p className="text-sm text-gray-600">{book.authors?.join(", ")}</p>
      {/* TODO: Add review/add to bookshelf buttons here */}
    </div>
  );
}