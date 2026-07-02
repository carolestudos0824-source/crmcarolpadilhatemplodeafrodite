import type { PromptItem } from "@/components/entrega/PromptsExecutarEtapa";

export const PROMPTS_PUBLICAR: PromptItem[] = [
  {
    id: "p1-diagnostico-caminho",
    tipo: "agente",
    titulo: "Diagnóstico do caminho ideal",
    descricao: "Use antes de decidir se vai continuar como web app, virar PWA ou pensar em loja.",
    texto: `Analise meu app e me ajude a decidir qual caminho seguir depois que ele ficou pronto.

Contexto do meu app:
- Nome do app: [preencha]
- Público-alvo: [preencha]
- O que o app faz: [preencha]
- O app já foi publicado? Sim/Não
- Já tenho domínio? Sim/Não
- Já tenho pessoas reais usando? Sim/Não
- Já validei a oferta? Sim/Não
- O app funciona bem no celular? Sim/Não
- Existe login? Sim/Não
- Existe banco de dados? Sim/Não
- Existe checkout ou área paga? Sim/Não
- As pessoas precisam acessar com frequência? Sim/Não
- Alguém pediu app instalado? Sim/Não
- O app precisa de câmera, GPS, notificações ou recursos avançados do celular? Sim/Não

Quero que você me diga:
1. Se devo manter como web app.
2. Se faz sentido transformar em PWA.
3. Se faz sentido preparar para Google Play.
4. Se faz sentido preparar para App Store.
5. Se devo deixar app nativo para o futuro.
6. Quais riscos existem se eu tentar ir para loja agora.
7. Qual deve ser meu próximo passo mais seguro.

Não prometa aprovação em loja, vendas, downloads ou resultado financeiro. Seja direto, prático e estratégico.`,
  },
  {
    id: "p2-publicar-web",
    tipo: "lovable",
    titulo: "Preparar o app como web app publicado",
    descricao: "Auditoria de prontidão para publicar como web app com domínio.",
    texto: `PUBLICAR WEB APP COM MAIS SEGURANÇA

Pedido direto:
Revise meu app para garantir que ele está pronto para ser publicado como web app com domínio, sem transformar em PWA, sem empacotar para loja e sem alterar o escopo principal.

Contexto:
Este app foi construído no Lovable e eu quero publicar primeiro como web app para validar com pessoas reais antes de pensar em App Store ou Google Play.

Tarefa específica:
Auditar a experiência de publicação web do app.

Faça obrigatoriamente:
1. Verificar se as páginas principais estão acessíveis.
2. Verificar se a navegação funciona no desktop e no mobile.
3. Verificar se o app tem nome claro e descrição clara.
4. Verificar se os botões principais funcionam.
5. Verificar se o fluxo principal pode ser concluído.
6. Verificar se páginas privadas estão protegidas, se existirem.
7. Verificar se links importantes funcionam.
8. Verificar se há erros visíveis na interface.
9. Sugerir ajustes pequenos e seguros, se necessário.

Preserve:
- estrutura atual do projeto
- login, banco, RLS, policies, checkout, admin, dados das pessoas usuárias e lógica de acesso
- páginas e identidade visual aprovadas

Não faça:
- não refaça o projeto inteiro
- não transforme em PWA agora
- não empacote para Android ou iOS
- não altere checkout, pagamento ou acesso
- não altere banco, RLS ou policies
- não exponha secrets, tokens, senhas ou chaves
- não use service_role no frontend

Critério de aceite:
O app deve estar pronto para ser publicado e testado como web app com domínio, com os principais fluxos funcionando.`,
  },
  {
    id: "p3-preparar-pwa",
    tipo: "lovable",
    titulo: "Preparar para PWA",
    descricao: "Avalia prontidão PWA sem publicar em loja e sem virar nativo.",
    texto: `PREPARAÇÃO PARA PWA INSTALÁVEL

Pedido direto:
Avalie e prepare meu app para uma possível experiência PWA instalável, sem publicar em lojas e sem transformar em app nativo.

Contexto:
Meu app já existe como web app. Quero avaliar se faz sentido evoluir para uma PWA, com experiência mais parecida com aplicativo instalado, antes de pensar em Google Play ou App Store.

Tarefa específica:
Revisar o app para prontidão PWA.

Faça obrigatoriamente:
1. Verificar se o app funciona bem no mobile.
2. Verificar se layout, botões e menus estão bons para toque.
3. Verificar se as telas principais não ficam cortadas.
4. Verificar se o fluxo principal funciona no celular.
5. Verificar se existe nome curto e nome completo do app.
6. Verificar se existe ícone adequado ou indicar onde preciso adicionar.
7. Verificar se a experiência faz sentido em tela cheia.
8. Sugerir melhorias antes de ativar comportamento PWA.
9. Não implementar nada arriscado sem explicar antes.

Preserve:
- estrutura atual do projeto
- login, banco, RLS, policies, checkout, admin e dados das pessoas usuárias
- páginas e identidade visual aprovadas

Não faça:
- não publique na App Store
- não publique na Google Play
- não empacote para Android/iOS
- não altere banco, RLS ou policies
- não use service_role no frontend
- não exponha secrets ou chaves
- não prometa que será aceito em loja

Critério de aceite:
O app deve estar avaliado e preparado para uma evolução PWA simples, com riscos e próximos passos claros.`,
  },
];

