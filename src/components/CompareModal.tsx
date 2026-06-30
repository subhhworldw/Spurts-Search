import React from "react";
import { SearchResult } from "../types";
import { X, Check, ArrowRightLeft, FileDown, Layers } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CompareModalProps {
  items: SearchResult[];
  onClose: () => void;
  onRemoveItem: (id: string) => void;
}

export default function CompareModal({ items, onClose, onRemoveItem }: CompareModalProps) {
  if (items.length === 0) return null;

  // Determine if all values in a specific property row differ
  const doesDiffer = (key: keyof SearchResult) => {
    if (items.length < 2) return false;
    const firstVal = String(items[0][key] ?? "").toLowerCase().trim();
    return items.some(item => String(item[key] ?? "").toLowerCase().trim() !== firstVal);
  };

  const handleExportFASTA = () => {
    let fastaText = "";
    items.forEach(item => {
      const seq = item.sequence || "MOCKSEQUENCEPEPTIDESTRINGREPRESENTATIONFORHIGHLIGHT";
      fastaText += `>${item.id} | ${item.title} [${item.organism || "Unknown Organism"}]\n${(seq.match(/.{1,60}/g) || [seq]).join("\n")}\n\n`;
    });

    const blob = new Blob([fastaText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `spurt_compare_export.fasta`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-6xl bg-brand-secondary border border-brand-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-left"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-brand-border bg-brand-tertiary">
          <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400">
            <ArrowRightLeft className="w-5 h-5" />
            <h2 className="text-base sm:text-lg font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Biomolecular Entry Comparison ({items.length} Selected)
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportFASTA}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export Batch FASTA</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg cursor-pointer transition-colors text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Matrix */}
        <div className="flex-1 overflow-auto p-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border border-brand-border/60 rounded-xl overflow-hidden bg-brand-bg/20">
            
            {/* Field Labels Column */}
            <div className="hidden md:flex flex-col border-r border-brand-border bg-brand-tertiary/40">
              <div className="h-[96px] p-4 flex items-end border-b border-brand-border">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Features Comparison</span>
              </div>
              <div className="p-4 border-b border-brand-border min-h-[58px] flex items-center">
                <span className="text-xs font-bold text-brand-text-secondary uppercase">Database</span>
              </div>
              <div className="p-4 border-b border-brand-border min-h-[58px] flex items-center">
                <span className="text-xs font-bold text-brand-text-secondary uppercase">Accession ID</span>
              </div>
              <div className="p-4 border-b border-brand-border min-h-[58px] flex items-center">
                <span className="text-xs font-bold text-brand-text-secondary uppercase">Taxon / Organism</span>
              </div>
              <div className="p-4 border-b border-brand-border min-h-[58px] flex items-center">
                <span className="text-xs font-bold text-brand-text-secondary uppercase">Sequence Length</span>
              </div>
              <div className="p-4 border-b border-brand-border min-h-[58px] flex items-center">
                <span className="text-xs font-bold text-brand-text-secondary uppercase">Method / Res (PDB)</span>
              </div>
              <div className="p-4 border-b border-brand-border min-h-[96px] flex items-start">
                <span className="text-xs font-bold text-brand-text-secondary uppercase">Description / Abstract</span>
              </div>
            </div>

            {/* Compared Items Columns */}
            {items.map((item, index) => {
              let badgeColor = "bg-emerald-100/60 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400";
              if (item.database === "uniprot") badgeColor = "bg-purple-100/60 text-purple-800 dark:bg-purple-950/30 dark:text-purple-400";
              if (item.database === "pdb") badgeColor = "bg-amber-100/60 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400";

              return (
                <div key={item.id} className="flex flex-col border-b md:border-b-0 md:border-r border-brand-border last:border-r-0 relative bg-brand-secondary">
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="absolute top-2 right-2 p-1 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-500 rounded-full cursor-pointer transition-colors"
                    title="Remove from comparison"
                  >
                    <X className="w-3 h-3" />
                  </button>

                  {/* Header / Title */}
                  <div className="h-[96px] p-4 flex flex-col justify-end border-b border-brand-border bg-brand-tertiary/10">
                    <span className={`inline-block font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase mb-1.5 border w-max ${badgeColor}`}>
                      {item.database}
                    </span>
                    <h3 className="text-xs font-bold text-neutral-900 dark:text-white line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  {/* Database Row */}
                  <div className={`p-4 border-b border-brand-border min-h-[58px] flex items-center text-xs font-semibold text-brand-text ${doesDiffer("database") ? "bg-amber-500/5" : ""}`}>
                    <span className="md:hidden font-bold text-[10px] text-neutral-400 mr-2 uppercase">Database:</span>
                    <span className="capitalize">{item.database}</span>
                    {doesDiffer("database") && <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-amber-500" title="Values differ" />}
                  </div>

                  {/* Accession ID Row */}
                  <div className={`p-4 border-b border-brand-border min-h-[58px] flex items-center text-xs font-mono text-brand-text ${doesDiffer("id") ? "bg-amber-500/5" : ""}`}>
                    <span className="md:hidden font-bold text-[10px] text-neutral-400 mr-2 uppercase">Accession ID:</span>
                    <span className="bg-brand-tertiary px-1.5 py-0.5 rounded font-bold text-indigo-600 dark:text-indigo-400">{item.id}</span>
                  </div>

                  {/* Organism Row */}
                  <div className={`p-4 border-b border-brand-border min-h-[58px] flex items-center text-xs font-medium text-brand-text italic ${doesDiffer("organism") ? "bg-amber-500/5" : ""}`}>
                    <span className="md:hidden font-bold text-[10px] text-neutral-400 mr-2 uppercase">Organism:</span>
                    <span>{item.organism || "Unknown / Non-cellular"}</span>
                    {doesDiffer("organism") && <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-amber-500" title="Values differ" />}
                  </div>

                  {/* Sequence Length Row */}
                  <div className={`p-4 border-b border-brand-border min-h-[58px] flex items-center text-xs font-semibold text-brand-text ${doesDiffer("sequenceLength") ? "bg-amber-500/5" : ""}`}>
                    <span className="md:hidden font-bold text-[10px] text-neutral-400 mr-2 uppercase">Length:</span>
                    <span>{item.sequenceLength ? `${item.sequenceLength.toLocaleString()} ${item.database === "uniprot" ? "aa" : "bp"}` : "N/A"}</span>
                    {doesDiffer("sequenceLength") && <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-amber-500" title="Values differ" />}
                  </div>

                  {/* Method / Resolution Row */}
                  <div className={`p-4 border-b border-brand-border min-h-[58px] flex items-center text-xs font-semibold text-brand-text ${doesDiffer("resolution") ? "bg-amber-500/5" : ""}`}>
                    <span className="md:hidden font-bold text-[10px] text-neutral-400 mr-2 uppercase">Structure Details:</span>
                    <span>
                      {item.database === "pdb"
                        ? `${item.experimentalMethod || "X-Ray"} (${item.resolution ? `${item.resolution} Å` : "N/A"})`
                        : "N/A (Sequence Entry)"}
                    </span>
                    {doesDiffer("resolution") && <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-amber-500" title="Values differ" />}
                  </div>

                  {/* Description Row */}
                  <div className={`p-4 border-b border-brand-border md:border-b-0 min-h-[96px] text-xs text-brand-text-secondary leading-relaxed ${doesDiffer("description") ? "bg-amber-500/5" : ""}`}>
                    <span className="md:hidden font-bold text-[10px] text-neutral-400 block mb-1 uppercase">Description:</span>
                    <p className="line-clamp-4 font-sans font-medium">{item.description}</p>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-brand-border bg-brand-tertiary flex items-center justify-between text-[11px] text-brand-text-muted font-bold">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Rows with differences are highlighted in soft yellow.</span>
          </span>
          <span>Press ESC to close comparison</span>
        </div>
      </motion.div>
    </div>
  );
}
