import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Toast from "./components/ui/Toast";
import { useAuthStore } from "./stores/authStore";
import { useNotificationStore } from "./stores/notificationStore";
import { getInitialNotifications } from "./services/notificationService";

const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Board = lazy(() => import("./pages/Board"));
const Analytics = lazy(() => import("./pages/Analytics"));

function App() {
  const setCheckingSession = useAuthStore((s) => s.setCheckingSession);
  const setNotifications = useNotificationStore((s) => s.setNotifications);
  const notifications = useNotificationStore((s) => s.notifications);

  useEffect(() => {
    setCheckingSession(false);
  }, [setCheckingSession]);

  // seed initial notifications from mock data, only if store is empty (avoid overwriting on every refresh)
  useEffect(() => {
    if (notifications.length === 0) {
      getInitialNotifications().then(setNotifications);
    }
  }, [notifications.length, setNotifications]);

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="p-6">Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/board" element={<Layout><Board /></Layout>} />
            <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
      <Toast />
    </BrowserRouter>
  );
}

export default App;