import { useEffect } from "react";
import { useNotificationStore } from "../../stores/notificationStore";

const typeStyles = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-slate-800",
};

export default function Toast() {
    const toasts = useNotificationStore((s) => s.toasts);
    const removeToast = useNotificationStore((s) => s.removeToast);

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((t) => (
                <ToastItem key={t.id} id={t.id} message={t.message} type={t.type} onDone={removeToast} />
            ))}
        </div>
    );
}

function ToastItem({
    id,
    message,
    type,
    onDone,
}: {
    id: string;
    message: string;
    type: "success" | "error" | "info";
    onDone: (id: string) => void;
}) {
    // auto dismiss after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => onDone(id), 3000);
        return () => clearTimeout(timer);
    }, [id, onDone]);

    return (
        <div
            role="status"
            className={`rounded-md px-4 py-2 text-sm text-white shadow-lg ${typeStyles[type]}`}
        >
            {message}
        </div>
    );
}