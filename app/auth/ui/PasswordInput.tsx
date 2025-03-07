import { UseFormRegister, FieldErrors } from "react-hook-form";
import { LoginSchema } from "@/auth/model/schema";

interface PasswordInputProps {
  register: UseFormRegister<LoginSchema>;
  errors: FieldErrors<LoginSchema>;
}

export function PasswordInput({ register, errors }: PasswordInputProps) {
  return (
    <div className="w-full">
      <input
        {...register("password")}
        type="password"
        placeholder="Пароль"
        className={`w-full border p-2 ${
          errors.password ? "border-red-500" : "border-gray-300"
        } rounded-md`}
      />
      {errors.password && (
        <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
      )}
    </div>
  );
}
