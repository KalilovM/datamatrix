import {
	AggregatedCodesIcon,
	AggregationIcon,
	CompanyIcon,
	DisaggregationIcon,
	NomenclatureIcon,
	OrderIcon,
	PrintIcon,
} from "@/shared/ui/icons";
import type { ReactNode } from "react";

export const sidebarItems: Array<{
	name: string;
	href: string;
	icon: ReactNode;
}> = [
	{ name: "Компания", href: "/companies", icon: <CompanyIcon /> },
	{ name: "Номенклатура", href: "/nomenclature", icon: <NomenclatureIcon /> },
	{ name: "Агрегация", href: "/aggregation", icon: <AggregationIcon /> },
	{
		name: "Агрегированные коды",
		href: "/aggregation-codes",
		icon: <AggregatedCodesIcon />,
	},
	{
		name: "Разагрегация",
		href: "/disaggregation",
		icon: <DisaggregationIcon />,
	},
	{ name: "Контрагенты", href: "/counteragents", icon: <AggregationIcon /> },
	{ name: "Заказы", href: "/orders", icon: <OrderIcon /> },
	{
		name: "Шаблоны печати",
		href: "/print-templates",
		icon: <PrintIcon />,
	},
];
