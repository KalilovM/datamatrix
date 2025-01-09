'use client';

import { useForm, Controller } from 'react-hook-form';
import ConfigsTable from '@/app/features/Configs/components/ConfigTable';
import MainLayout from '@/app/features/MainLayout';
import Link from 'next/link';
import { useState } from 'react';
import ConfigSelectModal from '@/app/features/Configs/components/ConfigSelectModal';

export default function Page() {
  const [isSelectModalOpen, setSelectModalOpen] = useState(false);

  const { handleSubmit, control, setValue, watch } = useForm({
    defaultValues: {
      name: '',
      configs: [],
    },
  });

  const configs = watch('configs');

  const handleAddConfigs = newConfigs => {
    const updatedConfigs = [
      ...configs,
      ...newConfigs.map(config => ({
        id: Date.now() + Math.random(),
        packCount: config.value.split('-')[1], // Parse packCount from value
        palletCount: config.value.split('-')[2], // Parse palletCount from value
      })),
    ];

    setValue('configs', updatedConfigs); // Update configs field
  };

  const onSubmit = data => {
    console.log('Form Data:', data);
  };

  return (
    <MainLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-full w-full flex-col gap-8"
      >
        <h1 className="text-3xl font-bold">Новая Номенклатура</h1>
        <div className="flex w-full flex-row gap-8 rounded-2xl border border-blue-300 bg-white px-4 py-4">
          <div className="flex w-full flex-col">
            <label htmlFor="name" className="text-neutral-600">
              Наименование
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  id="name"
                  className="w-full rounded-lg border border-gray-300 p-2"
                />
              )}
            />
          </div>
          <div className="flex w-full flex-row items-center justify-end gap-2.5">
            <Link
              href="/nomenclature"
              className="rounded-lg bg-neutral-600 px-4 py-2 text-white hover:bg-neutral-700"
            >
              Отмена
            </Link>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Сохранить
            </button>
          </div>
        </div>

        <div className="flex h-full flex-row gap-8">
          <ConfigsTable
            configs={configs}
            onAdd={() => setSelectModalOpen(true)}
          />
        </div>
      </form>

      {/* Config Select Modal */}
      <ConfigSelectModal
        isOpen={isSelectModalOpen}
        onClose={() => setSelectModalOpen(false)}
        onAdd={handleAddConfigs}
      />
    </MainLayout>
  );
}
