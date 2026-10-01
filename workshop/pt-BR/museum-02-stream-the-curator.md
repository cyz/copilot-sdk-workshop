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

:::language dotnet
Substitua todo o conteúdo de `Program.cs`:

```csharp
using GitHub.Copilot;
using GitHub.Copilot.Rpc;
using MuseumExhibitStudio.Helpers;

Console.WriteLine("=== Museum Exhibit Studio ===");
Console.WriteLine();

await using var client = new CopilotClient();
await client.StartAsync();

await using var session = await client.CreateSessionAsync(new SessionConfig
{
    ClientName = "museum-exhibit-studio",
    OnPermissionRequest = PermissionHandler.ApproveAll,
    Streaming = true
});

await CuratorStreamer.StreamExhibitAsync(
    session,
    "Write two sentences of museum wall text about the Apollo 11 Moon landing.");

await client.StopAsync();
```

Duas mudanças: `Streaming = true` na configuração da sessão e `CuratorStreamer.StreamExhibitAsync`
no lugar de `SendAndWaitAsync`. O handler de permissões da Etapa 1 fica exatamente onde estava.
O módulo auxiliar fica em `Helpers/CuratorStreamer.cs`, e você nunca o edita.

**Confira no código:** abra `Helpers/CuratorStreamer.cs` e leia `StreamExhibitAsync` uma vez. Ele é
o loop de eventos do SDK, e este é o ponto mais claro do workshop para ver como streaming realmente
funciona. Ele se inscreve com `session.On<SessionEvent>`, anexa e escreve cada trecho de
`AssistantMessageDeltaEvent` no momento em que chega, imprime uma linha `[tool:start]` para cada
`ToolExecutionStartEvent` e uma linha `[tool:done]` para cada `ToolExecutionCompleteEvent`,
conclui em `SessionIdleEvent` e falha em `SessionErrorEvent`. Uma corrida com `Task.Delay`
transforma o timeout em uma `TimeoutException`, e a inscrição é descartada em todos os caminhos de
execução.
:::

:::language nodejs
Substitua todo o conteúdo de `src/index.ts`:

```typescript
import { approveAll, CopilotClient } from "@github/copilot-sdk";
import { streamExhibit } from "./curator.js";

async function main(): Promise<void> {
  console.log("=== Museum Exhibit Studio ===");
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
    "Write two sentences of museum wall text about the Apollo 11 Moon landing.",
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
:::

:::language python
Substitua todo o conteúdo de `main.py`:

```python
import asyncio

from copilot import CopilotClient, PermissionHandler

from curator import stream_exhibit


async def main() -> None:
    print("=== Museum Exhibit Studio ===")
    print()

    async with CopilotClient() as client:
        async with await client.create_session(
            client_name="museum-exhibit-studio",
            on_permission_request=PermissionHandler.approve_all,
            streaming=True,
        ) as session:
            await stream_exhibit(
                session,
                "Write two sentences of museum wall text about the Apollo 11 Moon landing.",
            )


if __name__ == "__main__":
    asyncio.run(main())
```

O loop inteiro de eventos da Etapa 1 se reduz a uma chamada. `stream_exhibit` fica em `curator.py`,
já faz a correspondência em `AssistantMessageDeltaData`, `SessionErrorData` e `SessionIdleData`, e
você nunca o edita.

**Confira no código:** abra `curator.py` e leia `stream_exhibit` uma vez. Ele é o loop de eventos do
SDK, e este é o ponto mais claro do workshop para ver como streaming realmente funciona. Ele se
inscreve com `session.on`, imprime cada trecho de `AssistantMessageDeltaData` no momento em que
chega, imprime uma linha `[tool:start]` para cada `ToolExecutionStartData` e uma linha `[tool:done]`
para cada `ToolExecutionCompleteData`, define seu evento `done` em `SessionIdleData` e relança
`SessionErrorData` como um `RuntimeError`. `asyncio.wait_for` aplica o timeout, e um bloco `finally`
desfaz a inscrição em todos os caminhos de execução.
:::

:::language go
Substitua todo o conteúdo de `main.go`:

```go
package main

import (
	"context"
	"fmt"

	copilot "github.com/github/copilot-sdk/go"
)

func main() {
	fmt.Println("=== Museum Exhibit Studio ===")
	fmt.Println()

	ctx := context.Background()
	client := copilot.NewClient(&copilot.ClientOptions{LogLevel: "error"})
	if err := client.Start(ctx); err != nil {
		panic(err)
	}
	defer func() { _ = client.Stop() }()

	session, err := client.CreateSession(ctx, &copilot.SessionConfig{
		ClientName:          "museum-exhibit-studio",
		OnPermissionRequest: copilot.PermissionHandler.ApproveAll,
		Streaming:           copilot.Bool(true),
	})
	if err != nil {
		panic(err)
	}
	defer func() { _ = session.Disconnect() }()

	if _, err := StreamExhibit(
		session,
		"Write two sentences of museum wall text about the Apollo 11 Moon landing.",
		GenerationTimeout,
	); err != nil {
		panic(err)
	}
}
```

Duas mudanças: `Streaming: copilot.Bool(true)` na configuração da sessão e `StreamExhibit` no lugar
de `SendAndWait`. O handler de permissões da Etapa 1 fica exatamente onde estava.
`StreamExhibit` e `GenerationTimeout` vêm de `curator.go`, no mesmo pacote, e você nunca edita esse
arquivo.

**Confira no código:** abra `curator.go` e leia `StreamExhibit` uma vez. Ele é o loop de eventos do
SDK, e este é o ponto mais claro do workshop para ver como streaming realmente funciona. Ele se
inscreve com `session.On`, imprime cada trecho de `AssistantMessageDeltaData` no momento em que
chega, imprime uma linha `[tool:start]` para cada `ToolExecutionStartData` e uma linha `[tool:done]`
para cada `ToolExecutionCompleteData`, e registra qualquer `SessionErrorData` para retornar como
erro. Em seguida, aguarda em `session.SendAndWait` dentro de um `context.WithTimeout` construído a
partir do timeout que você passa, e um `unsubscribe` adiado roda em todos os caminhos de execução.
:::

:::language rust
Substitua todo o conteúdo de `src/main.rs`:

```rust
use github_copilot_sdk::permission;
use github_copilot_sdk::types::SessionConfig;
use github_copilot_sdk::{Client, ClientOptions};
use museum_exhibit_studio::{GENERATION_TIMEOUT, RuntimeError, stream_exhibit};

