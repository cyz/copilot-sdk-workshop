# Museum Exhibit Studio: preparação

> **Tempo:** Sem tempo definido  
> **Workshop:** agente fora do SDLC

## O que você vai criar

O Museum Exhibit Studio transforma fatos aprovados pelo educador em textos de exposição prontos para
o público:

```text
approved facts -> bounded prompt -> curator session -> structural checks -> human review
```

Você constrói um único aplicativo de console, que cresce no próprio diretório
`start-museum/<language>`. Cada etapa acrescenta uma ideia e termina com uma execução real, para
que você veja o curador tomar forma passo a passo:

| Etapa | Você adiciona | Você vê |
|---|---|---|
| 1 | Um cliente, uma sessão e um prompt | Texto de museu no seu terminal |
| 2 | A função de streaming pré-construída | O texto chegando em tempo real |
| 3 | A mensagem de sistema do curador | Outra voz e outro formato |
| 4 | O construtor de prompt baseado em fatos aprovados | Um texto que acompanha os seus fatos |
| 5 | Um executor de sessão com os guardrails | Ferramentas recusadas e falhas tratadas com clareza |
| 6 | O validador pré-construído | Um relatório estrutural PASS/FAIL |
| 7 | Uma sessão de pesquisa na Wikipedia com escopo restrito | Contexto com citações, mantido fora da exposição |
| 8 | Uma página interativa opcional | `exhibit.html` no seu navegador |

O projeto inicial já traz toda a infraestrutura que você não deveria ter de escrever: os conjuntos
de fatos aprovados e seus limites, uma função de streaming, a validação determinística da exposição,
o servidor MCP da Wikipedia com escopo restrito e seu handler de permissões que nega por padrão, a
permissão de escrita restrita ao arquivo `exhibit.html` e pequenos prompts interativos no terminal.
**Você nunca edita o módulo auxiliar.** Você escreve a configuração das sessões, as duas mensagens
de sistema, os construtores de prompt, um executor de sessão e a função `main`.

Você precisa do GitHub Copilot CLI autenticado, do runtime da sua linguagem e de um terminal. Você
trabalha diretamente no projeto mínimo em `start-museum/<language>`, não no aplicativo finalizado. O
projeto concluído em `finished/<language>/museum-exhibit-studio` serve apenas como referência
opcional.

> **Sobre o idioma do código:** os trechos de código, os prompts enviados ao modelo e as mensagens
> impressas pelo programa permanecem em inglês, exatamente como no projeto inicial e na referência
> em `finished/`. Por isso, o curador também responde em inglês, e as saídas de exemplo destas
> lições correspondem ao que você verá no terminal. Copie os blocos de código sem traduzi-los.

## Clone o repositório do workshop

```bash
git clone https://github.com/github/copilot-sdk-workshop.git
cd copilot-sdk-workshop
```

Confirme que o terminal está na raiz do repositório antes de entrar em um projeto inicial:

```bash
test "$(git rev-parse --show-toplevel)" = "$PWD"
```

O comando deve terminar com sucesso, sem saída.

Você constrói o aplicativo do museu **no próprio lugar**, dentro do diretório do projeto inicial da
sua linguagem. Não há etapa de cópia. Isso significa que você edita arquivos versionados no
repositório, e por isso seu trabalho aparece em `git status` como arquivos modificados. Isso é
esperado. Se quiser recomeçar a partir de um projeto inicial limpo, execute `git checkout -- .` na
raiz do repositório para descartar suas alterações.

Entre agora no diretório do projeto inicial da sua linguagem e permaneça nele para executar todos
os comandos do workshop do museu.

:::language dotnet
Entre no projeto inicial .NET; em seguida, restaure, faça o build e execute seu ponto de entrada
local:

```bash
cd start-museum/dotnet
dotnet restore
dotnet build --no-restore
dotnet run --no-build
```

