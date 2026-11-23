-- CreateEnum
CREATE TYPE "ViewingMethod" AS ENUM ('CINEMA', 'STREAMING', 'RENTAL', 'TELEVISION', 'BLURAY', 'DVD', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleteFlg" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "displayName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movie" (
    "id" TEXT NOT NULL,
    "tmdbMovieId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "originalTitle" TEXT,
    "posterPath" TEXT,
    "releaseDate" TIMESTAMP(3),
    "genreNames" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "watchedAt" TIMESTAMP(3) NOT NULL,
    "rating" INTEGER NOT NULL,
    "review" TEXT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "isRewatch" BOOLEAN NOT NULL DEFAULT false,
    "containsSpoiler" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MovieRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Movie_tmdbMovieId_key" ON "Movie"("tmdbMovieId");

-- CreateIndex
CREATE INDEX "MovieRecord_userId_idx" ON "MovieRecord"("userId");

-- CreateIndex
CREATE INDEX "MovieRecord_movieId_idx" ON "MovieRecord"("movieId");

-- CreateIndex
CREATE INDEX "MovieRecord_userId_watchedAt_idx" ON "MovieRecord"("userId", "watchedAt");

-- AddForeignKey
ALTER TABLE "MovieRecord" ADD CONSTRAINT "MovieRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieRecord" ADD CONSTRAINT "MovieRecord_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
