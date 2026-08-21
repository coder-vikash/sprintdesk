import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, id, className = "", ...rest }, ref) => {
        return (
            <div className="flex flex-col gap-1">
                {label && (
                    <label htmlFor={id} className="text-sm font-medium text-slate-700">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={id}
                    className={`rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${error ? "border-red-500" : "border-slate-300"
                        } ${className}`}
                    {...rest}
                />
                {error && <span className="text-xs text-red-600">{error}</span>}
            </div>
        );
    }
);

Input.displayName = "Input";
export default Input;