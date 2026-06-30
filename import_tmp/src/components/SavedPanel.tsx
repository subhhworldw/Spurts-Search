import { useState } from "react";
import { Bookmark, ChevronDown, ChevronUp, Trash2, ExternalLink } from "lucide-react";
import { SearchResult } from "../types";
import { InfoButton } from "./InfoButton";

interface SavedPanelProps {
  savedItems: SearchResult[];
  onRemove: (id: string) => void;
  onSelect: (item: SearchResult) => void;
}

export default function SavedPanel({ savedItems, onRemove, onSelect }: SavedPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full bg-brand-secondary border border-brand-border rounded-2xl shadow-xs mb-6 relative z-30">
      {/* Header Panel */}
      <div
        id="saved-header"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex justify-between items-center px-5 py-4 bg-brand-tertiary cursor-pointer hover:opacity-90 transition-all flex-wrap gap-2 ${
          isOpen ? "rounded-t-2xl" : "rounded-2xl"
        }`}
      >
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-emerald-500 fill-emerald-500" />
          <span className="font-semibold text-sm text-brand-text dark:text-neutral-200">
            Saved entries & structures ({savedItems.length})
          </span>
          <div onClick={(e) => e.stopPropagation()}>
            <InfoButton tipKey="star-save" />
          </div>
        </div>
        <button
          id="saved-toggle"
          aria-label={isOpen ? "Collapse Saved List" : "Expand Saved List"}
          className="p-1 rounded-md text-brand-text-muted dark:text-neutral-400 hover:text-brand-text transition-colors"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Bookmarked Elements */}
      {isOpen && (
        <div id="saved-list" className="p-4 bg-brand-secondary border-t border-brand-border max-h-96 overflow-y-auto rounded-b-2xl">
          {savedItems.length === 0 ? (
            <div className="text-center py-6 text-brand-text-muted dark:text-neutral-400 text-xs font-semibold">
              No saved results yet. Hit the bookmark icon on any search result card to pin it here.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {savedItems.map((item) => {
                let badgeStyle = "";
                if (item.database === "uniprot") {
                  badgeStyle = "bg-purple-100/60 text-purple-700 border-purple-100 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30";
                } else if (item.database === "pdb") {
                  badgeStyle = "bg-amber-100/60 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30";
                } else {
                  // NCBI Databases
                  badgeStyle = "bg-emerald-100/60 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-450 dark:border-emerald-900/30";
                }

                return (
                  <div
                    key={item.id}
                    className="saved-item flex items-start justify-between p-3 border border-brand-border hover:border-indigo-400 dark:hover:border-indigo-600 rounded-xl bg-brand-bg/50 hover:bg-brand-bg relative group transition-all"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                       <div className="flex items-center gap-2 mb-1">
                         <span className={`px-1.5 py-0.5 rounded-md font-mono text-[9px] uppercase font-bold border ${badgeStyle}`}>
                           {item.database === "genbank" ? "GenBank" : item.database}
                         </span>
                        <span className="text-[10px] text-brand-text-muted dark:text-neutral-400 font-semibold">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="saved-item-title text-xs font-semibold text-brand-text dark:text-neutral-200 truncate flex items-center gap-1.5">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline inline-flex items-center gap-1"
                        >
                          {item.title}
                          <ExternalLink className="w-3 h-3 text-neutral-400" />
                        </a>
                      </h4>
                      <div className="saved-item-id font-mono text-[10px] text-brand-text-muted dark:text-neutral-400 bg-brand-tertiary dark:bg-neutral-800 px-1.5 py-0.5 rounded-md inline-block mt-1">
                        ID: {item.id}
                      </div>
                    </div>

                    <button
                      onClick={() => onRemove(item.id)}
                      className="remove-saved p-1.5 rounded-md text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 opacity-80 group-hover:opacity-100 transition-all cursor-pointer"
                      title="Delete bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
