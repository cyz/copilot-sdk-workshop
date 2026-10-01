# Etapa 1: Crie sua primeira sessão do Copilot

> **Tempo:** 10 minutos

## O que você vai criar

Você vai conectar o aplicativo de console ao runtime do Copilot, criar uma conversa, enviar um
prompt e imprimir a resposta.

:::language dotnet
## Conheça o GitHub Copilot SDK e o runtime

O **GitHub Copilot SDK** é a API .NET que seu aplicativo usa para executar o Copilot como agente. O
[**runtime do Copilot**](https://github.com/github/copilot-sdk/blob/main/docs/features/agent-loop.md)
recebe prompts, chama modelos e gerencia ferramentas. `CopilotClient` conecta seu código C# a esse
runtime.

Um `CopilotSession` representa uma conversa contínua. Ele contém as mensagens e os resultados de
ferramentas que compõem o contexto da conversa. Mantenha um cliente ativo durante a execução do
aplicativo e crie uma sessão para cada conversa independente.

## Por que clientes e sessões permanecem separados

Manter essas responsabilidades separadas permite que a conexão com o runtime dure mais do que
qualquer conversa individual. Isso também fornece um pequeno exemplo funcional antes de introduzir
streaming e ferramentas.

Neste ponto, o aplicativo de console é simplesmente `CopilotClient -> CopilotSession -> model response`.
:::

:::language nodejs
## Conheça o GitHub Copilot SDK e o runtime

O **GitHub Copilot SDK** é a API Node.js que seu aplicativo usa para executar o Copilot como agente. O
[**runtime do Copilot**](https://github.com/github/copilot-sdk/blob/main/docs/features/agent-loop.md)
recebe prompts, chama modelos e gerencia ferramentas. `CopilotClient` conecta seu código TypeScript
a esse runtime.

Uma sessão de `createSession` representa uma conversa contínua. Ela contém as mensagens e os
resultados de ferramentas que compõem o contexto da conversa. Mantenha um cliente ativo durante a
execução do aplicativo e crie uma sessão para cada conversa independente.

## Por que clientes e sessões permanecem separados

Manter essas responsabilidades separadas permite que a conexão com o runtime dure mais do que
qualquer conversa individual. Isso também fornece um pequeno exemplo funcional antes de introduzir
streaming e ferramentas.

Neste ponto, o aplicativo de console é simplesmente `CopilotClient -> session -> model response`.
:::

:::language python
## Conheça o GitHub Copilot SDK e o runtime

O **GitHub Copilot SDK** é a API Python que seu aplicativo usa para executar o Copilot como agente. O
[**runtime do Copilot**](https://github.com/github/copilot-sdk/blob/main/docs/features/agent-loop.md)
recebe prompts, chama modelos e gerencia ferramentas. `CopilotClient` conecta seu código Python a
esse runtime.

Uma sessão de `create_session` representa uma conversa contínua. Ela contém as mensagens e os
resultados de ferramentas que compõem o contexto da conversa. Mantenha um cliente ativo durante a
execução do aplicativo e crie uma sessão para cada conversa independente.

## Por que clientes e sessões permanecem separados

Manter essas responsabilidades separadas permite que a conexão com o runtime dure mais do que
qualquer conversa individual. Isso também fornece um pequeno exemplo funcional antes de introduzir
streaming e ferramentas.

Neste ponto, o aplicativo de console é simplesmente `CopilotClient -> session -> model response`.
:::

:::language go
## Conheça o GitHub Copilot SDK e o runtime

O **GitHub Copilot SDK** é a API Go que seu aplicativo usa para executar o Copilot como agente. O
[**runtime do Copilot**](https://github.com/github/copilot-sdk/blob/main/docs/features/agent-loop.md)
recebe prompts, chama modelos e gerencia ferramentas. `copilot.NewClient` conecta seu código Go a
esse runtime.

Uma sessão de `CreateSession` representa uma conversa contínua. Ela contém as mensagens e os
resultados de ferramentas que compõem o contexto da conversa. Mantenha um cliente ativo durante a
execução do aplicativo e crie uma sessão para cada conversa independente.

## Por que clientes e sessões permanecem separados

Manter essas responsabilidades separadas permite que a conexão com o runtime dure mais do que
qualquer conversa individual. Isso também fornece um pequeno exemplo funcional antes de introduzir
streaming e ferramentas.

Neste ponto, o aplicativo de console é simplesmente `Client -> Session -> model response`.
:::

:::language rust
## Conheça o GitHub Copilot SDK e o runtime

O **GitHub Copilot SDK** é a API Rust que seu aplicativo usa para executar o Copilot como agente. O
[**runtime do Copilot**](https://github.com/github/copilot-sdk/blob/main/docs/features/agent-loop.md)
recebe prompts, chama modelos e gerencia ferramentas. `Client` conecta seu código Rust a esse
runtime.

Uma sessão de `create_session` representa uma conversa contínua. Ela contém as mensagens e os
resultados de ferramentas que compõem o contexto da conversa. Mantenha um cliente ativo durante a
execução do aplicativo e crie uma sessão para cada conversa independente.

## Por que clientes e sessões permanecem separados

Manter essas responsabilidades separadas permite que a conexão com o runtime dure mais do que
qualquer conversa individual. Isso também fornece um pequeno exemplo funcional antes de introduzir
streaming e ferramentas.

Neste ponto, o aplicativo de console é simplesmente `Client -> session -> model response`.
:::

:::language java
## Conheça o GitHub Copilot SDK e o runtime

O **GitHub Copilot SDK** é a API Java que seu aplicativo usa para executar o Copilot como agente. O
[**runtime do Copilot**](https://github.com/github/copilot-sdk/blob/main/docs/features/agent-loop.md)
recebe prompts, chama modelos e gerencia ferramentas. `CopilotClient` conecta seu código Java a
esse runtime.

Uma sessão de `createSession` representa uma conversa contínua. Ela contém as mensagens e os
resultados de ferramentas que compõem o contexto da conversa. Mantenha um cliente ativo durante a
execução do aplicativo e crie uma sessão para cada conversa independente.

## Por que clientes e sessões permanecem separados

Manter essas responsabilidades separadas permite que a conexão com o runtime dure mais do que
qualquer conversa individual. Isso também fornece um pequeno exemplo funcional antes de introduzir
streaming e ferramentas.

Neste ponto, o aplicativo de console é simplesmente `CopilotClient -> session -> model response`.
:::

## Inicie sua primeira sessão do Copilot

:::language dotnet
Abra `Program.cs` e **substitua o arquivo inteiro**:

```csharp
using GitHub.Copilot;
using GitHub.Copilot.Rpc;

Console.WriteLine("=== First Copilot session ===\n");

await using var client = new CopilotClient();
await client.StartAsync();

var ping = await client.PingAsync("workshop");
Console.WriteLine($"Connected to the Copilot runtime: {ping.Message}");

await using var session = await client.CreateSessionAsync(new SessionConfig
{
    OnPermissionRequest = PermissionHandler.ApproveAll,
});
var response = await session.SendAndWaitAsync(
    "In one sentence, explain why an accessible name matters for a form input.");

if (response is null)
{
    throw new InvalidOperationException("Copilot completed without an assistant message.");
}

Console.WriteLine($"\nCopilot: {response.Data.Content}");
```

O ping verifica a conexão com o runtime. O envio que aguarda a resposta completa espera até que a
sessão fique ociosa, por isso funciona bem quando você precisa apenas da resposta final.
:::

:::language nodejs
Abra `src/index.ts` e **substitua o arquivo inteiro**:

```typescript
import { approveAll, CopilotClient } from "@github/copilot-sdk";

const client = new CopilotClient();
await client.start();
try {
  const session = await client.createSession({ onPermissionRequest: approveAll });
  try {
    const response = await session.sendAndWait({ prompt: "Reply with one sentence confirming this Copilot session is ready." });
    console.log(response?.data && "content" in response.data ? response.data.content : response);
  } finally {
    await session.disconnect();
  }
} finally {
  await client.stop();
}
```

`sendAndWait` espera até que a sessão fique ociosa, por isso funciona bem quando você precisa apenas
da resposta final. Sempre encerre a sessão e o cliente em blocos `finally` para que o runtime seja
desligado corretamente.
:::

:::language python
Abra `main.py` e **substitua o arquivo inteiro**:

```python
import asyncio

from copilot import CopilotClient, PermissionHandler
from copilot.session_events import AssistantMessageData, SessionErrorData, SessionIdleData


async def main() -> None:
    async with CopilotClient() as client:
        async with await client.create_session(
            on_permission_request=PermissionHandler.approve_all
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
            await session.send("In one sentence, explain why an accessible name matters for a form input.")
            await done.wait()
            if error is not None:
                raise error


if __name__ == "__main__":
    asyncio.run(main())
```

O Python escuta os eventos da sessão em vez de chamar um único auxiliar de resposta completa.
Imprima a mensagem do assistente, trate os erros da sessão como falhas e aguarde o evento de
inatividade antes de sair.
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
	client := copilot.NewClient(&copilot.ClientOptions{LogLevel: "error"})
	if err := client.Start(context.Background()); err != nil {
		panic(err)
	}
	defer client.Stop()

	session, err := client.CreateSession(context.Background(), &copilot.SessionConfig{
		OnPermissionRequest: copilot.PermissionHandler.ApproveAll,
	})
	if err != nil {
		panic(err)
	}
	defer session.Disconnect()

	response, err := session.SendAndWait(context.Background(), copilot.MessageOptions{
		Prompt: "In one sentence, explain why an accessible name matters for a form input.",
	})
	if err != nil {
		panic(err)
	}
	if response != nil {
		if message, ok := response.Data.(*copilot.AssistantMessageData); ok {
			fmt.Println(message.Content)
		}
	}
}
```

`SendAndWait` espera até que a sessão fique ociosa, por isso funciona bem quando você precisa apenas
da resposta final. `defer` desconecta a sessão e encerra o cliente durante a saída.
:::

:::language rust
Abra `src/main.rs` e **substitua o arquivo inteiro**:

```rust
use github_copilot_sdk::permission;
use github_copilot_sdk::types::{MessageOptions, SessionConfig};
use github_copilot_sdk::{Client, ClientOptions};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::start(ClientOptions::default()).await?;
    let session = client
        .create_session(SessionConfig::default().with_permission_handler(permission::approve_all()))
        .await?;
    let response = session
        .send_and_wait(MessageOptions::new(
            "In one sentence, explain why an accessible name matters for a form input.",
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

`send_and_wait` espera até que a sessão fique ociosa, por isso funciona bem quando você precisa
apenas da resposta final. Desconecte a sessão e encerre o cliente antes de retornar.
:::

:::language java
Abra `src/main/java/workshop/AccessibilityReport.java` e **substitua o arquivo inteiro**:

```java
package workshop;

import com.github.copilot.CopilotClient;
import com.github.copilot.rpc.PermissionHandler;
import com.github.copilot.rpc.MessageOptions;
import com.github.copilot.rpc.SessionConfig;

public final class AccessibilityReport {
    private AccessibilityReport() {
    }

    public static void main(String[] args) throws Exception {
        try (var client = new CopilotClient()) {
            client.start().get();
            var session = client
                    .createSession(new SessionConfig().setOnPermissionRequest(PermissionHandler.APPROVE_ALL)).get();
            var response = session.sendAndWait(new MessageOptions()
                    .setPrompt("In one sentence, explain why an accessible name matters for a form input."))
                    .get();
            if (response == null) {
                throw new IllegalStateException("Copilot completed without an assistant message.");
            }
            System.out.println(response.getData().content());
        }
    }
}
```

`sendAndWait` espera até que a sessão fique ociosa, por isso funciona bem quando você precisa apenas
da resposta final. O bloco try-with-resources fecha o cliente quando `main` termina.
:::

Essa sessão define um manipulador de permissões e nada mais, portanto é executada com a persona
padrão do SDK. A configuração que você não alterou é a
[mensagem do sistema](https://github.com/github/copilot-sdk/blob/main/docs/getting-started.md#customize-the-system-message),
que tem três modos. `append` é o padrão: seu conteúdo é adicionado após o prompt gerenciado pelo SDK,
e a persona padrão da CLI é preservada junto com o contexto do ambiente, as instruções de
ferramentas e as proteções de segurança injetadas pelo SDK. `replace` substitui o prompt inteiro
pelo seu conteúdo. `customize` substitui seções individuais — tom, diretrizes, regras de alteração
de código e outras — enquanto preserva o restante. Este workshop mantém o padrão, portanto todas as
respostas que você vê vêm da persona padrão. Use os outros dois modos quando um aplicativo precisar
de voz ou escopo próprios.

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
python main.py
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

:::language dotnet
Sua resposta exata vai variar, mas a saída deve ter este formato:

```text
=== First Copilot session ===

Connected to the Copilot runtime: ...

Copilot: An accessible name lets assistive technology identify the input's purpose.
```
:::

:::language nodejs
Sua resposta exata vai variar, mas a saída deve ter este formato:

```text
This Copilot session is ready and waiting for your next prompt.
```
:::

:::language python
Sua resposta exata vai variar, mas a saída deve ter este formato:

```text
An accessible name lets assistive technology identify the input's purpose.
```
:::

:::language go
Sua resposta exata vai variar, mas a saída deve ter este formato:

```text
An accessible name lets assistive technology identify the input's purpose.
```
:::

:::language rust
Sua resposta exata vai variar, mas a saída deve ter este formato:

```text
An accessible name lets assistive technology identify the input's purpose.
```
:::

:::language java
Sua resposta exata vai variar, mas a saída deve ter este formato:

```text
An accessible name lets assistive technology identify the input's purpose.
```
:::

<details>
<summary>Solucione problemas desta execução</summary>

| Sintoma | Correção |
|---|---|
| Erro de autenticação ou autorização | Execute `copilot login` novamente e depois execute o projeto outra vez. |
| Executável do runtime não encontrado | Defina `COPILOT_CLI_BINARY_PATH` usando as instruções de verificação preliminar. |
| A solicitação atinge o tempo limite | Verifique o acesso de rede ao GitHub Copilot e tente novamente; este exemplo não oculta a falha. |

</details>

> **Você está pronto para usar streaming quando:** o terminal imprimir uma resposta completa do Copilot.

## Verifique seu entendimento

Qual objeto normalmente deve permanecer ativo durante toda a execução do aplicativo e qual objeto
mantém o contexto de uma conversa?

:::language dotnet
<details>
<summary>Confira sua resposta</summary>

Mantenha `CopilotClient` durante toda a conexão com o runtime. Um `CopilotSession` mantém as
mensagens e o contexto das ferramentas de uma conversa.

</details>
:::

:::language nodejs
<details>
<summary>Confira sua resposta</summary>

Mantenha `CopilotClient` durante toda a conexão com o runtime. Uma sessão de `createSession` mantém
as mensagens e o contexto das ferramentas de uma conversa.

</details>
:::

:::language python
<details>
<summary>Confira sua resposta</summary>

Mantenha `CopilotClient` durante toda a conexão com o runtime. Uma sessão de `create_session`
mantém as mensagens e o contexto das ferramentas de uma conversa.

</details>
:::

:::language go
<details>
<summary>Confira sua resposta</summary>

Mantenha o cliente de `copilot.NewClient` durante toda a conexão com o runtime. Uma sessão de
`CreateSession` mantém as mensagens e o contexto das ferramentas de uma conversa.

</details>
:::

:::language rust
<details>
<summary>Confira sua resposta</summary>

Mantenha `Client` durante toda a conexão com o runtime. Uma sessão de `create_session` mantém as
mensagens e o contexto das ferramentas de uma conversa.

</details>
:::

:::language java
<details>
<summary>Confira sua resposta</summary>

Mantenha `CopilotClient` durante toda a conexão com o runtime. Uma sessão de `createSession` mantém
as mensagens e o contexto das ferramentas de uma conversa.

</details>
:::

:::language dotnet
<details>
<summary>Implementação completa da Etapa 1</summary>

Compare seu trabalho com esta implementação completa da Etapa 1.

```csharp
using GitHub.Copilot;

Console.WriteLine("=== First Copilot session ===\n");

await using var client = new CopilotClient();
await client.StartAsync();

var ping = await client.PingAsync("workshop");
Console.WriteLine($"Connected to the Copilot runtime: {ping.Message}");

await using var session = await client.CreateSessionAsync(new SessionConfig());
var response = await session.SendAndWaitAsync(
    "In one sentence, explain why an accessible name matters for a form input.");

if (response is null)
{
    throw new InvalidOperationException("Copilot completed without an assistant message.");
}

Console.WriteLine($"\nCopilot: {response.Data.Content}");
```
</details>
:::

:::language nodejs
<details>
<summary>Implementação completa da Etapa 1</summary>

Compare seu trabalho com esta implementação completa da Etapa 1.

```typescript
import { CopilotClient } from "@github/copilot-sdk";

const client = new CopilotClient();
await client.start();
try {
  const session = await client.createSession({});
  try {
    const response = await session.sendAndWait({ prompt: "Reply with one sentence confirming this Copilot session is ready." });
    console.log(response?.data && "content" in response.data ? response.data.content : response);
  } finally {
    await session.disconnect();
  }
} finally {
  await client.stop();
}
```
</details>
:::

:::language python
<details>
<summary>Implementação completa da Etapa 1</summary>

Compare seu trabalho com esta implementação completa da Etapa 1.

```python
import asyncio

from copilot import CopilotClient
from copilot.session_events import AssistantMessageData, SessionErrorData, SessionIdleData


async def main() -> None:
    async with CopilotClient() as client:
        async with await client.create_session() as session:
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
            await session.send("In one sentence, explain why an accessible name matters for a form input.")
            await done.wait()
            if error is not None:
                raise error


if __name__ == "__main__":
    asyncio.run(main())
```
</details>
:::

:::language go
<details>
<summary>Implementação completa da Etapa 1</summary>

Compare seu trabalho com esta implementação completa da Etapa 1.

```go
package main

import (
	"context"
	"fmt"

	copilot "github.com/github/copilot-sdk/go"
)

func main() {
	client := copilot.NewClient(&copilot.ClientOptions{LogLevel: "error"})
	if err := client.Start(context.Background()); err != nil {
		panic(err)
	}
	defer client.Stop()

	session, err := client.CreateSession(context.Background(), &copilot.SessionConfig{})
	if err != nil {
		panic(err)
	}
	defer session.Disconnect()

	response, err := session.SendAndWait(context.Background(), copilot.MessageOptions{
		Prompt: "In one sentence, explain why an accessible name matters for a form input.",
	})
	if err != nil {
		panic(err)
	}
	if response != nil {
		if message, ok := response.Data.(*copilot.AssistantMessageData); ok {
			fmt.Println(message.Content)
		}
	}
}
```
</details>
:::

:::language rust
<details>
<summary>Implementação completa da Etapa 1</summary>

Compare seu trabalho com esta implementação completa da Etapa 1.

```rust
use github_copilot_sdk::types::{MessageOptions, SessionConfig};
use github_copilot_sdk::{Client, ClientOptions};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::start(ClientOptions::default()).await?;
    let session = client.create_session(SessionConfig::default()).await?;
    let response = session
        .send_and_wait(MessageOptions::new(
            "In one sentence, explain why an accessible name matters for a form input.",
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
</details>
:::

:::language java
<details>
<summary>Implementação completa da Etapa 1</summary>

Compare seu trabalho com esta implementação completa da Etapa 1.

```java
package workshop;

import com.github.copilot.CopilotClient;
import com.github.copilot.rpc.MessageOptions;
import com.github.copilot.rpc.SessionConfig;

public final class AccessibilityReport {
    private AccessibilityReport() {
    }

    public static void main(String[] args) throws Exception {
        try (var client = new CopilotClient()) {
            client.start().get();
            var session = client.createSession(new SessionConfig()).get();
            var response = session.sendAndWait(new MessageOptions()
                    .setPrompt("In one sentence, explain why an accessible name matters for a form input."))
                    .get();
            if (response == null) {
                throw new IllegalStateException("Copilot completed without an assistant message.");
            }
            System.out.println(response.getData().content());
        }
    }
}
```
</details>
:::

## Saiba mais

- [Crie seu primeiro aplicativo com tecnologia do Copilot](https://docs.github.com/en/copilot/how-tos/copilot-sdk/getting-started):
  o tutorial do GitHub para o mesmo primeiro cliente, sessão e prompt.
- [Retomada e persistência de sessões](https://github.com/github/copilot-sdk/blob/main/docs/features/session-persistence.md):
  como o estado da conversa de uma sessão é mantido e como retomá-la após uma reinicialização.
- [Limpeza de contexto](https://github.com/github/copilot-sdk/blob/main/docs/features/context-management.md):
  como substituir a conversa dentro de uma sessão sem criar uma nova.
- [Autenticação](https://github.com/github/copilot-sdk/blob/main/docs/auth/README.md):
  as credenciais que um cliente pode usar depois que você deixar de depender de `copilot login`.

Continue para a [Etapa 2: Transmita uma resposta](02-streaming.md).