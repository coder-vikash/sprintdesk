import type { ReactNode } from "react";

interface StatCardProps {
    label: string;
    value: number | string;
    icon: ReactNode;
    accentClass: string; // e.g. "bg-indigo-50 text-indigo-600"
}

export default function StatCard({ label, value, icon, accentClass }: StatCardProps) {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-800 dark:text-white">{value}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${accentClass}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}