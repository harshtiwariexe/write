"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useRef, useState } from "react";

interface TitleProp {
  initData: Doc<"documents">;
}

export default function Title({ initData }: TitleProp) {
  const inputRef = useRef<HTMLInputElement>(null);
  const update = useMutation(api.documents.update);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initData.title || "Untitled");

  const enableInput = () => {
    setTitle(initData.title);
    setIsEditing(true);

    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);

    update({
      id: initData._id,
      title: event.target.value || "Untitled",
    });
  };

  const onPressEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      disableInput();
    }
  };

  return (
    <div className="flex items-center gap-x-1">
      {!!initData.icon && <p>{initData.icon}</p>}
      {isEditing ? (
        <Input
          ref={inputRef}
          onClick={enableInput}
          onBlur={disableInput}
          onChange={onChange}
          onKeyDown={onPressEnter}
          value={title}
          className="h-7 x-2 focus-visible:ring-transparent"
        />
      ) : (
        <Button
          onClick={enableInput}
          variant="ghost"
          size="sm"
          className="font-normal h-auto p-1"
        >
          <span className="truncate">{initData?.title}</span>
        </Button>
      )}
    </div>
  );
}

Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className="h-9 w-16 rounded-md" />;
};
