// pages/api/review/invite.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const { projectId, applicantId } = req.body

  if (!projectId || !applicantId) {
    return res.status(400).json({ error: 'projectId and applicantId are required' })
  }

  // TODO: 실제 초대 로직 작성 (DB insert, 메일 발송 등)
  return res.status(200).json({ success: true })
}
