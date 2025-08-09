import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/client";

export const runtime = "edge";

type Tool = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  badge: string | null;
  price_cents: number;
  currency: string;
  is_active: boolean;
  icon_url: string | null;
};

const SEED: Tool[] = [
  { id: "seed-1", slug: "writer_blog_full", title: "네이버 블로그 완전 자동화", subtitle: "작성–발행까지 원클릭", badge: "준비 중", price_cents: 0, currency: "KRW", is_active: false, icon_url: null },
  { id: "seed-2", slug: "image_extract", title: "이미지 추출", subtitle: "URL/문서에서 이미지 모으기", badge: "준비 중", price_cents: 0, currency: "KRW", is_active: false, icon_url: null },
  { id: "seed-3", slug: "blog_neighbor_plus", title: "네이버 블로그 서이추+이웃댓글 자동화", subtitle: "관계 증폭 자동화", badge: "준비 중", price_cents: 0, currency: "KRW", is_active: false, icon_url: null },
  { id: "seed-4", slug: "smartstore_review_autoreply", title: "스마트 스토어 리뷰 자동답글", subtitle: "리뷰 대응 자동화", badge: "준비 중", price_cents: 0, currency: "KRW", is_active: false, icon_url: null },
  { id: "seed-5", slug: "place_review_autoreply", title: "플레이스 리뷰 자동 답글", subtitle: "맵 리뷰 케어", badge: "준비 중", price_cents: 0, currency: "KRW", is_active: false, icon_url: null },
];

export async function GET(_req: NextRequest) {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.from("catalog_tools").select("id,slug,title,subtitle,badge,price_cents,currency,is_active,icon_url");
    if (error) throw error;
    const active = (data ?? []).filter((t) => t.is_active);
    const inactive = (data ?? []).filter((t) => !t.is_active);
    return NextResponse.json({ active, inactive });
  } catch {
    // Fallback to seed if table not ready
    return NextResponse.json({ active: [], inactive: SEED, fallback: true });
  }
}


