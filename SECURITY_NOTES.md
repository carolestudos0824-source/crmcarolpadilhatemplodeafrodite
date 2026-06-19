# Security Notes — Fábrica de Apps com IA

Este documento registra as decisões de segurança do backend (Lovable Cloud / Postgres + RLS) e justifica os warnings de linter que são **intencionais**.

---

## 1. Modelo de acesso

- **Anônimo**: pode ver landing, checkout e páginas públicas. Não pode ler/escrever dados privados.
- **Authenticated** (usuário comum): lê e escreve **apenas o próprio** `user_id` em todas as tabelas privadas.
- **Admin**: identificado pela presença em `public.admin_users`. Verificação central via `public.is_admin()` / `public.is_admin(uuid)`.
- **Service role**: usado **apenas** em webhooks/edge functions no backend. **Nunca** é exposta ao frontend, bundle, env público (`VITE_*`), localStorage ou console.

RLS está habilitada em todas as tabelas do schema `public` que armazenam dados de usuário. Policies usam `auth.uid() = user_id` ou `public.is_admin(auth.uid())`.

---

## 2. Funções SECURITY DEFINER intencionais

Todas as funções abaixo possuem `SET search_path = 'public'` explícito.

### 2.1 Verificação de papel — `is_admin()`, `is_admin(uuid)`, `has_role(uuid, app_role)`

- **Motivo**: usadas dentro de policies RLS para evitar recursão (o `public.user_roles` / `public.admin_users` tem RLS própria que dependeria de si mesma).
- **EXECUTE**: `authenticated`, `service_role`. Revogado de `public`/`anon`.
- **Validação interna**: retornam apenas booleano. Não expõem lista de admins nem permitem enumeração.
- **Warning aceito** (`0029_authenticated_security_definer_function_executable`): precisam ser chamáveis pelo planner das policies sob o role `authenticated`. Sem isso, RLS quebra.

### 2.2 RPCs administrativas — `admin_set_access(uuid, boolean)`, `admin_lookup_user(text)`

- **Motivo**: chamadas pelo painel `/admin/acessos`. Precisam rodar com privilégios elevados para gravar em `user_access` / ler `auth.users`.
- **EXECUTE**: `authenticated`. Revogado de `public`/`anon`.
- **Validação interna**: primeira linha é `IF NOT public.is_admin() THEN RAISE EXCEPTION 'forbidden'`. Usuário comum recebe erro e nada acontece.
- **Warning aceito**: precisam ser chamáveis do cliente autenticado (admin logado). A autorização real está dentro da função, não no GRANT.


### 2.3 Resgate de gift code — `redeem_gift_code(text, uuid)`

- **Motivo**: precisa gravar em `gift_redemptions` e atualizar `profiles.is_premium` atomicamente, com rate-limit e lock.
- **EXECUTE**: `authenticated`. Revogado de `public`/`anon`.
- **Validação interna**:
  - exige `auth.uid()` (retorna erro se anônimo);
  - usa `auth.uid()` internamente — **ignora** o parâmetro `_user_id` para o destino do resgate, impossibilitando resgatar em nome de terceiros;
  - rate-limit de 10 tentativas / 15 min por usuário;
  - `UNIQUE (gift_code_id, user_id)` em `gift_redemptions` impede uso duplo;
  - lock `FOR UPDATE` + `current_uses < max_uses` impede race condition.
- **Warning aceito**: precisa ser chamada do cliente autenticado.

### 2.4 Funções de trigger — `handle_new_user`, `update_updated_at_column`, `handle_updated_at`, `enforce_quiz_publish_threshold`

- **Motivo**: executadas automaticamente por triggers (`AFTER INSERT ON auth.users`, `BEFORE UPDATE` etc.).
- **EXECUTE**: revogado de `public`/`anon`/`authenticated`. Só o owner (postgres) as invoca via trigger.
- **Validação interna**: não recebem entrada de cliente; operam sobre `NEW`/`OLD`.
- **Warning**: não se aplica — não são expostas ao Data API.


---

## 3. Regras permanentes (não violar)

1. **Nunca** expor `SUPABASE_SERVICE_ROLE_KEY` no frontend, em variáveis `VITE_*`, no bundle, no localStorage ou em logs do console.
2. **Nunca** declarar status de admin via flag client-side (localStorage, cookie não-httpOnly, hardcode). Sempre validar via `is_admin()` no servidor.
3. **Nunca** criar policy `FOR ... TO public USING (true)` em tabela com dados privados.
4. **Nunca** permitir que usuário comum altere `role`, `has_access`, `is_premium`, `premium_until`, ou qualquer coluna de outro usuário.
5. **Nunca** remover as checagens `IF NOT public.is_admin() THEN RAISE EXCEPTION 'forbidden'` das RPCs administrativas.
6. **Nunca** trocar `auth.uid()` por um parâmetro recebido do cliente em RPCs que gravam dados pessoais.
7. **Nunca** desabilitar RLS em tabelas privadas para "consertar" um 403 — corrigir a policy ou o GRANT.
8. **Sempre** acompanhar `CREATE TABLE public.<x>` de `GRANT ... TO authenticated` + `ENABLE ROW LEVEL SECURITY` + `CREATE POLICY`.

---

## 4. Warnings de linter aceitos

| Lint | Função(ões) | Justificativa |
|---|---|---|
| `0029_authenticated_security_definer_function_executable` | `is_admin`, `has_role`, `admin_set_access`, `admin_lookup_user`, `apply_arcano_backfill`, `redeem_gift_code` | Precisam ser chamáveis por `authenticated` — autorização real é feita dentro da função (`is_admin()` ou `auth.uid()`). |

Qualquer warning **novo** que apareça fora desta lista deve ser tratado, não ignorado.
