import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import ReviewClient from "@/components/review/review-client";

export default async function ReviewEntry({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const admin = supabaseAdmin();

  // find invite by token
  const { data: invite } = await admin
    .from("review_invites")
    .select("id, project_id, credits, used, expires_at, status")
    .eq("token", token)
    .maybeSingle();

  if (!invite) {
    notFound();
  }

  const expired = invite.expires_at ? new Date(invite.expires_at).getTime() < Date.now() : false;
  if (expired || invite.status !== "active") {
    return (
      <main className="py-16 text-center">
        <h1 className="text-2xl font-semibold mb-2">유효하지 않거나 만료된 초대입니다.</h1>
      </main>
    );
  }

  // load latest review pack for the project
  const { data: pack } = await admin
    .from("review_packs")
    .select("rules_json")
    .eq("project_id", invite.project_id)
    .order("created_at", { ascending: false })
    .maybeSingle();

  const guide = pack?.rules_json ?? null;

  return (
    <main className="py-8">
      <div className="max-w-[840px] mx-auto px-6">
        <ReviewClient token={token} invite={invite} guide={guide} />
      </div>
    </main>
  );
}

import { supabaseAdmin } from '@/lib/supabaseAdmin'

export default async function ReviewEntry({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const admin = supabaseAdmin()
  const { data, error } = await admin
    .from('review_invites')
    .select('credits, used, expires_at, status')
    .eq('token', token)
    .single()

  if (error || !data) return <div className="p-8">유효하지 않거나 만료된 초대입니다.</div>

  const left = data.credits - (data.used ?? 0)
  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold">리뷰 글쓰기 도우미(준비 중)</h1>
      <p className="mt-2">잔여 횟수: {left} / 만료일: {new Date(data.expires_at).toLocaleString()}</p>
      <p className="mt-6 text-[var(--fg)]/70">다음 단계에서 채널 선택과 초안 생성 UI가 붙습니다.</p>
    </div>
  )
}


