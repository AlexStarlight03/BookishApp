-- CreateTable
CREATE TABLE "Book" (
    "idBook" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "editor" TEXT,
    "nb_pages" INTEGER,
    "description" TEXT,
    "isbn" TEXT,
    "cover_img_url" TEXT,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("idBook")
);

-- CreateTable
CREATE TABLE "User" (
    "idUser" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashPassword" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("idUser")
);

-- CreateTable
CREATE TABLE "Status" (
    "idStatus" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "idUser" INTEGER,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("idStatus")
);

-- CreateTable
CREATE TABLE "BookStatus" (
    "idBookStatus" SERIAL NOT NULL,
    "idUser" INTEGER NOT NULL,
    "idBook" INTEGER NOT NULL,
    "idStatus" INTEGER,
    "dateStart" TIMESTAMP(3),
    "dateEnd" TIMESTAMP(3),
    "currPage" INTEGER,

    CONSTRAINT "BookStatus_pkey" PRIMARY KEY ("idBookStatus")
);

-- CreateTable
CREATE TABLE "Bookshelf" (
    "idBookshelf" SERIAL NOT NULL,
    "idUser" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Bookshelf_pkey" PRIMARY KEY ("idBookshelf")
);

-- CreateTable
CREATE TABLE "BookOnBookshelf" (
    "idBookshelf" INTEGER NOT NULL,
    "idBook" INTEGER NOT NULL,

    CONSTRAINT "BookOnBookshelf_pkey" PRIMARY KEY ("idBookshelf","idBook")
);

-- CreateTable
CREATE TABLE "Category" (
    "idCategory" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("idCategory")
);

-- CreateTable
CREATE TABLE "BookCategory" (
    "idCategory" INTEGER NOT NULL,
    "idBook" INTEGER NOT NULL,

    CONSTRAINT "BookCategory_pkey" PRIMARY KEY ("idCategory","idBook")
);

-- CreateTable
CREATE TABLE "Author" (
    "idAuthor" SERIAL NOT NULL,
    "name" TEXT,
    "lastName" TEXT,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("idAuthor")
);

-- CreateTable
CREATE TABLE "BookAuthor" (
    "idAuthor" INTEGER NOT NULL,
    "idBook" INTEGER NOT NULL,

    CONSTRAINT "BookAuthor_pkey" PRIMARY KEY ("idAuthor","idBook")
);

-- CreateTable
CREATE TABLE "Review" (
    "idReview" SERIAL NOT NULL,
    "idUser" INTEGER NOT NULL,
    "idBook" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "full_review" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("idReview")
);

-- CreateIndex
CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Status" ADD CONSTRAINT "Status_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("idUser") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookStatus" ADD CONSTRAINT "BookStatus_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("idUser") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookStatus" ADD CONSTRAINT "BookStatus_idBook_fkey" FOREIGN KEY ("idBook") REFERENCES "Book"("idBook") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookStatus" ADD CONSTRAINT "BookStatus_idStatus_fkey" FOREIGN KEY ("idStatus") REFERENCES "Status"("idStatus") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookshelf" ADD CONSTRAINT "Bookshelf_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("idUser") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookOnBookshelf" ADD CONSTRAINT "BookOnBookshelf_idBookshelf_fkey" FOREIGN KEY ("idBookshelf") REFERENCES "Bookshelf"("idBookshelf") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookOnBookshelf" ADD CONSTRAINT "BookOnBookshelf_idBook_fkey" FOREIGN KEY ("idBook") REFERENCES "Book"("idBook") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookCategory" ADD CONSTRAINT "BookCategory_idCategory_fkey" FOREIGN KEY ("idCategory") REFERENCES "Category"("idCategory") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookCategory" ADD CONSTRAINT "BookCategory_idBook_fkey" FOREIGN KEY ("idBook") REFERENCES "Book"("idBook") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookAuthor" ADD CONSTRAINT "BookAuthor_idAuthor_fkey" FOREIGN KEY ("idAuthor") REFERENCES "Author"("idAuthor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookAuthor" ADD CONSTRAINT "BookAuthor_idBook_fkey" FOREIGN KEY ("idBook") REFERENCES "Book"("idBook") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_idBook_fkey" FOREIGN KEY ("idBook") REFERENCES "Book"("idBook") ON DELETE RESTRICT ON UPDATE CASCADE;
