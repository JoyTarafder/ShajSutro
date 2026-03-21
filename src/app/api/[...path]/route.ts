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

function getProxyBase(): string {
  const raw = (
    process.env.API_PROXY_TARGET ??
    process.env.BACKEND_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    ""
  ).trim();

  if (!raw || raw === "/") return "";
  return raw.replace(/\/api\/?$/, "").replace(/\/$/, "");
}

function buildTargetUrl(req: NextRequest, path: string[]): string | null {
  const base = getProxyBase();
  if (!base) return null;

  let target: URL;
  try {
    target = new URL(base);
  } catch {
    return null;
  }

  // Prevent accidental self-proxy loops when API URL is set to the same Vercel domain.
  if (target.origin === req.nextUrl.origin) return null;

  const upstream = new URL(`/api/${path.join("/")}`, target.origin);
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

async function forward(req: NextRequest, params: { path: string[] }) {
  const targetUrl = buildTargetUrl(req, params.path);

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

export async function GET(req: NextRequest, context: { params: { path: string[] } }) {
  return forward(req, context.params);
}

export async function POST(req: NextRequest, context: { params: { path: string[] } }) {
  return forward(req, context.params);
}

export async function PUT(req: NextRequest, context: { params: { path: string[] } }) {
  return forward(req, context.params);
}

export async function PATCH(req: NextRequest, context: { params: { path: string[] } }) {
  return forward(req, context.params);
}

export async function DELETE(req: NextRequest, context: { params: { path: string[] } }) {
  return forward(req, context.params);
}

export async function OPTIONS(req: NextRequest, context: { params: { path: string[] } }) {
  return forward(req, context.params);
}
