"use client";

import { useUser } from "@/shared/model/useUser";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import InitialIcon from "./InitialIcon";

export default function Avatar() {
	const { user, isLoading, logout } = useUser();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const router = useRouter();

	const toggleMenu = useCallback(() => {
		setIsOpen((prev) => !prev);
	}, []);

	const handleClickOutside = useCallback((event: MouseEvent) => {
		if (
			dropdownRef.current &&
			!dropdownRef.current.contains(event.target as Node)
		) {
			setIsOpen(false);
		}
	}, []);

	useEffect(() => {
		if (isOpen) document.addEventListener("mousedown", handleClickOutside);
		else document.removeEventListener("mousedown", handleClickOutside);

		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isOpen, handleClickOutside]);

	if (isLoading) return null; // Prevent rendering while loading
	if (!user) return null; // Hide Avatar if user is not logged in

	return (
		<div className="relative flex items-center gap-3">
			<span className="text-sm text-gray-500">
				{user.role === "ADMIN" ? "Администратор" : "Пользователь"}
			</span>
			<button
				type="button"
				className="relative flex rounded-full bg-gray-800 text-sm focus:ring-4 focus:ring-gray-300"
				onClick={toggleMenu}
			>
				<span className="sr-only">Open user menu</span>
				<InitialIcon initial={user?.name?.charAt(0).toUpperCase() || "U"} />
			</button>
			{isOpen && (
				<div
					ref={dropdownRef}
					className="absolute right-0 top-3/4 z-50 mt-4 w-48 list-none divide-y divide-gray-100 rounded-lg bg-white shadow-lg"
				>
					<div className="px-4 py-3">
						<p className="text-sm font-medium text-gray-900">{user.name}</p>
						<p className="text-sm text-gray-500 truncate">{user.email}</p>
					</div>
					<ul className="py-2">
						<li>
							<button
								type="button"
								className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
								onClick={() => router.push("/settings")}
							>
								Настройки
							</button>
						</li>
						<li>
							<button
								type="button"
								onClick={logout}
								className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
							>
								Выйти
							</button>
						</li>
					</ul>
				</div>
			)}
		</div>
	);
}
