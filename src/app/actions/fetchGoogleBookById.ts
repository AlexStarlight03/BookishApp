export async function fetchGoogleBookById(googleBooksId: string) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
  if (!apiKey) throw new Error("Google Books API key not set");
  const url = `https://www.googleapis.com/books/v1/volumes/${googleBooksId}?key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Google Books API error");
  return await res.json();
}
