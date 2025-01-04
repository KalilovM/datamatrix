import { ReactNode } from 'react';
import { CompanyIcon, NomenclatureIcon } from '@/app/components/Icons';

export const sidebarItems: Array<{
  name: string;
  href: string;
  icon: ReactNode;
}> = [
  {
    name: 'Компании',
    href: '/companies',
    icon: <CompanyIcon />,
  },
  {
    name: 'Номенклатура',
    href: '/nomenclature',
    icon: <NomenclatureIcon />,
  },
];
