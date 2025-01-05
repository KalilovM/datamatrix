import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../../Modal';
import { UserCreationModal } from './UserCreationModal';
import { UserSelect } from './UserSelect';
import {
  CompanyFormValues,
  companySchema,
  CompanyCreationModalProps,
} from '@/types/company/types';

export const CompanyCreationModal: React.FC<CompanyCreationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [companyToken, setCompanyToken] = useState('');
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<
    { id: string; username: string; email: string }[]
  >([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      subscriptionEnd: new Date(Date.now()).toISOString().split('T')[0],
      userId: [],
    },
  });

  useEffect(() => {
    if (isOpen) {
      const generateToken = () =>
        Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      setCompanyToken(generateToken());
    }
  }, [isOpen]);

  const onSubmitHandler = (data: CompanyFormValues) => {
    onSubmit({
      ...data,
      token: companyToken,
      userId: selectedUsers.map(user => user.id),
    });
    handleClose();
  };

  const handleUserCreate = (newUser: {
    id: string;
    username: string;
    email: string;
  }) => {
    setSelectedUsers(prev => [...prev, newUser]);
    setUserModalOpen(false);
  };

  const handleClose = () => {
    reset(); // Reset form to default values
    setSelectedUsers([]); // Clear selected users
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
            <UserSelect
              selectedUsers={selectedUsers}
              onUsersSelect={setSelectedUsers}
              onUserRemove={userId =>
                setSelectedUsers(prev =>
                  prev.filter(user => user.id !== userId),
                )
              }
              onCreateNewUser={() => setUserModalOpen(true)}
            />
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
