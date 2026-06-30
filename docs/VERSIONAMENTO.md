# Padrão Oficial de Versionamento — Fábrica de Apps com IA

## v1.0.0 — Publicação Comercial Inicial

Primeira versão pública estável do produto.

Usar quando o app estiver pronto para publicação comercial inicial, com landing, checkout, área interna, jornada principal e validações essenciais funcionando.

## v1.0.1, v1.0.2, v1.0.3 — Hotfix pequeno

Usar para correções pontuais que não mudam o produto.

Exemplos:
- correção de texto;
- correção de botão;
- correção de rota;
- correção de responsividade;
- correção de bug visual;
- correção de navegação;
- ajuste de copy;
- redirecionamento;
- remoção de link;
- correção sem alterar banco, checkout ou lógica principal.

Regra:
Hotfix não deve mudar promessa, produto, preço, checkout, banco, RLS, área paga ou estrutura principal.

## v1.1.0, v1.2.0, v1.3.0 — Melhoria funcional

Usar quando houver melhoria real no produto sem quebrar a base.

Exemplos:
- nova seção;
- melhoria de fluxo;
- nova tela;
- melhoria no GPS do App;
- melhoria na lógica de jornada;
- melhoria no painel de progresso;
- novo recurso interno pequeno;
- melhoria no Agente Arquiteto;
- nova experiência dentro da entrega.

Regra:
Melhoria funcional pode adicionar valor, mas não deve exigir reconstrução estrutural nem alterar o modelo principal do produto.

## v2.0.0 — Mudança grande

Usar quando houver mudança estrutural relevante.

Exemplos:
- nova arquitetura;
- novo checkout;
- novo modelo de acesso;
- nova área interna;
- nova lógica de pagamento;
- novo sistema de permissões;
- grande mudança comercial;
- mudança profunda na jornada ou no produto.

Regra:
Versão 2.0.0 indica mudança grande o suficiente para exigir novo plano de teste, novo registro de release e rollback bem definido.

## Regra de registro de versão

Toda nova versão deve registrar:

- número da versão;
- data;
- mudança feita;
- motivo;
- métrica esperada;
- risco;
- plano de teste;
- plano de rollback;
- arquivos alterados;
- status da validação.
