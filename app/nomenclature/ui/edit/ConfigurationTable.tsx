import ConfirmModal from "@/shared/ui/ConfirmModal";
import { BinIcon, EditIcon, PlusIcon } from "@/shared/ui/icons";
import { useState } from "react";
import { toast } from "react-toastify";
import ConfigurationsUploadModal, {
	type ConfigurationOption,
} from "./ConfigurationsUploadModal";

interface ConfigurationTableProps {
	value?: ConfigurationOption[]; // controlled configurations array
	onChange: (value: ConfigurationOption[]) => void;
}

export default function ConfigurationTable({
	value = [],
	onChange,
}: ConfigurationTableProps) {
	const configurations = value;
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingConfig, setEditingConfig] =
		useState<ConfigurationOption | null>(null);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const handleEdit = (config: ConfigurationOption) => {
		setEditingConfig(config);
		setIsModalOpen(true);
	};

	const handleDeleteConfirm = (label: string) => {
		const updated = configurations.filter((config) => config.label !== label);
		onChange(updated);
		toast.success("Конфигурация удалена");
	};

	const handleDelete = (label: string) => {
		setEditingConfig(configurations.find((c) => c.label === label) || null);
		setIsDeleteModalOpen(true);
	};

	const handleSave = (config: ConfigurationOption) => {
		if (editingConfig) {
			// Update an existing configuration
			const updated = configurations.map((c) =>
				c.label === editingConfig.label ? config : c,
			);
			onChange(updated);
		} else {
			// Add new configuration
			onChange([...configurations, config]);
			toast.success("Конфигурация добавлена");
		}
		setIsModalOpen(false);
		setEditingConfig(null);
	};

	return (
		<div className="w-1/2">
			<div className="table-layout">
				{/* Table Header */}
				<div className="table-header flex justify-between items-center">
					<p className="table-header-title">Конфигурации</p>
					<button
						type="button"
						onClick={() => {
							setEditingConfig(null);
							setIsModalOpen(true);
						}}
						className="bg-blue-500 px-4 py-2 text-white rounded-md cursor-pointer"
					>
						<PlusIcon className="size-5" />
					</button>
				</div>

				{/* Table Rows */}
				<div className="table-rows-layout relative overflow-x-auto">
					<table className="w-full text-sm text-left text-gray-500">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
							<tr>
								<th scope="col" className="px-6 py-3">
									Конфигурация
								</th>
								<th scope="col" className="px-6 py-3 text-right">
									Действия
								</th>
							</tr>
						</thead>
						<tbody>
							{configurations.length > 0 ? (
								configurations.map((config) => (
									<tr
										key={config.label}
										className="bg-white border-b border-gray-200 hover:bg-gray-50"
									>
										<td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
											{config.label}
										</td>
										<td className="px-6 py-4 text-right flex items-center justify-end gap-2">
											<button
												type="button"
												onClick={() => handleEdit(config)}
												className="bg-blue-500 px-2.5 py-2.5 text-white rounded-md cursor-pointer"
											>
												<EditIcon className="size-5" />
											</button>
											<button
												type="button"
												onClick={() => handleDelete(config.label)}
												className="bg-red-500 px-2.5 py-2.5 text-white rounded-md cursor-pointer"
											>
												<BinIcon className="size-5" />
											</button>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={2} className="text-center py-4 text-gray-500">
										Нет конфигураций
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{isModalOpen && (
				<ConfigurationsUploadModal
					config={editingConfig}
					onClose={() => setIsModalOpen(false)}
					onSave={handleSave}
				/>
			)}
			{isDeleteModalOpen && (
				<ConfirmModal
					isOpen={isDeleteModalOpen}
					onCancel={() => setIsDeleteModalOpen(false)}
					onConfirm={() => {
						if (editingConfig) {
							handleDeleteConfirm(editingConfig.label);
						}
						setIsDeleteModalOpen(false);
					}}
					title="Удаление конфигурации"
					message={`Конфигурация "${editingConfig?.label}" будет удалена.`}
				/>
			)}
		</div>
	);
}
