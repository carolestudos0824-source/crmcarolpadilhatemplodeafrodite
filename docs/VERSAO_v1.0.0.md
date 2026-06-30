# Registro de Versão — Fábrica de Apps com IA

- **Versão:** v1.0.0
- **Nome:** Publicação Comercial Inicial
- **Data:** 30/06/2026
- **Status:** Pronta para publicar

## Resumo
Esta versão consolida a Fábrica de Apps com IA como programa-guia completo para criação, organização, revisão, publicação, venda, validação e evolução de aplicativos com IA.

## Mudanças
- Reposicionamento da landing.
- Inclusão clara das três jornadas.
- Lovable comunicado como ferramenta principal recomendada, sem exclusividade.
- Comunicação de lógica adaptável a outras ferramentas de IA.
- Preservação do cubo visual.
- Remoção de suporte público.
- Remoção do botão flutuante da landing.
- Ajuda interna restrita a `/entrega*` como "Ajuda do Programa".
- Remoção do link "Suporte" do rodapé.
- Redirecionamento de `/suporte` para `/#perguntas-frequentes`.
- Correções de responsividade mobile.
- Correção de jornada, fase, módulo ativo e próximo passo.
- Preservação de preço, checkout, garantia, login, banco, RLS, admin, área paga, módulos, prompts, IDs, TOTAL_COMMANDS e progresso.

## Motivo
Corrigir posicionamento comercial, reduzir ambiguidade, evitar promessa de suporte humano, melhorar experiência mobile e preparar o app para publicação.

## Métrica esperada
Aumentar cliques no CTA, visitas ao checkout, clareza da oferta e conversão, reduzindo dúvidas sobre suporte, Lovable, MVP e escopo do programa.

## Riscos
- Landing longa no mobile.
- Usuário interpretar ajuda interna como suporte humano.
- Link antigo `/suporte` precisar redirecionar corretamente.
- Diferença entre preview e produção.
- Checkout falhar após publicação.
- Estado da jornada divergir após login.

## Plano de teste
- Testar landing pública logada e deslogada.
- Testar CTAs.
- Testar checkout.
- Testar `/suporte`.
- Testar `/entrega` deslogado.
- Testar `/entrega` logado.
- Testar mobile em 360, 375, 390, 414 e 430px.
- Confirmar ausência de suporte público.
- Confirmar cubo intacto.
- Confirmar "Ajuda do Programa" apenas em `/entrega`.
- Rodar typecheck.

## Rollback
Se algo quebrar, reverter para a versão anterior publicada. Se o erro estiver localizado:
- `src/pages/Home.tsx` — problemas na landing.
- `src/App.tsx` — problemas de rota `/suporte`.
- `src/components/FabricaQuickHelp.tsx` — problemas na ajuda interna.
- `src/pages/Checkout.tsx` — problemas de compra.
- `src/pages/Entrega.tsx` e `src/components/entrega/*` — problemas mobile ou jornada.

## Preservado
preço · checkout · login · banco · RLS · admin · área paga · módulos · prompts · IDs · TOTAL_COMMANDS · progresso · cubo visual · garantia · identidade visual.
