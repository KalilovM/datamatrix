import { BinIcon } from "@/shared/ui/icons";
import { useOrderEditStore } from "../stores/useOrderEditStore";

const OrderEditGeneratedCodesList = () => {
	const { codes, setSelectedCode, removeCode } = useOrderEditStore();
	const deleteCode = (generatedCode: string) => {
		removeCode(generatedCode);
		console.log(codes);
	};

	return (
		<div className="relative overflow-x-auto shadow-md sm:rounded-lg h-full w-1/2 bg-white border border-blue-300">
			<table className="w-full text-sm text-left text-gray-500">
				<thead className="text-xs text-gray-700 uppercase bg-gray-50">
					<tr>
						<th scope="col" className="px-6 py-3">
							Агрегированный код
						</th>
						<th scope="col" className="px-6 py-3">
							Номенклатура
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
								<td className="px-6 py-4 font-medium text-gray-900">
									{code.generatedCode}
								</td>
								<td className="px-6 py-4">{code.nomenclature}</td>
								<td className="px-6 py-4">
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											deleteCode(code.generatedCode);
										}}
										className="bg-red-500 px-2.5 py-2.5 text-white rounded-md cursor-pointer"
									>
										<BinIcon className="size-5" />
									</button>
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
};

export default OrderEditGeneratedCodesList;
