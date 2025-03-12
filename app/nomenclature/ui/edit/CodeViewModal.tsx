import { CloseIcon } from "@/shared/ui/icons";

interface Props {
	codes: string[];
	isOpen: boolean;
	onClose: () => void;
}

export const CodeViewModal = ({ codes, isOpen, onClose }: Props) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
			<div className="bg-white rounded-lg shadow-lg w-1/2 p-6 relative">
				<button
					type="button"
					className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
					onClick={onClose}
				>
					<CloseIcon className="size-6" />
				</button>
				<h2 className="text-xl font-semibold text-gray-800 mb-4">
					Просмотр кодов
				</h2>
				<div className="relative overflow-x-auto max-h-80 overflow-y-auto">
					<table className="w-full text-sm text-left text-gray-500">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50">
							<tr>
								<th scope="col" className="px-6 py-3">
									Коды
								</th>
							</tr>
						</thead>
						<tbody>
							{codes.map((code, index) => (
								<tr
									key={index}
									className="odd:bg-white even:bg-gray-50 border-b border-gray-200"
								>
									<td className="px-6 py-4 font-mono text-gray-900 break-all">
										{code}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};
