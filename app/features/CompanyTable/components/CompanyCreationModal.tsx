import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../../Modal';
import { UserCreationModal } from './UserCreationModal';
import {
  CompanyFormValues,
  companySchema,
  CompanyCreationModalProps,
} from '@/types/company/types';
import { Controller } from 'react-hook-form';
import Select from 'react-select';

interface UserOptions {
  users: { id: string; username: string; email: string }[];
}

export const CompanyCreationModal: React.FC<CompanyCreationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [companyToken, setCompanyToken] = useState('');
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [userOptions, setUserOptions] = useState<UserOptions>({ users: [] });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      subscriptionEnd: new Date(Date.now()).toISOString().split('T')[0],
      userId: [],
    },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error('Failed to fetch users');
        const users = await res.json();
        setUserOptions({ users });
      } catch (error) {
        console.error(error);
      }
    };

    if (isOpen) {
      const generatedToken = Math.random().toString(36).substring(2, 18);
      setCompanyToken(generatedToken);
      setValue('token', generatedToken); // Set the token in the form
      fetchUsers();
    }
  }, [isOpen, setValue]);

  const onSubmitHandler = (data: CompanyFormValues) => {
    console.log(data); // Logs form data
    onSubmit({
      ...data,
      token: companyToken,
    });
    handleClose();
  };

  const handleUserCreate = (newUser: {
    id: string;
    username: string;
    email: string;
  }) => {
    setUserModalOpen(false);
  };

  const handleClose = () => {
    reset(); // Reset form to default values
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Новая компания"
        actionText="Создать"
        onAction={handleSubmit(onSubmitHandler)}
      >
        <form className="space-y-4">
          {/* Company Name */}
          <div>
            <label className="block font-bold">Наименование</label>
            <input
              {...register('name')}
              type="text"
              className="w-full rounded border px-3 py-2"
            />
            {errors.name && (
              <span className="text-sm text-red-600">
                {errors.name.message}
              </span>
            )}
          </div>
          {/* Subscription End Date */}
          <div>
            <label className="block font-bold">Дата окончания подписки</label>
            <input
              {...register('subscriptionEnd')}
              type="date"
              className="w-full rounded border px-3 py-2"
              onChange={e => setValue('subscriptionEnd', e.target.value)}
            />
            {errors.subscriptionEnd && (
              <span className="text-sm text-red-600">
                {errors.subscriptionEnd.message}
              </span>
            )}
          </div>
          {/* Company Token */}
          <div>
            <label className="block font-bold">Токен компании</label>
            <input
              type="text"
              className="w-full rounded border bg-gray-100 px-3 py-2 text-gray-700"
              value={companyToken}
              readOnly
            />
          </div>
          {/* Company Administrators */}
          <div>
            <label className="block font-bold">Администраторы</label>
            <Controller
              control={control}
              name="userId"
              render={({ field: { onChange, value, name } }) => (
                <Select
                  options={userOptions.users.map(user => ({
                    value: user.id,
                    label: user.username,
                  }))}
                  isMulti
                  value={value?.map((id: string) => {
                    const user = userOptions.users.find(user => user.id === id);
                    return user
                      ? { value: user.id, label: user.username }
                      : null;
                  })}
                  onChange={selectedOptions => {
                    onChange(
                      selectedOptions
                        ? selectedOptions.map(option => option.value)
                        : [],
                    );
                  }}
                  name={name}
                />
              )}
            />
            {errors.userId && (
              <span className="text-sm text-red-600">
                {errors.userId.message}
              </span>
            )}
          </div>
        </form>
      </Modal>

      <UserCreationModal
        isOpen={isUserModalOpen}
        onClose={() => setUserModalOpen(false)}
        onSubmit={handleUserCreate}
      />
    </>
  );
};
