import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Info, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TOOLTIP_DATA } from "../lib/tooltipData";

const KEY_MAP: Record<string, string> = {
  "query-type": "query-type-badge",
  "overview-tab": "detail-overview",
  "cross-refs-tab": "detail-crossrefs",
  "sequence-tab": "detail-sequence",
};

interface InfoButtonProps {
  tipKey: string;
}

export function InfoButton({ tipKey }: InfoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const resolvedKey = KEY_MAP[tipKey] || tipKey;
  const data = TOOLTIP_DATA[resolvedKey];

  const [positionStyle, setPositionStyle] = useState<React.CSSProperties>({
    top: 0,
    left: 0,
    opacity: 0, // hide until positioned
  });

  // Handle click outside & Escape key
  useEffect(() => {
    if (!isOpen) return;

    // Use capture phase to intercept clicks even if parent has stopPropagation
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick, true);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("click", handleOutsideClick, true);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  // Handle smart screen collision bounding box positioning
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    
    // Use requestAnimationFrame to ensure the popover is rendered and measured correctly
    const handlePositioning = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Tooltip dimensions (approximate)
      const tooltipWidth = viewportWidth < 768 ? 288 : 320; 
      const tooltipHeight = 150; 
      
      // Default to opening below the button
      let top = rect.bottom + 12; 
      
      // If it overflows bottom, but there's room above, open above
      if (top + tooltipHeight > viewportHeight && rect.top - tooltipHeight - 12 > 0) {
          top = rect.top - tooltipHeight - 12;
      }
      
      // Center horizontally relative to button
      let left = rect.left + rect.width / 2 - tooltipWidth / 2;
      
      // Constrain horizontally to viewport edges
      if (left < 16) {
        left = 16;
      } else if (left + tooltipWidth > viewportWidth - 16) {
        left = viewportWidth - tooltipWidth - 16;
      }

      setPositionStyle({
        top: `${top}px`,
        left: `${left}px`,
        opacity: 1, // reveal once positioned
      });
    };

    // Calculate immediately and on next frame
    handlePositioning();
    const rafId = requestAnimationFrame(handlePositioning);

    window.addEventListener("resize", handlePositioning);
    window.addEventListener("scroll", handlePositioning, true);
    
    return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("resize", handlePositioning);
        window.removeEventListener("scroll", handlePositioning, true);
    }
  }, [isOpen]);

  if (!data) return null;

  return (
    <span
      ref={containerRef}
      className="relative inline-flex items-center justify-center leading-none"
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className={`inline-flex items-center justify-center rounded-md transition-colors duration-200 cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 shrink-0 ${
          isOpen
            ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400"
            : "bg-transparent text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:text-neutral-500 dark:hover:text-neutral-300 dark:hover:bg-neutral-800/80"
        }`}
        style={{ width: "20px", height: "20px" }}
        aria-label={`Learn more about ${data.title}`}
        aria-expanded={isOpen}
      >
        <Info className="w-3.5 h-3.5" strokeWidth={2} />
      </button>

      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={popoverRef}
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: positionStyle.opacity, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 4 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
              className="fixed z-[99999] w-72 md:w-80 p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800/50 rounded-xl shadow-xl text-neutral-800 dark:text-neutral-300 font-normal text-xs text-left select-none pointer-events-auto lowercase leading-relaxed tracking-wide"
              style={positionStyle}
              role="tooltip"
            >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 font-bold text-sm text-neutral-950 dark:text-neutral-50">
                <span className="text-base leading-none">{data.icon}</span>
                <span>{data.title}</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* Concise Description: "What it is/does" */}
            <div className="text-neutral-600 dark:text-neutral-350 leading-relaxed font-normal mb-2.5">
              {data.what}
            </div>

            {/* Dynamic Pro Tip or Usage Example in a super clean & compact form */}
            {(data.tip || data.example) && (
              <div className="p-2 bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-800/60 rounded-lg text-[11px] leading-relaxed">
                {data.tip ? (
                  <div className="text-indigo-600 dark:text-indigo-400 font-medium">
                    💡 <span className="font-semibold">Tip:</span> {data.tip}
                  </div>
                ) : (
                  <div className="text-neutral-500 dark:text-neutral-400 font-mono">
                    <span className="font-semibold font-sans text-neutral-700 dark:text-neutral-350">e.g.</span> {data.example}
                  </div>
                )}
              </div>
            )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </span>
  );
}
