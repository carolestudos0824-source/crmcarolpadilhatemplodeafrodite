create table if not exists public.saved_prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone not null default now(),
  title text,
  content text not null,
  source_module text
);

create index if not exists saved_prompts_user_id_idx on public.saved_prompts(user_id);
create index if not exists saved_prompts_created_at_idx on public.saved_prompts(created_at);

revoke all on table public.saved_prompts from anon;
grant select, insert, update, delete on table public.saved_prompts to authenticated;
grant all on table public.saved_prompts to service_role;

alter table public.saved_prompts enable row level security;

drop policy if exists "Users can view their own saved prompts" on public.saved_prompts;
create policy "Users can view their own saved prompts"
  on public.saved_prompts for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "Users can insert their own saved prompts" on public.saved_prompts;
create policy "Users can insert their own saved prompts"
  on public.saved_prompts for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "Users can update their own saved prompts" on public.saved_prompts;
create policy "Users can update their own saved prompts"
  on public.saved_prompts for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "Users can delete their own saved prompts" on public.saved_prompts;
create policy "Users can delete their own saved prompts"
  on public.saved_prompts for delete to authenticated
  using (user_id = auth.uid());