"use client";

import { useTheme } from "next-themes";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface IconPickerProp {
  onChange: (icon: string) => void;
  children: React.ReactNode;
  asChild?: boolean;
}

export default function IconPicker({
  onChange,
  children,
  asChild,
}: IconPickerProp) {
  const ThemeMap = {
    dark: Theme.DARK,
    light: Theme.LIGHT,
  };
  const { resolvedTheme } = useTheme();
  const currentTheme = (resolvedTheme || "light") as keyof typeof ThemeMap;
  const theme = ThemeMap[currentTheme];

  return (
    <Popover>
      <PopoverTrigger asChild={asChild}>{children}</PopoverTrigger>
      <PopoverContent className="p-0 border-none shadow-none w-full">
        <EmojiPicker
          height={350}
          theme={theme}
          onEmojiClick={(data) => onChange(data?.emoji)}
        />
      </PopoverContent>
    </Popover>
  );
}
