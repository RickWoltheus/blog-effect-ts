import { cn } from "@/lib/utils";
import React from "react";

export const BrutalistClickArea = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div className="rounded-md bg-black h-full">
    <div
      ref={ref}
      className={cn(
        `block -translate-x-2 -translate-y-2 rounded-md border-2 h-full bg-white border-black p-4 text-2xl hover:-translate-y-3 
      active:translate-x-0 active:translate-y-0
      transition-all z-10`,
      )}
    >
      {props.children}
    </div>
  </div>
));
BrutalistClickArea.displayName = "BrutalistClickArea";
