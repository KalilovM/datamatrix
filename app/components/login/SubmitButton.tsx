"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      type="submit"
      className="w-full rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
    >
      {pending ? "Вход..." : "Войти"}
    </button>
  );
}
