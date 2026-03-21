export function getApiBase(): string {
  const raw = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").trim();
  // Accept values like:
  // - "https://example.com"
  // - "https://example.com/"
  // - "https://example.com/api"
  // - "/"
  // Normalize so callers can safely do `${API}/api/...` without double slashes.
  const cleaned = raw.replace(/\/api\/?$/, "").replace(/\/$/, "");
  // In deployed browsers, ignore localhost values because they point to the visitor's machine.
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1" &&
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(cleaned)
  ) {
    return "";
  }
  // If env is accidentally set to this same origin, use relative API calls.
  if (typeof window !== "undefined") {
    try {
      const configured = new URL(cleaned);
      if (configured.origin === window.location.origin) return "";
    } catch {
      // Ignore malformed URL and fall through to default behavior.
    }
  }
  // If user set "/" (common mistake on Vercel), treat as empty so we use relative calls.
  return cleaned === "" || cleaned === "/" ? "" : cleaned;
}

