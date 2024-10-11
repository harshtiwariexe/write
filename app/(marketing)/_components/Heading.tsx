"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Heading() {
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Your All-in-One Workspace: Organize, Plan, and Create Seamlessly
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Write is the connected Workspace where <br />
        better, faster work happens.
      </h3>
      <Button>
        Enter Write <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}
