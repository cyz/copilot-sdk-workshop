# Etapa 4: Fundamente o texto em fatos aprovados

> **Tempo:** 15 minutos

## O que você vai criar

Até agora, o curador escreveu com base na memória do modelo. Isso é inaceitável para um museu: uma
legenda de exposição é uma afirmação institucional, e "o modelo sabia" não é fonte.

Nesta etapa, o educador fornece os fatos, e o **aplicativo** os entrega ao curador por meio de uma
ferramenta que ele mesmo controla. Você registra a ferramenta pré-construída `approved_fact_lookup`,
faz dela a única ferramenta que o modelo pode chamar e escreve um prompt que manda o curador
chamá-la antes de escrever qualquer palavra. Você também permite que o educador escolha um entre
três conjuntos de fatos aprovados ou digite os próprios fatos.

## Por que os fatos ficam atrás de uma ferramenta, não dentro do prompt

Você poderia colar a lista de fatos no texto do prompt. Muitos aplicativos fazem isso. Mas, nesse
caso, os fatos viram apenas mais palavras em uma solicitação que o modelo pode interpretar com
liberdade, e toda execução carrega o catálogo inteiro, precise o modelo dele ou não.

Uma [**ferramenta local**](https://github.com/github/copilot-sdk/blob/main/docs/getting-started.md#how-tools-work)
é diferente. Ela roda dentro do seu processo, seu código decide o que ela retorna, e a transcrição
registra o momento em que o modelo a solicitou. `approved_fact_lookup` é essa ferramenta. Ela não
recebe argumentos e retorna a lista limitada de fatos aprovados; assim, duas execuções com o mesmo
conjunto de fatos fazem a mesma pergunta e recebem a mesma resposta — a fundamentação continua
determinística.

Os auxiliares já cuidam da ferramenta e dos limites. `boundFacts` remove espaços nas extremidades
de cada fato, descarta itens em branco e rejeita o lote quando ele está vazio, tem mais de 20 fatos
ou contém algum fato com mais de 500 caracteres. A função que cria a ferramenta (a *factory*) aplica
esses limites a tudo o que recebe, então o modelo nunca recebe uma lista sem limites. Limites não
são mera formalidade: uma lista de fatos sem limites significa custo, latência e superfície de
ataque imprevisíveis.

A ferramenta dispensa a solicitação de permissão (*skip permission*) porque apenas lê dados do
aplicativo que o educador acabou de aprovar na tela. Já o processo externo da Wikipedia, na Etapa
7, fica atrás de um limite de permissão.

## Duas listas, duas funções diferentes

Registrar uma ferramenta exige duas configurações, e confundir as duas é o erro mais comum neste
workshop:

- **`tools`** contém a *implementação*. É por aqui que o runtime fica sabendo que existe uma função
  chamada `approved_fact_lookup` e como executá-la.
- **`availableTools`** é a *lista de permissões (allowlist)*. Ela define quais ferramentas o
  modelo pode chamar nesta sessão. Uma ferramenta registrada, mas fora da lista de permissões, não
  pode ser chamada.

Você precisa das duas. A Etapa 5 retoma a lista de permissões e mostra o que ela impede.

O prompt é a terceira peça, e a mais fraca: ele *pede* ao modelo que chame a ferramenta. Ele não faz
a chamada acontecer e não consegue impedir uma chamada. Mantenha a instrução explícita "call
`approved_fact_lookup` first" (chame `approved_fact_lookup` primeiro) — nesta etapa, você quer que a
chamada de ferramenta aconteça de forma confiável para poder observá-la.

## Registre a ferramenta e construa o prompt

Abra `src/index.ts` e amplie a importação de `./curator.js`:

```typescript
import {
  approvedFactLookupName,
  askLine,
  askYesNo,
  boundFacts,
  closeTerminal,
  createApprovedFactLookup,
  factSets,
  readFacts,
  streamExhibit,
} from "./curator.js";
```

Logo abaixo da mensagem de sistema, adicione o construtor de prompt e a função que escolhe o
conjunto de fatos:

```typescript
function buildExhibitPrompt(): string {
  return `Create visitor-facing exhibit text about this application's approved subject.

Call ${approvedFactLookupName} first. Use only the facts it returns, and treat them as the
complete source of truth for this exhibit.

Return exactly this structure:

# <an engaging exhibit title>
## Narrative
<100-140 words, excluding the title and questions>
## Visitor questions
1. <question>
2. <question>
3. <question>

Write exactly three distinct visitor reflection questions. Do not add a preface,
conclusion, software discussion, or facts the tool did not return.`;
}

async function chooseFactSet(): Promise<(typeof factSets)[number]> {
  const answer = await askLine("Choose a fact set [1-3, default 1]: ");
  const choice = Number.parseInt(answer, 10);
  if (Number.isInteger(choice) && choice >= 1 && choice <= factSets.length) {
    return factSets[choice - 1] ?? factSets[0];
  }
  return factSets[0];
}
```

Substitua `main` por:

```typescript
async function main(): Promise<void> {
  console.log("=== Museum Exhibit Studio ===");
  console.log();
  console.log("Approved fact sets:");
  factSets.forEach((factSet, index) => console.log(`${index + 1}. ${factSet.label}`));
  console.log();

  const chosenSet = await chooseFactSet();
  let approvedFacts = boundFacts(chosenSet.facts);
  approvedFacts.forEach((fact, index) => console.log(`${index + 1}. ${fact}`));
  console.log();

  if (!(await askYesNo("Use these facts?", true))) {
    approvedFacts = boundFacts(await readFacts());
  }

  console.log();
  const client = new CopilotClient();
  await client.start();
  const session = await client.createSession({
    clientName: "museum-exhibit-studio",
    onPermissionRequest: approveAll,
    streaming: true,
    tools: [createApprovedFactLookup(approvedFacts)],
    availableTools: [approvedFactLookupName],
    systemMessage: { mode: "replace", content: systemMessage },
  });

  await streamExhibit(session, buildExhibitPrompt());

  await session.disconnect();
  await client.stop();
  closeTerminal();
}
```

Agora `buildExhibitPrompt` não recebe fato nenhum — em vez disso, o prompt cita a ferramenta pelo
nome. `createApprovedFactLookup` chama `boundFacts` internamente, então o limite vale
independentemente de quem cria a ferramenta.

**Confira no código:** `src/curator.ts` contém tudo isso, e vale a leitura porque é uma definição
real com `defineTool`, não simples infraestrutura. `createApprovedFactLookup` captura em uma closure
a lista limitada que o educador acabou de aprovar e define `approved_fact_lookup` com
`parameters: { type: "object", properties: {}, additionalProperties: false }`; assim, o modelo não
tem como influenciar o que volta — ele pede e recebe exatamente aquela lista. `skipPermission: true`
é definido ali mesmo porque os dados pertencem ao aplicativo. Os três conjuntos de fatos e os
limites `maximumFactCount` (20) e `maximumFactLength` (500), aplicados por `boundFacts`, estão no
mesmo arquivo.

## Execute

```bash
npm start
```

Agora o aplicativo faz algumas perguntas antes de escrever qualquer coisa, e você vê o curador
buscar os fatos antes de escrever a primeira palavra:

```text
=== Museum Exhibit Studio ===

Approved fact sets:
1. Apollo 11
2. Great Barrier Reef
3. Terracotta Army

Choose a fact set [1-3, default 1]: 2
1. The Great Barrier Reef lies off the coast of Queensland, Australia.
2. It stretches for about 2,300 kilometres.
3. It is made up of more than 2,900 individual reefs.
4. It was added to the UNESCO World Heritage List in 1981.
5. Rising sea temperatures have caused repeated coral bleaching events.

Use these facts? [Y/n]: y

[tool:start] approved_fact_lookup
[tool:done] success=true

# A Reef the Size of a Country
## Narrative
Off the Queensland coast, more than two thousand nine hundred reefs...
## Visitor questions
1. ...
```

A linha `[tool:start] approved_fact_lookup` é o ponto central desta etapa. O curador não “se
lembrou” do recife — ele pediu os fatos ao seu aplicativo, e o aplicativo respondeu.

## Prove que a ferramenta está fazendo o trabalho

Execute de novo e escolha o conjunto 1 ou 3. A exposição muda completamente de assunto, e o evento
da ferramenta aparece em todas as execuções. Nada mudou no prompt entre elas: o mesmo texto de
prompt produziu uma exposição sobre o Exército de Terracota porque a ferramenta retornou dados
diferentes. Essa é a diferença entre um prompt que carrega os dados e um aplicativo que é dono
deles.

Depois, responda `n` na confirmação, digite dois ou três fatos seus e envie uma linha em branco. O
curador passa a escrever sobre o seu assunto — os fatos que você digitou entraram na ferramenta, e a
ferramenta os entregou ao modelo.

Teste também o caso de falha. Responda `n` e envie imediatamente uma linha em branco, sem digitar
nenhum fato. A execução para com `Provide at least one approved fact.` — a factory da ferramenta se
recusou a criá-la com uma lista vazia, então nenhuma solicitação chegou a ser enviada. A Etapa 5
transforma essa falha abrupta em uma mensagem de erro clara.

## Verifique seu entendimento

- Você registrou a ferramenta em dois lugares. O que aconteceria se você colocasse
  `approved_fact_lookup` em `tools`, mas a deixasse fora da lista de permissões?
- O prompt diz "Call `approved_fact_lookup` first." Essa frase garante que a chamada aconteça? O
  que, nesta etapa, tornou a ferramenta *disponível* para ser chamada?
- A ferramenta não recebe argumentos e sempre retorna a mesma lista limitada para um mesmo conjunto
  de fatos. O que você perderia se ela aceitasse um argumento de consulta em texto livre?
- A estrutura da saída é pedida no prompt. Até aqui, o que de fato verificou que o modelo a seguiu?

## Saiba mais

- [Trabalhando com hooks](https://github.com/github/copilot-sdk/blob/main/docs/features/hooks.md):
  callbacks que o runtime invoca em torno de cada chamada de ferramenta, para auditoria ou para
  políticas controladas pelo seu código.
- [Hook pós-uso de ferramenta (*post-tool-use*)](https://github.com/github/copilot-sdk/blob/main/docs/hooks/post-tool-use.md):
  como inspecionar ou reescrever o que uma ferramenta retornou antes que o modelo leia.
- [Limpeza de contexto e ferramentas que encerram o turno](https://github.com/github/copilot-sdk/blob/main/docs/features/context-management.md):
  o que uma ferramenta pode fazer com a própria conversa e por que a maioria delas não deveria
  fazer isso.

Continue para a [Etapa 5: Defina os guardrails](museum-05-guardrails.md).
