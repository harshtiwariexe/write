"use client";
import { cn } from "@/lib/utils";
import React from "react";
import Image from "next/image"; // Import Image from next/image

interface CoverImageProp {
  url?: string;
  preview?: boolean;
}

export default function Cover({ url, preview }: CoverImageProp) {
  return (
    <div
      className={cn(
        "relative w-full h-[35vh] group",
        !url && "h-[12vh]",
        url && "bg-muted",
      )}
    >
      {url && <Image src={url} fill alt="Cover" className="object-cover" />}
    </div>
  );
}
