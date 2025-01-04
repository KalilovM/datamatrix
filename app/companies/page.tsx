'use client';

import CompanyTable from '@/app/features/CompanyTable';
import UsersTable from '@/app/features/UsersTable';
import { Company, User } from '@prisma/client';
import { useEffect, useState } from 'react';
import MainLayout from '@/app/features/MainLayout';

export default function Companies() {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch('/api/companies');
        const data = await res.json();
        setCompanies(data);
      } catch (error: unknown) {
        console.error('GET /api/companies', error);
      }
    };

    fetchCompanies();
  }, []);

  const handleCompanySelect = async (companyId: string) => {
    setSelectedCompany(companyId);
    try {
      const res = await fetch(`/api/companies/${companyId}/users`);
      const data = await res.json();
      setUsers(data);
    } catch (error: unknown) {
      console.error('GET /api/companies/[id]/users', error);
    }
  };

  return (
    <MainLayout>
      {/* Company Table */}
      <CompanyTable onSelect={handleCompanySelect} companies={companies} />
      {/* Users Table */}
      <UsersTable users={users} selectedCompanyId={selectedCompany} />
    </MainLayout>
  );
}
