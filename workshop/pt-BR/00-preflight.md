# Preparação: prepare sua máquina

> **Preparação sem tempo cronometrado**
>
> Conclua esta página antes de iniciar o workshop de 90 minutos.

## O que estará pronto

Ao final da preparação, você terá clonado o repositório, autenticado a Copilot CLI, compilado o
projeto inicial e baixado o Playwright MCP, pronto para uso.

:::language dotnet
## O que você precisa

| Requisito | Por que o workshop precisa dele | Verificar |
|---|---|---|
| [.NET 10 SDK](https://learn.microsoft.com/dotnet/core/install/) | Compila e executa o aplicativo de console em C# | `dotnet --version` |
| [Node.js 22 ou mais recente](https://nodejs.org/) | Executa o servidor Playwright MCP | `node --version` |
| [GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli) | Fornece o runtime do Copilot usado pelo SDK | `copilot --version` |
| [Acesso ao GitHub Copilot](https://github.com/features/copilot) | Autoriza solicitações do Copilot | `copilot login` |
| Microsoft Edge (padrão) ou Google Chrome | Permite que o Playwright inspecione a página de destino | Abra o navegador uma vez antes do workshop |

Seus comandos devem retornar uma saída neste formato:

```text
$ dotnet --version
10.0.x
$ node --version
v22.x.x
$ copilot --version
GitHub Copilot CLI ...
```
:::

:::language nodejs
## O que você precisa

| Requisito | Por que o workshop precisa dele | Verificar |
|---|---|---|
| [Node.js 22.12 ou mais recente](https://nodejs.org/) | Executa o aplicativo TypeScript do workshop e o Playwright MCP | `node --version` |
| [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) | Instala `@github/copilot-sdk` e as ferramentas de build | `npm --version` |
| [GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli) | Fornece o runtime do Copilot usado pelo SDK | `copilot --version` |
| [Acesso ao GitHub Copilot](https://github.com/features/copilot) | Autoriza solicitações do Copilot | `copilot login` |
| Microsoft Edge (padrão) ou Google Chrome | Permite que o Playwright inspecione a página de destino | Abra o navegador uma vez antes do workshop |

Seus comandos devem retornar uma saída neste formato:

```text
$ node --version
v22.12.x
$ npm --version
10.x.x
$ copilot --version
GitHub Copilot CLI ...
```

Consulte o
[guia oficial de instalação do SDK para Node.js](https://github.com/github/copilot-sdk/tree/main/nodejs).
:::

:::language python
## O que você precisa

| Requisito | Por que o workshop precisa dele | Verificar |
|---|---|---|
| [Python 3.11 ou mais recente](https://www.python.org/downloads/) | Executa o aplicativo assíncrono do workshop | `python --version` |
| [pip](https://pip.pypa.io/en/stable/installation/) | Instala o wheel fixado de `github-copilot-sdk` | `python -m pip --version` |
| [Node.js 22 ou mais recente](https://nodejs.org/) | Executa o servidor Playwright MCP | `node --version` |
| [GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli) | Substituição opcional do runtime local por meio de `COPILOT_CLI_PATH` | `copilot --version` |
| [Acesso ao GitHub Copilot](https://github.com/features/copilot) | Autoriza solicitações do Copilot | `copilot login` |
| Microsoft Edge (padrão) ou Google Chrome | Permite que o Playwright inspecione a página de destino | Abra o navegador uma vez antes do workshop |

Seus comandos devem retornar uma saída neste formato:

```text
$ python --version
Python 3.11.x
$ node --version
v22.x.x
$ copilot --version
GitHub Copilot CLI ...
```

O SDK para Python pode baixar um runtime fixado no primeiro uso. Consulte o
[guia oficial de instalação do SDK para Python](https://github.com/github/copilot-sdk/tree/main/python).
:::

:::language go
## O que você precisa

| Requisito | Por que o workshop precisa dele | Verificar |
|---|---|---|
| [Go 1.24 ou mais recente](https://go.dev/dl/) | Compila e executa o módulo Go do workshop | `go version` |
| [Node.js 22 ou mais recente](https://nodejs.org/) | Executa o servidor Playwright MCP | `node --version` |
| [GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli) | É necessária no `PATH` (ou em `COPILOT_CLI_PATH`) para o SDK | `copilot --version` |
| [Acesso ao GitHub Copilot](https://github.com/features/copilot) | Autoriza solicitações do Copilot | `copilot login` |
| Microsoft Edge (padrão) ou Google Chrome | Permite que o Playwright inspecione a página de destino | Abra o navegador uma vez antes do workshop |

Seus comandos devem retornar uma saída neste formato:

```text
$ go version
go version go1.24.x ...
$ node --version
v22.x.x
$ copilot --version
GitHub Copilot CLI ...
```

Consulte o
[guia oficial de instalação do SDK para Go](https://github.com/github/copilot-sdk/tree/main/go).
:::

:::language rust
## O que você precisa

| Requisito | Por que o workshop precisa dele | Verificar |
|---|---|---|
| [Rust 1.94 ou mais recente](https://rustup.rs/) | Compila o crate Rust assíncrono do workshop | `rustc --version` |
| [Cargo](https://doc.rust-lang.org/cargo/getting-started/installation.html) | Resolve as dependências travadas e executa o aplicativo | `cargo --version` |
| [Node.js 22 ou mais recente](https://nodejs.org/) | Executa o servidor Playwright MCP | `node --version` |
| [GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli) | Runtime usado quando não se depende apenas de um binário incluído | `copilot --version` |
| [Acesso ao GitHub Copilot](https://github.com/features/copilot) | Autoriza solicitações do Copilot | `copilot login` |
| Microsoft Edge (padrão) ou Google Chrome | Permite que o Playwright inspecione a página de destino | Abra o navegador uma vez antes do workshop |

Seus comandos devem retornar uma saída neste formato:

```text
$ rustc --version
rustc 1.94.x
$ cargo --version
cargo 1.94.x
$ node --version
v22.x.x
$ copilot --version
GitHub Copilot CLI ...
```

Consulte o
[guia oficial de instalação do SDK para Rust](https://github.com/github/copilot-sdk/tree/main/rust).
:::

:::language java
## O que você precisa

| Requisito | Por que o workshop precisa dele | Verificar |
|---|---|---|
| [Java 17 ou mais recente](https://adoptium.net/) (JDK) | Compila e executa o aplicativo Maven do workshop | `java -version` |
| [Apache Maven 3.9+](https://maven.apache.org/install.html) | Compila o projeto e inicia `exec:java` | `mvn -version` |
| [Node.js 22 ou mais recente](https://nodejs.org/) | Executa o servidor Playwright MCP | `node --version` |
| [GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli) | É necessária no `PATH` para o runtime do SDK para Java | `copilot --version` |
| [Acesso ao GitHub Copilot](https://github.com/features/copilot) | Autoriza solicitações do Copilot | `copilot login` |
| Microsoft Edge (padrão) ou Google Chrome | Permite que o Playwright inspecione a página de destino | Abra o navegador uma vez antes do workshop |

Seus comandos devem retornar uma saída neste formato:

```text
$ java -version
openjdk version "17.x.x" ...
$ mvn -version
Apache Maven 3.9.x
$ node --version
v22.x.x
$ copilot --version
GitHub Copilot CLI ...
```

Use Maven nesta trilha. Não o substitua por JBang ou Gradle. Consulte o
[guia oficial de instalação do SDK para Java](https://github.com/github/copilot-sdk/tree/main/java).
:::

## 1. Clone o repositório e escolha seu projeto inicial

```bash
git clone https://github.com/github/copilot-sdk-workshop.git
cd copilot-sdk-workshop
```

Você trabalha **diretamente dentro do repositório**. Não há uma etapa de cópia: entre no diretório
inicial da sua linguagem e permaneça nele durante todo o workshop. Isso significa que você editará
arquivos rastreados pelo repositório, portanto suas alterações aparecerão em `git status`. Isso é
esperado. Para restaurar um projeto inicial limpo, execute `git checkout -- .` na raiz do
repositório para descartar suas edições.

## 2. Autentique o Copilot

Instale a CLI seguindo o método do
[guia oficial de configuração](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli) e execute:

```bash
copilot login
```

Conclua o fluxo no navegador para que as chamadas posteriores do SDK possam acessar o GitHub Copilot.

## 3. Prepare o Playwright MCP

Execute este comando uma vez para baixar o pacote fixado e exibir suas opções sem iniciar um servidor:

```bash
npx -y @playwright/mcp@0.0.78 --help
```

A versão do pacote é fixada para que todos vejam os mesmos nomes de ferramentas e o mesmo
comportamento. O código usa o Microsoft Edge com `--browser=msedge`. Se você preparou o Google
Chrome, use `--browser=chrome` quando o argumento aparecer na Etapa 4.

:::language dotnet
## 4. Entre no projeto inicial e compile-o

Se `dotnet build` não encontrar a Copilot CLI posteriormente, defina o caminho dela para o terminal atual:

<div class="workshop-tabs" data-tabs>
  <div role="tablist" aria-label="Definir o caminho da Copilot CLI">
    <button type="button" role="tab" aria-selected="true" data-tab="cli-windows">Windows</button>
    <button type="button" role="tab" aria-selected="false" data-tab="cli-unix">macOS ou Linux</button>
  </div>
  <div role="tabpanel" data-panel="cli-windows">
    <pre><code class="language-powershell">$env:COPILOT_CLI_BINARY_PATH = (Get-Command copilot).Source</code></pre>
  </div>
  <div role="tabpanel" data-panel="cli-unix" hidden>
    <pre><code class="language-bash">export COPILOT_CLI_BINARY_PATH="$(command -v copilot)"</code></pre>
  </div>
</div>

Entre no projeto inicial .NET e compile-o. Permaneça neste diretório em todas as etapas seguintes:

```bash
cd start-accessibility/dotnet
dotnet build
```

Uma compilação bem-sucedida termina com:

```text
Build succeeded.
    0 Warning(s)
    0 Error(s)
```

Você trabalhará em `start-accessibility/dotnet` durante o restante do workshop, portanto mantenha
este terminal nesse diretório. A partir desta pasta, digite `code .` para abri-la no VS Code ou abra
a pasta no seu editor preferido.

Abra a página de destino controlada uma vez para confirmar que consegue acessá-la:

```text
{{TARGET_APP_URL}}
```

<details>
<summary>Solução de problemas da preparação</summary>

| Sintoma | Correção |
|---|---|
| `copilot` não é reconhecido | Reinicie o terminal após a instalação ou defina `COPILOT_CLI_BINARY_PATH` com o comando acima. |
| O Copilot solicita autenticação | Execute `copilot login`, conclua o fluxo no navegador e tente novamente. |
| A restauração do NuGet não consegue acessar a origem do pacote | Verifique as configurações de proxy ou da origem do pacote e execute `dotnet restore`. |
| `npx` não é reconhecido | Instale o Node.js 22 ou mais recente e reinicie o terminal. |
| O navegador não inicia posteriormente | Instale o Edge ou o Chrome, ou siga a [configuração de navegador do Playwright MCP](https://github.com/microsoft/playwright-mcp#configuration). |

</details>

> **Inicie a Etapa 1 quando:** `dotnet build` for bem-sucedido, `copilot login` estiver concluído e a
> página de destino abrir.
:::

:::language nodejs
## 4. Entre no projeto inicial e compile-o

Se o SDK não encontrar a Copilot CLI posteriormente, indique a instalação no terminal atual:

<div class="workshop-tabs" data-tabs>
  <div role="tablist" aria-label="Definir o caminho da Copilot CLI">
    <button type="button" role="tab" aria-selected="true" data-tab="cli-windows">Windows</button>
    <button type="button" role="tab" aria-selected="false" data-tab="cli-unix">macOS ou Linux</button>
  </div>
  <div role="tabpanel" data-panel="cli-windows">
    <pre><code class="language-powershell">$env:COPILOT_CLI_PATH = (Get-Command copilot).Source</code></pre>
  </div>
  <div role="tabpanel" data-panel="cli-unix" hidden>
    <pre><code class="language-bash">export COPILOT_CLI_PATH="$(command -v copilot)"</code></pre>
  </div>
</div>

Entre no projeto inicial Node.js, instale as dependências e faça a verificação de tipos. Permaneça
neste diretório em todas as etapas seguintes:

```bash
cd start-accessibility/nodejs
npm install
npm run build
```

Uma verificação de tipos bem-sucedida termina sem erros do TypeScript (saída vazia de `tsc --noEmit`).
O script start de `package.json` é `tsx src/index.ts`.

Você trabalhará em `start-accessibility/nodejs` durante o restante do workshop, portanto mantenha
este terminal nesse diretório. A partir desta pasta, digite `code .` para abri-la no VS Code ou abra
a pasta no seu editor preferido.

Abra a página de destino controlada uma vez para confirmar que consegue acessá-la:

```text
{{TARGET_APP_URL}}
```

<details>
<summary>Solução de problemas da preparação</summary>

| Sintoma | Correção |
|---|---|
| `node` ou `npm` não é reconhecido | Instale o Node.js 22.12 ou mais recente e reinicie o terminal. |
| Aviso do mecanismo sobre a versão do Node | Atualize para Node.js 22.12+; o projeto inicial declara `"node": ">=22.12.0"`. |
| `npm install` falha por causa do lockfile | Permaneça em `start-accessibility/nodejs` e mantenha `package-lock.json`; não o exclua. |
| `copilot` não é reconhecido | Reinicie o terminal após a instalação ou defina `COPILOT_CLI_PATH` com o comando acima. |
| O Copilot solicita autenticação | Execute `copilot login`, conclua o fluxo no navegador e tente novamente. |
| `npx` não consegue baixar o Playwright MCP | Verifique o acesso à rede e execute novamente o comando de preparação da seção 3. |
| O navegador não inicia posteriormente | Instale o Edge ou o Chrome, ou siga a [configuração de navegador do Playwright MCP](https://github.com/microsoft/playwright-mcp#configuration). |

</details>

> **Inicie a Etapa 1 quando:** `npm run build` for bem-sucedido, `copilot login` estiver concluído e
> a página de destino abrir.
:::

:::language python
## 4. Entre no projeto inicial e compile-o

Opcional: force o SDK a usar sua CLI instalada em vez de baixar um runtime:

<div class="workshop-tabs" data-tabs>
  <div role="tablist" aria-label="Definir o caminho da Copilot CLI">
    <button type="button" role="tab" aria-selected="true" data-tab="cli-windows">Windows</button>
    <button type="button" role="tab" aria-selected="false" data-tab="cli-unix">macOS ou Linux</button>
  </div>
  <div role="tabpanel" data-panel="cli-windows">
    <pre><code class="language-powershell">$env:COPILOT_CLI_PATH = (Get-Command copilot).Source</code></pre>
  </div>
  <div role="tabpanel" data-panel="cli-unix" hidden>
    <pre><code class="language-bash">export COPILOT_CLI_PATH="$(command -v copilot)"</code></pre>
  </div>
</div>

Entre no projeto inicial Python, crie um ambiente virtual, instale os requisitos fixados e faça uma
verificação de compilação. Permaneça neste diretório em todas as etapas seguintes:

<div class="workshop-tabs" data-tabs>
  <div role="tablist" aria-label="Criar o ambiente virtual Python">
    <button type="button" role="tab" aria-selected="true" data-tab="venv-windows">Windows</button>
    <button type="button" role="tab" aria-selected="false" data-tab="venv-unix">macOS ou Linux</button>
  </div>
  <div role="tabpanel" data-panel="venv-windows">
    <pre><code class="language-powershell">cd start-accessibility/python
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m py_compile main.py workshop.py report.py accessibility_rule_catalog.py</code></pre>
  </div>
  <div role="tabpanel" data-panel="venv-unix" hidden>
    <pre><code class="language-bash">cd start-accessibility/python
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m py_compile main.py workshop.py report.py accessibility_rule_catalog.py</code></pre>
  </div>
</div>

Uma instalação bem-sucedida exibe os pacotes resolvidos, incluindo `github-copilot-sdk==...`. Uma
verificação de compilação bem-sucedida não exibe saída. Mantenha o ambiente virtual ativado nas
etapas seguintes.

Você trabalhará em `start-accessibility/python` durante o restante do workshop, portanto mantenha
este terminal nesse diretório. A partir desta pasta, digite `code .` para abri-la no VS Code ou abra
a pasta no seu editor preferido.

Opcionalmente, baixe o runtime agora para que a primeira execução da Etapa 1 seja mais rápida:

```bash
python -m copilot download-runtime
```

Abra a página de destino controlada uma vez para confirmar que consegue acessá-la:

```text
{{TARGET_APP_URL}}
```

<details>
<summary>Solução de problemas da preparação</summary>

| Sintoma | Correção |
|---|---|
| `python` aponta para Python 2 ou está ausente | Use Python 3.11+ (`python3` no macOS/Linux) e recrie o venv. |
| `pip install` não consegue acessar o PyPI | Verifique as configurações de proxy e execute novamente `python -m pip install -r requirements.txt`. |
| Versões de pacote incorretas | Instale apenas a partir do `requirements.txt` fixado; não flexibilize os pins `==`. |
| O download do runtime falha posteriormente | Execute `python -m copilot download-runtime` ou defina `COPILOT_CLI_PATH` para uma CLI funcional. |
| O Copilot solicita autenticação | Execute `copilot login`, conclua o fluxo no navegador e tente novamente. |
| `npx` não é reconhecido | Instale o Node.js 22 ou mais recente e reinicie o terminal. |
| O navegador não inicia posteriormente | Instale o Edge ou o Chrome, ou siga a [configuração de navegador do Playwright MCP](https://github.com/microsoft/playwright-mcp#configuration). |

</details>

> **Inicie a Etapa 1 quando:** os requisitos fixados forem instalados, `py_compile` for bem-sucedido,
> `copilot login` estiver concluído e a página de destino abrir.
:::

:::language go
## 4. Entre no projeto inicial e compile-o

O SDK para Go espera encontrar a Copilot CLI no `PATH` ou por meio de `COPILOT_CLI_PATH`:

<div class="workshop-tabs" data-tabs>
  <div role="tablist" aria-label="Definir o caminho da Copilot CLI">
    <button type="button" role="tab" aria-selected="true" data-tab="cli-windows">Windows</button>
    <button type="button" role="tab" aria-selected="false" data-tab="cli-unix">macOS ou Linux</button>
  </div>
  <div role="tabpanel" data-panel="cli-windows">
    <pre><code class="language-powershell">$env:COPILOT_CLI_PATH = (Get-Command copilot).Source</code></pre>
  </div>
  <div role="tabpanel" data-panel="cli-unix" hidden>
    <pre><code class="language-bash">export COPILOT_CLI_PATH="$(command -v copilot)"</code></pre>
  </div>
</div>

Entre no projeto inicial Go e compile mantendo o lockfile. Permaneça neste diretório em todas as
etapas seguintes:

```bash
cd start-accessibility/go
go build -mod=readonly ./...
```

Uma compilação bem-sucedida não exibe erros e produz um binário no diretório inicial. Mantenha
`go.sum` intacto para que a resolução dos módulos continue determinística.

Você trabalhará em `start-accessibility/go` durante o restante do workshop, portanto mantenha este
terminal nesse diretório. A partir desta pasta, digite `code .` para abri-la no VS Code ou abra a
pasta no seu editor preferido.

Abra a página de destino controlada uma vez para confirmar que consegue acessá-la:

```text
{{TARGET_APP_URL}}
```

<details>
<summary>Solução de problemas da preparação</summary>

| Sintoma | Correção |
|---|---|
| `go: go.mod requires go >= 1.24` | Instale o Go 1.24 ou mais recente e reabra o terminal. |
| `missing go.sum entry` | Restaure o `go.sum` versionado; compile com `-mod=readonly` em vez de reescrever o lock. |
| Download de módulo bloqueado | Configure o acesso a `GOPROXY`/proxy e tente novamente a partir do diretório inicial. |
| `copilot` não é reconhecido | Instale a CLI, reinicie o terminal ou defina `COPILOT_CLI_PATH`. |
| O Copilot solicita autenticação | Execute `copilot login`, conclua o fluxo no navegador e tente novamente. |
| `npx` não é reconhecido | Instale o Node.js 22 ou mais recente e reinicie o terminal. |
| O navegador não inicia posteriormente | Instale o Edge ou o Chrome, ou siga a [configuração de navegador do Playwright MCP](https://github.com/microsoft/playwright-mcp#configuration). |

</details>

> **Inicie a Etapa 1 quando:** `go build -mod=readonly ./...` for bem-sucedido, `copilot login` estiver
> concluído e a página de destino abrir.

Compare com
[`finished/go/hello-copilot-sdk`](https://github.com/github/copilot-sdk-workshop/tree/main/finished/go/hello-copilot-sdk)
caso queira um ponto de referência posterior à Etapa 1.
:::

:::language rust
## 4. Entre no projeto inicial e compile-o

Se a inicialização do runtime não conseguir resolver a CLI posteriormente, defina `COPILOT_CLI_PATH`:

<div class="workshop-tabs" data-tabs>
  <div role="tablist" aria-label="Definir o caminho da Copilot CLI">
    <button type="button" role="tab" aria-selected="true" data-tab="cli-windows">Windows</button>
    <button type="button" role="tab" aria-selected="false" data-tab="cli-unix">macOS ou Linux</button>
  </div>
  <div role="tabpanel" data-panel="cli-windows">
    <pre><code class="language-powershell">$env:COPILOT_CLI_PATH = (Get-Command copilot).Source</code></pre>
  </div>
  <div role="tabpanel" data-panel="cli-unix" hidden>
    <pre><code class="language-bash">export COPILOT_CLI_PATH="$(command -v copilot)"</code></pre>
  </div>
</div>

Entre no projeto inicial Rust e verifique-o com o lockfile. Permaneça neste diretório em todas as
etapas seguintes:

```bash
cd start-accessibility/rust
cargo check --locked
```

Uma verificação bem-sucedida termina com uma linha `Finished` e nenhum erro. Mantenha `Cargo.lock`
versionado para que o grafo de crates permaneça fixado.

Você trabalhará em `start-accessibility/rust` durante o restante do workshop, portanto mantenha este
terminal nesse diretório. A partir desta pasta, digite `code .` para abri-la no VS Code ou abra a
pasta no seu editor preferido.

Abra a página de destino controlada uma vez para confirmar que consegue acessá-la:

```text
{{TARGET_APP_URL}}
```

<details>
<summary>Solução de problemas da preparação</summary>

| Sintoma | Correção |
|---|---|
| `rustc 1.xx is too old` | Instale Rust 1.94+ com `rustup update` e reabra o terminal. |
| Lockfile incompatível com `--locked` | Mantenha o `Cargo.lock` do projeto inicial; não execute `cargo update` sem restrições. |
| Download de crate bloqueado | Verifique o acesso de rede/proxy ao crates.io e tente `cargo check` novamente. |
| O runtime não inicia posteriormente | Instale e autentique `copilot` ou defina `COPILOT_CLI_PATH`. |
| O Copilot solicita autenticação | Execute `copilot login`, conclua o fluxo no navegador e tente novamente. |
| `npx` não é reconhecido | Instale o Node.js 22 ou mais recente e reinicie o terminal. |
| O navegador não inicia posteriormente | Instale o Edge ou o Chrome, ou siga a [configuração de navegador do Playwright MCP](https://github.com/microsoft/playwright-mcp#configuration). |

</details>

> **Inicie a Etapa 1 quando:** `cargo check --locked` for bem-sucedido, `copilot login` estiver
> concluído e a página de destino abrir.

Compare com
[`finished/rust/hello-copilot-sdk`](https://github.com/github/copilot-sdk-workshop/tree/main/finished/rust/hello-copilot-sdk)
caso queira um ponto de referência posterior à Etapa 1.
:::

:::language java
## 4. Entre no projeto inicial e compile-o

O SDK para Java espera encontrar a Copilot CLI no `PATH` quando o aplicativo é iniciado. Confirme
isso antes de compilar:

```bash
copilot --version
```

Entre no projeto inicial Java e compile com Maven. Permaneça neste diretório em todas as etapas seguintes:

```bash
cd start-accessibility/java
mvn compile
```

Uma compilação bem-sucedida termina com:

```text
[INFO] BUILD SUCCESS
```

O `pom.xml` já configura `exec-maven-plugin` com a `mainClass` `workshop.AccessibilityReport`.
Continue usando Maven nesta trilha.

Você trabalhará em `start-accessibility/java` durante o restante do workshop, portanto mantenha
este terminal nesse diretório. A partir desta pasta, digite `code .` para abri-la no VS Code ou abra
a pasta no seu editor preferido.

Abra a página de destino controlada uma vez para confirmar que consegue acessá-la:

```text
{{TARGET_APP_URL}}
```

<details>
<summary>Solução de problemas da preparação</summary>

| Sintoma | Correção |
|---|---|
| `java` ou `mvn` não é reconhecido | Instale o JDK 17+ e o Maven e reinicie o terminal. |
| Erros de versão do compilador | Confirme se `java -version` informa 17 ou mais recente; o POM define `maven.compiler.release` como 17. |
| O download de dependências falha | Verifique as configurações do Maven Central/proxy e execute `mvn compile` novamente. |
| Tentação de trocar de ferramenta | Não substitua o Maven por JBang ou Gradle neste workshop. |
| `copilot` não é reconhecido | Instale a CLI, reinicie o terminal e verifique `copilot --version`. |
| O Copilot solicita autenticação | Execute `copilot login`, conclua o fluxo no navegador e tente novamente. |
| `npx` não é reconhecido | Instale o Node.js 22 ou mais recente e reinicie o terminal. |
| O navegador não inicia posteriormente | Instale o Edge ou o Chrome, ou siga a [configuração de navegador do Playwright MCP](https://github.com/microsoft/playwright-mcp#configuration). |

</details>

> **Inicie a Etapa 1 quando:** `mvn compile` exibir `BUILD SUCCESS`, `copilot login` estiver concluído
> e a página de destino abrir.

Compare com
[`finished/java/hello-copilot-sdk`](https://github.com/github/copilot-sdk-workshop/tree/main/finished/java/hello-copilot-sdk)
caso queira um ponto de referência posterior à Etapa 1.
:::

## Saiba mais

O SDK que você está prestes a instalar está documentado fora deste workshop. Vale a pena adicionar
estas páginas aos favoritos antes da Etapa 1.

- [Guias práticos do GitHub Copilot SDK](https://docs.github.com/en/copilot/how-tos/copilot-sdk): a
  documentação do próprio GitHub sobre o SDK, incluindo os pré-requisitos reproduzidos nesta preparação.
- [Mapa da documentação do Copilot SDK](https://github.com/github/copilot-sdk/blob/main/docs/README.md):
  o índice de configuração, autenticação, recursos e solução de problemas.
- [Configuração padrão: a CLI incluída](https://github.com/github/copilot-sdk/blob/main/docs/setup/bundled-cli.md):
  como o SDK localiza e inicia a Copilot CLI e como apontá-lo para outro binário.
- [Guia de depuração](https://github.com/github/copilot-sdk/blob/main/docs/troubleshooting/debugging.md):
  o primeiro lugar a consultar quando uma execução falha antes de produzir qualquer saída.

:::language dotnet
- [Referência do SDK para .NET](https://github.com/github/copilot-sdk/blob/main/dotnet/README.md):
  instalação do pacote e um exemplo mínimo para o SDK para .NET.
:::

:::language nodejs
- [Referência do SDK para Node.js](https://github.com/github/copilot-sdk/blob/main/nodejs/README.md):
  instalação do pacote e um exemplo mínimo para o SDK para Node.js.
:::

:::language python
- [Referência do SDK para Python](https://github.com/github/copilot-sdk/blob/main/python/README.md):
  instalação do pacote e um exemplo mínimo para o SDK para Python.
:::

:::language go
- [Referência do SDK para Go](https://github.com/github/copilot-sdk/blob/main/go/README.md):
  instalação do módulo e um exemplo mínimo para o SDK para Go.
:::

:::language rust
- [Referência do SDK para Rust](https://github.com/github/copilot-sdk/blob/main/rust/README.md):
  instalação do crate e um exemplo mínimo para o SDK para Rust.
:::

:::language java
- [Referência do SDK para Java](https://github.com/github/copilot-sdk/blob/main/java/README.md):
  coordenadas da dependência e um exemplo mínimo para o SDK para Java.
:::

Continue para a [Etapa 1: crie sua primeira sessão do Copilot](01-first-session.md).