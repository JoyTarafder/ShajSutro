export function getApiBase(): string {
  const raw = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000").trim();
  // Accept values like:
  // - "https://example.com"
  // - "https://example.com/"
  // - "https://example.com/api"
  // - "/"
  // Normalize so callers can safely do `${API}/api/...` without double slashes.
  const cleaned = raw.replace(/\/api\/?$/, "").replace(/\/$/, "");
  // If user set "/" (common mistake on Vercel), treat as empty so we use relative calls.
  return cleaned === "" || cleaned === "/" ? "" : cleaned;
}

