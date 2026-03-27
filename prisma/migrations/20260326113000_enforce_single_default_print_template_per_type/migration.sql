WITH ranked_defaults AS (
	SELECT
		id,
		ROW_NUMBER() OVER (
			PARTITION BY "companyId", "type"
			ORDER BY "updatedAt" DESC, "createdAt" DESC, "id" DESC
		) AS rank
	FROM "PrintingTemplate"
	WHERE "isDefault" = true
)
UPDATE "PrintingTemplate"
SET "isDefault" = false
WHERE id IN (
	SELECT id
	FROM ranked_defaults
	WHERE rank > 1
);

CREATE UNIQUE INDEX "PrintingTemplate_single_default_per_company_type"
ON "PrintingTemplate" ("companyId", "type")
WHERE "isDefault" = true;
