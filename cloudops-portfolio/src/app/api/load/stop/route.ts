import { NextResponse } from "next/server";
import { mockLoadStop } from "@/lib/mock/data";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// PORTFOLIO MOCK: real route is admin-gated and stops the loadgen service. Here
// we just flip the in-memory run state to idle (banking progress so counters
// don't reset).
export async function POST() {
  mockLoadStop();
  return NextResponse.json({ stopped: true });
}
