import { NextRequest, NextResponse } from "next/server";
import { mockLoadStart } from "@/lib/mock/data";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// PORTFOLIO MOCK: real route is admin-gated and drives a loadgen service that
// generates genuine mesh traffic. Here we just flip the in-memory run state so
// the counters climb and the message reads back like a real run started.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const scenario = String(body?.scenario ?? "mixed");
  const rps = Number.isFinite(body?.rps) ? Number(body.rps) : 20;
  const durationSeconds = Number.isFinite(body?.durationSeconds)
    ? Number(body.durationSeconds)
    : 120;
  const started = mockLoadStart(scenario, rps, durationSeconds);
  return NextResponse.json(started);
}
