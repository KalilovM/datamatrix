'use client';

import MainLayout from '@/app/features/MainLayout';
import NomenclatureTable from '@/app/features/NomenclatureTable';
import { useEffect, useState } from 'react';

export default function Page() {
  const [nomenclatures, setNomenclatures] = useState([]);

  useEffect(() => {
    const fetchNomenclatures = async () => {
      const response = await fetch('/api/nomenclature');
      const data = await response.json();
      setNomenclatures(data);
      console.log(data);
    };
    fetchNomenclatures();
  }, []);
  return (
    <MainLayout>
      <NomenclatureTable nomenclatures={nomenclatures} />
    </MainLayout>
  );
}
