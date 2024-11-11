import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings2,
  Trash2,
} from "lucide-react";
import React, { ElementRef, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import UserItem from "./userItem";
import Item from "./item";
import DocumentList from "./documentList";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import TrashBox from "./trashBox";
import { useSearch } from "@/hooks/searchbox";
import { useSettings } from "@/hooks/use-setting";
import NavBar from "./navbar";

function Navigation() {
  const create = useMutation(api.documents.create);
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const search = useSearch();
  const settings = useSettings();
  const router = useRouter();

  const documentID = pathname.split("/").pop(); // This gets the last segment

  const handleCreate = () => {
    const promise = create({ title: "Untitled" }).then((documentID) =>
      router.push(`/documents/${documentID}`),
    );
    toast.promise(promise, {
      loading: "Creating a new note",
      success: "New note created",
      error: "Failed to create new note",
    });
  };

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
    /* trunk-ignore(eslint/react-hooks/exhaustive-deps) */
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [isMobile, pathname]);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = e.clientX;
    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;
    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% -  ${newWidth}px)`,
      );
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
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
          <Item label="Search" icon={Search} isSearch onClick={search.onOpen} />
          <Item label="Settings" icon={Settings2} onClick={settings.onOpen} />
          <Item onClick={handleCreate} label="New Page" icon={PlusCircle} />
        </div>
        <div className="mt-4">
          <DocumentList />
          <Item onClick={handleCreate} icon={Plus} label="Add a Page" />
          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="Trash" icon={Trash2} />
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-72"
              side={isMobile ? "bottom" : "right"}
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>

      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
          isResetting && "transition-all ease-in-out duration-300",
          (isMobile || isCollapsed) && "left-0 w-full",
        )}
      >
        {!!documentID ? (
          <NavBar isCollapsed={isCollapsed} onResetWidth={resetWidth} />
        ) : (
          <nav className="py-2 px-3 bg-transparent w-full">
            {isCollapsed && (
              <MenuIcon
                onClick={resetWidth}
                role="button"
                className="h-6 w-6 text-muted-foreground"
              />
            )}
          </nav>
        )}
      </div>
    </>
  );
}

export default Navigation;
