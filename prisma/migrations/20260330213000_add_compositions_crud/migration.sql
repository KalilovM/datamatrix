CREATE TABLE "Composition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Composition_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Nomenclature"
ADD COLUMN "compositionId" TEXT;

INSERT INTO "Composition" ("id", "name", "companyId", "createdAt", "updatedAt")
SELECT
    md5("companyId" || ':' || btrim("composition")) AS "id",
    btrim("composition") AS "name",
    "companyId",
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "Nomenclature"
WHERE "composition" IS NOT NULL
  AND btrim("composition") <> ''
GROUP BY "companyId", btrim("composition");

UPDATE "Nomenclature"
SET "compositionId" = md5("companyId" || ':' || btrim("composition"))
WHERE "composition" IS NOT NULL
  AND btrim("composition") <> '';

ALTER TABLE "Nomenclature"
DROP COLUMN "composition";

CREATE UNIQUE INDEX "Composition_companyId_name_key" ON "Composition"("companyId", "name");
CREATE INDEX "Nomenclature_compositionId_idx" ON "Nomenclature"("compositionId");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conrelid = '"Company"'::regclass
          AND conname = 'Company_id_unique_for_compositions'
    ) THEN
        ALTER TABLE "Company"
        ADD CONSTRAINT "Company_id_unique_for_compositions" UNIQUE ("id");
    END IF;
END $$;

ALTER TABLE "Composition"
ADD CONSTRAINT "Composition_companyId_fkey"
FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Nomenclature"
ADD CONSTRAINT "Nomenclature_compositionId_fkey"
FOREIGN KEY ("compositionId") REFERENCES "Composition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
