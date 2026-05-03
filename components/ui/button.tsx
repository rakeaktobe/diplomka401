"use client";

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "default" | "outline" | "ghost" | "link" | "danger" | "glass" | "success";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      default: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 dark:bg-blue-500 dark:hover:bg-blue-600",
      outline: "border border-slate-200 bg-transparent hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-100 dark:hover:bg-slate-800/50",
      ghost: "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800/50 dark:hover:text-slate-100",
      link: "text-blue-600 underline-offset-4 hover:underline dark:text-blue-400 p-0 h-auto",
      danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 dark:bg-red-600 dark:hover:bg-red-700",
      success: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 dark:bg-emerald-600 dark:hover:bg-emerald-700",
      glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 dark:bg-slate-900/40 dark:border-slate-800",
    }

    const sizes = {
      default: "h-11 px-6 py-2",
      sm: "h-9 rounded-xl px-3 text-xs",
      lg: "h-13 rounded-2xl px-10 text-base",
      icon: "h-10 w-10",
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98 }}
        disabled={isLoading || disabled}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-semibold ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          variants[variant as keyof typeof variants],
          sizes[size as keyof typeof sizes],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </motion.button>
    )
  }
)
Button.displayName = "Button"

export { Button }
