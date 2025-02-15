"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import InitialIcon from "@/components/InitialIcon";
import { redirect } from "next/navigation";
import { User } from "@prisma/client";

export default function Avatar({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "GET" });
      if (!res.ok) throw new Error("Logout failed");
      setIsOpen(false);
      redirect("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    },
    [setIsOpen],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  return (
    <div className="relative flex items-center space-x-3">
      {user ? (
        <span className="text-sm text-gray-500">
          {user.role === "ADMIN" ? "Администратор" : "Пользователь"}
        </span>
      ) : null}
      <button
        className="relative flex rounded-full bg-gray-800 text-sm focus:ring-4 focus:ring-gray-300"
        onClick={toggleMenu}
      >
        <span className="sr-only">Open user menu</span>
        <InitialIcon initial={user?.username?.charAt(0).toUpperCase() || "U"} />
      </button>
      <div
        ref={dropdownRef}
        className={
          "absolute right-0 top-3/4 z-50 my-4 list-none divide-y divide-gray-100 rounded-lg bg-white text-base shadow " +
          (isOpen ? "block" : "hidden")
        }
      >
        {user ? (
          <>
            <div className="px-4 py-3">
              <span className="block text-sm text-gray-900">
                {user.username}
              </span>
              <span className="block truncate text-sm text-gray-900">
                {user.email}
              </span>
            </div>
            <ul className="py-2">
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Настройки
                </a>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-start text-sm text-gray-700 hover:bg-gray-100"
                >
                  Выйти
                </button>
              </li>
            </ul>
          </>
        ) : (
          <div className="px-4 py-3">
            <span className="block text-sm text-gray-500">Not logged in</span>
          </div>
        )}
      </div>
    </div>
  );
}
