# Testing Strategy for Spurt Search Error Handling

1. **Test GenBank Timeout (Network / Timeout Fallback)**
   * **Scenario**: The NCBI API is slow or hangs.
   * **Action**: Simulate a slow response by lowering the `timeoutMs` in `fetchWithTimeout` to `10ms`, or use Chrome DevTools network throttling.
   * **Expected Outcome**: The request aborts gracefully, the frontend catches the `AbortError` (converted to `ERR_NETWORK_TIMEOUT`), the `ErrorAlert` shows a yellow warning with a "Try Again" button, and the app doesn't freeze.

2. **Test Malformed Gene/Protein ID (Validation & Parsing)**
   * **Scenario**: A user types an invalid string like `!!!@#$%` into the search box.
   * **Action**: Submit the invalid query.
   * **Expected Outcome**: The client-side validation logic catches it before a fetch is even made, throwing an `ERR_USER_INPUT` error. The unified `ErrorAlert` warns the user immediately with actionable advice (e.g., "Identifiers must be alphanumeric").

3. **Test Gemini Rate Limiting (API 429 Handling)**
   * **Scenario**: Exceeding the quota of the AI model.
   * **Action**: Force the backend `/api/summarize` endpoint to return a `429 Too Many Requests` status, or send dozens of requests rapidly.
   * **Expected Outcome**: The `ErrorAlert` displays a specific rate-limit warning. The retry button uses exponential backoff (or a specific delay informed by `retryDelayMs`), and raw biological data is still displayed (graceful degradation) alongside the error stating the AI summary is temporarily unavailable.

4. **Test Total Offline Mode (Infrastructure & Network)**
   * **Scenario**: User loses internet connection entirely during a fetch.
   * **Action**: Turn off WiFi or use the "Offline" preset in the Network tab of DevTools.
   * **Expected Outcome**: The browser throws a `TypeError: Failed to fetch`. `normalizeError` categorizes this as `ERR_NETWORK_OFFLINE`. The UI surfaces a red/fatal `ErrorAlert` stating "Network connection failed," and the `ErrorBoundary` does not crash.
