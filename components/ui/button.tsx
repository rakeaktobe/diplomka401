import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "danger";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            // default — filled blue
            "bg-blue-600 text-white hover:bg-blue-700 shadow dark:bg-blue-500 dark:hover:bg-blue-600":
              variant === "default",
            // outline
            "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800":
              variant === "outline",
            // ghost
            "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100":
              variant === "ghost",
            // link
            "text-blue-600 underline-offset-4 hover:underline dark:text-blue-400":
              variant === "link",
            // danger
            "bg-red-600 text-white hover:bg-red-700 shadow dark:bg-red-500 dark:hover:bg-red-600":
              variant === "danger",
            // sizes
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-md px-3": size === "sm",
            "h-11 rounded-md px-8": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
