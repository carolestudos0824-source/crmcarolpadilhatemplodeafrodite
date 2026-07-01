# Estado atual aprovado — Fábrica de Apps com IA

## Produto atual

A Fábrica de Apps com IA é um programa guiado para ajudar a pessoa a criar um app do zero usando IA, Lovable e comandos orientados.

A Fábrica de Apps não é o app final da pessoa.
Ela é a trilha guiada para a pessoa construir o próprio app.

## Oferta atual

Produto atual: Fábrica de Apps com IA.
Modelo atual: preço único.
Valor atual no código: R$47.
Não é assinatura.
Não é mensalidade.
Não existem planos múltiplos ativos.
Não existe Blueprint Personalizado como produto ativo.
Não existe plano Premium como produto ativo.

## Pagamento

Pagamento será resolvido por último.
O checkout real ainda depende de preencher `CHECKOUT_FABRICA_URL`.
Enquanto `CHECKOUT_FABRICA_URL` estiver como placeholder, a venda real ainda não está pronta.

Não criar webhook.
Não alterar integração de pagamento sem decisão explícita.
Não alterar preço sem aprovação.

## Acesso

A área `/entrega` é restrita.
Usuário sem login não acessa.
Usuário logado sem acesso não vê conteúdo premium.
Admin pode acessar para teste e gestão.
Liberação atual é manual/admin ou via código, conforme fluxo existente.
Não prometer liberação automática enquanto isso não estiver implementado.

## Jornada interna

A área interna possui 23 módulos:

1. Comece pelo Lovable
2. Comece aqui
3. Ideias prontas
4. Planejar o App
5. MVP e Arquitetura
6. Telas e Fluxo
7. Construir app
8. Login e banco
9. Página de venda
10. Monetização
11. Checkout e entrega
12. Legal e Confiança
13. Publicar e Domínio
14. Teste Final do App
15. SEO e GEO
16. Campanhas
17. Criativos
18. Métricas do App
19. Validação
20. Melhorias e Versões
21. Checklist
22. Erros comuns
23. Ativar acesso

## Progresso

`TOTAL_COMMANDS` deve continuar 54.
Os 54 comandos vêm dos 9 arrays antigos.
Não criar novos arrays `COMMANDS_*` sem rodada específica.
Os 23 módulos contam no progresso global.
Os 8 módulos novos concluem automaticamente quando todos os itens de seus checklists são marcados.

## Segurança

Não mexer sem necessidade em:

* Supabase
* RLS
* RPCs
* auth
* banco
* policies
* admin
* códigos premium
* compradores
* logs
* checkout
* rotas públicas

## Pendência bloqueante para venda

A única pendência crítica para venda pública é preencher a URL real do checkout:

`CHECKOUT_FABRICA_URL`

## Regra de evolução

Criar ou alterar uma coisa por vez.
Auditar depois de cada alteração.
Pagamento fica por último.
Refatoração do `Entrega.tsx` pode esperar.
