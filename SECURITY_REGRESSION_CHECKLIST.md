# Security Regression Checklist

Rodar antes de cada deploy relevante (mudança em RLS, RPC, auth, admin ou tabelas privadas).
Marcar `[x]` ao validar. Se algum item falhar, **bloquear o deploy**.

---

## Perfil 1 — Usuário anônimo (sem login)

- [ ] `/admin/acessos` redireciona para login (não renderiza painel).
- [ ] `supabase.from('profiles').select('*')` → erro/0 linhas.
- [ ] `supabase.from('user_progress').insert({...})` → erro de RLS.
- [ ] `supabase.from('subscription_events').select('*')` → erro/0 linhas.
- [ ] `supabase.from('admin_users').select('*')` → erro/0 linhas.
- [ ] `supabase.rpc('admin_set_access', {...})` → erro `forbidden` ou permissão negada.
- [ ] `supabase.rpc('redeem_gift_code', { _code: 'X' })` → erro "Autenticação necessária".
- [ ] `supabase.rpc('admin_lookup_user', { _email: 'a@b.c' })` → erro permissão negada.

## Perfil 2 — Usuário comum autenticado (não admin)

- [ ] Login funciona; sessão persiste após reload.
- [ ] Lê o próprio `profiles` (1 linha, próprio `user_id`).
- [ ] Salva/atualiza `user_progress` do próprio `user_id`.
- [ ] Envia `quiz_responses` com sucesso.
- [ ] Envia `beta_feedback` com sucesso.
- [ ] Resgata gift code válido → `success: true`, `is_premium` atualiza.
- [ ] Tenta resgatar o mesmo código de novo → erro "Código inválido".
- [ ] `select * from profiles where user_id <> <eu>` → 0 linhas.
- [ ] `select * from user_progress where user_id <> <eu>` → 0 linhas.
- [ ] `select * from admin_users` → 0 linhas.
- [ ] `supabase.rpc('admin_set_access', { _user_id: <outro>, _has_access: true })` → erro `forbidden`. `user_access` do outro não muda.
- [ ] `supabase.rpc('admin_lookup_user', { _email: '...' })` → erro `forbidden`.
- [ ] Tentar `update profiles set is_premium = true where user_id = <eu>` direto via SDK → bloqueado por trigger/policy.
- [ ] `/admin/acessos` não renderiza painel (redireciona ou mostra "sem permissão").

## Perfil 3 — Admin autenticado

- [ ] `/admin/acessos` renderiza o painel.
- [ ] Buscar usuário por e-mail retorna `user_id`, `email`, `has_access`.
- [ ] Liberar acesso → `user_access.has_access = true`, refletido na UI.
- [ ] Revogar acesso → `user_access.has_access = false`, refletido na UI.
- [ ] Admin consegue acessar `/entrega` mesmo sem registro em `user_access`.
- [ ] Logs/`admin_audit_log` registram a ação (se aplicável).

## Higiene de segredos (qualquer perfil)

- [ ] `grep -ri "service_role" src/` → **sem ocorrências**.
- [ ] `grep -ri "SUPABASE_SERVICE_ROLE" src/` → **sem ocorrências**.
- [ ] `grep -r "VITE_.*SERVICE" .env*` → **sem ocorrências**.
- [ ] DevTools → Application → LocalStorage: nenhuma chave contém `service_role` ou JWT com `"role":"service_role"`.
- [ ] DevTools → Console: nenhum log imprime tokens.
- [ ] Build de produção (`dist/`) `grep -r "service_role"` → **sem ocorrências**.

## Linter Supabase

- [ ] Rodar linter. Comparar com a lista de warnings aceitos em `SECURITY_NOTES.md` §4.
- [ ] Qualquer warning **novo** fora da lista → tratar antes do deploy.
