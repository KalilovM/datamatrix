"use client";

import { useQuery } from "@tanstack/react-query";
import { Company } from "@prisma/client";
import { User } from "@/app/users/definitions";


async function fetchCompanies(): Promise<Company[]> {
  const res = await fetch("/api/companies");
  if (!res.ok) throw new Error("Ошибка загрузки компаний");
  return res.json();
}

async function fetchUsers(): Promise<User[]> {
  const res = await fetch("/api/users");
  if (!res.ok) throw new Error("Ошибка загрузки пользователей");
  return res.json();
}

export function useCompanies() {
  const {
    data: companies,
    error: companiesError,
    isLoading: loadingCompanies,
  } = useQuery({
    queryKey: ["companies"],
    queryFn: fetchCompanies,
  });

  const {
    data: users,
    error: usersError,
    isLoading: loadingUsers,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  return {
    companies,
    users,
    error: companiesError || usersError,
    loading: loadingCompanies || loadingUsers,
  };
}