Critério de sucesso: o build passa e o programa imprime `=== Museum Exhibit Studio starter ===`
seguido de `Pre-built curator helpers are ready in Helpers/.`

Você trabalha em `start-museum/dotnet` pelo restante do workshop, então mantenha este terminal aqui.
A partir desta pasta, digite `code .` para abri-la no VS Code, ou abra a pasta no seu editor
preferido.

Seu módulo auxiliar é `Helpers/Curator*.cs`, no namespace `MuseumExhibitStudio.Helpers`. Você
escreverá todas as mudanças das lições em `Program.cs`.
:::

:::language nodejs
Entre no projeto inicial Node.js. O lockfile fixa o SDK 1.0.11 e o pacote de plataforma compatível
`@github/copilot` 1.0.80:

```bash
cd start-museum/nodejs
npm ci --ignore-scripts --no-audit --fund=false
npm run build
npm start
```

Critério de sucesso: o build passa e o programa imprime `=== Museum Exhibit Studio starter ===`
seguido de `Pre-built curator helpers are ready in src/curator.ts.`

Você vai trabalhar em `start-museum/nodejs` até o fim do workshop, então mantenha este terminal
nesse diretório. A partir dele, execute `code .` para abrir a pasta no VS Code ou abra-a no editor
de sua preferência.

Seu módulo auxiliar é `src/curator.ts`. Todas as alterações das lições serão feitas em
`src/index.ts`.
:::

:::language python
Entre no projeto inicial Python, crie um ambiente virtual isolado e instale o SDK 1.0.11:

```bash
cd start-museum/python
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python -m py_compile *.py
.venv/bin/python main.py
```

No Windows, o interpretador fica em `.venv/Scripts/python.exe`.

Critério de sucesso: o código-fonte compila e o programa imprime
`=== Museum Exhibit Studio starter ===` seguido de
`Pre-built curator helpers are ready in curator.py.`

Você trabalha em `start-museum/python` pelo restante do workshop, então mantenha este terminal aqui.
A partir desta pasta, digite `code .` para abri-la no VS Code, ou abra a pasta no seu editor
preferido.

Seu módulo auxiliar é `curator.py`. Você escreverá todas as mudanças das lições em `main.py`.
:::

:::language go
Entre no projeto inicial Go, baixe a dependência travada do SDK 1.0.11 e faça o build:

```bash
cd start-museum/go
go mod download
go build -mod=readonly ./...
go run .
```

Critério de sucesso: o build passa e o programa imprime `=== Museum Exhibit Studio starter ===`
seguido de `Pre-built curator helpers are ready in curator.go.`

Você trabalha em `start-museum/go` pelo restante do workshop, então mantenha este terminal aqui. A
partir desta pasta, digite `code .` para abri-la no VS Code, ou abra a pasta no seu editor
preferido.

Seu módulo auxiliar é `curator.go`, no mesmo pacote `main`. Você escreverá todas as mudanças das
lições em `main.go`.
:::

:::language rust
Entre no projeto inicial Rust, busque as dependências travadas e verifique o projeto:

```bash
cd start-museum/rust
cargo fetch --locked
cargo check --locked
cargo run --locked
```

Critério de sucesso: o Cargo deixa `Cargo.lock` inalterado e o programa imprime
`=== Museum Exhibit Studio starter ===` seguido de
`Pre-built curator helpers are ready in src/lib.rs.`

Você trabalha em `start-museum/rust` pelo restante do workshop, então mantenha este terminal aqui. A
partir desta pasta, digite `code .` para abri-la no VS Code, ou abra a pasta no seu editor
preferido.

Seu módulo auxiliar é o crate de biblioteca `museum_exhibit_studio` em `src/lib.rs`. Você escreverá
todas as mudanças das lições em `src/main.rs`.
:::

:::language java
Entre no projeto inicial Maven, resolva o SDK 1.0.11, compile e execute:

