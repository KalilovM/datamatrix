'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../../Modal';
import { EyeSlashIcon, EyeIcon } from '@/app/components/Icons';
import { Controller, useWatch } from 'react-hook-form';
import Select from 'react-select';
import {
  UserFormValues,
  userSchema,
  UserCreationModalProps,
} from '@/types/company/types';

const roleOptions = [
  { value: 'ADMIN', label: 'Админ' },
  { value: 'COMPANY_ADMIN', label: 'Админ фирмы' },
  { value: 'COMPANY_USER', label: 'Пользователь' },
];

export const UserCreationModal: React.FC<UserCreationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [companies, setCompanies] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: 'COMPANY_USER',
    },
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch('/api/companies');
        if (!res.ok) throw new Error('Failed to fetch companies');
        const data = await res.json();
        setCompanies(
          data.map((company: { id: string; name: string }) => ({
            value: company.id,
            label: company.name,
          })),
        );
      } catch (error) {
        console.error(error);
      }
    };

    if (isOpen) {
      fetchCompanies();
    }
  }, [isOpen]);

  const selectedRole = useWatch({
    control,
    name: 'role',
  });

  const onSubmitHandler = (data: UserFormValues) => {
    console.log(data);
    onSubmit(data);
    handleClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };
  const handleFormSubmit = handleSubmit(
    data => {
      console.log('Validated Data:', data);
      onSubmit(data);
      handleClose();
    },
    formErrors => {
      console.error('Validation Errors:', formErrors);
    },
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Новый пользователь"
      actionText="Создать"
      onAction={handleFormSubmit}
    >
      <form className="space-y-4">
        <div>
          <label className="block">Имя пользователя</label>
          <input
            {...register('username')}
            type="text"
            className="w-full rounded-lg border px-3 py-2"
          />
          {errors.username && (
            <span className="text-sm text-red-600">
              {errors.username.message}
            </span>
          )}
        </div>

        <div>
          <label className="block">Имейл</label>
          <input
            {...register('email')}
            type="email"
            className="w-full rounded-lg border px-3 py-2"
          />
          {errors.email && (
            <span className="text-sm text-red-600">{errors.email.message}</span>
          )}
        </div>

        <div>
          <label className="block">Пароль</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              className="w-full rounded-lg border px-3 py-2"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-gray-500 hover:text-black"
            >
              {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>
          {errors.password && (
            <span className="text-sm text-red-600">
              {errors.password.message}
            </span>
          )}
        </div>

        <div>
          <label className="block">Подтверждение пароля</label>
          <input
            {...register('confirmPassword')}
            type={showPassword ? 'text' : 'password'}
            className="w-full rounded-lg border px-3 py-2"
          />
          {errors.confirmPassword && (
            <span className="text-sm text-red-600">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>
        <div>
          <label className="block">Роль</label>
          <Controller
            name="role"
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <Select
                ref={ref}
                options={roleOptions}
                value={
                  value
                    ? roleOptions.find(option => option.value === value)
                    : roleOptions.find(
                        option => option.value === 'COMPANY_USER',
                      )
                }
                onChange={selected => onChange(selected?.value)}
                className="w-full"
              />
            )}
          />
          {errors.role && (
            <span className="text-sm text-red-600">{errors.role.message}</span>
          )}
        </div>
        {['COMPANY_ADMIN', 'COMPANY_USER'].includes(selectedRole) && (
          <div>
            <label className="block">Компания</label>
            <Controller
              name="companyId"
              control={control}
              render={({ field: { onChange, value, ref } }) => (
                <Select
                  ref={ref}
                  options={companies}
                  value={companies.find(option => option.value === value)}
                  onChange={selected => onChange(selected?.value)}
                  className="w-full"
                />
              )}
            />
            {errors.companyId && (
              <span className="text-sm text-red-600">
                {errors.companyId.message}
              </span>
            )}
          </div>
        )}
      </form>
    </Modal>
  );
};
