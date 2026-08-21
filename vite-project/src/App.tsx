import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Toast from "./components/ui/Toast";
import { useAuthStore } from "./stores/authStore";

// route-level code splitting - no point loading board/analytics bundle on login screen
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Board = lazy(() => import("./pages/Board"));
const Analytics = lazy(() => import("./pages/Analytics"));

function App() {
  const setCheckingSession = useAuthStore((s) => s.setCheckingSession);

  useEffect(() => {
    // TODO (Phase 4 follow-up): try restoring session using refresh token from localStorage
    // for now, if there's no token we just stop the loading state
    setCheckingSession(false);
  }, [setCheckingSession]);

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="p-6">Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />
            <Route
              path="/board"
              element={
                <Layout>
                  <Board />
                </Layout>
              }
            />
            <Route
              path="/analytics"
              element={
                <Layout>
                  <Analytics />
                </Layout>
              }
            />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
      <Toast />
    </BrowserRouter>
  );
}

export default App;