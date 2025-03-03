import { ReactNode } from "react";
import {
  AggregationIcon,
  CompanyIcon,
  NomenclatureIcon,
} from "@/components/Icons";

export const sidebarItems: Array<{
  name: string;
  href: string;
  icon: ReactNode;
}> = [
  {
    name: "Компании",
    href: "/companies",
    icon: <CompanyIcon />,
  },
  {
    name: "Номенклатура",
    href: "/nomenclature",
    icon: <NomenclatureIcon />,
  },
  {
    name: "Агрегация",
    href: "/aggregation",
    icon: <AggregationIcon />,
  },
  {
    name: "Контрагенты",
    href: "/counteragents",
    icon: <AggregationIcon />,
  },
  {
    name: "Заказы",
    href: "/orders",
    icon: <AggregationIcon />,
  },
  {
    name: "Аггрегированные коды",
    href: "/aggregation-codes",
    icon: <AggregationIcon />,
  },
  {
    name: "Разагрегация",
    href: "/disaggregation",
    icon: <AggregationIcon />,
  },
  {
    name: "Шаблоны печати",
    href: "/print-templates",
    icon: <AggregationIcon />,
  },
];
