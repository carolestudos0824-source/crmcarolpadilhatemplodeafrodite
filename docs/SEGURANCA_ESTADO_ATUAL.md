# Segurança — Estado atual aprovado

## Status geral

A segurança da Fábrica de Apps com IA foi auditada e está aprovada para esta fase.

A área `/entrega` é restrita.
Usuário anônimo não acessa.
Usuário logado sem acesso não vê conteúdo premium.
Usuário com acesso entra.
Admin acessa painel admin.
Usuário comum não acessa painel admin.

## Correções aplicadas

### user_access

A tabela `user_access` está protegida.

Regras:

* `user_id` é NOT NULL.
* usuário comum só lê a própria linha.
* usuário comum não lista acessos de outros usuários.
* usuário comum não insere, edita ou deleta acesso.
* admin gerencia acesso via RPC segura.
* service role continua podendo operar.

Conclusão:
Não há vazamento de e-mails ou dados de outros usuários para usuário comum.

### gift_redemptions

A tabela `gift_redemptions` está protegida.

Regras:

* usuário comum não pode inserir resgate diretamente.
* resgate acontece somente via RPC `redeem_gift_code`.
* usuário comum só vê os próprios resgates.
* admin vê o necessário.

Conclusão:
Usuário comum não consegue se auto-liberar acesso por inserção direta.

### gift_codes

A tabela `gift_codes` está protegida.

Regras:

* usuário comum não lista códigos.
* usuário comum não cria, ativa ou altera códigos.
* admin opera por RPC segura.

Conclusão:
Códigos premium não ficam expostos para usuários comuns.

## Avisos mantidos por design

### support_messages

Existe `INSERT WITH CHECK (true)` para permitir formulário público de suporte.

Justificativa:
Visitantes e usuários precisam conseguir enviar mensagem de suporte.

Restrições:

* SELECT não é público.
* UPDATE não é público.
* DELETE não é público.
* leitura e gestão ficam restritas ao admin.

Risco residual:
Spam no formulário.

Mitigação futura:
Adicionar captcha, rate-limit ou validação extra se necessário.

### magias e tarot_content

Existem policies de leitura pública `USING (true)`.

Justificativa:
São catálogos públicos legados e não expõem dados sensíveis de usuários da Fábrica de Apps.

### gift_code_redemption_attempts

RLS ativado sem policy.

Justificativa:
A tabela fica bloqueada para clientes. Escrita ocorre apenas pela RPC segura `redeem_gift_code`.

Não criar policy ampla apenas para silenciar scanner.

## Avisos da aba Segurança

Se a aba Segurança continuar mostrando avisos:

* `user_access`: considerar cache/heurística conservadora se as policies atuais estiverem preservadas.
* `gift_redemptions`: considerar cache se não houver policy INSERT para authenticated.
* `support_messages`: aviso intencional e aceito por ser formulário público.
* `gift_code_redemption_attempts`: intencional, tabela bloqueada ao client.

Não usar o botão "Tente corrigir tudo" sem auditoria manual.

## Invariantes

Não alterar sem rodada específica:

* checkout
* URL de pagamento
* preço
* Supabase
* RLS
* RPCs
* auth
* banco
* admin
* policies
* códigos premium
* compradores
* logs
* TOTAL_COMMANDS
* progresso global

## Status comercial

A única pendência bloqueante para venda real continua sendo:

`CHECKOUT_FABRICA_URL`

Pagamento fica por último.
