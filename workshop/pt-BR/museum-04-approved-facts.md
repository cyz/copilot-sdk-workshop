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

No museu, ela é o equivalente a `accessibility_rule_lookup` na trilha de acessibilidade: uma
ferramenta local, sem argumentos e controlada pelo aplicativo, que entrega ao modelo dados curados
que ele não conseguiria acessar de outra forma.

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

:::language dotnet
Abra `Program.cs`. Não altere nada no topo — você já tem
`using MuseumExhibitStudio.Helpers;`. Substitua tudo desde o primeiro `Console.WriteLine` até o
fim do arquivo:

```csharp
Console.WriteLine("=== Museum Exhibit Studio ===");
Console.WriteLine();
Console.WriteLine("Approved fact sets:");
for (var index = 0; index < CuratorFacts.FactSets.Count; index++)
{
    Console.WriteLine($"{index + 1}. {CuratorFacts.FactSets[index].Label}");
}

Console.WriteLine();

var selectedFactSet = ReadFactSetSelection();
var approvedFacts = CuratorFacts.BoundFacts(selectedFactSet.Facts);
for (var index = 0; index < approvedFacts.Length; index++)
{
    Console.WriteLine($"{index + 1}. {approvedFacts[index]}");
}

Console.WriteLine();

if (!CuratorTerminal.AskYesNo("Use these facts?", defaultYes: true))
{
    approvedFacts = CuratorFacts.BoundFacts(CuratorTerminal.ReadFacts());
}

Console.WriteLine();

await using var client = new CopilotClient();
await client.StartAsync();

await using var session = await client.CreateSessionAsync(new SessionConfig
{
    ClientName = "museum-exhibit-studio",
    OnPermissionRequest = PermissionHandler.ApproveAll,
    Streaming = true,
    Tools = [CuratorFacts.CreateApprovedFactLookup(approvedFacts)],
    AvailableTools = [CuratorFacts.ApprovedFactLookupName],
    SystemMessage = new SystemMessageConfig
    {
        Mode = SystemMessageMode.Replace,
        Content = SystemMessage
    }
});

await CuratorStreamer.StreamExhibitAsync(session, BuildExhibitPrompt());

await client.StopAsync();
CuratorTerminal.CloseTerminal();

CuratorFactSet ReadFactSetSelection()
{
    var input = CuratorTerminal.AskLine("Choose a fact set [1-3, default 1]: ");
    if (int.TryParse(input, out var selection) &&
        selection >= 1 &&
        selection <= CuratorFacts.FactSets.Count)
    {
        return CuratorFacts.FactSets[selection - 1];
    }

    return CuratorFacts.FactSets[0];
}

static string BuildExhibitPrompt()
{
    return $"""
        Create visitor-facing exhibit text about this application's approved subject.

        Call {CuratorFacts.ApprovedFactLookupName} first. Use only the facts it returns, and
        treat them as the complete source of truth for this exhibit.

        Return exactly this structure:

        # <an engaging exhibit title>
        ## Narrative
        <100-140 words, excluding the title and questions>
        ## Visitor questions
        1. <question>
        2. <question>
        3. <question>

        Write exactly three distinct visitor reflection questions. Do not add a preface,
        conclusion, software discussion, or facts the tool did not return.
        """;
}
```

Funções locais vêm depois das instruções de nível superior. `BuildExhibitPrompt` não recebe mais
fato nenhum — ele nomeia a ferramenta. `CreateApprovedFactLookup` chama `BoundFacts` internamente,
então o limite vale independentemente de quem constrói a ferramenta.

**Confira no código:** `Helpers/CuratorFacts.cs` contém tudo isso, e vale a leitura porque é uma
definição real de ferramenta, não apenas código de infraestrutura. `CreateApprovedFactLookup`
fecha sobre a lista com limites que o educador acabou de aprovar e a registra por meio de
`CopilotTool.DefineTool` com o nome `approved_fact_lookup`. O handler não recebe parâmetros, então
o modelo não consegue direcionar o que volta — ele pede, e recebe exatamente aquela lista.
`SkipPermission = true` está definido ali mesmo porque os dados são controlados pelo aplicativo. Os
três conjuntos de fatos e os limites `MaximumFactCount` (20) e `MaximumFactLength` (500) impostos
por `BoundFacts` estão no mesmo arquivo.
:::

:::language nodejs
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
:::

:::language python
Abra `main.py` e expanda a importação dos auxiliares:

```python
from curator import (
    APPROVED_FACT_LOOKUP_NAME,
    FACT_SETS,
    ask_line,
    ask_yes_no,
    bound_facts,
    create_approved_fact_lookup,
    read_facts,
    stream_exhibit,
)
```

