import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

export default function ProtectedRoute() {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const isCheckingSession = useAuthStore((s) => s.isCheckingSession);

    if (isCheckingSession) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                Checking session...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}