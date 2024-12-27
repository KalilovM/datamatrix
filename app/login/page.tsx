import LogoIcon from "@/app/components/svgs/LogoIcon";
import Link from "next/link";

// TODO: add validation for checking the form fields
// TODO: add show password icon in the field
export default function Login() {
  return (
    <div className="relative w-full h-screen">
      {/* Logo Section */}
      <div className="absolute top-0 left-0 p-6">
        <LogoIcon />
      </div>

      {/* Centered Form Section */}
      <div className="absolute inset-0 flex items-center justify-center">
        <form className="flex flex-col items-center space-y-4 w-full max-w-sm">
          <h1 className="text-2xl font-bold">Личный кабинет</h1>
          <input
            type="email"
            placeholder="Логин"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <input
            type="password"
            placeholder="Пароль"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Войти
          </button>
          <Link href="#" className="text-blue-500 hover:underline">
            Восстановить пароль
          </Link>
        </form>
      </div>
    </div>
  );
}
