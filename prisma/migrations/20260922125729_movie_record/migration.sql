/*
  Warnings:

  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MovieRecord" DROP CONSTRAINT "MovieRecord_movieId_fkey";

-- DropForeignKey
ALTER TABLE "MovieRecord" DROP CONSTRAINT "MovieRecord_userId_fkey";

-- DropTable
DROP TABLE "Profile";

-- AddForeignKey
ALTER TABLE "MovieRecord" ADD CONSTRAINT "MovieRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
