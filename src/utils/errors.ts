export enum ErrorCategory {
  NETWORK = "NETWORK",
  API = "API",
  DATA = "DATA",
  USER = "USER",
  INFRASTRUCTURE = "INFRASTRUCTURE",
  UNKNOWN = "UNKNOWN",
}

export enum ErrorSeverity {
  INFO = "INFO",
  WARNING = "WARNING",
  FATAL = "FATAL",
}

export interface AppErrorOptions {
  category: ErrorCategory;
  severity: ErrorSeverity;
  code: string;
  message: string;
  originalError?: unknown;
  canRetry?: boolean;
  retryDelayMs?: number;
  details?: string;
}

export class AppError extends Error {
  public category: ErrorCategory;
  public severity: ErrorSeverity;
  public code: string;
  public originalError?: unknown;
  public canRetry: boolean;
  public retryDelayMs?: number;
  public details?: string;

  constructor(options: AppErrorOptions) {
    super(options.message);
    this.name = "AppError";
    this.category = options.category;
    this.severity = options.severity;
    this.code = options.code;
    this.originalError = options.originalError;
    this.canRetry = options.canRetry ?? false;
    this.retryDelayMs = options.retryDelayMs;
    this.details = options.details;
  }
}

// Helper to determine what type of error we're dealing with
export function normalizeError(error: unknown, defaultMessage = "An unexpected error occurred"): AppError {
  if (error instanceof AppError) {
    return error;
  }

  // Handle generic errors
  if (error instanceof Error) {
    // Network errors (fetch fails to connect)
    if (error.name === "TypeError" && error.message === "Failed to fetch") {
      return new AppError({
        category: ErrorCategory.NETWORK,
        severity: ErrorSeverity.WARNING,
        code: "ERR_NETWORK_OFFLINE",
        message: "Network connection failed. Please check your internet connection.",
        originalError: error,
        canRetry: true,
        retryDelayMs: 3000,
      });
    }

    // Abort errors (timeout)
    if (error.name === "AbortError") {
      return new AppError({
        category: ErrorCategory.NETWORK,
        severity: ErrorSeverity.WARNING,
        code: "ERR_NETWORK_TIMEOUT",
        message: "The request timed out. The server might be busy or unresponsive.",
        originalError: error,
        canRetry: true,
        retryDelayMs: 5000,
      });
    }

    return new AppError({
      category: ErrorCategory.UNKNOWN,
      severity: ErrorSeverity.FATAL,
      code: "ERR_UNKNOWN",
      message: error.message || defaultMessage,
      originalError: error,
    });
  }

  return new AppError({
    category: ErrorCategory.UNKNOWN,
    severity: ErrorSeverity.FATAL,
    code: "ERR_UNKNOWN",
    message: defaultMessage,
    originalError: error,
    details: typeof error === "string" ? error : JSON.stringify(error),
  });
}
