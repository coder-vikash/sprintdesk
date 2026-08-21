import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    isLoading?: boolean;
}

const variantClasses: Record<Variant, string> = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "bg-transparent hover:bg-slate-100",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = "primary", isLoading, className = "", children, disabled, ...rest }, ref) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
                {...rest}
            >
                {isLoading ? "Loading..." : children}
            </button>
        );
    }
);

Button.displayName = "Button";
export default Button;