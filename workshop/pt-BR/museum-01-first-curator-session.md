# Etapa 1: Crie sua primeira sessão do curador

> **Tempo:** 10 minutos

## O que você vai criar

Um texto de museu de verdade, no seu terminal, em cerca de dez minutos. Você se conecta ao runtime
do Copilot, abre uma conversa, envia um único prompt e imprime a resposta.

Sem mensagem de sistema. Sem catálogo de fatos. Sem ferramentas. Sem interfaces. Não há contrato
para implementar — você chama o SDK diretamente, e os auxiliares pré-construídos do curador ficam
intocados até a Etapa 2 precisar deles.

## Conheça o cliente e a sessão

O [**runtime do Copilot**](https://github.com/github/copilot-sdk/blob/main/docs/features/agent-loop.md)
recebe prompts, chama modelos e gerencia ferramentas. O **cliente** conecta seu aplicativo a esse
runtime. Uma **sessão** é uma conversa contínua: ela guarda as mensagens e os resultados de
ferramentas que formam o contexto.

Mantenha um único cliente ativo durante uma unidade de trabalho e crie uma sessão para cada conversa
independente. Por enquanto, o aplicativo é simplesmente `client -> session -> printed response`
(cliente → sessão → resposta impressa).

## Responda às solicitações de permissão antes de enviar

O runtime não decide sozinho se uma chamada de ferramenta pode ser executada. Ele pergunta ao
aplicativo, e quem responde é o
[handler de permissões](https://github.com/github/copilot-sdk/blob/main/docs/hooks/pre-tool-use.md)
da sessão. Se a sessão for criada sem um handler, a solicitação não é negada: ela é emitida como
evento e fica pendente, aguardando resolução manual. Na prática, a execução trava esperando uma
resposta que nunca chega.

Dê a esta primeira sessão um handler que aprova tudo, para que toda solicitação receba
resposta. Ele aprova as solicitações quando as configurações gerenciadas estão desativadas e
é um valor padrão, não uma medida de segurança: a Etapa 5 mostra o que realmente restringe esta
sessão, e as Etapas 7 e 8 o substituem por handlers de escopo restrito.

## Escreva a sessão

Abra `src/index.ts` e **substitua o arquivo inteiro**:

```typescript
import { approveAll, CopilotClient } from "@github/copilot-sdk";

async function main(): Promise<void> {
  console.log("=== Estúdio de Exposições de Museu ===");
  console.log();

  const client = new CopilotClient();
  await client.start();
  const session = await client.createSession({
    clientName: "museum-exhibit-studio",
    onPermissionRequest: approveAll,
  });

  const response = await session.sendAndWait({
    prompt: "Escreva duas frases de texto de parede de museu sobre o pouso da Apollo 11 na Lua.",
  });
  console.log(response?.data && "content" in response.data ? response.data.content : response);

  await session.disconnect();
  await client.stop();
}

void main();
```

`sendAndWait` aguarda até a sessão ficar ociosa (*idle*), então você recebe a resposta completa em
uma única chamada. `approveAll` é importado do SDK junto com `CopilotClient`.

`src/curator.ts`, ao lado deste arquivo, é o módulo auxiliar pré-construído que você vai começar a
chamar na Etapa 2. Você nunca o edita — apenas o lê.

## Execute

```bash
npm start
```

O texto exato vai variar, mas a saída tem este formato:

```text
=== Estúdio de Exposições de Museu ===

A missão Apollo 11 levou três astronautas rumo à Lua em julho de 1969. Dias depois,
dois deles pisaram em sua superfície enquanto o mundo ouvia.
```

Duas frases com cara de texto de museu aparecem depois de uma breve pausa. Ainda não há streaming,
nenhum tom é imposto e nada impede o modelo de ir além do assunto pedido. É isso que as próximas
três etapas resolvem.

## Verifique seu entendimento

- O que a sessão guarda que o cliente não guarda?
- A resposta chegou inteira, de uma vez, depois de uma pausa. Que parte do código atual causa isso?
- A sessão respondeu a todas as solicitações de permissão em vez de deixá-las pendentes. Isso
  tornou a sessão mais segura ou apenas permitiu que ela chegasse ao fim?
- Nada nesta etapa restringe o que o modelo pode afirmar sobre a Apollo 11. O que, neste momento, é
  a única coisa que mantém a resposta mais ou menos dentro do assunto?

## Saiba mais

- [Crie seu primeiro aplicativo com o Copilot](https://docs.github.com/en/copilot/how-tos/copilot-sdk/getting-started):
  o tutorial do GitHub que cobre o mesmo primeiro cliente, sessão e prompt.
- [Retomada e persistência de sessões](https://github.com/github/copilot-sdk/blob/main/docs/features/session-persistence.md):
  o que uma sessão guarda e como retomar uma conversa mais tarde.
- [Autenticação](https://github.com/github/copilot-sdk/blob/main/docs/auth/README.md):
  as credenciais que um cliente pode usar quando você for além do `copilot login`.

Continue para a [Etapa 2: Exiba a resposta do curador em streaming](museum-02-stream-the-curator.md).