Adicione o construtor de prompt abaixo de `SYSTEM_MESSAGE`:

```python
def build_exhibit_prompt() -> str:
    return f"""Create visitor-facing exhibit text about this application's approved subject.

Call {APPROVED_FACT_LOOKUP_NAME} first. Use only the facts it returns, and treat them as
the complete source of truth for this exhibit.

Return exactly this structure:

# <an engaging exhibit title>
## Narrative
<100-140 words, excluding the title and questions>
## Visitor questions
1. <question>
2. <question>
3. <question>

Write exactly three distinct visitor reflection questions. Do not add a preface,
conclusion, software discussion, or facts the tool did not return."""
```

Substitua `main`:

```python
async def main() -> None:
    print("=== Museum Exhibit Studio ===")
    print()
    print("Approved fact sets:")
    for index, fact_set in enumerate(FACT_SETS, start=1):
        print(f"{index}. {fact_set.label}")
    print()

    choice = ask_line("Choose a fact set [1-3, default 1]: ")
    selected_index = int(choice) - 1 if choice in {"1", "2", "3"} else 0
    facts = list(FACT_SETS[selected_index].facts)
    for index, fact in enumerate(facts, start=1):
        print(f"{index}. {fact}")
    print()

    if not ask_yes_no("Use these facts?", True):
        facts = read_facts()
    facts = bound_facts(facts)

    print()
    async with CopilotClient() as client:
        async with await client.create_session(
            client_name="museum-exhibit-studio",
            on_permission_request=PermissionHandler.approve_all,
            streaming=True,
            tools=[create_approved_fact_lookup(facts)],
            available_tools=[APPROVED_FACT_LOOKUP_NAME],
            system_message={"mode": "replace", "content": SYSTEM_MESSAGE},
        ) as session:
            await stream_exhibit(session, build_exhibit_prompt())
```

`build_exhibit_prompt` não recebe mais fato nenhum — ele nomeia a ferramenta.
`create_approved_fact_lookup` chama `bound_facts` internamente, então o limite vale
independentemente de quem constrói a ferramenta.

**Confira no código:** `curator.py` contém tudo isso, e vale a leitura porque é uma definição real
de `@define_tool`, não apenas código de infraestrutura. `create_approved_fact_lookup` fecha sobre
a lista com limites que o educador acabou de aprovar e decora uma função aninhada
`approved_fact_lookup()` que não recebe argumentos, então o modelo não consegue direcionar o que
volta — ele pede, e recebe exatamente aquela lista. `skip_permission=True` está definido ali mesmo
porque os dados são controlados pelo aplicativo. Os três conjuntos de fatos e os limites
`MAXIMUM_FACT_COUNT` (20) e `MAXIMUM_FACT_LENGTH` (500) impostos por `bound_facts` estão no mesmo
arquivo.
:::

:::language go
Abra `main.go`. Adicione `"strconv"` ao bloco de importação e, em seguida, adicione o construtor
de prompt abaixo da mensagem de sistema:

```go
func buildExhibitPrompt() string {
	return fmt.Sprintf(`Create visitor-facing exhibit text about this application's approved subject.

Call %s first. Use only the facts it returns, and treat them as the complete
source of truth for this exhibit.

Return exactly this structure:

# <an engaging exhibit title>
## Narrative
<100-140 words, excluding the title and questions>
## Visitor questions
1. <question>
2. <question>
3. <question>

Write exactly three distinct visitor reflection questions. Do not add a preface,
conclusion, software discussion, or facts the tool did not return.`, ApprovedFactLookupName)
}
```

Substitua `main`:

```go
func main() {
	fmt.Println("=== Museum Exhibit Studio ===")
	fmt.Println()
	fmt.Println("Approved fact sets:")
	for index, factSet := range FactSets {
		fmt.Printf("%d. %s\n", index+1, factSet.Label)
	}
	fmt.Println()

	choice := AskLine(fmt.Sprintf("Choose a fact set [1-%d, default 1]: ", len(FactSets)))
	selectedIndex := 0
	if parsed, err := strconv.Atoi(choice); err == nil && parsed >= 1 && parsed <= len(FactSets) {
		selectedIndex = parsed - 1
	}

	facts := append([]string(nil), FactSets[selectedIndex].Facts...)
	for index, fact := range facts {
		fmt.Printf("%d. %s\n", index+1, fact)
	}
	fmt.Println()

	if !AskYesNo("Use these facts?", true) {
		facts = ReadFacts()
	}
	facts, err := BoundFacts(facts)
	if err != nil {
		panic(err)
	}

	lookup, err := ApprovedFactLookup(facts)
	if err != nil {
		panic(err)
	}

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
		Tools:               []copilot.Tool{lookup},
		AvailableTools:      []string{ApprovedFactLookupName},
		SystemMessage: &copilot.SystemMessageConfig{
			Mode:    "replace",
			Content: systemMessage,
		},
	})
	if err != nil {
		panic(err)
	}
	defer func() { _ = session.Disconnect() }()

	if _, err := StreamExhibit(session, buildExhibitPrompt(), GenerationTimeout); err != nil {
		panic(err)
	}
}
```

