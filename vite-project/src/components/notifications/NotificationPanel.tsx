import { useState } from "react";
import { useNotificationStore } from "../../stores/notificationStore";

const PAGE_SIZE = 20;

export default function NotificationPanel({ onClose }: { onClose: () => void }) {
    const notifications = useNotificationStore((s) => s.notifications);
    const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
    const markAsRead = useNotificationStore((s) => s.markAsRead);

    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(notifications.length / PAGE_SIZE) || 1;
    const visibleNotifications = notifications.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="absolute right-0 top-8 z-40 w-80 rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800 dark:text-white">Notifications</span>
                <button onClick={markAllAsRead} className="text-xs text-indigo-600 dark:text-indigo-400">
                    Mark all read
                </button>
            </div>

            <div className="max-h-64 overflow-y-auto">
                {visibleNotifications.length === 0 ? (
                    <p className="py-4 text-center text-xs text-slate-400 dark:text-slate-500">
                        No notifications yet
                    </p>
                ) : (
                    visibleNotifications.map((n) => (
                        <button
                            key={n.id}
                            onClick={() => markAsRead(n.id)}
                            className={`block w-full border-b border-slate-100 py-2 text-left text-sm last:border-0 dark:border-slate-700 ${!n.read
                                    ? "font-medium text-slate-800 dark:text-white"
                                    : "text-slate-500 dark:text-slate-400"
                                }`}
                        >
                            <p>{n.title}</p>
                            <p className="truncate text-xs text-slate-400 dark:text-slate-500">{n.message}</p>
                        </button>
                    ))
                )}
            </div>

            {totalPages > 1 && (
                <div className="mt-2 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="disabled:opacity-30">
                        ← Prev
                    </button>
                    <span>{page} / {totalPages}</span>
                    <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="disabled:opacity-30">
                        Next →
                    </button>
                </div>
            )}

            <button onClick={onClose} className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                Close
            </button>
        </div>
    );
}