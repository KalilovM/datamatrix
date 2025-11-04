"use client";

import { useOrderStore } from "@/orders/stores/useOrderStore";

export default function OrderCodesList() {
	const { selectedCode, getCodesByGeneratedCode } = useOrderStore();

	const codeEntry = selectedCode ? getCodesByGeneratedCode(selectedCode) : null;

	return (
		<div className="relative w-1/2 h-full overflow-x-auto bg-white border border-blue-300 shadow-md sm:rounded-lg">
			<table className="w-full text-sm text-left text-gray-500">
				<thead className="text-xs text-gray-700 uppercase bg-gray-50">
					<tr>
						<th scope="col" className="px-6 py-3">
							Код
						</th>
					</tr>
				</thead>
				<tbody>
					{!codeEntry || codeEntry.codes.length === 0 ? (
						<tr>
							<td className="px-6 py-4 text-center text-gray-500">Нет кодов</td>
						</tr>
					) : (
						codeEntry.codes.map((code) => (
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
