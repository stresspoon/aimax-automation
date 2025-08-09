import { supabaseAdmin } from '@/lib/supabaseAdmin'

export default async function ReviewEntry({ params }: { params: { token: string } }) {
  const admin = supabaseAdmin()
  const { data, error } = await admin
    .from('review_invites')
    .select('credits, used, expires_at, status')
    .eq('token', params.token)
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


