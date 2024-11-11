"use client";

import { useCoverImage } from "@/hooks/use-cover-image";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { usePathname } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { SingleImageDropzone } from "../singleImageDrop";

export default function CoverImageModal() {
  const coverImage = useCoverImage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File>();
  const { edgestore } = useEdgeStore();
  const update = useMutation(api.documents.update);

  const pathname = usePathname();

  // Add validation to ensure we have a valid document ID
  const documentId = pathname.split("/").pop();

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  };

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);

      const res = await edgestore.publicFiles.upload({ file });

      await update({
        id: documentId as Id<"documents">,
        coverImage: res.url,
      });

      onClose();
    }
  };

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  );
}
