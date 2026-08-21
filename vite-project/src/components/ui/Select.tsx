import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";

interface Option {
    label: string;
    value: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: Option[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, options, id, className = "", ...rest }, ref) => {
        return (
            <div className="flex flex-col gap-1">
                {label && (
                    <label htmlFor={id} className="text-sm font-medium text-slate-700">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    id={id}
                    className={`rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
                    {...rest}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
        );
    }
);

Select.displayName = "Select";
export default Select;