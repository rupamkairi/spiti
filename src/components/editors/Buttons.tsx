import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export default function Button({
  className,
  active,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={twMerge("btn", active ? "btn-primary" : "", className)}
      {...props}
    >
      {children}
    </button>
  );
}
