import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Database, Dna, Activity } from "lucide-react";
import { ApiStatusMap } from "../types";

interface SearchStatusProps {
  apiStatus: ApiStatusMap;
  isSearching: boolean;
}

export default function SearchStatus({ apiStatus, isSearching }: SearchStatusProps) {
  const [activeMessage, setActiveMessage] = useState("Initializing query...");
  const [activeIcon, setActiveIcon] = useState<React.ReactNode>(<Loader2 className="w-4 h-4 animate-spin" />);

  useEffect(() => {
    if (!isSearching) return;

    if (apiStatus.uniprot === "loading") {
      setActiveMessage("Fetching UniProt annotations...");
      setActiveIcon(<Activity className="w-4 h-4 animate-pulse text-purple-400" />);
    } else if (apiStatus.nucleotide === "loading" || apiStatus.protein === "loading") {
      setActiveMessage("Querying NCBI GenBank...");
      setActiveIcon(<Dna className="w-4 h-4 animate-pulse text-emerald-400" />);
    } else if (apiStatus.pdb === "loading") {
      setActiveMessage("Retrieving PDB 3D structures...");
      setActiveIcon(<Database className="w-4 h-4 animate-pulse text-amber-400" />);
    } else {
      setActiveMessage("Aggregating biological data...");
      setActiveIcon(<Loader2 className="w-4 h-4 animate-spin text-indigo-400" />);
    }
  }, [apiStatus, isSearching]);

  return (
    <AnimatePresence>
      {isSearching && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="w-full flex items-center justify-center my-6"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-3 px-5 py-2.5 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-full shadow-xs">
            <div className="text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              {activeIcon}
            </div>
            <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
              {activeMessage}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
