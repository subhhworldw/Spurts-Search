import { Dna, Database, Github, Linkedin } from "lucide-react";
import { motion } from "motion/react";

interface HeaderProps {
  apiStatus: Record<string, "ok" | "error" | "loading" | null>;
}

export default function Header({ apiStatus }: HeaderProps) {
  return (
    <header className="hero-entrance flex flex-col md:flex-row justify-between items-start md:items-center py-6 border-b border-brand-border mb-8 gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 shadow-sm animate-pulse">
          <Dna className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-sans tracking-tight text-brand-text dark:text-neutral-50">
              Spurt
            </h1>
          </div>
          <p className="text-sm text-brand-text-secondary dark:text-neutral-400 max-w-xl font-sans mt-0.5 font-medium">
            Unified biological search across reliable genomic & structural databases
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 self-stretch md:self-auto justify-end md:justify-end ml-auto md:ml-0 mt-2 md:mt-4 md:translate-y-[1px]">
        <motion.a
          href="https://github.com/subhhworldw/Spurt-Search"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-border bg-brand-bg hover:bg-neutral-100 dark:hover:bg-neutral-900 text-brand-text hover:text-indigo-600 dark:hover:text-indigo-400 transition-all text-xs font-bold shadow-xs cursor-pointer"
        >
          <Github className="w-3.5 h-3.5" />
          GitHub
        </motion.a>
        <motion.a
          href="https://www.linkedin.com/in/subhh-worldw/"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-border bg-brand-bg hover:bg-neutral-100 dark:hover:bg-neutral-900 text-brand-text hover:text-indigo-600 dark:hover:text-indigo-400 transition-all text-xs font-bold shadow-xs cursor-pointer"
        >
          <Linkedin className="w-3.5 h-3.5" />
          LinkedIn
        </motion.a>
      </div>
    </header>
  );
}
