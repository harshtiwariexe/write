"use client";

import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { PartialBlock } from "@blocknote/core";
import { useTheme } from "next-themes";
import { useEdgeStore } from "@/lib/edgestore";

interface EditorProps {
  onChange: (value: string) => void;
  initContent?: string;
  editable?: boolean;
}

export default function Editor({
  onChange,
  initContent,
  editable,
}: EditorProps) {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const hanldeUpload = async (file: File) => {
    const res = await edgestore.publicFiles.upload({ file });
    return res.url;
  };

  const editor = useCreateBlockNote({
    initialContent: initContent
      ? (JSON.parse(initContent) as PartialBlock[])
      : undefined,
    uploadFile: hanldeUpload,
  });

  // Use editor.onChange to handle content updates
  editor.onChange(() => {
    onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
  });

  return (
    <div>
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        editable={editable}
      />
    </div>
  );
}
