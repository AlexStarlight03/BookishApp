import { UserInfo } from "@/components/UserInfo";
import { BookshelfCard } from "@/components/ui/BookshelfCard";
import BookCard from "@/components/ui/BookCard";
import { getBookshelvesByUserId } from "@/app/actions/bookshelf";
import { getBooksFromUser } from "@/app/actions/bookStatus";
import { getUserById } from "@/app/actions/user";
import { getServerUser } from "@/lib/auth-utils";
import dynamic from "next/dynamic";
import DashboardClientWrapper from "@/components/ui/DashboardClientWrapper";
import DashboardBookshelvesClient from "@/components/ui/DashboardBookshelvesClient";
import DashboardGoalClient from "@/components/ui/DashboardGoalClient";

export default async function DashboardPage() {

  const user = await getServerUser();
  if (!user) return <div>Non authentifié</div>;


  const bookshelvesResult = await getBookshelvesByUserId({ idUser: user.id });
  const bookshelves = bookshelvesResult.success && Array.isArray(bookshelvesResult.data)
    ? bookshelvesResult.data
    : [];

  const currentShelf = bookshelves.find((shelf: any) => shelf.name === "En cours");
  const currentBookshelf = currentShelf && Array.isArray(currentShelf.booksBookshelf)
    ? currentShelf.booksBookshelf.map((bb: any) => ({
        ...bb,
        book: bb.book,
        bookshelf: currentShelf,
      }))
    : [];

  const booksResult = await getBooksFromUser({ idUser: user.id, status: "Terminés" });
  let readCount = 0;
  if (booksResult.success && Array.isArray(booksResult.books) && booksResult.books.length > 0) {
    const books = booksResult.books;
    const thisYear = new Date().getFullYear();
    readCount = books.filter(
      (b: any) => b.dateEnd && new Date(b.dateEnd).getFullYear() === thisYear
    ).length;
  }

  const userData = await getUserById({ id: user.id });
  const objective = userData.success && userData.data && typeof userData.data.yearlyGoal === "number"
    ? userData.data.yearlyGoal
    : null;

  const progress = objective && objective > 0 ? Math.min((readCount / objective) * 100, 100) : 0;


  return (
    <div className="main-block bg-card">
      <h1 className="book-title mb-6 text-center">Mon Profil</h1>
      <UserInfo />
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Livres en cours</h2>
        <DashboardClientWrapper
          initialBookshelves={bookshelves}
          initialBooks={currentBookshelf}
          userId={user.id}
        />
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Objectif de lecture</h2>
        <DashboardGoalClient objective={objective} readCount={readCount} />
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Mes bookshelves</h2>
        {bookshelves.length > 0 ? (
          <DashboardBookshelvesClient bookshelves={bookshelves} />
        ) : (
          <p>Vous n'avez pas encore créé de bookshelf.</p>
        )}
      </div>
    </div>
  );
}