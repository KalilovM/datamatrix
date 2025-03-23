import { useOrderStore } from "@/orders/stores/useOrderStore";
import { BinIcon } from "@/shared/ui/icons";
const OrderGeneratedCodesList = () => {
	const { codes, setSelectedCode, removeCode } = useOrderStore();

	const handleDeleteCode = (generatedCode: string) => {
		removeCode(generatedCode);
		setSelectedCode(null);
	};

	const totalCodes = codes.reduce((sum, code) => sum + code.codes.length, 0);

	return (
		<div className="relative overflow-x-auto shadow-md sm:rounded-lg h-full w-1/2 bg-white border border-blue-300">
			<table className="w-full text-sm text-left text-gray-500">
				<thead className="text-xs text-gray-700 uppercase bg-gray-50">
					<tr>
						<th scope="col" className="px-6 py-3">
							Отсканированный код
						</th>
						<th scope="col" className="px-6 py-3">
							Номенклатура
						</th>
						<th scope="col" className="px-6 py-3">
							Кол-во
						</th>
						<th scope="col" className="px-6 py-3">
							<span className="sr-only">Действия</span>
						</th>
					</tr>
				</thead>
				<tbody>
					{codes.length === 0 ? (
						<tr>
							<td colSpan={3} className="px-6 py-4 text-center text-gray-500">
								Нет сгенерированных кодов
							</td>
						</tr>
					) : (
						codes.map((code) => (
							<tr
								key={code.generatedCode}
								onClick={() => setSelectedCode(code.generatedCode)}
								className="bg-white border-b hover:bg-gray-50"
							>
								<td className="px-6 py-4 font-medium text-gray-900 max-w-[320px] truncate">
									{code.generatedCode}
								</td>
								<td className="px-6 py-4">{code.nomenclature}</td>
								<td className="px-6 py-4">{code.codes.length}</td>
								<td className="px-6 py-4">
									<button
										type="button"
										onClick={() => handleDeleteCode(code.generatedCode)}
										className="bg-red-500 px-2.5 py-2.5 text-white rounded-md cursor-pointer"
									>
										<BinIcon className="size-5" />
									</button>
								</td>
							</tr>
						))
					)}
				</tbody>
				<tfoot className="sticky bottom-0 bg-white border-t border-blue-300">
					<tr className="text-base font-semibold text-gray-700">
						<td className="px-6 py-3">Итого</td>
						<td className="px-6 py-3"></td>
						<td className="px-6 py-3">{totalCodes}</td>
						<td className="px-6 py-3"></td>
					</tr>
				</tfoot>
			</table>
		</div>
	);
};

export default OrderGeneratedCodesList;
