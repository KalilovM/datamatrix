/*
  Warnings:

  - You are about to drop the column `GTIN` on the `CodePack` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `CodePack` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Code" ADD COLUMN     "sizeGtinId" TEXT;

-- AlterTable
ALTER TABLE "CodePack" DROP COLUMN "GTIN",
DROP COLUMN "size",
ADD COLUMN     "sizeGtinId" TEXT;

-- CreateTable
CREATE TABLE "SizeGtin" (
    "id" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "gtin" TEXT NOT NULL,

    CONSTRAINT "SizeGtin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SizeGtin_gtin_key" ON "SizeGtin"("gtin");

-- CreateIndex
CREATE UNIQUE INDEX "SizeGtin_size_gtin_key" ON "SizeGtin"("size", "gtin");

-- AddForeignKey
ALTER TABLE "Code" ADD CONSTRAINT "Code_sizeGtinId_fkey" FOREIGN KEY ("sizeGtinId") REFERENCES "SizeGtin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodePack" ADD CONSTRAINT "CodePack_sizeGtinId_fkey" FOREIGN KEY ("sizeGtinId") REFERENCES "SizeGtin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
