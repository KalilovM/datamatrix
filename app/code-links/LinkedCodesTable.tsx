"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const Select = dynamic(() => import("react-select"), { ssr: false });

function LinkedCodesTable({ linkedCodes = [] }: { linkedCodes?: string[] }) {
	const [codes, setCodes] = useState<string[]>(linkedCodes);

	return (
		<div className="w-full gap-4 flex flex-col print:hidden">
			<div className="flex flex-row w-full rounded-lg border border-blue-300 bg-white px-8 py-3 gap-4">
				<div className="w-1/2 flex flex-col">
					<ul>
						{codes.map((code, index) => (
							<li key={code} className="border-b border-gray-200 py-2">
								{code}
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}

export default LinkedCodesTable;
