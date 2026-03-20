export type EditableTemplateField =
	| "name"
	| "modelArticle"
	| "color"
	| "size"
	| "composition";

export type EditableTemplateLayout = "standard" | "nomenclatureDetails";

export const templateFieldOptions: Array<{
	value: EditableTemplateField;
	label: string;
}> = [
	{ value: "name", label: "Наименование" },
	{ value: "modelArticle", label: "Модель" },
	{ value: "color", label: "Цвет" },
	{ value: "size", label: "Размер" },
	{ value: "composition", label: "Состав" },
];

export const templateFieldLabels: Record<EditableTemplateField, string> = {
	name: "Наименование",
	modelArticle: "Модель",
	color: "Цвет",
	size: "Размер",
	composition: "Состав",
};

export const nomenclatureLayoutStaticContent = {
	brand: "Alona",
	manufacturer: "Alona",
	address: "Кыргызстан",
	countryOfOrigin: "Сделано в Кыргызстане",
} as const;

export const fixedNomenclatureDetailsFields = [
	{ field: "name", bold: true, size: 12 },
	{ field: "modelArticle", bold: false, size: 10 },
	{ field: "size", bold: false, size: 10 },
	{ field: "color", bold: false, size: 10 },
	{ field: "composition", bold: false, size: 10 },
] as const satisfies ReadonlyArray<{
	field: EditableTemplateField;
	bold: boolean;
	size: number;
}>;

export function normalizeEditableFieldType(
	value: string | null | undefined,
): EditableTemplateField | "" {
	switch ((value ?? "").toUpperCase()) {
		case "NAME":
			return "name";
		case "MODEL_ARTICLE":
			return "modelArticle";
		case "COLOR":
			return "color";
		case "SIZE":
			return "size";
		case "COMPOSITION":
			return "composition";
		default:
			return "";
	}
}

export function toPrismaTemplateFieldType(
	value: string,
): "NAME" | "MODEL_ARTICLE" | "COLOR" | "SIZE" | "COMPOSITION" {
	switch (value) {
		case "name":
			return "NAME";
		case "modelArticle":
			return "MODEL_ARTICLE";
		case "color":
			return "COLOR";
		case "size":
			return "SIZE";
		case "composition":
			return "COMPOSITION";
		default:
			throw new Error(`Unsupported fieldType: ${value}`);
	}
}

export function normalizeEditableTemplateLayout(
	value: string | null | undefined,
): EditableTemplateLayout {
	return (value ?? "").toUpperCase() === "NOMENCLATURE_DETAILS"
		? "nomenclatureDetails"
		: "standard";
}

export function toPrismaTemplateLayout(
	value: string | null | undefined,
): "STANDARD" | "NOMENCLATURE_DETAILS" {
	return normalizeEditableTemplateLayout(value) === "nomenclatureDetails"
		? "NOMENCLATURE_DETAILS"
		: "STANDARD";
}

export function isNomenclatureDetailsLayout(value: string | null | undefined) {
	return normalizeEditableTemplateLayout(value) === "nomenclatureDetails";
}

export function getFixedNomenclatureDetailsTextFields() {
	return fixedNomenclatureDetailsFields.map((field) => ({
		field: field.field,
		bold: field.bold,
		size: field.size,
	}));
}
