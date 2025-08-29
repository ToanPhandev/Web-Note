import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from "lucide-react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useMediaQuery } from "usehooks-ts";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { ElementRef, useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";
import { api } from "../../convex/_generated/api";
import { Item } from "./item";
import { UserItem } from "./user-item";
import { TrashBox } from "./trash-box";
import { Navbar } from "./navbar";

export const Navigation = () => {
  const navigate = useNavigate();
  const search = useQuery(api.documents.getSearch);
  const create = useMutation(api.documents.create);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  const handleCreate = () => {
    const promise = create({ title: "Untitled" }).then((documentId) =>
      navigate(`/documents/${documentId}`)
    );

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        <div
          onClick={() => {}}
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100"
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>
        <div>
          <UserItem />
          <Item label="Search" icon={Search} isSearch onClick={() => {}} />
          <Item label="Settings" icon={Settings} onClick={() => {}} />
          <Item onClick={handleCreate} label="New page" icon={PlusCircle} />
        </div>
        <div className="mt-4">
          <TrashBox />
        </div>
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}
      >
        <Navbar isCollapsed={isCollapsed} onResetWidth={() => {}} />
      </div>
    </>
  );
};
