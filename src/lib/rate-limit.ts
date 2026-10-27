import { NextResponse } from "next/server";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const requests = new Map<string, RateLimitEntry>();

export function checkRateLimit(
  request: Request,
  route: string,
  limit: number,
  windowMs: number,
): NextResponse | null {
  const ip =
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  const key = `${route}:${ip}`;
  const now = Date.now();

  let entry = requests.get(key);

  if (!entry || now > entry.resetAt) {
    entry = {
      count: 0,
      resetAt: now + windowMs,
    };
  }

  entry.count++;
  requests.set(key, entry);

  if (requests.size > 5000) {
    for (const [storedKey, value] of requests) {
      if (now > value.resetAt) {
        requests.delete(storedKey);
      }
    }
  }

  if (entry.count > limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);

    return NextResponse.json(
      {
        success: false,
        message: "Demasiadas solicitudes. Intenta nuevamente más tarde.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
        },
      },
    );
  }

  return null;
}