import { useQuery } from "convex/react";
import { SignOutButton } from "../SignOutButton";
import { api } from "../../convex/_generated/api";

export const UserItem = () => {
  const user = useQuery(api.auth.loggedInUser);

  return (
    <div className="flex items-center gap-x-2 p-2">
      <div className="rounded-md bg-secondary p-1">
        <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-white font-bold">
          {user?.email?.[0].toUpperCase()}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-sm line-clamp-1">{user?.email}</p>
      </div>
      <SignOutButton />
    </div>
  );
};
