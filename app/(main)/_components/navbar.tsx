"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import Title from "./title";
import Banner from "./banner";
import Menu from "./menu";
import Publish from "./publish";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

export default function NavBar({ isCollapsed, onResetWidth }: NavbarProps) {
  const pathname = usePathname();

  // Add validation to ensure we have a valid document ID
  const documentId = pathname.split("/").pop();
  const isValidId = documentId && documentId !== "documents";

  // Only query if we have a valid ID
  const document = useQuery(
    api.documents.getById,
    isValidId ? { documentId: documentId as Id<"documents"> } : "skip",
  );

  // Handle cases where we don't have a valid document ID
  if (!isValidId) {
    return (
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className="h-6 w-6 text-muted-foreground"
          />
        )}
        <div className="flex items-center justify-between w-full">Write</div>
      </nav>
    );
  }

  if (document === undefined) {
    return (
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center justify-between">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
      </nav>
    );
  }

  if (document === null) return null;

  return (
    <>
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className="h-6 w-6 text-muted-foreground"
          />
        )}
        <div className="flex items-center justify-between w-full">
          <Title initData={document} />
          <div className="flex items-center gap-x-2">
            <Publish initData={document} />
            <Menu documentId={document._id} />
          </div>
        </div>
      </nav>
      {document.isArchived && <Banner documentId={document._id} />}
    </>
  );
}
