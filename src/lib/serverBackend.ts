/**
 * Backend base URL for server-side proxy and Route Handlers.
 * Prefer API_PROXY_TARGET / BACKEND_URL on Vercel; NEXT_PUBLIC_API_URL is a fallback.
 */
export function getServerBackendBase(): string {
  const raw = (
    process.env.API_PROXY_TARGET ??
    process.env.BACKEND_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    ""
  ).trim();
  if (!raw || raw === "/") return "";
  const withoutTrailingApi = raw.replace(/\/api\/?$/, "").replace(/\/$/, "");
  if (!withoutTrailingApi) return "";
  // Allow env without scheme (common typo on Vercel)
  if (!/^https?:\/\//i.test(withoutTrailingApi)) {
    if (/^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(withoutTrailingApi)) {
      return `http://${withoutTrailingApi}`;
    }
    return `https://${withoutTrailingApi}`;
  }
  return withoutTrailingApi;
}

/**
 * Join backend base with request pathname. Do NOT use `new URL('/api/...', base)` — a
 * pathname starting with `/` replaces the entire path on the host and drops base path
 * segments (e.g. `https://host.com/prefix` + `/api/x` would wrongly become `https://host.com/api/x`).
 */
export function joinBackendUrl(base: string, pathname: string): string {
  const b = base.replace(/\/$/, "");
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${b}${p}`;
}
