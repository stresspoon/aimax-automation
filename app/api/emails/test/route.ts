import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { projectId, to, template } = await req.json();
    if (!projectId || !to || !template) return NextResponse.json({ error: "invalid payload" }, { status: 400 });
    // TODO: enqueue to Upstash queue (mock now)
    return NextResponse.json({ queued: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


