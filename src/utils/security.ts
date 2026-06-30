import { HistoryItem } from "../types";

/**
 * Sanitizes search queries by removing null bytes, HTML tags, and specific 
 * dangerous script characters to prevent prompt injection or code leaks.
 */
export function sanitizeQuery(query: string): string {
  if (!query) return "";
  
  // 1. Remove null bytes
  let sanitized = query.replace(/\x00/g, "");
  
  // 2. Strip standard tag-like brackets and quotes that could escape contexts
  sanitized = sanitized.replace(/[<>"'`]/g, "");
  
  // 3. Enforce strict max length of 500 characters
  sanitized = sanitized.slice(0, 500);
  
  return sanitized.trim();
}

/**
 * Validates a search query, identifying the biologically relevant query format (Gene, Protein, PDB ID).
 * Rejects obviously non-biological patterns or common injection payloads.
 */
export function validateQuery(query: string): {
  isValid: boolean;
  type: "gene" | "protein" | "pdb" | "general_bio" | "invalid";
  message?: string;
} {
  const trimmed = query.trim();
  if (!trimmed) {
    return { isValid: false, type: "invalid", message: "Search term cannot be empty." };
  }

  if (trimmed.length > 500) {
    return { isValid: false, type: "invalid", message: "Search term exceeds maximum length of 500 characters." };
  }

  // Guard against standard SQL/XSS signatures
  const lower = trimmed.toLowerCase();
  const dangerousPatterns = [
    "javascript:",
    "onload=",
    "onerror=",
    "union select",
    "select * from",
    "drop table",
    "alter table",
    "where 1=1",
    "<script",
  ];
  if (dangerousPatterns.some((pattern) => lower.includes(pattern))) {
    return {
      isValid: false,
      type: "invalid",
      message: "Security warning: Potential query injection pattern detected.",
    };
  }

  // PDB IDs: Usually 4 characters, starting with a number 1-9 followed by alphanumeric, or purely 4-alphanumeric.
  const isPdbId = /^[1-9][A-Za-z0-9]{3}$|^[A-Za-z0-9]{4}$/.test(trimmed) && trimmed.length === 4;
  if (isPdbId) {
    return { isValid: true, type: "pdb" };
  }

  // UniProt Accessions: e.g. P38398, P04637, P02649, P01308
  const isUniprotAcc = /^[OPQ][0-9][A-Z0-9]{3}[0-9]$|^[A-N_R-Z][0-9][A-Z0-9]{4}$|^[A-N_R-Z][0-9][A-Z][A-Z0-9]{2}[0-9][A-Z0-9]{5}$/i.test(trimmed);
  if (isUniprotAcc) {
    return { isValid: true, type: "protein" };
  }

  // GenBank Accessions: e.g. NM_000546, NC_045512, AH002844
  const isGenBankAcc = /^[A-Z]{1,2}[0-9]{5,6}$|^[A-Z]{2}_[0-9]{6,12}$/i.test(trimmed);
  if (isGenBankAcc) {
    return { isValid: true, type: "gene" };
  }

  // General Biological queries: symbols, names (BRCA1, TP53, Spike, insulin receptors)
  const isSafeBioPhrase = /^[a-zA-Z0-9\s\-._(),/]+$/.test(trimmed);
  if (isSafeBioPhrase) {
    if (/^[A-Z0-9]{2,10}$/i.test(trimmed)) {
       return { isValid: true, type: "gene" };
    }
    return { isValid: true, type: "general_bio" };
  }

  return {
    isValid: false,
    type: "invalid",
    message: "Query contains invalid characters. Only letters, numbers, spaces, and standard notation punctuation are allowed.",
  };
}

/**
 * Global rate-limiting scheduler to enforce NCBI's limit: max 3 requests/second (340ms minimum gap).
 */
let lastNcbiRequestTime = 0;
const NCBI_MIN_GAP_MS = 350; // Safeguard limit above the 340ms threshold

export async function rateLimitNcbiCall<T>(call: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const timeSinceLast = now - lastNcbiRequestTime;
  
  if (timeSinceLast < NCBI_MIN_GAP_MS) {
    const delay = NCBI_MIN_GAP_MS - timeSinceLast;
    // Advance scheduled timestamp to lock other concurrent threads
    lastNcbiRequestTime = now + delay;
    await new Promise((resolve) => setTimeout(resolve, delay));
  } else {
    lastNcbiRequestTime = Date.now();
  }
  
  return call();
}

/**
 * Standard stale history dynamic filter.
 * Purges raw history items older than 7 days (604,800,000 milliseconds).
 */
export function purgeStaleHistory(history: HistoryItem[]): HistoryItem[] {
  const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  return history.filter((item) => {
    return item.timestamp && now - item.timestamp < ONE_WEEK_MS;
  });
}

/**
 * WebCrypto API AES-GCM Encrypted Data Local Storage Utilities.
 */
const ENCRYPTION_KEY_NAME = "sprut_crypto_key";

async function getOrCreateEncryptionKey(): Promise<CryptoKey | null> {
  try {
    if (typeof window === "undefined" || !window.crypto || !window.crypto.subtle) {
      return null;
    }
    
    const keyRaw = localStorage.getItem(ENCRYPTION_KEY_NAME);
    if (!keyRaw) {
      const key = await window.crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );
      const exported = await window.crypto.subtle.exportKey("jwk", key);
      localStorage.setItem(ENCRYPTION_KEY_NAME, JSON.stringify(exported));
      return key;
    } else {
      const parsed = JSON.parse(keyRaw);
      return await window.crypto.subtle.importKey(
        "jwk",
        parsed,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );
    }
  } catch (err) {
    console.warn("[Security] WebCrypto key generation failed. Falling back to non-encrypted layer safely.", err);
    return null;
  }
}

export async function encryptHistory(history: HistoryItem[]): Promise<string | null> {
  try {
    const serialized = JSON.stringify(history);
    const key = await getOrCreateEncryptionKey();
    if (!key) return null;

    const encoder = new TextEncoder();
    const data = encoder.encode(serialized);
    
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );

    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);

    // Convert to safe base64
    const binary = String.fromCharCode(...Array.from(combined));
    return btoa(binary);
  } catch (err) {
    console.error("[Security] History encryption failed:", err);
    return null;
  }
}

export async function decryptHistory(encryptedBase64: string): Promise<HistoryItem[] | null> {
  try {
    const key = await getOrCreateEncryptionKey();
    if (!key) return null;

    const binary = atob(encryptedBase64);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      buffer[i] = binary.charCodeAt(i);
    }

    const iv = buffer.slice(0, 12);
    const payload = buffer.slice(12);

    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      payload
    );

    const decoder = new TextDecoder();
    const text = decoder.decode(decrypted);
    return JSON.parse(text) as HistoryItem[];
  } catch (err) {
    console.error("[Security] History decryption failed:", err);
    return null;
  }
}
