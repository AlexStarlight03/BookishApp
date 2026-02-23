"use server";
import prisma from "@/lib/prisma";

export async function createBookStatus(body: any) {
  try {
    const { googleBooksId, title, editor, nb_pages, description, isbn, cover_img_url, idBookshelf, idUser, dateStart, dateEnd, currPage, authors, categories } = body;
    if (!googleBooksId || !idBookshelf || !idUser) {
      return { success: false, message: "Un utilisateur, livre et shelf sont necessaires." };
    }
    let book = await prisma.book.findFirst({ where: { googleBooksId } });
    if (!book) {
      let bookData = { title, editor, nb_pages, description, isbn, cover_img_url, authors, categories };
      if (!title) {
        try {
          const { fetchGoogleBookById } = await import("./fetchGoogleBookById");
          const googleBook = await fetchGoogleBookById(googleBooksId);
          if (googleBook && googleBook.volumeInfo) {
            bookData.title = googleBook.volumeInfo.title || "Titre inconnu";
            bookData.editor = googleBook.volumeInfo.publisher || null;
            bookData.nb_pages = googleBook.volumeInfo.pageCount || null;
            bookData.description = googleBook.volumeInfo.description || null;
            bookData.isbn = (googleBook.volumeInfo.industryIdentifiers && googleBook.volumeInfo.industryIdentifiers[0]?.identifier) || null;
            bookData.cover_img_url = (googleBook.volumeInfo.imageLinks && googleBook.volumeInfo.imageLinks.thumbnail) || null;
            bookData.authors = googleBook.volumeInfo.authors || [];
            bookData.categories = googleBook.volumeInfo.categories || [];
          }
        } catch (err) {
          return { success: false, message: "Impossible de récupérer les détails du livre depuis Google Books." };
        }
      }
      if (!bookData.title) {
        return { success: false, message: "Le champ 'title' est requis pour créer un nouveau livre." };
      }
      book = await prisma.book.create({
        data: {
          googleBooksId,
          title: bookData.title,
          editor: bookData.editor || null,
          nb_pages: bookData.nb_pages !== undefined ? Number(bookData.nb_pages) : null,
          description: bookData.description || null,
          isbn: bookData.isbn || null,
          cover_img_url: bookData.cover_img_url || null,
        },
      });
      body.authors = bookData.authors;
      body.categories = bookData.categories;
    }
    if (authors && Array.isArray(authors)) {
      for (const authorName of authors) {
        let author = await prisma.author.findFirst({ where: { name: typeof authorName === "string" ? authorName : authorName.name } });
            if (!author) {
                author = await prisma.author.create({ data: { name: typeof authorName === "string" ? authorName : authorName.name } });
            }
            const existingRelation = await prisma.bookAuthor.findFirst({
                where: { idBook: book.idBook, idAuthor: author.idAuthor }
            });
            if (!existingRelation) {
              await prisma.bookAuthor.create({
                  data: {
                      idBook: book.idBook,
                      idAuthor: author.idAuthor,
                  },
              });
            }
        }
    }
    if (categories && Array.isArray(categories)) {
      const uniqueCategoryNames = new Set<string>();
      for (const categoryString of categories) {
        const subcategories = typeof categoryString === "string"
          ? categoryString.split("/").map(s => s.trim())
          : [categoryString.name];
        subcategories.forEach(name => uniqueCategoryNames.add(name));
      }

      for (const subcategoryName of uniqueCategoryNames) {
        const shortCategoryNames = new Set<string>();
        const subcategoriesSplit = typeof subcategoryName === "string"
          ? subcategoryName.split("/").map(s => s.trim())
          : [subcategoryName];
          subcategoriesSplit.forEach(name => shortCategoryNames.add(name));
        for (const shortName of shortCategoryNames) {
          let category = await prisma.category.findFirst({
            where: { name: shortName }
          });
          if (!category) {
            category = await prisma.category.create({ data: { name: shortName } });
          }
          const existingRelation = await prisma.bookCategory.findFirst({
            where: { idBook: book.idBook, idCategory: category.idCategory }
          });
          if (!existingRelation) {
            await prisma.bookCategory.create({
              data: {
                idBook: book.idBook,
                idCategory: category.idCategory,
              },
            });
          }
        }
      }
    }
    const bookStatus = await prisma.bookStatus.create({
      data: {
        idBook: book.idBook,
        idBookshelf: Number(idBookshelf),
        idUser,
        dateStart: dateStart ? new Date(dateStart) : null,
        dateEnd: dateEnd ? new Date(dateEnd) : null,
        currPage: currPage !== undefined ? Number(currPage) : null,
      },
    });

    return { success: true, bookStatus };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, message: "Ce statut de livre existe déjà." };
    }
    return { success: false, message: "Erreur lors de la création du statut de livre", error: error.message };
  }
}

