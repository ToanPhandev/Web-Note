import { Authenticated, Unauthenticated } from "convex/react";
import { Outlet } from "react-router-dom";
import { Navigation } from "../components/navigation";
import { SearchCommand } from "../components/search-command";
import { SignInForm } from "../SignInForm";

export const MainLayout = () => {
  return (
    <div className="h-full flex dark:bg-[#1F1F1F]">
      <Authenticated>
        <Navigation />
        <main className="flex-1 h-full overflow-y-auto">
          <SearchCommand />
          <Outlet />
        </main>
      </Authenticated>
      <Unauthenticated>
        <div className="flex-1 flex items-center justify-center">
          <SignInForm />
        </div>
      </Unauthenticated>
    </div>
  );
};
