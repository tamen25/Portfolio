import { NextResponse } from "next/server";
import { mockLoadStatus } from "@/lib/mock/data";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// PORTFOLIO MOCK: real route proxies a loadgen service. Here run state is an
// in-memory simulation so Start/Stop on /load feels live within a session.
export async function GET() {
  return NextResponse.json(mockLoadStatus(), {
    headers: { "cache-control": "no-store" },
  });
}
