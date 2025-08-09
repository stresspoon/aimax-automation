// app/api/review/invite/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto' // Node 런타임 가정
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'nodejs' // Edge가 아니라 Node에서 돌릴 것

export async function POST(req: NextRequest) {
  const { projectId, applicantId, credits = 3, ttlDays = 30 } = await req.json()
  if (!projectId || !applicantId) {
    return NextResponse.json({ error: 'projectId/applicantId required' }, { status: 400 })
  }

  const admin = supabaseAdmin()
  const token = crypto.randomBytes(24).toString('base64url')
  const expiresAt = new Date(Date.now() + ttlDays * 86400000).toISOString()

  const { data, error } = await admin
    .from('review_invites')
    .insert({
      project_id: projectId,
      applicant_id: applicantId,
      token,
      credits,
      expires_at: expiresAt
    })
    .select('id, token, expires_at')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const base = process.env.APP_BASE_URL || 'http://localhost:3000'
  const link = `${base}/review/${data.token}`
  return NextResponse.json({ ok: true, token: data.token, link, expiresAt: data.expires_at })
}
