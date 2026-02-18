/*
  Warnings:

  - The primary key for the `BookStatus` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idBookStatus` on the `BookStatus` table. All the data in the column will be lost.
  - You are about to drop the column `idStatus` on the `BookStatus` table. All the data in the column will be lost.
  - You are about to drop the `BookOnBookshelf` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Status` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `idBookshelf` to the `BookStatus` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BookOnBookshelf" DROP CONSTRAINT "BookOnBookshelf_idBook_fkey";

-- DropForeignKey
ALTER TABLE "BookOnBookshelf" DROP CONSTRAINT "BookOnBookshelf_idBookshelf_fkey";

-- DropForeignKey
ALTER TABLE "BookStatus" DROP CONSTRAINT "BookStatus_idStatus_fkey";

-- DropForeignKey
ALTER TABLE "BookStatus" DROP CONSTRAINT "BookStatus_idUser_fkey";

-- DropForeignKey
ALTER TABLE "Status" DROP CONSTRAINT "Status_idUser_fkey";

-- AlterTable
ALTER TABLE "BookStatus" DROP CONSTRAINT "BookStatus_pkey",
DROP COLUMN "idBookStatus",
DROP COLUMN "idStatus",
ADD COLUMN     "idBookshelf" INTEGER NOT NULL,
ADD CONSTRAINT "BookStatus_pkey" PRIMARY KEY ("idBookshelf", "idBook");

-- DropTable
DROP TABLE "BookOnBookshelf";

-- DropTable
DROP TABLE "Status";

-- AddForeignKey
ALTER TABLE "BookStatus" ADD CONSTRAINT "BookStatus_idBookshelf_fkey" FOREIGN KEY ("idBookshelf") REFERENCES "Bookshelf"("idBookshelf") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookStatus" ADD CONSTRAINT "BookStatus_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;
