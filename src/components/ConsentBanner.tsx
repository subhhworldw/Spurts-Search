import { useState, useEffect } from "react";
import { ShieldCheck, Cookie, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ConsentBannerProps {
  onAccept: () => void;
  onDecline: () => void;
}

export default function ConsentBanner({ onAccept, onDecline }: ConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already decided on cookie consent
    const consent = localStorage.getItem("spurt-cookie-consent");
    if (!consent) {
      // Small delay on load for micro-engagement rhythm
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("spurt-cookie-consent", "accepted");
    setIsVisible(false);
    onAccept();
  };

  const handleDeclineAll = () => {
    localStorage.setItem("spurt-cookie-consent", "declined");
    setIsVisible(false);
    onDecline();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="privacy-consent-banner"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-550 flex flex-col gap-3.5 p-4.5 bg-neutral-950/95 border border-brand-border backdrop-blur-md rounded-2xl shadow-xl border-indigo-900/40"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
              <ShieldCheck className="w-4.5 h-4.5 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-neutral-100 tracking-wide font-sans flex items-center gap-1.5 uppercase">
                Privacy & Insights Consent
              </h4>
              <p className="text-[11px] text-zinc-400 font-medium leading-relaxed mt-1">
                Spurt Search is safe and offline-first ready. By accepting, you consent to locally encrypted query caches and minimal telemetry integration (Vercel Analytics) used to observe transit latency over core public bio-databases. No personal data ever leaves your browser.
              </p>
            </div>
            <button
              onClick={handleDeclineAll}
              className="text-zinc-500 hover:text-zinc-300 transition-colors p-1 rounded-lg cursor-pointer shrink-0"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-1 border-t border-indigo-950/40">
            <button
              onClick={handleDeclineAll}
              className="px-3 py-1.5 text-[10.5px] font-bold text-zinc-400 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-800 rounded-lg transition-all cursor-pointer"
            >
              Reject Telemetry
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-3.5 py-1.5 text-[10.5px] font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm cursor-pointer hover:shadow-indigo-500/15 transition-all"
            >
              Accept All & Connect
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
