import { normalizeError, AppError, ErrorCategory, ErrorSeverity } from "./errors";

/**
 * Common fetch wrapper that implements timeout and standard error parsing.
 */
export async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    
    clearTimeout(id);
    
    if (!response.ok) {
      // Differentiate between 429 Rate Limit and other errors
      if (response.status === 429) {
        throw new AppError({
          category: ErrorCategory.API,
          severity: ErrorSeverity.WARNING,
          code: "ERR_RATE_LIMITED",
          message: "The external service is receiving too many requests. We'll try again shortly.",
          canRetry: true,
          retryDelayMs: 2000,
        });
      }
      
      if (response.status === 404) {
        throw new AppError({
          category: ErrorCategory.DATA,
          severity: ErrorSeverity.INFO,
          code: "ERR_NOT_FOUND",
          message: "No biological records found for this identifier.",
          canRetry: false,
        });
      }

      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    clearTimeout(id);
    throw normalizeError(error);
  }
}

/**
 * Example pattern for querying a resilient API like GenBank
 * Demonstrates: try/catch, timeout, and fallback degradation
 */
export async function queryGenBankPattern(id: string) {
  try {
    // 1. Enforce timeout to prevent hanging UI
    const response = await fetchWithTimeout(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=nucleotide&id=${id}&retmode=json`, {}, 5000);
    const data = await response.json();
    
    // 2. Data validation
    if (!data.result || !data.result[id]) {
      throw new AppError({
        category: ErrorCategory.DATA,
        severity: ErrorSeverity.WARNING,
        code: "ERR_GENBANK_PARSE",
        message: "GenBank returned data, but the specific record is missing or malformed.",
      });
    }
    
    return data;
  } catch (err) {
    const error = normalizeError(err);
    
    // 3. Graceful degradation
    // If it's just a timeout, we might return a partial object instead of crashing
    if (error.code === "ERR_NETWORK_TIMEOUT") {
      console.warn("GenBank timeout, falling back to basic data.");
      return { _partial: true, id };
    }
    
    throw error;
  }
}
