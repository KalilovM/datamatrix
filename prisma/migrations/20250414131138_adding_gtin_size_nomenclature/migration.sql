/*
  Warnings:

  - Added the required column `nomenclatureId` to the `SizeGtin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SizeGtin" ADD COLUMN     "nomenclatureId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SizeGtin" ADD CONSTRAINT "SizeGtin_nomenclatureId_fkey" FOREIGN KEY ("nomenclatureId") REFERENCES "Nomenclature"("id") ON DELETE CASCADE ON UPDATE CASCADE;
