import { useOrderNomenclatureStore } from "@/orders/stores/useOrderNomenclatureStore";
import { useOrderStore } from "@/orders/stores/useOrderStore";
import { BinIcon } from "@/shared/ui/icons";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Select from "react-select";

export default function OrderNomenclatures() {
	const { codes } = useOrderStore();
	const { rows, addRow, updateRow, updatePreparedOrders, removeRow } =
		useOrderNomenclatureStore();

	const { data: nomenclatures } = useQuery({
		queryKey: ["fetchNomenclatures"],
		queryFn: async () => {
			const response = await fetch("/api/orders/nomenclatures");
			return response.json();
		},
	});

	const handleAddRow = () => {
		if (nomenclatures && nomenclatures.length > 0) {
			addRow({
				nomenclature: null,
				numberOfOrders: 0,
				numberOfPreparedOrders: 0,
			});
		}
	};

	const handleDeleteRow = (index: number) => {
		removeRow(index);
	};

	useEffect(() => {
		if (codes.length > 0) {
			updatePreparedOrders(codes);
		}
	}, [codes, updatePreparedOrders]);

	const handleNomenclatureChange = (selectedOption, index) => {
		console.log(selectedOption);
		console.log(codes);
		const numberOfPreparedOrders = codes
			.filter((code) => code.nomenclature === selectedOption.value)
			.reduce((total, code) => total + code.codes.length, 0);

		updateRow(index, {
			nomenclature: selectedOption,
			numberOfPreparedOrders,
		});
	};

	  const options = (nomenclatures ?? [])
		.slice() // copy to avoid mutating original
		.sort((a, b) =>
		(a.modelArticle ?? "").toString().toLowerCase() >
		(b.modelArticle ?? "").toString().toLowerCase()
			? 1
			: -1
		)
		.map((n) => ({
			value: n.id,
			// label used for searching & keyboard selection
			label: `${n.modelArticle} - ${n.color ?? ""}`,
			// keep raw metadata for rendering
			meta: n,
    }));

	const totalOrdered = rows.reduce(
		(sum, row) => sum + Number(row.numberOfOrders || 0),
		0,
	);
	const totalPrepared = rows.reduce(
		(sum, row) => sum + Number(row.numberOfPreparedOrders || 0),
		0,
	);

	return (
		<div className="flex flex-col w-full gap-4 h-full">
			<div className="relative overflow-x-auto shadow-md sm:rounded-lg h-full w-full bg-white border border-blue-300">
				<table className="w-full table-auto text-sm text-left text-gray-500">
					<thead className="text-xs text-gray-700 uppercase bg-gray-50">
						<tr>
							<th scope="col" className="px-6 py-3">
								Номенклатура
							</th>
							<th scope="col" className="px-6 py-3">
								Заказано
							</th>
							<th scope="col" className="px-6 py-3">
								Подготовлено
							</th>
							<th scope="col" className="px-6 py-3">
								<span>Действия</span>
							</th>
						</tr>
					</thead>
					<tbody>
						{rows.map((row, index) => (
							<tr key={index}>
								<td className="px-6 py-3">
									<Select
										options={options}
										onChange={(selectedOption) =>
											handleNomenclatureChange(selectedOption, index)
										}
										placeholder="Номенклатура"
										value={row.nomenclature}
										formatOptionLabel={(option) => {
												const color = option?.color ?? "";
												return (
													<div className="flex items-center gap-2">
													<div
														style={{
														width: 12,
														height: 12,
														borderRadius: 3,
														border: "1px solid rgba(0,0,0,0.12)",
														background: color || "transparent",
														}}
														aria-hidden
													/>
													<span>{option.label}</span>
													</div>
												);
											}}
									/>
								</td>
								<td className="px-6 py-3">
									<input
										type="number"
										value={row.numberOfOrders}
										onChange={(e) =>
											updateRow(index, { numberOfOrders: e.target.value })
										}
										className="border rounded px-2 py-1 w-full"
									/>
								</td>
								<td className="px-6 py-3">{row.numberOfPreparedOrders}</td>
								<td className="px-6 py-3">
									<button
										type="button"
										onClick={() => handleDeleteRow(index)}
										className="bg-red-500 px-2.5 py-2.5 text-white rounded-md cursor-pointer"
									>
										<BinIcon className="size-5" />
									</button>
								</td>
							</tr>
						))}
						<tr>
							<td colSpan={4} className="w-full text-center py-4">
								<button
									onClick={handleAddRow}
									className="px-4 py-2 bg-blue-600 text-white rounded-lg"
								>
									Добавить
								</button>
							</td>
						</tr>
					</tbody>
					<tfoot className="sticky bottom-0 bg-white border-t border-blue-300">
						<tr className="text-base font-semibold text-gray-700">
							<td className="px-6 py-3">Итого</td>
							<td className="px-6 py-3">{totalOrdered}</td>
							<td className="px-6 py-3">{totalPrepared}</td>
							<td className="px-6 py-3"></td>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
	);
}
