import { getSupabase } from "@/lib/supabase/client";

export type GrantInput = {
  slug: string;
  userId: string;
  amount_cents?: number;
  currency?: string;
  status?: string; // default 'paid'
};

export async function grantEntitlement({ slug, userId, amount_cents, currency, status = "paid" }: GrantInput) {
  const supabase = getSupabase();

  const { data: product, error: perr } = await supabase
    .from("products")
    .select("id,slug,title,price_cents,currency,active")
    .eq("slug", slug)
    .single();
  if (perr || !product) throw new Error("product not found");

  const amount = typeof amount_cents === "number" ? amount_cents : product.price_cents ?? 0;
  const curr = currency ?? product.currency ?? "KRW";

  const { data: purchase, error: ierr } = await supabase
    .from("purchases")
    .insert([{ user_id: userId, product_id: product.id, amount_cents: amount, currency: curr, status }])
    .select()
    .single();
  if (ierr) throw ierr;

  const { error: eerr } = await supabase
    .from("entitlements")
    .upsert([{ user_id: userId, product_id: product.id }], { onConflict: "user_id,product_id" });
  if (eerr) throw eerr;

  return { ok: true, purchase_id: purchase.id } as const;
}