export const PROMPTS_TESTE: PromptItem[] = [
  {
    id: "p4-auditoria-final",
    tipo: "lovable",
    titulo: "Auditoria final antes de PWA ou loja",
    descricao: "Relatório de prontidão mobile e segurança básica antes de evoluir.",
    texto: `AUDITORIA FINAL ANTES DE PWA OU LOJA

Pedido direto:
Faça uma auditoria final do meu app antes de eu pensar em transformar em PWA, empacotar para Android/iOS ou enviar para App Store/Google Play.

Contexto:
Meu app foi construído no Lovable. Antes de evoluir para PWA ou loja, quero identificar problemas de mobile, login, banco, segurança, links, performance e experiência.

Tarefa específica:
Auditar o app inteiro com foco em prontidão mobile e segurança básica.

Faça obrigatoriamente:
1. Testar experiência mobile.
2. Verificar botões, menus, textos e telas no celular.
3. Verificar se cadastro, login e logout funcionam, se existirem.
4. Verificar se páginas privadas estão protegidas.
5. Verificar se cada pessoa acessa apenas os próprios dados.
6. Verificar se não há dados sensíveis expostos.
7. Verificar se não há secrets, tokens ou service_role no frontend.
8. Verificar se as páginas principais funcionam.
9. Verificar se existem páginas ou links de suporte, política de privacidade e termos quando necessário.
10. Listar bugs, riscos e ajustes recomendados.

Preserve:
- estrutura atual do projeto
- login, banco, RLS, policies, checkout, admin, área de entrega e dados das pessoas usuárias

Não faça:
- não refaça o projeto inteiro
- não altere banco ou RLS sem necessidade
- não altere checkout ou pagamento
- não remova funcionalidades existentes
- não exponha secrets, tokens, senhas ou chaves
- não use service_role no frontend
- não publique em lojas
- não prometa aprovação em loja

Critério de aceite:
Receber um relatório claro com: problemas encontrados, riscos, ajustes prioritários, o que pode esperar e se o app está pronto para continuar como web, evoluir para PWA ou se ainda precisa de correções.`,
  },
  {
    id: "p5-correcao-cirurgica",
    tipo: "lovable",
    titulo: "Correção cirúrgica antes de evoluir",
    descricao: "Corrige só o necessário, sem refazer o projeto.",
    texto: `CORREÇÃO CIRÚRGICA ANTES DE EVOLUIR O APP

Pedido direto:
Corrija apenas os problemas necessários para deixar meu app mais estável antes de pensar em PWA, loja ou versão mobile, sem refazer o projeto inteiro.

Contexto:
Depois de testar meu app, encontrei estes problemas:
- Problema 1: [preencha]
- Problema 2: [preencha]
- Problema 3: [preencha]

Tarefa específica:
Corrigir somente os problemas listados, preservando a estrutura atual.

Faça obrigatoriamente:
1. Corrigir apenas o que foi listado.
2. Explicar o que será alterado antes de alterar algo sensível.
3. Preservar funcionalidades existentes.
4. Testar o fluxo afetado depois da correção.
5. Informar se existe algum risco residual.

Preserve:
- estrutura atual do projeto
- páginas aprovadas
- identidade visual
- login, banco, RLS, policies, checkout, admin e dados das pessoas usuárias

Não faça:
- não refaça o projeto inteiro
- não mexa em checkout ou pagamento
- não altere banco, RLS ou policies sem necessidade clara
- não remova funcionalidades
- não exponha secrets, tokens, senhas ou chaves
- não use service_role no frontend
- não crie funcionalidades novas sem pedido

Critério de aceite:
Os problemas listados devem ser corrigidos sem quebrar login, banco, checkout, área paga, admin ou fluxos existentes.`,
  },
];

