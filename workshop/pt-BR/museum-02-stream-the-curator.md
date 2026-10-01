# Etapa 2: Exiba a resposta do curador em streaming

> **Tempo:** 10 minutos

## O que você vai criar

O mesmo prompt, mas agora a resposta aparece palavra por palavra, em vez de chegar inteira depois
de uma pausa silenciosa.

Você não vai escrever um loop de eventos. Os auxiliares pré-construídos do curador já trazem uma
função de streaming: ela assina os
[eventos da sessão](https://github.com/github/copilot-sdk/blob/main/docs/features/streaming-events.md),
escreve cada delta na saída padrão, informa a atividade das ferramentas, falha quando a sessão emite
um erro, impõe um timeout, cancela a assinatura em todos os caminhos de execução e retorna o texto
completo acumulado. Seu trabalho é ativar o streaming e chamar essa função.

## Por que streaming importa para um curador

O texto de uma exposição é prosa que uma pessoa precisa ler e avaliar. Ver o texto chegando mostra
na hora se o tom está certo, se o modelo está enchendo linguiça ou fugindo do assunto — muito antes
de a execução terminar. O streaming também oferece um ponto para observar as chamadas de ferramenta,
o que passa a importar na Etapa 4, quando o curador precisa chamar a ferramenta de fatos do
aplicativo antes de escrever qualquer coisa.

A função auxiliar retorna a resposta inteira como string; assim, daqui em diante você sempre terá o
texto final para inspecionar depois que o stream terminar.

## Troque a chamada bloqueante pela função de streaming

Substitua todo o conteúdo de `src/index.ts`:

```typescript
import { approveAll, CopilotClient } from "@github/copilot-sdk";
import { streamExhibit } from "./curator.js";

async function main(): Promise<void> {
  console.log("=== Estúdio de Exposições de Museu ===");
  console.log();

  const client = new CopilotClient();
  await client.start();
  const session = await client.createSession({
    clientName: "museum-exhibit-studio",
    onPermissionRequest: approveAll,
    streaming: true,
  });

  await streamExhibit(
    session,
    "Escreva duas frases de texto de parede de museu sobre o pouso da Apollo 11 na Lua.",
  );

  await session.disconnect();
  await client.stop();
}

void main();
```

Duas mudanças: `streaming: true` na configuração da sessão e `streamExhibit` no lugar de
`sendAndWait`. O handler de permissões da Etapa 1 continua exatamente onde estava. O módulo
auxiliar fica em `src/curator.ts`, e você nunca o edita.

**Confira no código:** abra `src/curator.ts` e leia `streamExhibit` com atenção. Ela é o loop de
eventos do SDK, e este é o ponto do workshop em que fica mais claro como o streaming realmente
funciona. A função assina os eventos com `session.on`, escreve na saída padrão cada trecho de
`assistant.message_delta` assim que ele chega, imprime uma linha `[tool:start]` para cada evento
`tool.execution_start` e uma linha `[tool:done]` para cada `tool.execution_complete`, resolve a
promise em `session.idle` e a rejeita em `session.error`. Um `setTimeout` rejeita a promise se
nenhum dos dois eventos chegar, e `finish` cancela a assinatura em todos os caminhos de execução.

## Execute

```bash
npm start
```

Aparece o mesmo tipo de resposta, mas desta vez você a vê sendo escrita:

```text
=== Estúdio de Exposições de Museu ===

Em julho de 1969, três astronautas deixaram a Terra a bordo da Apollo 11...
```

O texto vai crescendo na tela, em vez de aparecer de uma vez, e o programa termina logo depois da
última palavra. Se nada aparecer até o final, a sessão não está fazendo streaming — confira se você
ativou a flag de streaming na configuração da sessão.

## Verifique seu entendimento

- Conceitualmente, o streaming é ativado em dois lugares: na configuração da sessão e no código que
  lê os eventos. Qual deles você escreveu, e qual já era responsabilidade do módulo auxiliar?
- A função auxiliar retorna o texto completo da resposta, mesmo já tendo impresso esse texto. Por
  que esse valor de retorno vai importar na Etapa 6?
- Se o modelo nunca ficar ocioso, o que impede seu programa de esperar para sempre?

## Saiba mais

- [Direcionamento e enfileiramento (*steering and queueing*)](https://github.com/github/copilot-sdk/blob/main/docs/features/steering-and-queueing.md):
  enviar outra mensagem enquanto um turno ainda está em streaming, sem esperar que ele termine.
- [Métricas de uso e cobrança](https://github.com/github/copilot-sdk/blob/main/docs/features/usage-and-billing.md):
  ler a contagem de tokens e o custo a partir dos mesmos eventos que a função de streaming já assina.
- [Limpeza de contexto](https://github.com/github/copilot-sdk/blob/main/docs/features/context-management.md):
  recomeçar a conversa dentro de uma sessão que você quer continuar usando.

Continue para a [Etapa 3: Dê voz ao curador](museum-03-curator-voice.md).
