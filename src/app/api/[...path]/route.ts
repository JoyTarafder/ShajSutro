import { NextRequest, NextResponse } from "next/server";
import { getServerBackendBase } from "@/lib/serverBackend";

export const runtime = "nodejs";

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
]);

/** Prefer pathname over route params — more reliable on Vercel than `params` alone. */
function parseApiPathSegments(pathname: string): string[] {
  if (!pathname.startsWith("/api")) return [];
  const rest = pathname.slice("/api".length).replace(/^\/+/, "");
  if (!rest) return [];
  return rest.split("/").filter(Boolean);
}

/** If a client ever hits `/api/api/...`, avoid forwarding `/api/api/...` to the backend. */
function normalizeSegments(segments: string[]): string[] {
  if (segments[0] === "api") return segments.slice(1);
  return segments;
}

function buildTargetUrl(req: NextRequest, path: string[]): string | null {
  const base = getServerBackendBase();
  if (!base) return null;

  let baseUrl: URL;
  try {
    baseUrl = new URL(base);
  } catch {
    return null;
  }

  // Prevent accidental self-proxy loops when API URL is set to the same Vercel domain.
  if (baseUrl.origin === req.nextUrl.origin) return null;

  const segments = normalizeSegments(path);
  const relativePath = `api/${segments.join("/")}`;
  // Resolve relative to the full backend base (including any path prefix), not only
  // origin — `new URL('/api/...', origin)` drops pathname segments on the base URL.
  const baseForResolve = base.endsWith("/") ? base : `${base}/`;
  const upstream = new URL(relativePath, baseForResolve);
  upstream.search = req.nextUrl.search;
  return upstream.toString();
}

function buildForwardHeaders(req: NextRequest): Headers {
  const headers = new Headers();

  req.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  return headers;
}

type RouteParams = { path?: string[] };

async function resolveRouteParams(
  context: { params: RouteParams | Promise<RouteParams> },
): Promise<string[] | undefined> {
  const p = await Promise.resolve(context.params);
  return p.path;
}

async function forward(req: NextRequest, paramsPath: string[] | undefined) {
  const fromUrl = parseApiPathSegments(req.nextUrl.pathname);
  const pathSegments =
    fromUrl.length > 0 ? fromUrl : normalizeSegments(paramsPath ?? []);

  if (pathSegments.length === 0) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Invalid API path. Expected /api/... behind the Next.js proxy.",
      },
      { status: 400 },
    );
  }

  const targetUrl = buildTargetUrl(req, pathSegments);

  if (!targetUrl) {
    return NextResponse.json(
      {
        success: false,
        message:
          "API proxy is not configured. Set API_PROXY_TARGET to your backend URL.",
      },
      { status: 500 },
    );
  }

  const method = req.method.toUpperCase();
  const hasBody = method !== "GET" && method !== "HEAD";
  const body = hasBody ? await req.arrayBuffer() : undefined;

  const upstreamRes = await fetch(targetUrl, {
    method,
    headers: buildForwardHeaders(req),
    body,
    cache: "no-store",
    redirect: "manual",
  });

  const responseHeaders = new Headers();
  upstreamRes.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      responseHeaders.set(key, value);
    }
  });

  return new NextResponse(upstreamRes.body, {
    status: upstreamRes.status,
    headers: responseHeaders,
  });
}

export async function GET(
  req: NextRequest,
  context: { params: RouteParams | Promise<RouteParams> },
) {
  return forward(req, await resolveRouteParams(context));
}

export async function POST(
  req: NextRequest,
  context: { params: RouteParams | Promise<RouteParams> },
) {
  return forward(req, await resolveRouteParams(context));
}

export async function PUT(
  req: NextRequest,
  context: { params: RouteParams | Promise<RouteParams> },
) {
  return forward(req, await resolveRouteParams(context));
}

export async function PATCH(
  req: NextRequest,
  context: { params: RouteParams | Promise<RouteParams> },
) {
  return forward(req, await resolveRouteParams(context));
}

export async function DELETE(
  req: NextRequest,
  context: { params: RouteParams | Promise<RouteParams> },
) {
  return forward(req, await resolveRouteParams(context));
}

export async function OPTIONS(
  req: NextRequest,
  context: { params: RouteParams | Promise<RouteParams> },
) {
  return forward(req, await resolveRouteParams(context));
}