export const PROMPTS_MELHORIAS: PromptItem[] = [
  {
    id: "p6-planejar-versao",
    tipo: "agente",
    titulo: "Planejar a próxima versão do app",
    descricao: "Organiza o que entra, o que espera e a ordem dos próximos prompts.",
    texto: `Me ajude a planejar a próxima versão do meu app.

Contexto do app:
- Nome: [preencha]
- Público: [preencha]
- O que ele faz: [preencha]
- Já publiquei? Sim/Não
- Já tenho pessoas reais usando? Sim/Não
- O que as pessoas mais usam: [preencha]
- O que está gerando dúvida: [preencha]
- O que está dando erro: [preencha]
- O que eu quero melhorar: [preencha]
- Estou pensando em: web app, PWA, Google Play, App Store ou nativo futuro.

Quero que você organize:
1. O que deve entrar na próxima versão.
2. O que deve ficar para depois.
3. O que não vale a pena fazer agora.
4. Se devo continuar como web app, evoluir para PWA, preparar loja ou esperar.
5. Um plano simples de versão 1.1, 1.2 e 2.0.
6. Quais prompts devo mandar para o Lovable, em ordem segura.

Não prometa vendas, downloads, aprovação em loja ou resultado financeiro. Seja estratégico e reduza o escopo.`,
  },
  {
    id: "p7-mobile-antes-pwa",
    tipo: "lovable",
    titulo: "Melhorar experiência mobile antes de PWA",
    descricao: "Ajustes seguros de usabilidade mobile antes de virar PWA.",
    texto: `MELHORIA DA EXPERIÊNCIA MOBILE ANTES DE PWA

Pedido direto:
Melhore a experiência mobile do meu app antes de eu pensar em transformá-lo em PWA ou publicar em lojas.

Contexto:
Meu app já está funcionando como web app, mas quero melhorar a experiência no celular antes de avançar para PWA, Google Play ou App Store.

Tarefa específica:
Revisar e melhorar a usabilidade mobile do app, com mudanças pequenas e seguras.

Faça obrigatoriamente:
1. Verificar responsividade das telas principais.
2. Melhorar espaçamentos, botões e legibilidade no celular.
3. Verificar menus e navegação mobile.
4. Corrigir telas cortadas ou elementos difíceis de tocar.
5. Preservar identidade visual atual.
6. Não alterar regras de negócio.
7. Não alterar login, banco, checkout ou permissões.

Preserve:
- estrutura atual do projeto
- identidade visual aprovada
- fluxos principais
- login, banco, RLS, policies, checkout, admin e dados das pessoas usuárias

Não faça:
- não refaça o projeto inteiro
- não mude layout desktop aprovado sem necessidade
- não altere banco ou policies
- não mexa em checkout
- não publique em lojas
- não implemente PWA ainda, apenas prepare a experiência mobile

Critério de aceite:
O app deve ficar mais confortável de usar no celular, sem quebrar desktop, login, banco, checkout ou fluxos principais.`,
  },
  {
    id: "p8-plano-loja",
    tipo: "agente",
    titulo: "Plano de preparação para loja",
    descricao: "Checklists separadas para Google Play e App Store, com riscos.",
    texto: `Me ajude a montar um plano de preparação para publicar meu app em loja no futuro.

Contexto do app:
- Nome: [preencha]
- Público: [preencha]
- O que o app faz: [preencha]
- Plataforma desejada: Google Play, App Store ou ambas
- Já tenho pessoas reais usando? Sim/Não
- Já validei a oferta? Sim/Não
- O app tem login? Sim/Não
- O app coleta dados? Sim/Não
- O app tem checkout? Sim/Não
- O app tem política de privacidade? Sim/Não
- O app tem suporte? Sim/Não

Quero que você me entregue:
1. Se faz sentido pensar em loja agora ou se devo esperar.
2. O que preciso preparar antes.
3. Quais páginas, documentos e informações preciso organizar.
4. Quais riscos podem gerar reprovação ou retrabalho.
5. Uma checklist separada para Google Play.
6. Uma checklist separada para App Store.
7. O que devo pedir para o Lovable revisar antes.

Não prometa aprovação, vendas, downloads ou resultado financeiro.`,
  },
];

