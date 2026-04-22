import * as React from "react"
import { cn } from "@/lib/utils"

type BadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "success" | "warning" | "error" | "secondary" | "outline";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
        {
          // default — dark slate
          "border-transparent bg-slate-900 text-slate-50 dark:bg-slate-100 dark:text-slate-900":
            variant === "default",
          // secondary — light gray
          "border-transparent bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100":
            variant === "secondary",
          // success — green
          "border-transparent bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300":
            variant === "success",
          // warning — yellow
          "border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300":
            variant === "warning",
          // error — red
          "border-transparent bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300":
            variant === "error",
          // outline
          "text-slate-950 dark:text-slate-100":
            variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
