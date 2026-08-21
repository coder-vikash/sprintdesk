import { useNotificationStore } from "../../stores/notificationStore";

export default function NotificationPanel({ onClose }: { onClose: () => void }) {
    const notifications = useNotificationStore((s) => s.notifications);
    const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);

    return (
        <div className="absolute right-0 top-8 z-40 w-80 rounded-lg border bg-white p-3 shadow-lg">
            <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold">Notifications</span>
                <button onClick={markAllAsRead} className="text-xs text-indigo-600">
                    Mark all read
                </button>
            </div>

            <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                    <p className="py-4 text-center text-xs text-slate-400">No notifications yet</p>
                ) : (
                    notifications.slice(0, 20).map((n) => (
                        <div
                            key={n.id}
                            className={`border-b py-2 text-sm last:border-0 ${!n.read ? "font-medium" : "text-slate-500"}`}
                        >
                            <p>{n.title}</p>
                            <p className="text-xs text-slate-400">{n.message}</p>
                        </div>
                    ))
                )}
            </div>

            <button onClick={onClose} className="mt-2 text-xs text-slate-400">
                Close
            </button>
        </div>
    );
}