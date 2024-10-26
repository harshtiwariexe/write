import {
  ChevronsLeft,
  Menu,
  PlusCircle,
  Search,
  Settings2,
} from "lucide-react";
import React, { ElementRef, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import UserItem from "./userItem";
import Item from "./item";
import DocumentList from "./documentList";

function Navigation() {
  const create = useMutation(api.documents.create);
  const pathName = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  const handleCreate = () => {
    const promise = create({ title: "Untitled" });
    toast.promise(promise, {
      loading: "Creating a new note",
      success: "New note created",
      error: "Failed to create new note",
    });
  };

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)",
      );
      navbarRef.current.style.setProperty("left", isMobile ? "0" : "240px");

      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsResetting(true);
      setIsCollapsed(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");

      setTimeout(() => setIsResetting(false), 300);
    }
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className="group/sidebar h-full bg-secondary overflow-y-auto z-[99999] relative flex flex-col w-60"
      >
        {!isMobile && !isCollapsed && (
          <div
            onClick={collapse}
            role="button"
            className="h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition"
          >
            <ChevronsLeft className="h-6 w-6" />
          </div>
        )}
        {isMobile && !isCollapsed && (
          <div
            onClick={collapse}
            role="button"
            className="h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-100 transition"
          >
            <ChevronsLeft className="h-6 w-6" />
          </div>
        )}
        <div>
          <UserItem />
          <Item label="Search" icon={Search} isSearch onClick={() => {}} />
          <Item label="Settings" icon={Settings2} onClick={() => {}} />
          <Item onClick={handleCreate} label="New Page" icon={PlusCircle} />
        </div>
        <div className="mt-4">
          <DocumentList />
        </div>
      </aside>

      <div
        ref={navbarRef}
        className="absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]"
      >
        <nav className="bg-transparent px-3 py-2 w-full">
          {(isMobile || isCollapsed) && (
            <Menu
              role="button"
              className="h-6 w-6 text-muted-foreground"
              onClick={resetWidth}
            />
          )}
        </nav>
      </div>
    </>
  );
}

export default Navigation;
