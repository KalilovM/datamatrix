"use client";

import type { Counteragent } from "@/entities/counteragent/types";
import Link from "next/link";
import CounteragentRow from "./CounteragentRow";

interface CounteragentsTableProps {
	counteragents: Counteragent[];
}

export default function CounteragentsTable({
	counteragents,
}: CounteragentsTableProps) {
	return (
		<div className="table-layout">
			<div className="table-header">
				<p className="table-header-title">Контрагенты</p>
				<Link
					href="/counteragents/create"
					className="bg-blue-500 px-2.5 py-1.5 text-white rounded-md"
				>
					Создать
				</Link>
			</div>
			<div className="table-rows-layout">
				{counteragents.map((counteragent) => (
					<CounteragentRow key={counteragent.id} counteragent={counteragent} />
				))}
			</div>
		</div>
	);
}
