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

:::language dotnet
Abra `Program.cs` e **substitua o arquivo inteiro**:

```csharp
using GitHub.Copilot;
using GitHub.Copilot.Rpc;

Console.WriteLine("=== Museum Exhibit Studio ===");
Console.WriteLine();

await using var client = new CopilotClient();
await client.StartAsync();

await using var session = await client.CreateSessionAsync(new SessionConfig
{
    ClientName = "museum-exhibit-studio",
    OnPermissionRequest = PermissionHandler.ApproveAll
});

var response = await session.SendAndWaitAsync(
    "Write two sentences of museum wall text about the Apollo 11 Moon landing.");

if (response is null)
{
    throw new InvalidOperationException("The curator returned no content.");
}

Console.WriteLine(response.Data.Content);

await client.StopAsync();
```

`SendAndWaitAsync` bloqueia até a sessão ficar ociosa, então você recebe a resposta final em uma
única chamada. `await using` descarta a sessão e o cliente na saída. `PermissionHandler.ApproveAll`
vem de `GitHub.Copilot.Rpc`, por isso o segundo `using` está ali.

Os auxiliares pré-construídos que você começa a chamar na Etapa 2 ficam em
`Helpers/CuratorFacts.cs`, `Helpers/CuratorStreamer.cs`, `Helpers/CuratorValidation.cs`,
`Helpers/CuratorSafety.cs` e `Helpers/CuratorTerminal.cs`. Você nunca edita esses arquivos — você
os lê.
:::

:::language nodejs
Abra `src/index.ts` e **substitua o arquivo inteiro**:

```typescript
import { approveAll, CopilotClient } from "@github/copilot-sdk";

async function main(): Promise<void> {
  console.log("=== Museum Exhibit Studio ===");
  console.log();

  const client = new CopilotClient();
  await client.start();
  const session = await client.createSession({
    clientName: "museum-exhibit-studio",
    onPermissionRequest: approveAll,
  });

  const response = await session.sendAndWait({
    prompt: "Write two sentences of museum wall text about the Apollo 11 Moon landing.",
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
:::

:::language python
Abra `main.py` e **substitua o arquivo inteiro**:

```python
import asyncio

from copilot import CopilotClient, PermissionHandler
from copilot.session_events import AssistantMessageData, SessionErrorData, SessionIdleData


async def main() -> None:
    print("=== Museum Exhibit Studio ===")
    print()

    async with CopilotClient() as client:
        async with await client.create_session(
            client_name="museum-exhibit-studio",
            on_permission_request=PermissionHandler.approve_all,
        ) as session:
            done = asyncio.Event()
            error: RuntimeError | None = None

            def on_event(event) -> None:
                nonlocal error
                match event.data:
                    case AssistantMessageData(content=content):
                        print(content)
                    case SessionErrorData(message=message):
                        error = RuntimeError(message)
                        done.set()
                    case SessionIdleData():
                        done.set()

            session.on(on_event)
            await session.send(
                "Write two sentences of museum wall text about the Apollo 11 Moon landing."
            )
            await done.wait()
            if error is not None:
                raise error


if __name__ == "__main__":
    asyncio.run(main())
```

O Python escuta eventos da sessão em vez de chamar um único auxiliar bloqueante. Imprima a mensagem
do assistente, trate um erro da sessão como falha e aguarde a inatividade antes de sair. A Etapa 2
substitui este listener inteiro por uma chamada de auxiliar.

`curator.py`, ao lado deste arquivo, é o módulo auxiliar pré-construído que traz essa substituição.
Você nunca o edita — você o lê.
:::

:::language go
Abra `main.go` e **substitua o arquivo inteiro**:

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
	})
	if err != nil {
		panic(err)
	}
	defer func() { _ = session.Disconnect() }()

	response, err := session.SendAndWait(ctx, copilot.MessageOptions{
		Prompt: "Write two sentences of museum wall text about the Apollo 11 Moon landing.",
	})
	if err != nil {
		panic(err)
	}
	if response == nil {
		panic("The curator returned no content.")
	}
	if message, ok := response.Data.(*copilot.AssistantMessageData); ok {
		fmt.Println(message.Content)
	}
}
```

`curator.go` já está no mesmo pacote `main`, então seus auxiliares ficam no escopo no momento em
que você precisar deles. `SendAndWait` bloqueia até a sessão ficar ociosa.
:::

:::language rust
Abra `src/main.rs` e **substitua o arquivo inteiro**:

```rust
use github_copilot_sdk::permission;
use github_copilot_sdk::types::{MessageOptions, SessionConfig};
use github_copilot_sdk::{Client, ClientOptions};
use museum_exhibit_studio::RuntimeError;

#[tokio::main]
async fn main() -> Result<(), RuntimeError> {
    println!("=== Museum Exhibit Studio ===");
    println!();

    let client = Client::start(ClientOptions::default()).await?;
    let mut config = SessionConfig::default().with_permission_handler(permission::approve_all());
    config.client_name = Some("museum-exhibit-studio".to_owned());
    let session = client.create_session(config).await?;

    let response = session
        .send_and_wait(MessageOptions::new(
            "Write two sentences of museum wall text about the Apollo 11 Moon landing.",
        ))
        .await?;

    if let Some(message) = response {
        if let Some(content) = message.data.get("content").and_then(|value| value.as_str()) {
            println!("{content}");
        }
    }

    session.disconnect().await?;
    client.stop().await?;
    Ok(())
}
```

`src/lib.rs` é o crate de biblioteca `museum_exhibit_studio` que fornece os auxiliares pré-construídos,
e você nunca o edita. Hoje você importa um nome dele: `RuntimeError`, o alias do crate para
`Box<dyn Error + Send + Sync>`. Todos os auxiliares que você chama a partir da Etapa 2 relatam
falhas com esse tipo, então `main` o retorna desde o início e `?` continua funcionando conforme as
lições crescem.

`with_permission_handler` retorna a configuração atualizada, então mantenha os demais campos
definidos no valor que ele devolve.
:::

:::language java
Abra `src/main/java/workshop/MuseumExhibitStudio.java` e **substitua o arquivo inteiro**:

```java
package workshop;

import com.github.copilot.CopilotClient;
import com.github.copilot.rpc.MessageOptions;
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
                    .setOnPermissionRequest(PermissionHandler.APPROVE_ALL)).get();
            try {
                var response = session.sendAndWait(new MessageOptions().setPrompt(
                        "Write two sentences of museum wall text about the Apollo 11 Moon landing.")).get();
                if (response == null) {
                    throw new IllegalStateException("The curator returned no content.");
                }
                System.out.println(response.getData().content());
            } finally {
                session.close();
                client.stop().get();
            }
        }
    }
}
```

`sendAndWait` bloqueia até a sessão ficar ociosa. O bloco try-with-resources fecha o cliente quando
`main` termina. `PermissionHandler.APPROVE_ALL` vem de `com.github.copilot.rpc`.

Os auxiliares pré-construídos que você começa a chamar na Etapa 2 ficam ao lado do seu arquivo em
`src/main/java/workshop/`: `CuratorFacts.java`, `CuratorStreamer.java`, `CuratorValidation.java`,
`CuratorSafety.java` e `CuratorTerminal.java`. Você nunca edita esses arquivos — você os lê.
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

O texto exato vai variar, mas a saída tem este formato:

```text
=== Museum Exhibit Studio ===

The Apollo 11 mission carried three astronauts toward the Moon in July 1969. Days later,
two of them stepped onto its surface while the world listened.
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
