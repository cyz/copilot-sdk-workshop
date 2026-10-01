# Museum Exhibit Studio: preparação

> **Tempo:** Sem tempo definido  
> **Workshop:** agente fora do SDLC

## O que você vai criar

O Museum Exhibit Studio transforma fatos aprovados pelo educador em textos de exposição prontos para
o público:

```text
approved facts -> bounded prompt -> curator session -> structural checks -> human review
```

Você constrói um único aplicativo de console em Node.js, que cresce no próprio diretório
`start-museum/nodejs`. Cada etapa acrescenta uma ideia e termina com uma execução real, para
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

Você trabalha diretamente no projeto mínimo em `start-museum/nodejs`, não no aplicativo finalizado.
O projeto concluído em `finished/nodejs/museum-exhibit-studio` serve apenas como referência
opcional.

> **Sobre o idioma do código:** os trechos de código, os prompts enviados ao modelo e as mensagens
> impressas pelo programa permanecem em inglês, exatamente como no projeto inicial e na referência
> em `finished/`. Por isso, o curador também responde em inglês, e as saídas de exemplo destas
> lições correspondem ao que você verá no terminal. Copie os blocos de código sem traduzi-los.

## O que você precisa

| Requisito | Por que o workshop precisa dele | Como verificar |
|---|---|---|
| [Node.js 22.12 ou mais recente](https://nodejs.org/) | Executa o aplicativo TypeScript e o servidor MCP da Wikipedia | `node --version` |
| [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) | Instala o SDK fixado e as ferramentas de build, e executa o `npx` | `npm --version` |
| [GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli) | Faz o login no GitHub Copilot | `copilot --version` |
| [Acesso ao GitHub Copilot](https://github.com/features/copilot) | Autoriza as solicitações ao Copilot | `copilot login` |

Instale o Copilot CLI pelo método do
[guia oficial de instalação](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli)
e, em seguida, faça login e conclua o fluxo no navegador, para que as chamadas do SDK consigam
acessar o GitHub Copilot:

```bash
copilot login
```

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

Você constrói o aplicativo do museu **no próprio lugar**, dentro do diretório do projeto inicial
Node.js. Não há etapa de cópia. Isso significa que você edita arquivos versionados no
repositório, e por isso seu trabalho aparece em `git status` como arquivos modificados. Isso é
esperado. Se quiser recomeçar a partir de um projeto inicial limpo, execute `git checkout -- .` na
raiz do repositório para descartar suas alterações.

Entre agora no projeto inicial Node.js e permaneça nele para executar todos os comandos do workshop
do museu. O lockfile fixa o SDK 1.0.11 e o pacote de plataforma compatível `@github/copilot`
1.0.80:

```bash
cd start-museum/nodejs
npm ci --ignore-scripts --no-audit --fund=false
npm run build
npm start
```

Critério de sucesso: o build passa e o programa imprime `=== Estúdio de Exposições de Museu (projeto inicial) ===`
seguido de `Os auxiliares do curador pré-construídos estão prontos em src/curator.ts.`

Você vai trabalhar em `start-museum/nodejs` até o fim do workshop, então mantenha este terminal
nesse diretório. A partir dele, execute `code .` para abrir a pasta no VS Code ou abra-a no editor
de sua preferência.

Seu módulo auxiliar é `src/curator.ts`. Todas as alterações das lições serão feitas em
`src/index.ts`.

<details>
<summary>Solução de problemas da preparação</summary>

| Sintoma | Solução |
|---|---|
| `node` ou `npm` não é reconhecido | Instale o Node.js 22.12 ou mais recente e reinicie o terminal. |
| Aviso de *engine* sobre a versão do Node.js | Atualize para o Node.js 22.12+; o projeto inicial declara `"node": ">=22.12.0"`. |
| `npm ci` falha por causa do lockfile | Permaneça em `start-museum/nodejs` e mantenha o `package-lock.json`; não o apague. |
| `copilot` não é reconhecido | Reinicie o terminal depois de instalar o Copilot CLI. |
| O Copilot pede autenticação | Execute `copilot login`, conclua o fluxo no navegador e tente de novo. |

</details>

> **Comece a Etapa 1 quando:** `npm run build` passar, `npm start` imprimir o banner do projeto
> inicial e o `copilot login` estiver concluído.

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
- [Referência do SDK Node.js](https://github.com/github/copilot-sdk/blob/main/nodejs/README.md):
  instalação do pacote e um exemplo mínimo para o SDK Node.js.

Continue para a [Etapa 1: Crie sua primeira sessão do curador](museum-01-first-curator-session.md).
