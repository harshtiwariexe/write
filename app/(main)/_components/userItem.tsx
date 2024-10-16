"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { ChevronsLeftRightIcon } from "lucide-react";
import React from "react";

function UserItem() {
  const { user } = useUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          role="button"
          className="flex items-center text-sm p-3 w-full hover:bg-primary/5"
        >
          <div className="flex gap-x-2 items-center  max-w-[150px]">
            <Avatar className="h-6 w-6">
              <AvatarImage src={user?.imageUrl} className="rounded-full" />
            </Avatar>
            <span className="text-start font-medium line-clamp-1">
              {user?.fullName}&apos;s Write
            </span>
          </div>
          <ChevronsLeftRightIcon className="rotate-90 ml-2 text-muted-foreground h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80 md:w-96 p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800"
        forceMount
        align="start"
        alignOffset={11}
      >
        <div className="flex flex-col p-2 space-y-4">
          <p className="text-xs font-medium leading-none text-gray-500 dark:text-gray-400 truncate">
            {user?.emailAddresses[0].emailAddress}
          </p>

          <div className="flex items-center gap-x-3">
            {/* User Avatar */}
            <div className="rounded-full bg-secondary p-1">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user?.imageUrl}
                  className="rounded-full object-cover"
                  loading="lazy"
                  alt="User Avatar"
                  width={32}
                  height={32} // Fixed size for the image
                />
              </Avatar>
            </div>

            <div className="space-y-1">
              {/* User Full Name */}
              <p className="text-sm font-medium line-clamp-1">
                {user?.fullName}&apos;s Account
              </p>
            </div>
          </div>

          {/* Additional Options */}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          asChild
          className="w-full cursor-pointer text-muted-foreground"
        >
          <SignOutButton>Sign Out</SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserItem;