`buildExhibitPrompt` não recebe mais fato nenhum — ele nomeia a ferramenta.
`ApprovedFactLookup` chama `BoundFacts` internamente, então o limite vale independentemente de quem
constrói a ferramenta.

**Confira no código:** `curator.go` contém tudo isso, e vale a leitura porque é uma definição real
de `copilot.DefineTool`, não apenas código de infraestrutura. `ApprovedFactLookup` fecha sobre a
lista com limites que o educador acabou de aprovar e define um handler cujo tipo de argumento é
`struct{}`, então o modelo não consegue direcionar o que volta — ele pede, e recebe exatamente
aquela lista. `lookup.SkipPermission = true` está definido ali mesmo porque os dados são
controlados pelo aplicativo. Os três conjuntos de fatos e os limites `MaximumFactCount` (20) e
`MaximumFactLength` (500) impostos por `BoundFacts` estão no mesmo arquivo.
:::

:::language rust
Abra `src/main.rs` e expanda a importação da crate:

```rust
use museum_exhibit_studio::{
    APPROVED_FACT_LOOKUP_NAME, GENERATION_TIMEOUT, RuntimeError, approved_fact_lookup, ask_line,
    ask_yes_no, bound_facts, fact_sets, read_facts, stream_exhibit,
};
```

Adicione o construtor de prompt abaixo de `SYSTEM_MESSAGE`:

```rust
fn build_exhibit_prompt() -> String {
    format!(
        r#"Create visitor-facing exhibit text about this application's approved subject.

Call {APPROVED_FACT_LOOKUP_NAME} first. Use only the facts it returns, and treat them as
the complete source of truth for this exhibit.

Return exactly this structure:

# <an engaging exhibit title>
## Narrative
<100-140 words, excluding the title and questions>
## Visitor questions
1. <question>
2. <question>
3. <question>

Write exactly three distinct visitor reflection questions. Do not add a preface,
conclusion, software discussion, or facts the tool did not return."#
    )
}
```

Substitua `main`:

```rust
#[tokio::main]
async fn main() -> Result<(), RuntimeError> {
    println!("=== Museum Exhibit Studio ===");
    println!();
    println!("Approved fact sets:");
    for (index, fact_set) in fact_sets().iter().enumerate() {
        println!("{}. {}", index + 1, fact_set.label);
    }
    println!();

    let choice = ask_line("Choose a fact set [1-3, default 1]: ")?;
    let selected_index = choice
        .trim()
        .parse::<usize>()
        .ok()
        .filter(|index| (1..=fact_sets().len()).contains(index))
        .unwrap_or(1)
        - 1;
    let mut facts = fact_sets()[selected_index]
        .facts
        .iter()
        .map(|fact| (*fact).to_owned())
        .collect::<Vec<_>>();
    for (index, fact) in facts.iter().enumerate() {
        println!("{}. {fact}", index + 1);
    }
    println!();

    if !ask_yes_no("Use these facts?", true)? {
        facts = read_facts()?;
    }
    let facts = bound_facts(facts)?;

    println!();
    let client = Client::start(ClientOptions::default()).await?;
    let mut config = SessionConfig::default().with_permission_handler(permission::approve_all());
    config.client_name = Some("museum-exhibit-studio".to_owned());
    config.streaming = Some(true);
    config.tools = Some(vec![approved_fact_lookup(&facts)?]);
    config.available_tools = Some(vec![APPROVED_FACT_LOOKUP_NAME.to_owned()]);
    config.system_message = Some(
        SystemMessageConfig::new()
            .with_mode("replace")
            .with_content(SYSTEM_MESSAGE),
    );
    let session = client.create_session(config).await?;

    stream_exhibit(&session, build_exhibit_prompt(), GENERATION_TIMEOUT).await?;

    session.disconnect().await?;
    client.stop().await?;
    Ok(())
}
```

`build_exhibit_prompt` não recebe mais fato nenhum — ele nomeia a ferramenta.
`approved_fact_lookup` chama `bound_facts` internamente, então o limite vale independentemente de
quem constrói a ferramenta.

