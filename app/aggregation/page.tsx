import MainLayout from '@/app/features/MainLayout';
import AggregationHead from '../features/Aggregation/components/AggregationHead';
import PalletTable from '../features/Aggregation/components/PalletTable';
import PackTable from '../features/Aggregation/components/PackTable';

export default function Page() {
  return (
    <MainLayout>
      <div className="flex h-full w-full flex-col gap-8">
        <h1 className="text-3xl font-bold">Агрегация</h1>
        {/* Nomenclature */}
        <AggregationHead configOptions={[]} nomenclatureOptions={[]} />

        <div className="flex h-full flex-row gap-8">
          <PalletTable />
          <PackTable />
        </div>
      </div>
    </MainLayout>
  );
}
