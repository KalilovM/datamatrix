ALTER TYPE "TemplateFieldType" ADD VALUE 'COMPOSITION';

CREATE TYPE "PrintingTemplateLayout" AS ENUM ('STANDARD', 'NOMENCLATURE_DETAILS');

ALTER TABLE "Nomenclature"
ADD COLUMN "composition" TEXT;

ALTER TABLE "PrintingTemplate"
ADD COLUMN "layout" "PrintingTemplateLayout" NOT NULL DEFAULT 'STANDARD';
