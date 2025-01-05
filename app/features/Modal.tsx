import React from 'react';
import Button from '../components/Button';
import { CloseIcon } from '../components/Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actionText,
  onAction,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-1/3 rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <Button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
            icon={<CloseIcon />}
          ></Button>
        </div>
        <div className="p-4">{children}</div>
        {actionText && (
          <div className="flex justify-end border-t p-4">
            <button
              onClick={onAction}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              {actionText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
