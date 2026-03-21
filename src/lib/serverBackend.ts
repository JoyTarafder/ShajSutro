/**
 * Backend origin for server-side fetches (proxy, Route Handlers).
 * Matches resolution in `app/api/[...path]/route.ts`.
 */
export function getServerBackendBase(): string {
  const raw = (
    process.env.API_PROXY_TARGET ??
    process.env.BACKEND_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    ""
  ).trim();
  return raw.replace(/\/api\/?$/, "").replace(/\/$/, "");
}
