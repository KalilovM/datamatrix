import { useEffect } from "react";
import { createPortal } from "react-dom";

interface ConfirmModalProps {
	isOpen: boolean;
	title: string;
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
}

export default function ConfirmModal({
	isOpen,
	title,
	message,
	onConfirm,
	onCancel,
}: ConfirmModalProps) {
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
		return () => {
			document.body.style.overflow = "auto";
		};
	}, [isOpen]);

	if (!isOpen) return null;

	return createPortal(
		<div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
			<div className="bg-white p-6 rounded-md shadow-lg w-96">
				<h2 className="text-xl font-bold">{title}</h2>
				<p className="mt-2">{message}</p>
				<div className="flex justify-end gap-4 mt-4">
					<button
						type="button"
						onClick={onCancel}
						className="px-4 py-2 bg-gray-300 rounded-md cursor-pointer"
					>
						Отмена
					</button>
					<button
						type="button"
						onClick={onConfirm}
						className="px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer"
					>
						Удалить
					</button>
				</div>
			</div>
		</div>,
		document.body,
	);
}
