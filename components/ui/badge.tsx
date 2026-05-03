import * as React from "react"
import { cn } from "@/lib/utils"

type BadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "success" | "warning" | "error" | "secondary" | "outline" | "blue";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-slate-900 text-slate-50 dark:bg-slate-100 dark:text-slate-900 shadow-sm",
    secondary: "border-transparent bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-300",
    blue: "border-transparent bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    success: "border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    warning: "border-transparent bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    error: "border-transparent bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    outline: "text-slate-950 dark:text-slate-100 border-slate-200 dark:border-slate-800",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] md:text-xs font-bold transition-all uppercase tracking-wider",
        variants[variant as keyof typeof variants],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