#[tokio::main]
async fn main() -> Result<(), RuntimeError> {
    println!("=== Museum Exhibit Studio ===");
    println!();

    let client = Client::start(ClientOptions::default()).await?;
    let mut config = SessionConfig::default().with_permission_handler(permission::approve_all());
    config.client_name = Some("museum-exhibit-studio".to_owned());
    config.streaming = Some(true);
    let session = client.create_session(config).await?;

    stream_exhibit(
        &session,
        "Write two sentences of museum wall text about the Apollo 11 Moon landing.",
        GENERATION_TIMEOUT,
    )
    .await?;

    session.disconnect().await?;
    client.stop().await?;
    Ok(())
}
```

Duas mudanças: `config.streaming = Some(true)` e `stream_exhibit` no lugar de `send_and_wait`. O
handler de permissões da Etapa 1 fica exatamente onde estava. Tanto `stream_exhibit` quanto
`GENERATION_TIMEOUT` vêm da crate `museum_exhibit_studio` em `src/lib.rs`, e você nunca a edita.

**Confira no código:** abra `src/lib.rs` e leia `stream_exhibit` uma vez. Ele é o loop de eventos do
SDK, e este é o ponto mais claro do workshop para ver como streaming realmente funciona. Ele se
inscreve com `session.subscribe`, imprime e descarrega cada trecho de `assistant.message_delta` no
momento em que chega, imprime uma linha `[tool:start]` para cada evento `tool.execution_start` e uma
linha `[tool:done]` para cada evento `tool.execution_complete`, termina em `session.idle` e retorna
um erro em `session.error`. Ele faz polling conjunto do futuro de envio, do stream de eventos e de
um prazo final; assim, o timeout que você passa vale mesmo que nenhum evento chegue.
:::

:::language java
Substitua todo o conteúdo de `src/main/java/workshop/MuseumExhibitStudio.java`:

```java
package workshop;

import com.github.copilot.CopilotClient;
import com.github.copilot.rpc.PermissionHandler;
import com.github.copilot.rpc.SessionConfig;

public final class MuseumExhibitStudio {
    private MuseumExhibitStudio() {
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== Museum Exhibit Studio ===");
        System.out.println();

        try (var client = new CopilotClient()) {
            client.start().get();
            var session = client.createSession(new SessionConfig()
                    .setClientName("museum-exhibit-studio")
                    .setOnPermissionRequest(PermissionHandler.APPROVE_ALL)
                    .setStreaming(true)).get();
            try {
                CuratorStreamer.streamExhibit(session,
                        "Write two sentences of museum wall text about the Apollo 11 Moon landing.");
            } finally {
                session.close();
                client.stop().get();
            }
        }
    }
}
```

Duas mudanças: `setStreaming(true)` na configuração da sessão e `CuratorStreamer.streamExhibit` no
lugar de `sendAndWait`. O handler de permissões da Etapa 1 fica exatamente onde estava. O módulo
auxiliar fica em `CuratorStreamer.java`, ao lado do seu arquivo, e você nunca o edita.

**Confira no código:** abra `CuratorStreamer.java` e leia `streamExhibit` uma vez. Ele é o loop de
eventos do SDK, e este é o ponto mais claro do workshop para ver como streaming realmente funciona.
Ele registra um listener por tipo de evento: `AssistantMessageDeltaEvent` imprime e acumula cada
trecho à medida que chega, `ToolExecutionStartEvent` e `ToolExecutionCompleteEvent` imprimem as
linhas `[tool:start]` e `[tool:done]`, `SessionIdleEvent` encerra a linha e `SessionErrorEvent` é
capturado e relançado. O timeout que você passa vai para `session.sendAndWait` em milissegundos, e
cada inscrição é fechada em um bloco `finally`.
:::

## Execute

:::language dotnet
```bash
dotnet run
```
:::
:::language nodejs
```bash
npm start
```
:::
:::language python
```bash
.venv/bin/python main.py
```
:::
:::language go
```bash
go run .
```
:::
:::language rust
```bash
cargo run
```
:::
:::language java
```bash
mvn compile exec:java
```
:::

Aparece o mesmo tipo de resposta, mas desta vez você a vê sendo escrita:

```text
=== Museum Exhibit Studio ===

In July 1969, three astronauts left Earth aboard Apollo 11... 
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
