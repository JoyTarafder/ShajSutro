import { getServerBackendBase, joinBackendUrl } from "@/lib/serverBackend";
import { NextRequest, NextResponse } from "next/server";

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

function buildForwardHeaders(req: NextRequest): Headers {
  const headers = new Headers();
  req.headers.forEach((value, key) => {
    const k = key.toLowerCase();
    if (!HOP_BY_HOP_HEADERS.has(k) && k !== "x-forwarded-host") {
      headers.set(key, value);
    }
  });
  return headers;
}

function buildTargetUrl(req: NextRequest): string | null {
  const base = getServerBackendBase();
  if (!base) return null;

  let baseUrl: URL;
  try {
    baseUrl = new URL(base);
  } catch {
    return null;
  }

  if (baseUrl.origin === req.nextUrl.origin) return null;

  const pathname = req.nextUrl.pathname;
  const search = req.nextUrl.search;
  return joinBackendUrl(base, pathname) + search;
}

async function forward(req: NextRequest) {
  const targetUrl = buildTargetUrl(req);

  if (!targetUrl) {
    const base = getServerBackendBase();
    if (!base) {
      return NextResponse.json(
        {
          success: false,
          message:
            "API proxy is not configured. Set API_PROXY_TARGET (or BACKEND_URL) to your Express API URL in Vercel.",
        },
        { status: 500 },
      );
    }
    return NextResponse.json(
      {
        success: false,
        message:
          "API proxy target cannot be the same origin as this site. Point it to your separate backend URL.",
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

export async function GET(req: NextRequest) {
  return forward(req);
}

export async function POST(req: NextRequest) {
  return forward(req);
}

export async function PUT(req: NextRequest) {
  return forward(req);
}

export async function PATCH(req: NextRequest) {
  return forward(req);
}

export async function DELETE(req: NextRequest) {
  return forward(req);
}

export async function OPTIONS(req: NextRequest) {
  return forward(req);
}
