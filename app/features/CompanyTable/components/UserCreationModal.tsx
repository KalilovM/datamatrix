import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../../Modal';
import { EyeSlashIcon, EyeIcon } from '@/app/components/Icons';
import {
  UserFormValues,
  userSchema,
  UserCreationModalProps,
} from '@/types/company/types';

export const UserCreationModal: React.FC<UserCreationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
  });

  const onSubmitHandler = (data: UserFormValues) => {
    const newUser = {
      id: `${Date.now()}`,
      username: data.username,
      email: data.email,
    };
    onSubmit(newUser);
    handleClose();
  };

  const handleClose = () => {
    reset(); // Reset the form to default values
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create User"
      actionText="Save"
      onAction={handleSubmit(onSubmitHandler)}
    >
      <form className="space-y-4">
        <div>
          <label className="block font-bold">Имя пользователя</label>
          <input
            {...register('username')}
            type="text"
            className="w-full rounded border px-3 py-2"
          />
          {errors.username && (
            <span className="text-sm text-red-600">
              {errors.username.message}
            </span>
          )}
        </div>

        <div>
          <label className="block font-bold">Имейл</label>
          <input
            {...register('email')}
            type="email"
            className="w-full rounded border px-3 py-2"
          />
          {errors.email && (
            <span className="text-sm text-red-600">{errors.email.message}</span>
          )}
        </div>

        <div>
          <label className="block font-bold">Пароль</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              className="w-full rounded border px-3 py-2"
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
          <label className="block font-bold">Подтверждение пароля</label>
          <input
            {...register('confirmPassword')}
            type={showPassword ? 'text' : 'password'}
            className="w-full rounded border px-3 py-2"
          />
          {errors.confirmPassword && (
            <span className="text-sm text-red-600">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>
      </form>
    </Modal>
  );
};
