import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabase } from "@/lib/supabase/client";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json();
    if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
    const uid = cookies().get("aimax_uid")?.value;
    if (!uid) return NextResponse.json({ error: "not logged in" }, { status: 401 });

    const supabase = getSupabase();
    const { data: product, error: perr } = await supabase.from("products").select("id,slug,title,price_cents,currency,active").eq("slug", slug).single();
    if (perr || !product) return NextResponse.json({ error: "product not found" }, { status: 404 });

    const { data: purchase, error: ierr } = await supabase
      .from("purchases")
      .insert([{ user_id: uid, product_id: product.id, amount_cents: product.price_cents, currency: product.currency, status: "paid" }])
      .select()
      .single();
    if (ierr) throw ierr;

    // entitlements upsert: user_id + product_id unique 가정
    const { error: eerr } = await supabase
      .from("entitlements")
      .upsert([{ user_id: uid, product_id: product.id }], { onConflict: "user_id,product_id" });
    if (eerr) throw eerr;

    return NextResponse.json({ ok: true, purchase_id: purchase.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


