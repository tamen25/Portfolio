import { NextRequest, NextResponse } from "next/server";
import { mockRecentTraces, mockTraceOtlp } from "@/lib/mock/data";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// PORTFOLIO MOCK: real route lists recent traces from Tempo (or one trace by id
// as OTLP JSON). Here both come from the mock layer so the traces table streams
// and the span waterfall renders a believable place-order tree.
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (id) {
    // Keep the same hex-id guard as the real route.
    if (!/^[a-fA-F0-9]{1,40}$/.test(id)) {
      return NextResponse.json({ error: "invalid_trace_id" }, { status: 400 });
    }
    return NextResponse.json({ trace: mockTraceOtlp(id) });
  }
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? 20);
  return NextResponse.json(
    { traces: mockRecentTraces(limit) },
    { headers: { "cache-control": "no-store" } },
  );
}
