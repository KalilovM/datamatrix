import { useOrderNomenclatureStore } from "@/orders/stores/useOrderNomenclatureStore";
import { useOrderStore } from "@/orders/stores/useOrderStore";
import { BinIcon } from "@/shared/ui/icons";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Select from "react-select";

type NomenclatureOptionMeta = {
	id: string;
	modelArticle: string;
	color: string;
};

type NomenclatureOption = {
	id: string;
	value: string;
	label: string;
	meta: NomenclatureOptionMeta;
};

export default function OrderNomenclatures() {
	const { codes } = useOrderStore();
	const { rows, addRow, updateRow, updatePreparedOrders, removeRow } =
		useOrderNomenclatureStore();

	const { data: nomenclatures } = useQuery<NomenclatureOptionMeta[]>({
		queryKey: ["fetchNomenclatures"],
		queryFn: async () => {
			const response = await fetch("/api/orders/nomenclatures");
			return response.json() as Promise<NomenclatureOptionMeta[]>;
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

	const handleNomenclatureChange = (
		selectedOption: NomenclatureOption | null,
		index: number,
	) => {
		if (!selectedOption) return;
		console.log(selectedOption);
		console.log(codes);
		const numberOfPreparedOrders = codes
			.filter((code) => code.nomenclature === selectedOption.meta.modelArticle)
			.reduce((total, code) => total + code.codes.length, 0);

		updateRow(index, {
			nomenclature: selectedOption,
			numberOfPreparedOrders,
		});
	};

	const options: NomenclatureOption[] = (nomenclatures ?? [])
		.slice() // copy to avoid mutating original
		.sort((a, b) =>
			(a.modelArticle ?? "").toString().toLowerCase() >
				(b.modelArticle ?? "").toString().toLowerCase()
				? 1
				: -1
		)
		.map((n) => ({
			id: n.id,
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
		<div className="flex flex-col w-full h-full gap-4">
			<div className="relative w-full h-full overflow-x-auto bg-white border border-blue-300 shadow-md sm:rounded-lg">
				<table className="w-full text-sm text-left text-gray-500 table-auto">
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
									<Select<NomenclatureOption, false>
										options={options}
										onChange={(selectedOption) =>
											handleNomenclatureChange(selectedOption, index)
										}
										placeholder="Номенклатура"
										value={row.nomenclature as NomenclatureOption | null}
										formatOptionLabel={(option) => {
											const color = option.meta?.color ?? "";
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
											updateRow(index, {
												numberOfOrders: Number(e.target.value),
											})
										}
										className="w-full px-2 py-1 border rounded"
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
							<td colSpan={4} className="w-full py-4 text-center">
								<button
									onClick={handleAddRow}
									className="px-4 py-2 text-white bg-blue-600 rounded-lg"
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
