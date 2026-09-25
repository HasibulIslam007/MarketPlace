-- CreateTable
CREATE TABLE "HomePageSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "heroImageUrl" TEXT,
    "heroImageAlt" TEXT NOT NULL DEFAULT 'Featured sneaker',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomePageSettings_pkey" PRIMARY KEY ("id")
);