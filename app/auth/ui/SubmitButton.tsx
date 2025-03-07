"use client";

interface SubmitButtonProps {
  loading: boolean;
}

export function SubmitButton({ loading }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      disabled={loading}
    >
      {loading ? "Вход..." : "Войти"}
    </button>
  );
}
