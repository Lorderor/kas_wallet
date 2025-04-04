import { FC, ReactNode } from "react";

interface ButtonProps {
  type?: "submit" | "reset" | "button";
  isDisabled?: boolean;
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
}

export const Button: FC<ButtonProps> = ({
  type,
  isDisabled,
  onClick,
  className,
  children,
}) => {
  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`border border-blue-300 rounded px-5 py-2 ${className}`}
    >
      {children}
    </button>
  );
};