export const PROMPTS_CHECKLIST: PromptItem[] = [
  {
    id: "p9-decisao-final",
    tipo: "agente",
    titulo: "Decisão final do caminho",
    descricao: "Recomendação direta entre web, PWA, Play, App Store ou nativo.",
    texto: `Com base nas minhas respostas, me diga qual caminho seguir agora com meu app.

Respostas:
- Meu app está publicado? Sim/Não
- Meu app tem domínio? Sim/Não
- Meu app funciona bem no celular? Sim/Não
- Meu app já tem pessoas reais usando? Sim/Não
- Meu app já validou uma oferta? Sim/Não
- Meu app tem login funcionando? Sim/Não
- Meu app tem banco de dados funcionando? Sim/Não
- Meu app tem checkout ou área paga? Sim/Não
- Meu app tem política de privacidade? Sim/Não
- Meu app tem suporte claro? Sim/Não
- Meu app tem bugs importantes? Sim/Não
- Pessoas usuárias pediram app instalado? Sim/Não
- O público usa mais Android, iPhone ou navegador?
- O app precisa de câmera, GPS, push notification ou recursos avançados? Sim/Não

Quero uma recomendação direta entre:
1. Continuar como web app.
2. Melhorar o web app antes.
3. Transformar em PWA.
4. Preparar para Google Play.
5. Preparar para App Store.
6. Deixar nativo para o futuro.

Explique o motivo, os riscos e o próximo passo prático. Não prometa aprovação em loja, vendas, downloads ou resultado financeiro.`,
  },
  {
    id: "p10-briefing-mobile-dev",
    tipo: "agente",
    titulo: "Briefing para um dev mobile no futuro",
    descricao: "Transforma o app atual em briefing seguro para equipe técnica.",
    texto: `Me ajude a transformar meu app atual em um briefing para um desenvolvedor mobile ou equipe técnica no futuro.

Contexto:
Meu app foi construído primeiro como web app. Talvez no futuro eu queira uma versão nativa ou mais avançada.

Informações do app:
- Nome: [preencha]
- Público: [preencha]
- Objetivo: [preencha]
- Funcionalidades principais: [preencha]
- Funcionalidades pagas: [preencha]
- Login: [preencha]
- Banco de dados: [preencha]
- Integrações: [preencha]
- Checkout: [preencha]
- Dados coletados: [preencha]
- Telas principais: [preencha]
- Problemas atuais: [preencha]
- Recursos mobile desejados: [preencha]

Quero que você gere:
1. Um briefing claro do app.
2. Lista de funcionalidades essenciais.
3. Lista de funcionalidades que podem ficar para depois.
4. Riscos técnicos.
5. Cuidados com segurança, dados, login e pagamento.
6. Perguntas que devo fazer ao desenvolvedor.
7. O que não devo entregar, como senhas, tokens, chaves secretas ou service_role.

Não escreva código. Não peça secrets. Não oriente burlar login, pagamento, RLS ou regras de acesso.`,
  },
];

