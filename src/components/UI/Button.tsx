import { FC } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
interface ButtonProps {
  title: string;
  variant: "primary" | "secondary";
  onClick: () => void;
  icon?: string
}

const Button: FC<ButtonProps> = ({ title, variant, onClick, icon }) => {
  const baseStyles = "px-4 py-2 rounded font-medium transition flex gap-2 items-center justify-between";

  const classBtn = {
    primary: "bg-primary text-white hover:opacity-90",
    secondary: "border border-primary text-primary hover:bg-primary hover:text-white",
  }

  return (
    <button
      className={`${variant === "primary" ? classBtn.primary : classBtn.secondary} ${baseStyles}`}
      onClick={onClick}
    >
      {icon && <Icon icon={icon} />} <span>{title}</span>
    </button>
  );
};

export default Button;
