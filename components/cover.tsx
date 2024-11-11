"use client";
import { cn } from "@/lib/utils";
import React from "react";
import Image from "next/image"; // Import Image from next/image
import { Button } from "./ui/button";
import { ImageIcon, X } from "lucide-react";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useEdgeStore } from "@/lib/edgestore";
import { Skeleton } from "./ui/skeleton";

interface CoverImageProp {
  url?: string;
  preview?: boolean;
  initData: Doc<"documents">;
}

export default function Cover({ url, preview, initData }: CoverImageProp) {
  const coverImage = useCoverImage();
  const removeImage = useMutation(api.documents.removeImage);
  const { edgestore } = useEdgeStore();

  const onRemoveImage = async () => {
    if (url) {
      await edgestore.publicFiles.delete({
        url: url,
      });
    }
    removeImage({ id: initData._id });
    coverImage.onClose();
  };
  return (
    <div
      className={cn(
        "relative w-full h-[35vh] group",
        !url && "h-[12vh]",
        url && "bg-muted",
      )}
    >
      {url && <Image src={url} fill alt="Cover" className="object-cover" />}
      {url && !preview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            onClick={() => coverImage.onReplace(url)}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Change Cover
          </Button>
          <Button
            onClick={onRemoveImage}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <X className="h-4 w-4 mr-2" />
            Remove Cover
          </Button>
        </div>
      )}
    </div>
  );
}

Cover.Skeleton = function CoverSekelton() {
  return <Skeleton className="w-full h-[12vh]" />;
};
