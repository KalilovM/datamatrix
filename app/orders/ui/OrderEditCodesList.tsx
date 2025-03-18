import { useEffect, useState } from "react";
import { useOrderEditStore } from "../stores/useOrderEditStore";

export default function OrderEditCodesList() {
	const { getCodesRawData, selectedCode, getCodesByGeneratedCode } =
		useOrderEditStore();
	const [codes, setCodes] = useState<string[]>([]);

	useEffect(() => {
		const data = selectedCode
			? getCodesByGeneratedCode(selectedCode)?.codes || []
			: [];
		setCodes(data);
	}, [getCodesByGeneratedCode, getCodesRawData, selectedCode]);

	return (
		<div className="relative overflow-x-auto shadow-md sm:rounded-lg h-full w-1/2 bg-white border border-blue-300">
			<table className="w-full text-sm text-left text-gray-500">
				<thead className="text-xs text-gray-700 uppercase bg-gray-50">
					<tr>
						<th scope="col" className="px-6 py-3">
							Код
						</th>
					</tr>
				</thead>
				<tbody>
					{codes.length === 0 ? (
						<tr>
							<td className="px-6 py-4 text-center text-gray-500">Нет кодов</td>
						</tr>
					) : (
						codes.map((code) => (
							<tr key={code} className="bg-white border-b hover:bg-gray-50">
								<td className="px-6 py-4 font-medium text-gray-900 break-all">
									{code}
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}
