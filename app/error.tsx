"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function Error() {
  return (
    <div className="hh-full flex items-center flex-col justify-center">
      <h2>Something went wrong!!!</h2>
      <Button asChild>
        <Link href="/documents">Home</Link>
      </Button>
    </div>
  );
}
