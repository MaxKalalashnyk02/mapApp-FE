import React, { MouseEvent, ReactNode } from "react";
import { ThemedText } from "./ThemedText";

type Variant = "primary" | "secondary";

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  size?: "large" | "small" | "medium";
  type?: "button" | "reset" | "submit" | undefined;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  loading?: boolean;
  className?: string;
}

const baseStyles =
  "px-4 py-2 font-medium rounded-lg transition focus:outline-none";
const variantStyles: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary/90",
  secondary: "bg-secondary text-white hover:bg-secondary/90",
};

const sizeStyles = {
  large: "h-[73px] w-[316px] rounded-[5px] px-[9px]",
  medium:
    "h-[48px] md:h-[61px] w-full md:max-w-[286px] text-center rounded-[5px]",
  small: "w-full h-[48px] w-[136px] rounded-[5px] px-4",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  className = "",
  children,
  onClick,
  type,
  ...rest
}) => (
  <button
    type={type}
    onClick={onClick}
    className={`${baseStyles} ${variantStyles[variant]} ${className} ${sizeStyles[size]}`}
    {...rest}
  >
    <ThemedText>{children}</ThemedText>
  </button>
);
