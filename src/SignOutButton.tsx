"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useNavigate } from "react-router-dom";

export function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return null;
  }

  const handleSignOut = () => {
    signOut().then(() => {
      navigate("/Signin");
    });
  };

  return (
    <button
      className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors shadow-sm hover:shadow-md dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
      onClick={handleSignOut}
    >
      Đăng xuất
    </button>
  );
}
