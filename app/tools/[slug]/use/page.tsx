import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/supabase/client";

export default async function UseToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const uid = cookies().get("aimax_uid")?.value;
  if (!uid) redirect(`/tools/${slug}`);
  const supabase = getSupabase();
  const { data: product } = await supabase.from("products").select("id").eq("slug", slug).single();
  if (!product) redirect(`/tools/${slug}`);
  const { data: ent } = await supabase
    .from("entitlements")
    .select("id")
    .eq("user_id", uid)
    .eq("product_id", product.id)
    .maybeSingle();
  if (!ent) redirect(`/tools/${slug}`);
  return (
    <main className="py-16 text-center">
      <h1 className="text-2xl font-semibold">도구 사용 화면</h1>
      <p className="text-[var(--fg)]/70">권한 확인됨. 실제 기능은 이후 단계에서 연결합니다.</p>
    </main>
  );
}


