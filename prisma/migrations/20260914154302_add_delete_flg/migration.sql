-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "deleteFlg" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "MovieRecord" ADD COLUMN     "deleteFlg" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "deleteFlg" BOOLEAN NOT NULL DEFAULT false;
