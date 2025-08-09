import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { grantEntitlement } from "@/lib/checkout/grant";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json();
    if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
    const store = await cookies();
    const uid = store.get("aimax_uid")?.value;
    if (!uid) return NextResponse.json({ error: "not logged in" }, { status: 401 });

    const result = await grantEntitlement({ slug, userId: uid });
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


