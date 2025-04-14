import type {
	CodeSchema,
	NomenclatureEditSchema,
	NomenclatureSchema,
} from "./schema";
import type { z } from "zod";

type CodeData = z.infer<typeof CodeSchema>;
type NomenclatureSchemaData = z.infer<typeof NomenclatureSchema>;
type NomenclatureEditSchemaData = z.infer<typeof NomenclatureEditSchema>;

export type FormMode = "create" | "edit";

export interface NomenclatureFormProps {
	mode: FormMode;
	initialData?: NomenclatureEditSchemaData;
}

export type { NomenclatureSchemaData, NomenclatureEditSchemaData, CodeData };
