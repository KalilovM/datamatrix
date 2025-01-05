'use client';

import CompanyTable from '../features/CompanyTable/components/CompanyTable';
import UsersTable from '../features/UsersTable/components/UsersTable';
import { useCompanyStore } from '@/stores/useCompanyStore';
import MainLayout from '@/app/features/MainLayout';

export default function Companies() {
  const { selectedCompanyId, setSelectedCompanyId } = useCompanyStore();

  const handleCompanySelect = (companyId: string) => {
    setSelectedCompanyId(companyId);
  };

  return (
    <MainLayout>
      <CompanyTable onSelect={handleCompanySelect} />
      <UsersTable selectedCompanyId={selectedCompanyId} />
    </MainLayout>
  );
}
