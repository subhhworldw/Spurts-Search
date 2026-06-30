import { motion } from "motion/react";

interface StatusBadgeProps {
  key?: string | number;
  db: string;
  status: "ok" | "error" | "loading" | null;
  className?: string;
}

export default function StatusBadge({ db, status, className = "" }: StatusBadgeProps) {
  if (!status) return null;

  let statusColor = "bg-neutral-500/5 text-neutral-600 dark:bg-neutral-500/10 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800";
  let dotColor = "bg-neutral-400";
  let pulseColor = "bg-neutral-400/40";
  
  if (status === "loading") {
    statusColor = "bg-amber-500/5 text-amber-700 dark:bg-amber-400/5 dark:text-amber-400 border-amber-200/60 dark:border-amber-900/40";
    dotColor = "bg-amber-500";
    pulseColor = "bg-amber-400/40";
  } else if (status === "ok") {
    statusColor = "bg-emerald-500/5 text-emerald-800 dark:bg-emerald-400/5 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/40";
    dotColor = "bg-emerald-500";
    pulseColor = "bg-emerald-400/40";
  } else if (status === "error") {
    statusColor = "bg-rose-500/5 text-rose-700 dark:bg-rose-400/5 dark:text-rose-400 border-rose-200/60 dark:border-rose-900/40";
    dotColor = "bg-rose-500";
    pulseColor = "bg-rose-400/40";
  }

  const displayName = db === "genbank" ? "GenBank" : db;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85, y: 3 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      whileHover={{ scale: 1.02, y: -0.5 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 18
      }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono font-bold text-[10px] uppercase tracking-wider border shadow-xs hover:shadow-sm transition-all duration-200 cursor-default select-none ${statusColor} ${className}`}
    >
      <span className="relative flex h-2 w-2 items-center justify-center">
        {status === "loading" && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${pulseColor} opacity-75`}></span>
        )}
        {status === "ok" && (
          <span className={`absolute inline-flex h-full w-full rounded-full ${pulseColor} opacity-50`}></span>
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dotColor}`}></span>
      </span>
      {displayName}
    </motion.span>
  );
}

