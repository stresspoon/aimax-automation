-- review schema: tables + RLS policies
-- Run this in Supabase SQL editor on your project

begin;

-- 1) Tables

create table if not exists public.review_packs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  rules_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.review_invites (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  applicant_id uuid not null,
  token text unique not null,
  credits int not null default 3,
  expires_at timestamptz not null,
  used int not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.review_drafts (
  id uuid primary key default gen_random_uuid(),
  invite_id uuid not null references public.review_invites(id) on delete cascade,
  channel text not null,
  outline jsonb,
  draft text,
  created_at timestamptz not null default now()
);

create table if not exists public.review_submissions (
  id uuid primary key default gen_random_uuid(),
  invite_id uuid not null references public.review_invites(id) on delete cascade,
  channel text not null,
  url text,
  checks jsonb,
  created_at timestamptz not null default now()
);

-- 2) RLS

alter table public.review_packs enable row level security;
alter table public.review_invites enable row level security;
alter table public.review_drafts enable row level security;
alter table public.review_submissions enable row level security;

-- Helper ownership predicate: projects.user_id = auth.uid()
-- review_packs owner
drop policy if exists rp_owner_select on public.review_packs;
create policy rp_owner_select on public.review_packs
  for select using (
    exists (
      select 1 from public.projects p
      where p.id = review_packs.project_id and p.user_id = auth.uid()
    )
  );

drop policy if exists rp_owner_ins on public.review_packs;
create policy rp_owner_ins on public.review_packs
  for insert with check (
    exists (
      select 1 from public.projects p
      where p.id = review_packs.project_id and p.user_id = auth.uid()
    )
  );

drop policy if exists rp_owner_upd on public.review_packs;
create policy rp_owner_upd on public.review_packs
  for update using (
    exists (
      select 1 from public.projects p
      where p.id = review_packs.project_id and p.user_id = auth.uid()
    )
  );

drop policy if exists rp_owner_del on public.review_packs;
create policy rp_owner_del on public.review_packs
  for delete using (
    exists (
      select 1 from public.projects p
      where p.id = review_packs.project_id and p.user_id = auth.uid()
    )
  );

-- review_invites owner
drop policy if exists ri_owner_all on public.review_invites;
create policy ri_owner_all on public.review_invites
  for all using (
    exists (
      select 1 from public.projects p
      where p.id = review_invites.project_id and p.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.projects p
      where p.id = review_invites.project_id and p.user_id = auth.uid()
    )
  );

-- Token-based read for invites (for anonymous access to a single row)
-- This uses a custom JWT claim "inv_token"; the row is visible only if it matches
-- If you don't inject a custom claim, server-side service-role queries already bypass RLS
drop policy if exists ri_select_by_token on public.review_invites;
create policy ri_select_by_token on public.review_invites
  for select using (
    -- allow when JWT contains inv_token and it matches the row token
    (current_setting('request.jwt.claims', true)::jsonb ? 'inv_token')
    and token = (current_setting('request.jwt.claims', true)::jsonb ->> 'inv_token')
  );

-- review_drafts owner via invite->project
drop policy if exists rd_owner_all on public.review_drafts;
create policy rd_owner_all on public.review_drafts
  for all using (
    exists (
      select 1 from public.projects p
      join public.review_invites ri on ri.project_id = p.id
      where review_drafts.invite_id = ri.id and p.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.projects p
      join public.review_invites ri on ri.project_id = p.id
      where review_drafts.invite_id = ri.id and p.user_id = auth.uid()
    )
  );

-- review_submissions owner via invite->project
drop policy if exists rs_owner_all on public.review_submissions;
create policy rs_owner_all on public.review_submissions
  for all using (
    exists (
      select 1 from public.projects p
      join public.review_invites ri on ri.project_id = p.id
      where review_submissions.invite_id = ri.id and p.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.projects p
      join public.review_invites ri on ri.project_id = p.id
      where review_submissions.invite_id = ri.id and p.user_id = auth.uid()
    )
  );

commit;

-- Notes:
-- 1) The "ri_select_by_token" policy requires injecting a custom JWT claim { inv_token: "..." }
--    for anonymous clients. Server-side calls with service role bypass RLS, so not required there.
-- 2) All owner policies hinge on projects.user_id = auth.uid(). Ensure RLS is enabled on projects too.


