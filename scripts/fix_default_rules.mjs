// scripts/fix_default_rules.mjs
// Usage: node scripts/fix_default_rules.mjs
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(url, key, { auth: { persistSession: false } })

const DEFAULT_RULES = {
  blog: { min: 300 },
  instagram: { min: 1000 },
  threads: { min: 500 },
}

const { data, error } = await supabase
  .from('projects')
  .update({ rules_json: DEFAULT_RULES })
  .is('rules_json', null)
  .select('id')

if (error) {
  console.error('Update failed:', error.message)
  process.exit(1)
}

console.log(`Updated ${data?.length ?? 0} projects with default rules_json`)

