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
    href: "/counteragent",
    icon: <AggregationIcon />,
  },
  {
    name: "Заказы",
    href: "/order",
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
];