**Confira no código:** `src/lib.rs` contém tudo isso, e vale a leitura porque é uma definição real
de ferramenta, não apenas código de infraestrutura. `approved_fact_lookup` fecha sobre a lista com
limites que o educador acabou de aprovar e constrói uma `Tool` cujo esquema de parâmetros é
`{"type": "object", "properties": {}, "additionalProperties": false}`, então o modelo não
consegue direcionar o que volta — ele pede, e recebe exatamente aquela lista.
`.with_skip_permission(true)` está definido ali mesmo porque os dados são controlados pelo
aplicativo. Os três conjuntos de fatos e os limites `MAXIMUM_FACT_COUNT` (20) e
`MAXIMUM_FACT_LENGTH` (500) impostos por `bound_facts` estão no mesmo arquivo.
:::

:::language java
Abra `src/main/java/workshop/MuseumExhibitStudio.java`. Adicione
`import java.util.List;` às importações e, em seguida, adicione o construtor de prompt à classe:

```java
    public static String buildExhibitPrompt() {
        return """
                Create visitor-facing exhibit text about this application's approved subject.

                Call %s first. Use only the facts it returns, and treat them as the
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
                conclusion, software discussion, or facts the tool did not return.
                """.formatted(CuratorFacts.APPROVED_FACT_LOOKUP_NAME);
    }

    private static CuratorFacts.FactSet selectFactSet(String input) {
        if (input != null && !input.isBlank()) {
            try {
                int selected = Integer.parseInt(input.trim());
                if (selected >= 1 && selected <= CuratorFacts.factSets.size()) {
                    return CuratorFacts.factSets.get(selected - 1);
                }
            } catch (NumberFormatException ignored) {
            }
        }
        return CuratorFacts.factSets.get(0);
    }
```

Substitua `main`:

```java
    public static void main(String[] args) throws Exception {
        System.out.println("=== Museum Exhibit Studio ===");
        System.out.println();
        System.out.println("Approved fact sets:");
        for (int index = 0; index < CuratorFacts.factSets.size(); index++) {
            System.out.printf("%d. %s%n", index + 1, CuratorFacts.factSets.get(index).label());
        }
        System.out.println();

        CuratorFacts.FactSet selected =
                selectFactSet(CuratorTerminal.askLine("Choose a fact set [1-3, default 1]: "));
        List<String> facts = selected.facts();
        for (int index = 0; index < facts.size(); index++) {
            System.out.printf("%d. %s%n", index + 1, facts.get(index));
        }
        System.out.println();

        if (!CuratorTerminal.askYesNo("Use these facts?", true)) {
            facts = CuratorTerminal.readFacts();
        }
        facts = CuratorFacts.boundFacts(facts);

        System.out.println();
        try (var client = new CopilotClient()) {
            client.start().get();
            var session = client.createSession(new SessionConfig()
                    .setClientName("museum-exhibit-studio")
                    .setOnPermissionRequest(PermissionHandler.APPROVE_ALL)
                    .setStreaming(true)
                    .setTools(List.of(CuratorFacts.approvedFactLookup(facts)))
                    .setAvailableTools(List.of(CuratorFacts.APPROVED_FACT_LOOKUP_NAME))
                    .setSystemMessage(new SystemMessageConfig()
                            .setMode(SystemMessageMode.REPLACE)
                            .setContent(SYSTEM_MESSAGE))).get();
            try {
                CuratorStreamer.streamExhibit(session, buildExhibitPrompt());
            } finally {
                session.close();
                client.stop().get();
            }
        } finally {
            CuratorTerminal.close();
        }
    }
```

`buildExhibitPrompt` não recebe mais fato nenhum — ele nomeia a ferramenta. `approvedFactLookup`
chama `boundFacts` internamente, então o limite vale independentemente de quem constrói a
ferramenta.

**Confira no código:** `CuratorFacts.java` contém tudo isso, e vale a leitura porque é uma
definição real de `ToolDefinition`, não apenas código de infraestrutura. `approvedFactLookup`
constrói um `ApprovedFactReader` privado sobre a lista com limites que o educador acabou de
aprovar e vincula seu método `read`, sem argumentos, então o modelo não consegue direcionar o que
volta — ele pede, e recebe exatamente aquela lista. `.skipPermission(true)` está definido ali
mesmo porque os dados são controlados pelo aplicativo. Os três conjuntos de fatos e os limites
`MAXIMUM_FACT_COUNT` (20) e `MAXIMUM_FACT_LENGTH` (500) impostos por `boundFacts` estão no mesmo
arquivo.
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
