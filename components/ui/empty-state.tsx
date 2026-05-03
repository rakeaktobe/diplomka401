"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Button } from "./button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800"
    >
      <div className="p-4 rounded-full bg-slate-50 dark:bg-slate-900 mb-4">
        <Icon className="w-12 h-12 text-slate-400 dark:text-slate-600" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-xs mb-6">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick} variant="default" className="bg-blue-600 hover:bg-blue-700">
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}
