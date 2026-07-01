import { NextResponse } from "next/server";
import { mockTopology } from "@/lib/mock/data";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// PORTFOLIO MOCK: the real route queries the Tempo metrics-generator (via Mimir)
// behind a Cognito session. Here we serve synthetic service-graph topology so the
// console's service map animates without any backend. See src/lib/mock/data.ts.
export async function GET() {
  return NextResponse.json(mockTopology(), {
    headers: { "cache-control": "no-store" },
  });
}
