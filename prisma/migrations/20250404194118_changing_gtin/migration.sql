/*
  Warnings:

  - You are about to drop the column `GTIN` on the `Nomenclature` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CodePack" ADD COLUMN     "GTIN" TEXT;

-- AlterTable
ALTER TABLE "Nomenclature" DROP COLUMN "GTIN";
