"use client";

import dynamic from "next/dynamic";

const Select = dynamic(() => import("react-select"), { ssr: false });

function CodeLinksTable() {
	return (
		<div className="w-full gap-4 flex flex-col print:hidden">
			<div className="flex items-center justify-between">
				<h1 className="leading-6 text-xl font-bold">Датаматрикс Коды</h1>
			</div>
			<div className="flex flex-row w-full rounded-lg border border-blue-300 bg-white px-8 py-3 gap-4">
				<div className="w-1/2 flex flex-col">
					<label htmlFor="nomenclatures">Модель</label>
					<input
						type="text"
						name="code"
						placeholder="Введите датаматрикс код"
						className="border border-gray-300 rounded-lg px-3 py-2"
					/>
				</div>
			</div>
		</div>
	);
}

export default CodeLinksTable;
