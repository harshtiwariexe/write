"use client";
import Cover from "@/components/cover";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import Toolbar from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { usePathname } from "next/navigation";
import React from "react";

export default function DocumentsIdPage() {
  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    [],
  );
  const pathname = usePathname();
  const update = useMutation(api.documents.update);

  // Add validation to ensure we have a valid document ID
  const documentId = pathname.split("/").pop();
  const isValidId = documentId && documentId !== "documents";

  // Only query if we have a valid ID
  const document = useQuery(
    api.documents.getById,
    isValidId ? { documentId: documentId as Id<"documents"> } : "skip",
  );

  const onChange = (content: string) => {
    update({
      id: documentId as Id<"documents">,
      content,
    });
  };

  // Handle cases where we don't have a valid document ID
  if (!isValidId) {
    return <div>Not valid Id</div>;
  }

  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) return null;

  return (
    <div className="pb-40">
      <Cover url={document.coverImage} initData={document} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initData={document} />
        <Editor onChange={onChange} initContent={document.content} />
      </div>
    </div>
  );
}
