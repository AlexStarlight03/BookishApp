/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "BookStatus" DROP CONSTRAINT "BookStatus_idUser_fkey";

-- DropForeignKey
ALTER TABLE "Bookshelf" DROP CONSTRAINT "Bookshelf_idUser_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_idUser_fkey";

-- AlterTable
ALTER TABLE "BookStatus" ALTER COLUMN "idUser" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Bookshelf" ALTER COLUMN "idUser" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "idUser" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "idUser" DROP DEFAULT,
ALTER COLUMN "idUser" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("idUser");
DROP SEQUENCE "User_idUser_seq";

-- AddForeignKey
ALTER TABLE "Bookshelf" ADD CONSTRAINT "Bookshelf_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("idUser") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookStatus" ADD CONSTRAINT "BookStatus_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;
