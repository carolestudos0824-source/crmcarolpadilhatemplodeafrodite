# Roteiro de Teste com Usuário Real — Fábrica de Apps com IA

> Documento de pesquisa. **Não é código.** Use para conduzir sessões de teste moderado.

## Objetivo
Validar se uma pessoa iniciante entende como usar a Fábrica de Apps com IA para começar a criar ou organizar um app no Lovable, **sem explicação externa**.

## Perfil do testador
- Não domina Lovable.
- Tem uma ideia de app, serviço ou produto digital.
- Sabe usar ChatGPT de forma básica.
- Representa o público real da Fábrica.

## Duração
20 a 40 minutos.

## Regra principal
Não explique antes. Apenas diga:

> "Quero que você use essa plataforma como se tivesse comprado acesso e quisesse criar seu primeiro app. Vá falando em voz alta o que você está entendendo, onde clicaria e o que te deixa em dúvida."

---

## Tarefas

### Tarefa 1 — Primeira impressão (`/entrega`)
Perguntas:
1. Onde você acha que está?
2. O que você acha que esse programa faz?
3. Qual seria seu primeiro clique?

Observar: entende a Fábrica? percebe o Agente? entende **Projeto em foco**? olha para o **Estado Atual**?

### Tarefa 2 — Projeto em foco
"Crie ou selecione um projeto de app que você gostaria de construir."

Observar: entende que precisa criar um projeto? confunde Fábrica com o app dela? sabe onde clicar? consegue salvar/selecionar?

### Tarefa 3 — Contexto
"Preencha o contexto do seu app com o mínimo necessário para o programa te ajudar."

Observar: entende quais campos preencher? trava em campos opcionais? entende ação principal? consegue salvar?

### Tarefa 4 — Escolha de caminho
"Escolha o caminho que mais combina com você."

Opções: Começando do zero / Quero um app completo / Já tenho um app.
Depois pergunte: "Por que você escolheu esse caminho?"

### Tarefa 5 — Próximo passo
"Agora tente descobrir o próximo passo recomendado."

Observar: usa o Estado Atual? clica em "Ir para próximo passo"? entende a página que abriu?

### Tarefa 6 — Agente
"Você está insegura antes de mandar algo para o Lovable. O que faria?"

Observar: encontra o Agente? entende que o Agente é para pensar? entende que pode revisar antes de executar?

### Tarefa 7 — Lovable
"Agora imagine que você quer mandar o comando para o Lovable."

Observar: identifica o botão certo? entende diferença entre Agente e Lovable? entende que copiar não conclui a etapa?

### Tarefa 8 — Retorno do Lovable
"Imagine que o Lovable respondeu ou fez uma alteração no app. O que você faria agora?"

Observar: volta ao Agente? entende que deve testar? entende quando marcar como concluído? entende que o Programa organiza o próximo passo?

### Tarefa 9 — Retomada
Recarregue a página. "Onde você acha que parou?"

Observar: entende última ação registrada? entende progresso? sabe continuar?

---

## Perguntas finais
1. O que você acha que é a Fábrica?
2. O que você acha que é o Agente?
3. O que você acha que é o Lovable?
4. Em qual momento você ficou mais insegura?
5. Qual botão você teve medo de clicar?
6. O que você esperava que acontecesse e não aconteceu?

---

## Critérios de aprovação
A pessoa consegue:
- criar ou selecionar projeto;
- preencher contexto mínimo;
- escolher uma jornada;
- entender o próximo passo;
- encontrar o Agente;
- diferenciar Agente de Lovable;
- copiar prompt sem achar que concluiu;
- entender que deve testar antes de marcar concluído;
- retomar depois do reload.

## Critérios de alerta
Registrar como problema se a pessoa:
- perguntar "onde começo?";
- confundir Fábrica com o app dela;
- não encontrar o Agente;
- clicar direto no Lovable sem entender;
- marcar concluído só porque copiou;
- não souber voltar depois do Lovable;
- travar mais de 5 segundos em um botão;
- não entender Etapa 1 vs Etapa 2;
- não souber explicar o próximo passo.

---

## Formato de anotação (por trava)

```
Tela:
O que a pessoa tentou fazer:
Onde travou:
Frase exata que ela falou:
Tempo aproximado de hesitação:
Gravidade: (alta / média / baixa)
Correção provável:
```
