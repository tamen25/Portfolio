import { NextResponse } from "next/server";
import { mockServiceMetrics } from "@/lib/mock/data";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// PORTFOLIO MOCK: real route derives per-service rps/error from Mimir. Here we
// synthesise it so the /services grid and headline metric strip stay live.
export async function GET() {
  return NextResponse.json(
    { services: mockServiceMetrics() },
    { headers: { "cache-control": "no-store" } },
  );
}
