"use client";

import { useQuery } from "@tanstack/react-query";
import type { Filters } from "../definitions";

export function useAggregatedCodes(filters: Filters = {}) {
        const queryString = new URLSearchParams(filters as Record<string, string>).toString();

        return useQuery({
                queryKey: ["aggregatedCodes", filters],
                queryFn: async () => {
                        const res = await fetch(`/api/aggregated-codes?${queryString}`);
                        if (!res.ok) throw new Error("Ошибка загрузки агрегированных кодов");
                        return res.json();
                },
        });
}
