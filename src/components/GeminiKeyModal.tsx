import { useState, useEffect } from "react";
import {
  Key,
  Eye,
  EyeOff,
  ExternalLink,
  X,
  Check,
  Lock,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface GeminiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  currentKey: string;
}

export default function GeminiKeyModal({
  isOpen,
  onClose,
  onSave,
  currentKey,
}: GeminiKeyModalProps) {
  const [keyInput, setKeyInput] = useState(currentKey);
  const [showKey, setShowKey] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Keep internal input field synchronized with the globally configured or reset key
  useEffect(() => {
    setKeyInput(currentKey);
  }, [currentKey]);

  const handleSave = () => {
    const trimmed = keyInput.trim();
    if (!trimmed) {
      setErrorMsg("Please enter a valid Gemini API Key.");
      return;
    }

    setErrorMsg(null);
    onSave(trimmed);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    setKeyInput("");
    onSave("");
    setErrorMsg(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal content container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="relative w-full max-w-lg bg-neutral-900 border border-zinc-800 text-white rounded-2xl shadow-2xl p-6 overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/30 text-indigo-400">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold tracking-tight">
                  Configure Gemini API Key
                </h3>
                <p className="text-xs text-neutral-400">
                  Enable automated instant AI Biological Annotations
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Instructions Box */}
          <div className="mb-5 p-4 rounded-xl bg-indigo-950/20 border border-indigo-900/30 text-xs text-neutral-350 leading-relaxed font-semibold">
            <span className="font-bold text-indigo-400 block mb-1">
              How to generate your free Gemini API Key:
            </span>
            <ol className="list-decimal pl-4 space-y-1.5 mt-2">
              <li>
                Go to the{" "}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-450 hover:text-indigo-300 underline font-bold inline-flex items-center gap-0.5"
                >
                  Google AI Studio Keys Page{" "}
                  <ExternalLink className="w-3 h-3 inline" />
                </a>
                .
              </li>
              <li>
                Click <strong className="text-white">"Create API Key"</strong>.
              </li>
              <li className="p-2 sm:p-2.5 my-1.5 bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-500/25 rounded-xl text-indigo-300 dark:text-indigo-200 font-bold shadow-2xs transition-all flex items-start gap-2">
                <span className="mt-0.5 text-indigo-400 font-sans font-extrabold text-xs shrink-0 select-none">
                  🔑
                </span>
                <span>
                  Copy your own unique different Gemini API key (ensure you use
                  your own key).
                </span>
              </li>
              <li>
                <strong className="text-white font-semibold">
                  Paste and save
                </strong>{" "}
                the key in the field below to save it securely to your browser's
                private local state.
              </li>
            </ol>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Your Gemini API Key
              </label>
              <div className="relative flex items-center">
                <input
                  type={showKey ? "text" : "password"}
                  value={keyInput}
                  onChange={(e) => {
                    setKeyInput(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="Paste your key here (e.g., AIzaSy...)"
                  className="w-full pl-3 pr-24 py-2.5 bg-neutral-950 text-neutral-200 border border-zinc-800 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono text-xs transition-all placeholder:text-zinc-750 font-medium"
                />
                <div className="absolute right-2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-200 rounded-lg hover:bg-neutral-900 cursor-pointer"
                    title={showKey ? "Hide key" : "Show key"}
                  >
                    {showKey ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  {keyInput && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="text-[10px] text-zinc-500 hover:text-rose-400 px-1.5 py-1 rounded hover:bg-rose-500/5 font-semibold transition-colors uppercase tracking-wider font-mono"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Error notifications */}
            {errorMsg && (
              <div className="flex items-start gap-2 text-xs text-amber-400 font-medium bg-amber-500/5 p-3 border border-amber-500/20 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Privacy Disclaimer */}
            <div className="flex items-start gap-2 text-[10.5px] text-zinc-400 font-semibold bg-zinc-950/40 p-3 border border-zinc-900 rounded-xl">
              <Lock className="w-3.5 h-3.5 shrink-0 text-indigo-400 mt-0.5" />
              <span>
                <strong>Privacy Statement:</strong> Your API key is cached
                local-only strictly in your browser's{" "}
                <code className="text-indigo-400">localStorage</code>. It is
                channeled securely via an encrypted proxy and never tracked
                externally.
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-neutral-400 hover:text-white hover:bg-neutral-800 border border-transparent rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={success}
                className={`relative px-5 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all ${
                  success
                    ? "bg-emerald-600 text-white border-emerald-500"
                    : "bg-indigo-600 text-white hover:bg-indigo-500 border border-indigo-700/50 shadow-md hover:shadow-indigo-500/10"
                }`}
              >
                {success ? (
                  <>
                    <Check className="w-4 h-4 animate-bounce" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Key</span>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
