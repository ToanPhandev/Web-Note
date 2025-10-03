import React, { useState, lazy, Suspense } from "react";
import {
  Authenticated,
  useConvexAuth,
} from "convex/react";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { Routes, Route, Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useTheme } from "./components/theme-provider";
import { Sun, Moon, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { WorkspaceProvider } from "./contexts/WorkspaceContext";

const HomePage = lazy(() => import("./components/HomePage"));
const NotesPage = lazy(() => import("./pages/NotesPage"));
const SignInPage = lazy(() => import("./pages/SignInPage"));

const loadingFallback = (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
  </div>
);

export default function App() {
  return (
    <>
      <Suspense fallback={loadingFallback}>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/Welcome" element={<HomePage />} />
          <Route element={<Layout />}>
            <Route
              path="/Homepage"
              element={
                <Authenticated>
                  <NotesPage />
                </Authenticated>
              }
            />
            <Route path="/Signin" element={<SignInPage />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster position="top-center" />
    </>
  );
}

// Root component to handle redirection
function Root() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  if (isLoading) {
    return loadingFallback;
  }
  return isAuthenticated ? (
    <Navigate to="/Homepage" replace />
  ) : (
    <Navigate to="/Welcome" replace />
  );
}

// Layout component
function Layout() {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  return (
    <WorkspaceProvider>
      <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm h-16 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            {location.pathname === "/Homepage" && (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                {isSidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
              </button>
            )}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Ghi Chú Nhanh</h1>
          </div>
          <div className="flex items-center gap-4">
            {location.pathname !== "/Signin" && (
              <Authenticated>
                <SignOutButton />
              </Authenticated>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </button>
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          {location.pathname === "/Homepage" && (
            <Authenticated>
              <Sidebar isOpen={isSidebarOpen} />
            </Authenticated>
          )}
          <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </WorkspaceProvider>
  );
}