// scripts/seed_applicants.mjs
// Usage: SEED_PROJECT_ID=project_uuid node scripts/seed_applicants.mjs
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
const projectId = process.env.SEED_PROJECT_ID

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}
if (!projectId) {
  console.error('Set SEED_PROJECT_ID to target project uuid')
  process.exit(1)
}

const supabase = createClient(url, key, { auth: { persistSession: false } })

const N = 8
const rows = Array.from({ length: N }).map((_, i) => ({
  project_id: projectId,
  name: `테스터 ${i + 1}`,
  email: `tester${i + 1}@example.com`,
  phone: `010-0000-${String(1000 + i)}`,
  source: 'seed',
  url_threads: null,
  url_instagram: null,
  url_blog: null,
  status: 'pending'
}))

const { error } = await supabase.from('applicants').insert(rows)
if (error) {
  console.error('Insert failed:', error.message)
  process.exit(1)
}
console.log(`Seeded ${rows.length} pending applicants to project ${projectId}`)

