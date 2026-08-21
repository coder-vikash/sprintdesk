import { useState } from "react";
import { useNotificationStore } from "../../stores/notificationStore";
import NotificationPanel from "./NotificationPanel";

export default function NotificationBell() {
    const [open, setOpen] = useState(false);
    const unreadCount = useNotificationStore((s) => s.unreadCount());

    return (
        <div className="relative">
            <button
                onClick={() => setOpen((o) => !o)}
                aria-label="Notifications"
                className="relative text-lg"
            >
                🔔
                {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] text-white">
                        {unreadCount}
                    </span>
                )}
            </button>
            {open && <NotificationPanel onClose={() => setOpen(false)} />}
        </div>
    );
}