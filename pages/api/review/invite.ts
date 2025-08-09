// pages/api/review/invite.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end('Method Not Allowed')
  }

  try {
    const { projectId, applicantId, credits = 3, ttlDays = 30 } = req.body || {}
    if (!projectId || !applicantId) {
      return res.status(400).json({ error: 'projectId/applicantId required' })
    }

    const token = crypto.randomBytes(24).toString('base64url')
    const expiresAt = new Date(Date.now() + ttlDays * 86400000).toISOString()

    const admin = supabaseAdmin()
    const { data, error } = await admin
      .from('review_invites')
      .insert({
        project_id: projectId,
        applicant_id: applicantId,
        token,
        credits,
        expires_at: expiresAt
      })
      .select('token, expires_at')
      .single()

    if (error) return res.status(500).json({ error: error.message })

    const base = process.env.APP_BASE_URL || 'http://localhost:3000'
    const link = `${base}/review/${data.token}`
    return res.status(200).json({ ok: true, token: data.token, link, expiresAt: data.expires_at })
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'unknown' })
  }
}
