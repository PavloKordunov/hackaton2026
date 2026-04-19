import { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = "", ...props }: CardProps) => (
  <div
    {...props}
    className={`bg-white rounded-xl shadow-sm border border-slate-100 ${className}`}
  >
    {children}
  </div>
);

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "success" | "outline" | "ghost";
  className?: string;
}

type NativeButtonProps = ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}: NativeButtonProps) => {
  const styles = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    success: "bg-emerald-500 text-white hover:bg-emerald-600",
    outline: "border border-slate-200 text-slate-700 hover:bg-slate-50",
    ghost: "text-slate-500 hover:bg-slate-50",
  };

  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-lg font-medium transition-all active:scale-95 flex items-center justify-center gap-2 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