export async function getAllBookStatus() {
  try {
    const bookStatus = await prisma.bookStatus.findMany({include: {
      book: true,
      bookshelf: true,
    }});
    return { success: true, data: bookStatus };
  } catch (error: any) {
    return { success: false, message: "Erreur lors de la récupération des statuts", error: error.message };
  }
}

export async function getBookStatusById({ idBookshelf, idBook }: { idBookshelf: number, idBook: number }) {
  try {
    if (!idBookshelf || !idBook) {
      return { success: false, message: "Format d'identifiant invalide (attendu: idBookshelf-idBook)" };
    }
    const bookStatus = await prisma.bookStatus.findUnique({
      where: {
        idBookshelf_idBook: {
          idBook,
          idBookshelf,
        },
      },
    });
    if (!bookStatus) {
      return { success: false, message: "Statut non trouvé" };
    }
    return { success: true, data: bookStatus };
  } catch (error: any) {
    return { success: false, message: "Erreur lors de la récupération du statut", error: error.message };
  }
}

export async function modifyBookStatus({ idBookshelf, idBook }: { idBookshelf: number, idBook: number }, body: any) {
  try {
    if (!idBookshelf || !idBook) {
      return { success: false, message: "Format d'identifiant invalide (attendu: idBookshelf-idBook)" };
    }
    const { idBookshelf: newBookshelfId, dateStart, dateEnd, currPage } = body || {};
    const updateData: { idBookshelf?: number; dateStart?: Date; dateEnd?: Date; currPage?: number } = {};
    if (newBookshelfId !== undefined && newBookshelfId !== idBookshelf) {
      updateData.idBookshelf = newBookshelfId;
    }
    if (dateStart !== undefined) updateData.dateStart = new Date(dateStart);
    if (dateEnd !== undefined) updateData.dateEnd = new Date(dateEnd);
    if (currPage !== undefined) updateData.currPage = Number(currPage);
    const bookStatus = await prisma.bookStatus.update({
      where: {
        idBookshelf_idBook: {
          idBook,
          idBookshelf,
        },
      },
      data: updateData,
    });
    return { success: true, data: bookStatus };
  } catch (error: any) {
    if (error.code === "P2025") {
      return { success: false, message: "Statut non trouvé" };
    }
    return { message: "Erreur lors de la modification du statut", success: false, error: error.message };
  }
}

export async function deleteBookStatus({ idBookshelf, idBook }: { idBookshelf: number, idBook: number }) {
  try {
    if (!idBookshelf || !idBook) {
      return { success: false, message: "Format d'identifiant invalide (attendu: idBookshelf-idBook)" };
    }
    await prisma.bookStatus.delete({
      where: {
        idBookshelf_idBook: {
          idBook,
          idBookshelf,
        },
      },
    });
    return { success: true, message: "Statut de livre supprimé avec succès." };
  } catch (error: any) {
    if (error.code === "P2025") {
      return { success: false, message: "Statut non trouvé" };
    }
    return { message: "Erreur lors de la suppression du statut", success: false, error: error.message };
  }
}

export async function getBooksFromBookshelf({ idBookshelf }: { idBookshelf: number }) {
  try {
    if (!idBookshelf) {
      return { success: false, message: "Paramètre idBookshelf manquant ou invalide" };
    }
    const booksStatus = await prisma.bookStatus.findMany({
      where: { idBookshelf },
      include: {
        book: true,
        bookshelf: true,
      },
    });
    const books = booksStatus.map((bs) => ({
      ...bs.book,
      dateStart: bs.dateStart,
      dateEnd: bs.dateEnd,
      currPage: bs.currPage,
    }));
    return { data: booksStatus };
  } catch (error: any) {
    return { success: false, message: "Erreur lors de la récupération des livres de la bibliotheque", error: error.message };
  }
}

export async function getBooksFromUser({ idUser, status }: { idUser: string, status?: string }) {
  try {
    if (!idUser) {
      return { success: false, message: "Paramètre idUser manquant ou invalide" };
    }
    const where: any = { idUser };
    if (status) {
      where.bookshelf = { name: status };
    }
    const booksStatus = await prisma.bookStatus.findMany({
      where,
      include: {
        book: true,
        bookshelf: true,
      },
    });
    const books = booksStatus.map((bs) => ({
      ...bs.book,
      dateStart: bs.dateStart,
      dateEnd: bs.dateEnd,
      currPage: bs.currPage,
    }));
    return { success: true, books };
  } catch (error: any) {
    return { success: false, message: "Erreur lors de la récupération des livres de l'utilisateur", error: error.message };
  }
}