import { create } from 'zustand';

interface CompanyState {
  selectedCompanyId: string | null;
  setSelectedCompanyId: (id: string | null) => void;
}

export const useCompanyStore = create<CompanyState>(set => ({
  selectedCompanyId: null,
  setSelectedCompanyId: id => set({ selectedCompanyId: id }),
}));
