import { useEffect } from "react";
import type { ReactNode } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            role="dialog"
            aria-modal="true"
        >
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800">
                <div className="mb-4 flex items-center justify-between">
                    {title && <h2 className="text-lg font-semibold text-slate-800 dark:text-white">{title}</h2>}
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
                    >
                        ✕
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}