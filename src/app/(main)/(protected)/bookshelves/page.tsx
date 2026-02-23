
import CreateBookshelfModal from "@/components/forms/CreateBookshelfModal";
import { getServerUser } from "@/lib/auth-utils";
import { getBookshelvesByUserId } from "@/app/actions/bookshelf";
import BookshelvesClient from "@/components/ui/BookshelvesClient";


const DEFAULT_SHELVES = ["À lire", "En cours", "Terminés"];

export default async function BookshelvesPage() {
	const user = await getServerUser();
	if (!user) {
		return (
			<main className="max-w-4xl mx-auto px-4 py-8">
				<h1 className="book-title text-center">Non authentifié</h1>
			</main>
		);
	}
	const userId = user.id;
	const result = await getBookshelvesByUserId({ idUser: userId });
	let bookshelves = result?.data || [];
	bookshelves = bookshelves.sort((a, b) => {
		const aDefault = DEFAULT_SHELVES.indexOf(a.name);
		const bDefault = DEFAULT_SHELVES.indexOf(b.name);
		if (aDefault !== -1 && bDefault !== -1) return aDefault - bDefault;
		if (aDefault !== -1) return -1;
		if (bDefault !== -1) return 1;
		return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
	});

		return (
			<main className="max-w-4xl mx-auto px-4 py-8">
				<div className="flex items-center justify-between mb-6">
					<h1 className="book-title text-center">Mes étagères</h1>
					<CreateBookshelfModal userId={userId} />
				</div>
				<BookshelvesClient bookshelves={bookshelves} />
			</main>
		);
}
