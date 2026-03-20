import * as React from "react";
import { cn } from "@/lib/utils";

const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => {
  return (
    <select
      className={cn(
        "flex h-11 w-full appearance-none rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-emerald/40 focus-visible:border-accent-emerald",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "bg-[length:16px] bg-[position:right_0.75rem_center] bg-no-repeat pr-10",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = "Select";

export { Select };
