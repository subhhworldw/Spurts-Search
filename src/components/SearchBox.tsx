import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Flame,
  Clock,
  Trash2,
  Database,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Layers,
  Keyboard,
} from "lucide-react";
import { HistoryItem } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { validateQuery } from "../utils/security";
import { InfoButton } from "./InfoButton";

export const NCBI_DATABASES = [
  { id: "assembly", name: "Assembly", desc: "Genomic assemblies" },
  {
    id: "biocollections",
    name: "Biocollections",
    desc: "Museum & biorepositories",
  },
  { id: "bioproject", name: "BioProject", desc: "Biological projects" },
  { id: "biosample", name: "BioSample", desc: "Sample descriptions" },
  { id: "books", name: "Books", desc: "Biomedical literature books" },
  { id: "clinvar", name: "ClinVar", desc: "Clinical human variation" },
  { id: "cdd", name: "Conserved Domains", desc: "Conserved protein domains" },
  { id: "gap", name: "dbGaP", desc: "Genotypes & Phenotypes" },
  { id: "dbvar", name: "dbVar", desc: "Structural genomic variations" },
  { id: "gene", name: "Gene", desc: "Gene-centered genomic info" },
  { id: "genome", name: "Genome", desc: "Whole genome sequence data" },
  { id: "gds", name: "GEO DataSets", desc: "Expression datasets (GEO)" },
  {
    id: "geoprofiles",
    name: "GEO Profiles",
    desc: "Expression profiles (GEO)",
  },
  { id: "gtr", name: "GTR", desc: "Genetic Testing Registry" },
  {
    id: "ipg",
    name: "Identical Protein Groups",
    desc: "Identical protein sequences",
  },
  { id: "medgen", name: "MedGen", desc: "Medical genetics information" },
  { id: "mesh", name: "MeSH", desc: "Medical Subject Headings" },
  { id: "nlmcatalog", name: "NLM Catalog", desc: "NLM bibliographies" },
  { id: "nucleotide", name: "Nucleotide", desc: "GenBank/RefSeq sequences" },
  { id: "omim", name: "OMIM", desc: "Mendelian genes & diseases" },
  { id: "pmc", name: "PMC", desc: "PubMed Central full-text papers" },
  { id: "protein", name: "Protein", desc: "Protein sequence data" },
  {
    id: "proteinclusters",
    name: "Protein Clusters",
    desc: "Highly similar proteins",
  },
  {
    id: "sparcle",
    name: "Protein Family Models",
    desc: "Functional protein families",
  },
  {
    id: "pcassay",
    name: "PubChem BioAssay",
    desc: "Chemical bioactivity screens",
  },
  {
    id: "pccompound",
    name: "PubChem Compound",
    desc: "Validated chemical structures",
  },
  {
    id: "pcsubstance",
    name: "PubChem Substance",
    desc: "Deposited chemical records",
  },
  { id: "pubmed", name: "PubMed", desc: "Literature citation abstracts" },
  { id: "snp", name: "SNP", desc: "Single nucleotide variations" },
  { id: "sra", name: "SRA", desc: "Raw sequence reads archives" },
  { id: "structure", name: "Structure", desc: "Macromolecular 3D structures" },
  { id: "taxonomy", name: "Taxonomy", desc: "Lineages & classification" },
  { id: "toolkit", name: "ToolKit", desc: "NCBI software tools" },
  {
    id: "toolkitall",
    name: "ToolKitAll",
    desc: "Vast toolkit index resources",
  },
  {
    id: "toolkitbookgh",
    name: "ToolKitBookgh",
    desc: "Developer reference books",
  },
];

interface SearchBoxProps {
  onSearch: (query: string, dbs: Record<string, boolean>) => void;
  onBatchSearch?: (queries: string[], dbs: Record<string, boolean>) => void;
  isBatchMode: boolean;
  setIsBatchMode: (mode: boolean) => void;
  searchHistory: HistoryItem[];
  onClearHistory: () => void;
  onSelectHistory: (query: string) => void;
  isLoading: boolean;
}

const PRESETS = [
  "BRCA2",
  "insulin",
  "p53",
  "hemoglobin",
  "ACE2",
  "tau protein",
];

