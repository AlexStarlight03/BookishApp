/*
  Warnings:

  - You are about to drop the column `stackAuthId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_stackAuthId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "stackAuthId";