export const PROMPTS_ERROS: PromptItem[] = [
  {
    id: "erros-p1-loja-cedo",
    tipo: "agente",
    titulo: "Revisar se estou indo para loja cedo demais",
    descricao: "Analisa se faz sentido tentar App Store / Google Play agora ou se ainda é fase de web app.",
    texto: `Analise se estou tentando publicar meu app em loja cedo demais.

Contexto do meu app:
- Nome:
- Público:
- O que o app faz:
- Já publiquei como web app? Sim/Não
- Já tenho domínio? Sim/Não
- Já tenho usuárias reais? Sim/Não
- Já validei a oferta? Sim/Não
- Já recebi feedback real? Sim/Não
- O app funciona bem no celular? Sim/Não
- Existem bugs importantes? Sim/Não
- Tenho política de privacidade? Sim/Não
- Tenho suporte claro? Sim/Não
- Quero ir para: Google Play, App Store ou ambas
- Meu motivo para querer loja:

Quero que você me diga:
1. Se estou indo para loja cedo demais.
2. O que preciso corrigir antes.
3. Se devo continuar como web app por enquanto.
4. Se PWA já resolveria meu momento.
5. Quais riscos existem se eu tentar loja agora.
6. Qual próximo passo mais seguro.

Não prometa aprovação, vendas, downloads ou resultado financeiro.`,
  },
  {
    id: "erros-p2-corrigir-bugs",
    tipo: "lovable",
    titulo: "Corrigir app quebrado antes de evoluir",
    descricao: "Correção cirúrgica dos bugs principais antes de PWA, Android, iOS ou loja.",
    texto: `CORREÇÃO CIRÚRGICA ANTES DE EVOLUIR PARA PWA OU LOJA

Pedido direto:
Corrija apenas os bugs principais do meu app antes de qualquer evolução para PWA, Android, iOS, App Store ou Google Play.

Contexto:
Meu app foi construído no Lovable e ainda apresenta problemas. Antes de transformar em PWA ou pensar em lojas, quero corrigir o que está quebrado.

Problemas encontrados:
1.
2.
3.

Tarefa específica:
Corrigir somente os problemas listados, preservando a estrutura atual do projeto.

Faça obrigatoriamente:
1. Corrigir apenas os bugs informados.
2. Preservar o restante do app.
3. Testar o fluxo afetado.
4. Informar o que foi corrigido.
5. Informar se há riscos restantes.

Preserve:
- estrutura atual do projeto
- páginas aprovadas
- identidade visual
- login, banco, RLS, policies, checkout, admin, área paga e dados das usuárias

Não faça:
- não refaça o projeto inteiro
- não crie funcionalidades novas
- não altere checkout ou pagamento
- não altere banco, RLS ou policies sem necessidade clara
- não exponha secrets, tokens, senhas ou chaves
- não use service_role no frontend
- não publique em lojas
- não transforme em PWA ainda

Critério de aceite:
Os bugs listados devem ser corrigidos sem quebrar login, banco, checkout, área paga, admin ou fluxos existentes.`,
  },
  {
    id: "erros-p3-tipo-de-app",
    tipo: "agente",
    titulo: "Entender qual tipo de app eu tenho agora",
    descricao: "Diferencia web app, PWA, app empacotado e nativo, e recomenda o caminho.",
    texto: `Me ajude a entender qual tipo de app eu tenho agora e qual evolução faz sentido.

Contexto:
Criei meu app usando IA e quero entender se ele é web app, se pode virar PWA, se pode ser empacotado para loja ou se precisaria de uma versão nativa no futuro.

Informações:
- O app funciona por link? Sim/Não
- Tem domínio? Sim/Não
- Funciona bem no celular? Sim/Não
- Tem login? Sim/Não
- Tem banco de dados? Sim/Não
- Tem checkout? Sim/Não
- Precisa de câmera, GPS, notificações ou recursos nativos? Sim/Não
- Já tenho usuárias reais? Sim/Não
- Quero publicar em loja por qual motivo?

Quero que você explique:
1. Que tipo de app eu tenho hoje.
2. O que seria uma PWA no meu caso.
3. O que seria empacotar esse app.
4. O que seria uma versão nativa.
5. Qual caminho faz mais sentido agora.
6. O que eu não devo fazer ainda.

Seja simples, direto e não prometa aprovação, vendas ou resultado financeiro.`,
  },
  {
    id: "erros-p4-paginas-confianca",
    tipo: "lovable",
    titulo: "Preparar páginas de confiança antes de loja",
    descricao: "Revisão de política de privacidade, termos, suporte e transparência antes de PWA ou loja.",
    texto: `PÁGINAS DE CONFIANÇA ANTES DE PENSAR EM LOJA

Pedido direto:
Revise se meu app possui páginas e informações mínimas de confiança antes de eu pensar em PWA, Google Play ou App Store.

Contexto:
Meu app pode ter login, coleta de dados, checkout, área paga ou informações de usuárias. Quero preparar a base de confiança antes de pensar em loja.

Tarefa específica:
Verificar e, se necessário, sugerir páginas ou links de confiança para o app.

Faça obrigatoriamente:
1. Verificar se existe política de privacidade quando houver coleta de dados.
2. Verificar se existe termos de uso quando necessário.
3. Verificar se existe contato de suporte.
4. Verificar se links importantes funcionam.
5. Verificar se o app explica claramente o que faz.
6. Verificar se textos não prometem resultado garantido.
7. Sugerir ajustes simples antes de criar ou alterar páginas.

Preserve:
- estrutura atual do projeto
- identidade visual aprovada
- login, banco, RLS, policies, checkout, admin, área paga e dados das usuárias

Não faça:
- não altere checkout ou pagamento
- não mexa em RLS, policies ou banco
- não exponha dados sensíveis
- não invente CNPJ, depoimentos, métricas ou provas sociais
- não prometa aprovação em loja
- não prometa vendas ou resultados
- não refaça o projeto inteiro

Critério de aceite:
O app deve ter uma base mínima de confiança revisada, com suporte, transparência e textos seguros antes de qualquer evolução para loja.`,
  },
  {
    id: "erros-p5-nativo-futuro",
    tipo: "agente",
    titulo: "Decidir se nativo deve ficar para o futuro",
    descricao: "Analisa se faz sentido pensar em app nativo agora ou deixar como evolução futura.",
    texto: `Me ajude a decidir se uma versão nativa do meu app deve ficar para o futuro.

Contexto do app:
- Nome:
- Público:
- O que o app faz:
- Já tenho usuárias reais? Sim/Não
- Já tenho receita? Sim/Não
- O app precisa de recursos avançados do celular? Sim/Não
- Quais recursos:
- A versão web atual está funcionando bem? Sim/Não
- A experiência mobile está boa? Sim/Não
- Meu motivo para querer nativo:

Quero que você me diga:
1. Se faz sentido pensar em nativo agora.
2. Se devo continuar web app.
3. Se PWA pode resolver antes.
4. Se loja faz sentido antes do nativo.
5. Quais riscos existem em ir para nativo cedo demais.
6. Qual caminho mais seguro para os próximos 30 dias.

Não escreva código. Não prometa resultado financeiro, aprovação em loja, vendas ou downloads.`,
  },
];