export default function SearchBox({
  onSearch,
  onBatchSearch,
  isBatchMode,
  setIsBatchMode,
  searchHistory,
  onClearHistory,
  onSelectHistory,
  isLoading,
}: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [batchInput, setBatchInput] = useState("");
  const [isNcbiExpanded, setIsNcbiExpanded] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [isClearingShaking, setIsClearingShaking] = useState(false);

  // Autocomplete Suggestions State
  const [suggestions, setSuggestions] = useState<
    { value: string; source: string }[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Rotating placeholder
  const placeholders = [
    "BRCA2",
    "insulin human",
    "tumor suppressor",
    "p53 crystal structure",
    "breast cancer protein",
    "DNA repair enzyme",
    "Alzheimer's related protein",
    "photosynthesis enzyme",
    "spike protein coronavirus",
    "kinase mouse",
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const [dbs, setDbs] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {
      uniprot: true,
      pdb: true,
      nucleotide: true,
    };
    NCBI_DATABASES.forEach((db) => {
      if (db.id !== "nucleotide") {
        initial[db.id] = false;
      }
    });
    return initial;
  });

  // Debounce autocomplete suggestions
  useEffect(() => {
    if (isBatchMode || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const handler = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        const term = query.trim();

        // Fetch from UniProt
        const uniprotPromise = fetch(
          `https://rest.uniprot.org/uniprotkb/search?query=${encodeURIComponent(
            term,
          )}&format=json&size=3`,
        )
          .then((r) => r.json())
          .then((data) => {
            const list = data?.results || [];
            return list
              .map((item: any) => {
                const val = item.uniProtkbId || item.primaryAccession || "";
                return { value: val, source: "UniProt" };
              })
              .filter((item: any) => !!item.value);
          })
          .catch(() => []);

        // Fetch from NCBI (Spell Check)
        const ncbiPromise = fetch(
          `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/espell.fcgi?db=protein&term=${encodeURIComponent(
            term,
          )}&retmode=json`,
        )
          .then((r) => r.json())
          .then((data) => {
            const corrected = data?.esearchresult?.spelledquery;
            if (corrected && corrected.toLowerCase() !== term.toLowerCase()) {
              return [{ value: corrected, source: "GenBank Check" }];
            }
            return [];
          })
          .catch(() => []);

        const [uniprotHits, ncbiHits] = await Promise.all([
          uniprotPromise,
          ncbiPromise,
        ]);

        // Combine suggestions
        const combined = [...uniprotHits.slice(0, 3), ...ncbiHits.slice(0, 3)];
        // De-duplicate values case-insensitively
        const unique = combined.filter(
          (v, i, a) =>
            a.findIndex(
              (t) => t.value.toLowerCase() === v.value.toLowerCase(),
            ) === i,
        );
        setSuggestions(unique);
      } catch (err) {
        console.warn("Autocomplete fetch failed:", err);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query, isBatchMode]);

  // Click-away listener to hide autocomplete suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut: Ctrl+K or / to focus search box
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "/" &&
          document.activeElement !== inputRef.current &&
          document.activeElement?.tagName !== "TEXTAREA") ||
        (e.key === "k" && (e.ctrlKey || e.metaKey))
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
      if (e.key === "Escape") {
        setShowSuggestions(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isBatchMode) {
      handleBatchSubmit();
      return;
    }

    const trimmed = query.trim();
    if (!trimmed) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 350);
      return;
    }

    const check = validateQuery(trimmed);
    if (!check.isValid) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 350);
    }

    if (trimmed && !isLoading) {
      setShowSuggestions(false);
      onSearch(trimmed, dbs);
    }
  };

  const handleBatchSubmit = () => {
    const lines = batchInput
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 350);
      return;
    }

    if (onBatchSearch && !isLoading) {
      onBatchSearch(lines, dbs);
    }
  };

  const handleSelectSuggestion = (val: string) => {
    setQuery(val);
    setShowSuggestions(false);
    onSearch(val, dbs);
  };

  const handleClearClick = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setIsClearingShaking(true);
      setTimeout(() => setIsClearingShaking(false), 350);
      const timer = setTimeout(() => setConfirmClear(false), 4000);
      return () => clearTimeout(timer);
    } else {
      onClearHistory();
      setConfirmClear(false);
    }
  };

  const handleCheckboxChange = (db: string) => {
    setDbs((prev) => {
      const next = { ...prev, [db]: !prev[db] };
      const anyChecked = Object.values(next).some(Boolean);
      if (!anyChecked) return prev;
      return next;
    });
  };

  return (
    <div
      className={`w-full flex flex-col gap-5 bg-brand-secondary p-5 md:p-6 rounded-2xl border border-brand-border shadow-sm mb-6 ${isShaking ? "search-shake" : ""}`}
    >
      {/* Mode Selection Tabs */}
      <div className="flex border-b border-brand-border/60 pb-1.5 justify-start gap-4">
        <button
          type="button"
          onClick={() => setIsBatchMode(false)}
          className={`pb-2 px-1 text-xs font-bold uppercase tracking-wider relative cursor-pointer transition-all ${
            !isBatchMode
              ? "text-indigo-600 dark:text-indigo-400 font-extrabold"
              : "text-brand-text-muted hover:text-brand-text"
          }`}
        >
          <span>Single Search Mode</span>
          {!isBatchMode && (
            <motion.div
              layoutId="searchModeLine"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full"
            />
          )}
        </button>
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsBatchMode(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setIsBatchMode(true);
          }}
          className={`pb-2 px-1 text-xs font-bold uppercase tracking-wider relative cursor-pointer transition-all flex items-center gap-1.5 outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-sm ${
            isBatchMode
              ? "text-indigo-600 dark:text-indigo-400 font-extrabold"
              : "text-brand-text-muted hover:text-brand-text"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Batch Accession Mode</span>
          <div
            onClick={(e) => e.stopPropagation()}
            className="ml-1 -mt-0.5 cursor-default"
          >
            <InfoButton tipKey="batch-search" />
          </div>
          {isBatchMode && (
            <motion.div
              layoutId="searchModeLine"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full"
            />
          )}
        </div>
      </div>

      {/* Main Forms */}
      {!isBatchMode ? (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 relative pb-2"
          ref={dropdownRef}
        >
          <div className="relative flex-1 focus-glow-pulse rounded-xl flex items-center">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400 dark:text-neutral-500">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              id="search-input"
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder={`Try searching "${placeholders[placeholderIndex]}"...`}
              className="w-full pl-11 pr-10 py-3.5 bg-brand-bg dark:bg-neutral-950 text-brand-text dark:text-neutral-100 rounded-xl border border-brand-border dark:border-neutral-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-sans text-sm transition-all shadow-xs font-medium placeholder:transition-opacity duration-300"
              disabled={isLoading}
              autoComplete="off"
            />
            <div className="absolute right-3">
              <InfoButton tipKey="search-bar" />
            </div>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions &&
                (query.trim().length >= 2 || isLoadingSuggestions) && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute top-[calc(100%+8px)] left-0 right-0 bg-brand-bg dark:bg-neutral-950 border border-brand-border rounded-xl shadow-xl z-50 overflow-hidden text-left"
                  >
                    {isLoadingSuggestions && suggestions.length === 0 && (
                      <div className="p-3 text-xs text-brand-text-muted flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                        <span>Fetching annotations & suggestions...</span>
                      </div>
                    )}
                    {suggestions.length > 0 && (
                      <div className="py-1">
                        <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider border-b border-brand-border/40 flex items-center justify-between">
                          Biological Suggestions
                          <InfoButton tipKey="search-autocomplete" />
                        </div>
                        {suggestions.map((item, idx) => (
                          <button
                            key={`${item.value}-${idx}`}
                            type="button"
                            onClick={() => handleSelectSuggestion(item.value)}
                            className="w-full px-4 py-2.5 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 text-xs font-bold text-brand-text dark:text-neutral-200 flex items-center justify-between cursor-pointer border-b border-brand-border/30 last:border-0"
                          >
                            <span className="font-mono">{item.value}</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-tertiary text-brand-text-muted border border-brand-border/40 uppercase">
                              {item.source}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                    {!isLoadingSuggestions && suggestions.length === 0 && (
                      <div className="p-3.5 text-xs text-brand-text-muted">
                        No matching quick-access suggestions found. Hit Enter to
                        execute a full structural search.
                      </div>
                    )}
                  </motion.div>
                )}
            </AnimatePresence>
          </div>

          <motion.button
            type="submit"
            id="search-button"
            disabled={isLoading || !query.trim()}
            whileHover={{ scale: isLoading || !query.trim() ? 1 : 1.02 }}
            whileTap={{ scale: isLoading || !query.trim() ? 1 : 0.96 }}
            transition={{ type: "spring", stiffness: 450, damping: 15 }}
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-300 dark:disabled:bg-neutral-800 disabled:text-neutral-500 dark:disabled:text-neutral-600 hover:shadow-md cursor-pointer text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            {isLoading ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    ease: "linear",
                  }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Search
              </>
            )}
          </motion.button>
        </form>
      ) : (
        /* Batch Accession Form */
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleBatchSubmit();
          }}
          className="flex flex-col gap-3 relative pb-2"
        >
          <div className="relative flex-1">
            <textarea
              value={batchInput}
              onChange={(e) => setBatchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  handleBatchSubmit();
                }
              }}
              placeholder="Paste multiple identifiers, one per line (e.g.&#10;P38398&#10;1ABC&#10;NM_000546&#10;APOE)"
              rows={5}
              className="w-full p-4 bg-brand-bg dark:bg-neutral-950 text-brand-text dark:text-neutral-100 rounded-xl border border-brand-border dark:border-neutral-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono text-sm transition-all shadow-xs leading-relaxed"
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div className="text-[11px] font-bold text-neutral-400 flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5" />
              <span>
                Press{" "}
                <kbd className="px-1.5 py-0.5 bg-brand-tertiary rounded-md border border-brand-border">
                  Ctrl+Enter
                </kbd>{" "}
                to launch batch search
              </span>
              <InfoButton tipKey="keyboard-palette" />
            </div>
            <motion.button
              type="button"
              onClick={handleBatchSubmit}
              disabled={isLoading || !batchInput.trim()}
              whileHover={{ scale: isLoading || !batchInput.trim() ? 1 : 1.02 }}
              whileTap={{ scale: isLoading || !batchInput.trim() ? 1 : 0.96 }}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-300 dark:disabled:bg-neutral-800 disabled:text-neutral-500 dark:disabled:text-neutral-600 hover:shadow-md cursor-pointer text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm uppercase tracking-wide"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing Batch...
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  Batch Retrieve
                </>
              )}
            </motion.button>
          </div>
        </form>
      )}

      {/* Preset Suggestions & Filters */}
      <div className="flex flex-col items-center justify-center gap-5 pt-3.5 border-t border-brand-border/40 w-full text-center">
        {/* presets */}
        {!isBatchMode && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
            <span className="text-xs font-semibold text-brand-text-secondary dark:text-neutral-400 uppercase tracking-widest flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" /> Quick Try:
            </span>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {PRESETS.map((p) => (
                <motion.button
                  key={p}
                  type="button"
                  onClick={() => {
                    setQuery(p);
                    onSearch(p, dbs);
                  }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-2.5 py-1 text-xs font-bold border border-brand-border dark:border-neutral-800 rounded-lg hover:border-indigo-400 dark:hover:border-indigo-600 cursor-pointer bg-brand-bg text-brand-text hover:bg-brand-secondary transition-all shadow-2xs font-mono"
                >
                  {p}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Database Focus Options */}
        <div className="flex flex-wrap items-center justify-center gap-4 border-t border-brand-border/20 pt-3.5 w-full">
          <span className="text-xs font-bold text-brand-text-secondary dark:text-neutral-300 uppercase tracking-wider flex items-center gap-1.5 select-none">
            <Database className="w-3.5 h-3.5 text-indigo-500" /> Focus Targets:
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <motion.label
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <input
                type="checkbox"
                id="nucleotide"
                checked={!!dbs.nucleotide}
                onChange={() => handleCheckboxChange("nucleotide")}
                className="w-4 h-4 rounded-sm border-neutral-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 dark:accent-indigo-500 cursor-pointer"
              />
              GenBank (Nucleotide)
            </motion.label>
            <motion.label
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <input
                type="checkbox"
                id="uniprot"
                checked={!!dbs.uniprot}
                onChange={() => handleCheckboxChange("uniprot")}
                className="w-4 h-4 rounded-sm border-neutral-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 dark:accent-indigo-500 cursor-pointer"
              />
              UniProt
            </motion.label>
            <motion.label
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <input
                type="checkbox"
                id="pdb"
                checked={!!dbs.pdb}
                onChange={() => handleCheckboxChange("pdb")}
                className="w-4 h-4 rounded-sm border-neutral-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 dark:accent-indigo-500 cursor-pointer"
              />
              PDB Structures
            </motion.label>

            <button
              type="button"
              onClick={() => setIsNcbiExpanded(!isNcbiExpanded)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-900 border border-brand-border dark:border-neutral-800 rounded-xl text-xs font-bold text-brand-text dark:text-neutral-300 cursor-pointer select-none transition-colors"
            >
              <span>Expand NCBI Grid</span>
              {isNcbiExpanded ? (
                <ChevronUp className="w-3.5 h-3.5 text-indigo-500 animate-bounce" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-indigo-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded NCBI Grid */}
      <AnimatePresence>
        {isNcbiExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, scaleY: 0.95 }}
            animate={{ opacity: 1, height: "auto", scaleY: 1 }}
            exit={{ opacity: 0, height: 0, scaleY: 0.95 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="p-4 bg-brand-bg dark:bg-neutral-950 border border-brand-border rounded-xl -mt-2 overflow-hidden origin-top text-left"
          >
            <div className="flex justify-between items-center pb-2 border-b border-brand-border/40 mb-3 flex-wrap gap-2">
              <div className="text-xs font-bold text-brand-text dark:text-neutral-300 flex items-center gap-1">
                <span>NCBI E-Utilities Integrated Databases</span>
                <span className="text-[10px] text-brand-text-muted font-normal normal-case">
                  (Powered by official live eutils.ncbi.nlm.nih.gov)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const updated = { ...dbs };
                    NCBI_DATABASES.forEach((db) => {
                      updated[db.id] = true;
                    });
                    setDbs(updated);
                  }}
                  className="px-2.5 py-1 bg-black hover:bg-neutral-900 dark:bg-neutral-900 dark:hover:bg-neutral-850 text-white border border-black dark:border-neutral-800 rounded-md text-[10px] font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const updated = { ...dbs };
                    NCBI_DATABASES.forEach((db) => {
                      updated[db.id] = false;
                    });
                    updated.nucleotide = true;
                    setDbs(updated);
                  }}
                  className="px-2.5 py-1 bg-black hover:bg-neutral-900 dark:bg-neutral-900 dark:hover:bg-neutral-850 text-white border border-black dark:border-neutral-800 rounded-md text-[10px] font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
              {NCBI_DATABASES.map((db) => {
                const isChecked = !!dbs[db.id];
                return (
                  <label
                    key={db.id}
                    className={`flex items-start gap-2.5 p-2 rounded-lg border transition-all cursor-pointer hover:bg-brand-secondary ${
                      isChecked
                        ? "border-indigo-100 bg-indigo-50/20 dark:border-indigo-950/40 dark:bg-indigo-950/10"
                        : "border-brand-border/40 hover:border-brand-border"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        setDbs((prev) => {
                          const next = { ...prev, [db.id]: !prev[db.id] };
                          const anyChecked = Object.values(next).some(Boolean);
                          if (!anyChecked) return prev;
                          return next;
                        });
                      }}
                      className="w-4 h-4 rounded-sm border-neutral-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 dark:accent-indigo-500 mt-0.5 cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold leading-tight text-brand-text dark:text-neutral-200">
                        {db.name}
                      </span>
                      <span className="text-[10px] text-brand-text-muted leading-tight">
                        {db.desc}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Query History Panel */}
      {searchHistory.length > 0 && (
        <div
          id="history-panel"
          className="pt-3 border-t border-brand-border/50"
        >
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-xs font-bold text-brand-text-secondary dark:text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-500" /> Recent Searches
              <InfoButton tipKey="search-history" />
            </span>
            <button
              id="clear-history"
              onClick={handleClearClick}
              className={`text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                isClearingShaking ? "search-shake text-rose-500" : ""
              } ${confirmClear ? "text-amber-500 dark:text-amber-400 scale-105" : "text-brand-text-muted hover:text-rose-600 dark:hover:text-rose-400"}`}
            >
              <Trash2 className="w-3.5 h-3.5" />{" "}
              {confirmClear ? "Click to Confirm Clear?" : "Clear History"}
            </button>
          </div>
          <div
            id="history-list"
            className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1"
          >
            {searchHistory.map((h, idx) => (
              <div
                key={`${h.query}-${idx}`}
                onClick={() => {
                  setQuery(h.query);
                  onSelectHistory(h.query);
                }}
                className="history-item flex items-center gap-2 px-3 py-1.5 bg-brand-bg hover:bg-indigo-50 dark:bg-neutral-800 dark:hover:bg-indigo-950/20 text-brand-text-secondary dark:text-neutral-300 border border-brand-border dark:border-neutral-800 rounded-xl text-xs font-semibold cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-600 transition-all shadow-2xs group"
              >
                <span>{h.query}</span>
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 group-hover:text-indigo-400">
                  {new Date(h.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
