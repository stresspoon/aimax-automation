import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(_req: NextRequest) {
  try {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    console.log("stripe webhook hit", { configured: !!secret });
    // TODO: signature verify & parse event
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


