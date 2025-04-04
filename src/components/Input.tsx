import { FC, ChangeEvent, ClipboardEvent } from "react";

interface InputProps {
  type: string;
  placeholder?: string;
  value: string | number;
  className?: string;
  readOnly?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onPaste?: (e: ClipboardEvent<HTMLInputElement>) => void;
}

export const Input: FC<InputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  className,
  readOnly,
  onPaste,
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`border rounded border-blue-300 ${className}`}
      readOnly={readOnly}
      onPaste={onPaste}
    />
  );
};
