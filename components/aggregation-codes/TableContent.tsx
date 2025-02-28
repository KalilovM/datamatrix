"use client";

import { IAggregatedCode } from "@/app/aggregation-codes/defenitions";
import { useState } from "react";
import AggregationCodesRow from "./AggregationCodesRow";
import { FilterIcon } from "../Icons";

interface ITableContentProps {
  aggregatedCodes: IAggregatedCode[];
}

export default function TableContent({ aggregatedCodes }: ITableContentProps) {
  return (
    <div className="table-layout">
      {/* Table Header */}
      <div className="table-header">
        <p className="table-header-title">Сгенерированные коды</p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="🔍 Поиск..."
            className="border rounded-md px-3 py-1.5"
          />
          <button className="bg-white text-white p-2 rounded-md inset">
            <span>
              <FilterIcon className="size-5" strokeWidth="2" stroke="black" />
            </span>
          </button>
        </div>
      </div>

      {/* Filters (Hidden by Default - Toggle Logic Required) */}
      <div className="table-filters hidden">
        <select className="border rounded-md px-3 py-1.5">
          <option value="">Все</option>
          <option value="Pack">Pack</option>
          <option value="Pallet">Pallet</option>
        </select>
        <input type="date" className="border rounded-md px-3 py-1.5" />
        <input
          type="text"
          placeholder="Конфигурация"
          className="border rounded-md px-3 py-1.5"
        />
      </div>

      {/* Table Columns */}
      <AggregationCodesRow aggregatedCodes={aggregatedCodes} />
    </div>
  );
}
