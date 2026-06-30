import React, { useState } from "react";
import { SearchFilters } from "../types";
import { Filter, ChevronDown, ChevronUp, RefreshCw, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { InfoButton } from "./InfoButton";

interface AdvancedFiltersPanelProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  onReset: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function AdvancedFiltersPanel({
  filters,
  onChange,
  onReset,
  isOpen,
  onToggle,
}: AdvancedFiltersPanelProps) {
  const [activeSection, setActiveSection] = useState<"ncbi" | "uniprot" | "pdb" | null>("ncbi");

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const toggleSection = (section: "ncbi" | "uniprot" | "pdb") => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="w-full">
      {/* Filter Toggle Bar */}
      <div className="flex items-center justify-between p-3.5 bg-brand-secondary border border-brand-border rounded-xl mb-4">
        <div
          role="button"
          tabIndex={0}
          onClick={onToggle}
          onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') onToggle(); }}
          className="flex flex-1 items-center gap-2 text-xs font-bold text-brand-text dark:text-neutral-200 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-sm"
        >
          <Filter className={`w-4 h-4 ${isOpen ? "text-indigo-500 fill-indigo-500/15" : "text-neutral-500"}`} />
          <span>Advanced Filters & Parameters</span>
          <div onClick={(e) => e.stopPropagation()} className="ml-1 -mt-0.5 cursor-default">
            <InfoButton tipKey="filter-database" />
          </div>
          <div className="ml-auto pr-4 flex items-center">
            {isOpen ? <ChevronUp className="w-4 h-4 text-indigo-500 transition-transform" /> : <ChevronDown className="w-4 h-4 text-neutral-500 transition-transform" />}
          </div>
        </div>
        {isOpen && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 cursor-pointer dark:text-rose-400 dark:hover:text-rose-300 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-brand-secondary border border-brand-border rounded-2xl text-left">
              
              {/* NCBI Filters */}
              <div className="space-y-3.5 border-b md:border-b-0 md:border-r border-brand-border/45 pb-4 md:pb-0 md:pr-4">
                <button
                  onClick={() => toggleSection("ncbi")}
                  className="flex items-center justify-between w-full text-xs font-extrabold text-indigo-600 dark:text-indigo-450 uppercase tracking-wider mb-2"
                >
                  <span>NCBI GenBank Filters</span>
                  <span className="text-[10px] lowercase font-normal text-neutral-400">collapsible</span>
                </button>
                
                <div className="space-y-3">
                  <div>
                    <label className="flex items-center text-[10.5px] font-bold text-brand-text-secondary dark:text-neutral-450 uppercase mb-1">
                      Target Organism
                      <InfoButton tipKey="filter-organism" />
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Homo sapiens"
                      value={filters.ncbiOrganism}
                      onChange={(e) => updateFilter("ncbiOrganism", e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-brand-border rounded-lg bg-brand-bg text-brand-text placeholder-neutral-400 focus:outline-hidden focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="flex items-center text-[10.5px] font-bold text-brand-text-secondary dark:text-neutral-450 uppercase mb-1">
                        Min Length (bp)
                        <InfoButton tipKey="filter-length" />
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={filters.ncbiMinLength}
                        onChange={(e) => updateFilter("ncbiMinLength", e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-brand-border rounded-lg bg-brand-bg text-brand-text placeholder-neutral-400 focus:outline-hidden focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-[10.5px] font-bold text-brand-text-secondary dark:text-neutral-450 uppercase mb-1">
                        Max Length (bp)
                        <InfoButton tipKey="filter-length" />
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 5000"
                        value={filters.ncbiMaxLength}
                        onChange={(e) => updateFilter("ncbiMaxLength", e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-brand-border rounded-lg bg-brand-bg text-brand-text placeholder-neutral-400 focus:outline-hidden focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center text-[10.5px] font-bold text-brand-text-secondary dark:text-neutral-450 uppercase mb-1">
                      Molecule Type
                      <InfoButton tipKey="filter-database" />
                    </label>
                    <select
                      value={filters.ncbiMoleculeType}
                      onChange={(e) => updateFilter("ncbiMoleculeType", e.target.value)}
                      className="w-full text-xs px-2 py-1.5 border border-brand-border rounded-lg bg-brand-bg text-brand-text focus:outline-hidden focus:border-indigo-500 transition-colors"
                    >
                      <option value="all">All Molecular Types</option>
                      <option value="genomic dna">Genomic DNA</option>
                      <option value="mrna">mRNA / Transcript</option>
                      <option value="rna">Other RNA Seq</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="flex items-center text-[10.5px] font-bold text-brand-text-secondary dark:text-neutral-450 uppercase mb-1">
                        Start Year
                        <InfoButton tipKey="filter-date" />
                      </label>
                      <input
                        type="number"
                        placeholder="1980"
                        value={filters.ncbiMinYear}
                        onChange={(e) => updateFilter("ncbiMinYear", e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-brand-border rounded-lg bg-brand-bg text-brand-text placeholder-neutral-400 focus:outline-hidden focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-[10.5px] font-bold text-brand-text-secondary dark:text-neutral-450 uppercase mb-1">
                        End Year
                        <InfoButton tipKey="filter-date" />
                      </label>
                      <input
                        type="number"
                        placeholder="2026"
                        value={filters.ncbiMaxYear}
                        onChange={(e) => updateFilter("ncbiMaxYear", e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-brand-border rounded-lg bg-brand-bg text-brand-text placeholder-neutral-400 focus:outline-hidden focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* UniProt Filters */}
              <div className="space-y-3.5 border-b md:border-b-0 md:border-r border-brand-border/45 pb-4 md:pb-0 md:px-4">
                <button
                  onClick={() => toggleSection("uniprot")}
                  className="flex items-center justify-between w-full text-xs font-extrabold text-purple-600 dark:text-purple-450 uppercase tracking-wider mb-2"
                >
                  <span>UniProt KB Filters</span>
                  <span className="text-[10px] lowercase font-normal text-neutral-400">collapsible</span>
                </button>
                
                <div className="space-y-3">
                  <div>
                    <label className="flex items-center text-[10.5px] font-bold text-brand-text-secondary dark:text-neutral-450 uppercase mb-1">
                      Annotation Review Status
                      <InfoButton tipKey="filter-reviewed" />
                    </label>
                    <div className="flex gap-1.5">
                      {(["all", "reviewed", "unreviewed"] as const).map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => updateFilter("uniprotReviewed", status)}
                          className={`flex-1 text-[10px] font-bold py-1 px-1.5 border rounded-lg capitalize cursor-pointer transition-colors ${
                            filters.uniprotReviewed === status
                              ? "bg-purple-100/60 text-purple-800 border-purple-300 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/60"
                              : "bg-brand-bg text-brand-text-secondary border-brand-border hover:bg-brand-tertiary"
                          }`}
                        >
                          {status === "all" ? "Both" : status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center text-[10.5px] font-bold text-brand-text-secondary dark:text-neutral-450 uppercase mb-1">
                      Source Organism
                      <InfoButton tipKey="filter-organism" />
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mouse / Human"
                      value={filters.uniprotOrganism}
                      onChange={(e) => updateFilter("uniprotOrganism", e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-brand-border rounded-lg bg-brand-bg text-brand-text placeholder-neutral-400 focus:outline-hidden focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-[10.5px] font-bold text-brand-text-secondary dark:text-neutral-450 uppercase mb-1">
                      Gene Name / Symbol
                      <InfoButton tipKey="search-bar" />
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BRCA1"
                      value={filters.uniprotGeneName}
                      onChange={(e) => updateFilter("uniprotGeneName", e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-brand-border rounded-lg bg-brand-bg text-brand-text placeholder-neutral-400 focus:outline-hidden focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-[10.5px] font-bold text-brand-text-secondary dark:text-neutral-450 uppercase mb-1">
                      Min Annotation Score ({filters.uniprotMinScore}/5)
                      <InfoButton tipKey="sort-results" />
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={filters.uniprotMinScore}
                      onChange={(e) => updateFilter("uniprotMinScore", parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-neutral-250 rounded-lg appearance-none cursor-pointer accent-purple-600 dark:bg-neutral-800"
                    />
                    <div className="flex justify-between text-[9px] font-semibold text-brand-text-muted mt-1">
                      <span>1 (Low)</span>
                      <span>3 (Med)</span>
                      <span>5 (High)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* PDB Filters */}
              <div className="space-y-3.5 pb-2 md:pb-0 md:pl-4">
                <button
                  onClick={() => toggleSection("pdb")}
                  className="flex items-center justify-between w-full text-xs font-extrabold text-amber-600 dark:text-amber-450 uppercase tracking-wider mb-2"
                >
                  <span>RCSB PDB Filters</span>
                  <span className="text-[10px] lowercase font-normal text-neutral-400">collapsible</span>
                </button>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="flex items-center text-[10.5px] font-bold text-brand-text-secondary dark:text-neutral-450 uppercase mb-1">
                        Min Res (Å)
                        <InfoButton tipKey="filter-resolution" />
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="0.5"
                        value={filters.pdbMinResolution}
                        onChange={(e) => updateFilter("pdbMinResolution", e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-brand-border rounded-lg bg-brand-bg text-brand-text placeholder-neutral-400 focus:outline-hidden focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-[10.5px] font-bold text-brand-text-secondary dark:text-neutral-450 uppercase mb-1">
                        Max Res (Å)
                        <InfoButton tipKey="filter-resolution" />
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="3.5"
                        value={filters.pdbMaxResolution}
                        onChange={(e) => updateFilter("pdbMaxResolution", e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-brand-border rounded-lg bg-brand-bg text-brand-text placeholder-neutral-400 focus:outline-hidden focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center text-[10.5px] font-bold text-brand-text-secondary dark:text-neutral-450 uppercase mb-1">
                      Experimental Method
                      <InfoButton tipKey="filter-database" />
                    </label>
                    <select
                      value={filters.pdbExperimentalMethod}
                      onChange={(e) => updateFilter("pdbExperimentalMethod", e.target.value)}
                      className="w-full text-xs px-2 py-1.5 border border-brand-border rounded-lg bg-brand-bg text-brand-text focus:outline-hidden focus:border-indigo-500 transition-colors"
                    >
                      <option value="all">All Methods</option>
                      <option value="x-ray diffraction">X-Ray Diffraction</option>
                      <option value="electron microscopy">Cryo-EM</option>
                      <option value="solution nmr">NMR</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="flex items-center text-[10.5px] font-bold text-brand-text-secondary dark:text-neutral-450 uppercase mb-1">
                        Min Chains
                        <InfoButton tipKey="filter-length" />
                      </label>
                      <input
                        type="number"
                        placeholder="1"
                        value={filters.pdbMinChains}
                        onChange={(e) => updateFilter("pdbMinChains", e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-brand-border rounded-lg bg-brand-bg text-brand-text placeholder-neutral-400 focus:outline-hidden focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-[10.5px] font-bold text-brand-text-secondary dark:text-neutral-450 uppercase mb-1">
                        Max Chains
                        <InfoButton tipKey="filter-length" />
                      </label>
                      <input
                        type="number"
                        placeholder="24"
                        value={filters.pdbMaxChains}
                        onChange={(e) => updateFilter("pdbMaxChains", e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-brand-border rounded-lg bg-brand-bg text-brand-text placeholder-neutral-400 focus:outline-hidden focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="flex items-center text-[10.5px] font-bold text-brand-text-secondary dark:text-neutral-450 uppercase mb-1">
                        Start Year
                        <InfoButton tipKey="filter-date" />
                      </label>
                      <input
                        type="number"
                        placeholder="1971"
                        value={filters.pdbMinYear}
                        onChange={(e) => updateFilter("pdbMinYear", e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-brand-border rounded-lg bg-brand-bg text-brand-text placeholder-neutral-400 focus:outline-hidden focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-[10.5px] font-bold text-brand-text-secondary dark:text-neutral-450 uppercase mb-1">
                        End Year
                        <InfoButton tipKey="filter-date" />
                      </label>
                      <input
                        type="number"
                        placeholder="2026"
                        value={filters.pdbMaxYear}
                        onChange={(e) => updateFilter("pdbMaxYear", e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-brand-border rounded-lg bg-brand-bg text-brand-text placeholder-neutral-400 focus:outline-hidden focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