```bash
cd start-museum/java
mvn dependency:go-offline
mvn compile
mvn exec:java
```

Critério de sucesso: o Maven termina com sucesso e o programa imprime
`=== Museum Exhibit Studio starter ===` seguido de
`Pre-built curator helpers are ready in src/main/java/workshop/.`

Você trabalha em `start-museum/java` pelo restante do workshop, então mantenha este terminal aqui. A
partir desta pasta, digite `code .` para abri-la no VS Code, ou abra a pasta no seu editor
preferido.

Seu módulo auxiliar é `src/main/java/workshop/Curator*.java`. Você escreverá todas as mudanças das
lições em `src/main/java/workshop/MuseumExhibitStudio.java`.
:::

## Estabeleça o limite de confiança

| Controle | O que ele pode fazer |
|---|---|
| Mensagem de sistema | Orientar papel, tom, escopo e formato de saída |
| Lista de permissões (allowlist) de ferramentas | Decidir exatamente quais ferramentas existem em uma sessão |
| Código do aplicativo | Ser dono dos dados por trás de uma ferramenta e impor limites, timeout, validação e limpeza |
| Revisão humana | Decidir se cada afirmação histórica tem respaldo nos fatos |

Os fatos aprovados pelo educador são a única fonte autorizada, e o curador só chega até eles por
meio de uma ferramenta controlada pelo aplicativo. A memória do modelo não é conhecimento
museológico verificado, e as instruções do prompt não são um limite de autorização: somente a lista
de permissões e o handler de permissões decidem o que a sessão pode de fato fazer.

## Saiba mais

O SDK por trás do curador tem documentação própria, fora deste workshop. Vale a pena manter estas
páginas abertas enquanto você avança (todas em inglês):

- [Guias práticos do GitHub Copilot SDK](https://docs.github.com/en/copilot/how-tos/copilot-sdk): a
  documentação oficial do GitHub para o SDK, incluindo os pré-requisitos cobertos nesta preparação.
- [Mapa da documentação do Copilot SDK](https://github.com/github/copilot-sdk/blob/main/docs/README.md):
  o índice de configuração, autenticação, recursos e solução de problemas.
- [Configuração padrão: a CLI incluída no pacote](https://github.com/github/copilot-sdk/blob/main/docs/setup/bundled-cli.md):
  como o SDK localiza e inicia o Copilot CLI e como apontá-lo para outro binário.
- [Guia de depuração](https://github.com/github/copilot-sdk/blob/main/docs/troubleshooting/debugging.md):
  o primeiro lugar a consultar quando uma execução falha antes de produzir qualquer saída.

:::language dotnet
- [Referência do SDK .NET](https://github.com/github/copilot-sdk/blob/main/dotnet/README.md):
  instalação do pacote e um exemplo mínimo para o SDK .NET.
:::

:::language nodejs
- [Referência do SDK Node.js](https://github.com/github/copilot-sdk/blob/main/nodejs/README.md):
  instalação do pacote e um exemplo mínimo para o SDK Node.js.
:::

:::language python
- [Referência do SDK Python](https://github.com/github/copilot-sdk/blob/main/python/README.md):
  instalação do pacote e um exemplo mínimo para o SDK Python.
:::

:::language go
- [Referência do SDK Go](https://github.com/github/copilot-sdk/blob/main/go/README.md):
  instalação do módulo e um exemplo mínimo para o SDK Go.
:::

:::language rust
- [Referência do SDK Rust](https://github.com/github/copilot-sdk/blob/main/rust/README.md):
  instalação do crate e um exemplo mínimo para o SDK Rust.
:::

:::language java
- [Referência do SDK Java](https://github.com/github/copilot-sdk/blob/main/java/README.md):
  coordenadas da dependência e um exemplo mínimo para o SDK Java.
:::

Continue para a [Etapa 1: Crie sua primeira sessão do curador](museum-01-first-curator-session.md).
