import Link from "next/link";
import BookCard from "@/components/ui/BookCard";
import { getBookshelvesByUserId } from "@/app/actions/bookshelf";
import { getBooksFromUser } from "@/app/actions/bookStatus";
import { getUserById } from "@/app/actions/user";
import { getServerUser } from "@/lib/auth-utils";
import dynamic from "next/dynamic";
import CurrentReadsClientWrapper from "@/components/ui/CurrentReadsClientWrapper";

export default async function HomePage() {
  const stackUser = await getServerUser();

  if (!stackUser) {
    return (
      <main className="main-block min-h-[calc(100vh-4rem)]">
        <section className="flex flex-col items-center justify-center text-center px-6 py-24 sm:py-32 bg-card">
          <h1 className="book-title">
            Bienvenue sur <span style={{ color: "var(--accent)" }}>Bookish</span>
          </h1>
          <p className="mt-6 max-w-2xl book-author">
            Gérez vos lectures et vos critiques de livres en toute simplicité avec{" "}
            <span className="font-semibold" style={{ color: "var(--accent)" }}>Bookish</span>,
            votre compagnon de lecture ultime. Découvrez, organisez et partagez vos expériences
            littéraires avec une communauté passionnée.
          </p>
          <div className="px-6 py-10 flex gap-4">
            <Link
              href="/handler/sign-in"
              className="book-button"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              Se connecter
            </Link>
            <Link
              href="/handler/sign-up"
              className="book-button"
              style={{ background: "var(--highlight)", color: "var(--accent-dark)" }}
            >
              S'inscrire
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const userId = stackUser.id;

  const bookshelvesData = await getBookshelvesByUserId({ idUser: userId });
  const bookshelves = bookshelvesData?.data || [];
  const currentShelf = bookshelves.find((shelf: any) => shelf.name === "En cours");
  const currentBookshelf =
    currentShelf && Array.isArray(currentShelf.booksBookshelf)
      ? currentShelf.booksBookshelf.map((bb: any) => ({
          ...bb,
          book: bb.book,
          bookshelf: currentShelf,
        }))
      : [];

  const booksFromUserData = await getBooksFromUser({ idUser: userId, status: "Terminés" });
  let readCount = 0;
  if (
    booksFromUserData.success &&
    Array.isArray(booksFromUserData.books) &&
    booksFromUserData.books.length > 0
  ) {
    const thisYear = new Date().getFullYear();
    readCount = booksFromUserData.books.filter(
      (b: any) => b.dateEnd && new Date(b.dateEnd).getFullYear() === thisYear
    ).length;
  }

  const userData = await getUserById({ id: userId });
  const yearlyGoal =
    userData.success && userData.data && typeof userData.data.yearlyGoal === "number"
      ? userData.data.yearlyGoal
      : null;

  const progress = yearlyGoal ? Math.min((readCount / yearlyGoal) * 100, 100) : 0;

  return (
    <main className="main-block min-h-[calc(100vh-4rem)]">
      <section className="flex flex-col sm:flex-row items-stretch justify-center gap-8 px-6 py-24 sm:py-32 bg-card">

        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <h1 className="book-title">
            Bienvenue sur <span style={{ color: "var(--accent)" }}>Bookish</span>
          </h1>
          <p className="mt-6 max-w-2xl book-author">
            Gérez vos lectures et vos critiques de livres en toute simplicité avec{" "}
            <span className="font-semibold" style={{ color: "var(--accent)" }}>Bookish</span>,
            votre compagnon de lecture ultime.
          </p>
          <div className="px-6 py-10">
            <Link
              href="/dashboard"
              className="book-button"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              Mon Dashboard
            </Link>
          </div>
        </div>

        {yearlyGoal !== null && (
          <div className="flex-1 flex flex-col items-center justify-center text-center bg-card rounded-xl shadow-lg py-8 px-6">
            <span className="book-title mb-2">Objectif annuel</span>
            <div className="relative w-full max-w-md h-8 bg-gray-200 rounded-full overflow-hidden shadow-inner mb-4 mt-2">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white drop-shadow">
                {progress.toFixed(1)}%
              </span>
            </div>
            <div className="text-lg font-semibold mt-2 mb-1" style={{ color: "var(--brown)" }}>
              {readCount} / {yearlyGoal} livres lus
            </div>
            <div className="text-sm mt-2" style={{ color: "var(--brown)" }}>
              {progress >= 100 ? "Bravo, objectif atteint ! 🎉" : `${readCount} livres lus cette année`}
            </div>
          </div>
        )}
      </section>

      <section className="max-w-4xl mx-auto px-4 bg-card">
        <h2 className="book-title">Mes lectures en cours</h2>
        <CurrentReadsClientWrapper
          initialBookshelves={bookshelves}
          initialBooks={currentBookshelf}
          userId={userId}
        />
      </section>

      <section className="flex justify-center mt-8">
        <Link
          href="/reviews"
          className="book-button"
          style={{ background: "var(--highlight)", color: "var(--brown)" }}
        >
          Voir toutes mes critiques
        </Link>
      </section>
    </main>
  );
}