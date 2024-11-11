"use client";

import IconPicker from "@/components/icon-Picker";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useMutation } from "convex/react";
import { ImageIcon, Smile, X } from "lucide-react";
import React, { ElementRef, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface ToolbarProps {
  initData: Doc<"documents">;
  preview?: boolean;
}

export default function Toolbar({ initData, preview }: ToolbarProps) {
  const inputRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initData?.title);
  const coverImage = useCoverImage();

  const update = useMutation(api.documents.update);
  const removeIcon = useMutation(api.documents.removeIcon);

  const enableInput = () => {
    if (preview) return;

    setIsEditing(true);
    setTimeout(() => {
      setValue(initData?.title);
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => setIsEditing(false);

  const onInput = (value: string) => {
    setValue(value);
    update({
      id: initData._id,
      title: value || "Untitled",
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      disableInput();
    }
  };

  const onIconSelect = (icon: string) => {
    update({
      id: initData._id,
      icon,
    });
  };

  const onRemoveIcon = () => {
    removeIcon({ id: initData._id });
  };

  return (
    <div className="pl-[54px] group relative">
      {!!initData.icon && !preview && (
        <div className="flex items-center group/icon gap-x-2 pt-6">
          <IconPicker onChange={onIconSelect}>
            <p className="text-5xl hover:opacity-75 transition">
              {initData?.icon}
            </p>
          </IconPicker>
          <Button
            onClick={onRemoveIcon}
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
            variant="outline"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {!!initData.icon && preview && (
        <p className="text-5xl pt-6">{initData?.icon}</p>
      )}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!initData.icon && !preview && (
          <IconPicker asChild onChange={onIconSelect}>
            <Button
              className="text-muted-foreground text-xs"
              variant="outline"
              size="sm"
            >
              <Smile className="h-4 w-4 mr-2" /> Add Icon
            </Button>
          </IconPicker>
        )}
        {!initData.coverImage && !preview && (
          <Button
            onClick={coverImage.onOpen}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" /> Add Image
          </Button>
        )}
      </div>
      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(e) => onInput(e.target.value)}
          className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none"
        />
      ) : (
        <div
          onClick={enableInput}
          className="pb-[11px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]"
        >
          {initData.title}
        </div>
      )}
    </div>
  );
}
