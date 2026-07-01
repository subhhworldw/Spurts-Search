import React, { useState } from "react";
import { AlertCircle, AlertTriangle, Info, XCircle, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { AppError, ErrorSeverity, ErrorCategory } from "../utils/errors";
import { motion, AnimatePresence } from "motion/react";

interface ErrorAlertProps {
  error: AppError;
  onDismiss?: () => void;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorAlert({ error, onDismiss, onRetry, className = "" }: ErrorAlertProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Configure colors and icons based on severity
  let config = {
    bg: "bg-red-50 dark:bg-red-950/20",
    border: "border-red-200 dark:border-red-900/50",
    iconBg: "bg-red-100 dark:bg-red-900/50",
    iconColor: "text-red-600 dark:text-red-400",
    titleColor: "text-red-800 dark:text-red-200",
    textColor: "text-red-700 dark:text-red-300",
    Icon: XCircle,
  };

  if (error.severity === ErrorSeverity.WARNING) {
    config = {
      bg: "bg-yellow-50 dark:bg-yellow-950/20",
      border: "border-yellow-200 dark:border-yellow-900/50",
      iconBg: "bg-yellow-100 dark:bg-yellow-900/50",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      titleColor: "text-yellow-800 dark:text-yellow-200",
      textColor: "text-yellow-700 dark:text-yellow-300",
      Icon: AlertTriangle,
    };
  } else if (error.severity === ErrorSeverity.INFO) {
    config = {
      bg: "bg-blue-50 dark:bg-blue-950/20",
      border: "border-blue-200 dark:border-blue-900/50",
      iconBg: "bg-blue-100 dark:bg-blue-900/50",
      iconColor: "text-blue-600 dark:text-blue-400",
      titleColor: "text-blue-800 dark:text-blue-200",
      textColor: "text-blue-700 dark:text-blue-300",
      Icon: Info,
    };
  }

  const { Icon } = config;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`rounded-xl border ${config.bg} ${config.border} p-4 w-full shadow-sm ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3">
        <div className={`p-1.5 rounded-lg ${config.iconBg} shrink-0 mt-0.5`}>
          <Icon className={`w-5 h-5 ${config.iconColor}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-sm ${config.titleColor} mb-1`}>
            {error.category === ErrorCategory.NETWORK ? "Connection Issue" : 
             error.category === ErrorCategory.API ? "Service Unavailable" :
             error.category === ErrorCategory.USER ? "Input Error" :
             "Application Error"}
          </h3>
          <p className={`text-sm ${config.textColor} leading-relaxed`}>
            {error.message}
          </p>

          <div className="flex items-center gap-4 mt-3">
            {error.canRetry && onRetry && (
              <button
                onClick={onRetry}
                className={`flex items-center gap-1.5 text-sm font-medium ${config.titleColor} hover:opacity-80 transition-opacity cursor-pointer`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Try Again
              </button>
            )}
            
            {(error.details || error.originalError) && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className={`flex items-center gap-1 text-sm font-medium ${config.textColor} opacity-80 hover:opacity-100 transition-opacity cursor-pointer`}
              >
                {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                {showDetails ? "Hide Details" : "View Details"}
              </button>
            )}
          </div>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className={`mt-3 p-3 rounded-lg bg-black/5 dark:bg-black/20 text-xs font-mono ${config.textColor} break-words overflow-x-auto`}>
                  <div className="mb-1"><strong>Code:</strong> {error.code}</div>
                  {error.details && <div className="mb-1"><strong>Details:</strong> {error.details}</div>}
                  {error.originalError && (
                    <div className="mt-2 whitespace-pre-wrap">
                      <strong>Trace:</strong>{"\n"}
                      {error.originalError instanceof Error 
                        ? (error.originalError.stack || error.originalError.message)
                        : JSON.stringify(error.originalError, null, 2)}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`p-1.5 rounded-lg opacity-60 hover:opacity-100 ${config.iconColor} hover:${config.iconBg} transition-colors shrink-0 cursor-pointer`}
            aria-label="Dismiss error"
          >
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
