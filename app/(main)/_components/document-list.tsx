"use client";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Item from "./item";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";

interface DocumentListProp {
  parentDocumentID?: Id<"documents">;
  level?: number;
}

export default function DocumentList({
  parentDocumentID,
  level = 0,
}: DocumentListProp) {
  const param = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (documentID: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [documentID]: !prevExpanded[documentID],
    }));
  };

  const documents = useQuery(api.documents.getSidebar, {
    parentDocument: parentDocumentID,
  });

  const onRedirect = (documentID: string) => {
    router.push(`/documents/${documentID}`);
  };

  if (documents === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <p
        style={{ paddingLeft: level ? `${level * 12 + 25}px` : undefined }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80",
          expanded && "last:block",
          level === 0 && "hidden",
        )}
      >
        No pages inside
      </p>
      {documents.map((document) => (
        <div key={document._id}>
          <Item
            onClick={() => onRedirect(document._id)}
            label={document.title}
            icon={FileIcon}
            documentIcon={document.icon}
            active={param.documentID === document._id}
            level={level}
            onExpand={() => onExpand(document._id)}
            expanded={expanded[document._id]}
          />
          {expanded[document._id] && (
            <DocumentList parentDocumentID={document._id} level={level + 1} />
          )}
        </div>
      ))}
    </>
  );
}
