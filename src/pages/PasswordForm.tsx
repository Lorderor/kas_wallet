import { useWalletStore } from "../store/walletStore.ts";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { FC, useState } from "react";

// Типы для формы
type Inputs = {
  password: string;
  confirmPassword: string;
};

export const PasswordForm: FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const setPassword = useWalletStore((state) => state.setPassword);
  const createMode = useWalletStore((state) => state.createMode);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log("Form submitted with data:", data);
    setPassword(data.password);
    navigate(createMode === "import" ? "/import" : "/create");
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Create a Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Поле пароля */}
        <div>
          <label htmlFor="password" className="block font-semibold">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                validate: validatePassword,
              })}
              placeholder="Enter your password"
              className="border border-gray-300 p-2 rounded-md w-full"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-2"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.password && (
            <div className="text-red-500">{errors.password.message}</div>
          )}
        </div>

        {/* Поле подтверждения пароля */}
        <div>
          <label htmlFor="confirmPassword" className="block font-semibold">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  validateConfirmPassword(value, watch("password")),
              })}
              placeholder="Confirm your password"
              className="border border-gray-300 p-2 rounded-md w-full"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-2"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.confirmPassword && (
            <div className="text-red-500">{errors.confirmPassword.message}</div>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

// Функция валидации для пароля
const validatePassword = (value: string) => {
  if (!/[A-Z]/.test(value)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[a-z]/.test(value)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/\d/.test(value)) {
    return "Password must contain at least one number";
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
    return "Password must contain at least one special character";
  }
  if (value.length < 10) {
    return "Password must be at least 10 characters long";
  }
  return true;
};

// Функция для проверки совпадения пароля и подтверждения пароля
const validateConfirmPassword = (value: string, password: string) => {
  if (value !== password) {
    return "Passwords must match";
  }
  return true;
};
