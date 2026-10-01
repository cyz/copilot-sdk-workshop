# Etapa 6: Comprove a estrutura

> **Tempo:** 10 minutos

## O que você vai criar

Um relatório PASS/FAIL impresso abaixo de cada exposição. São só duas linhas de código novo: guardar
o texto que o executor de sessão já retorna e entregá-lo ao validador pré-construído.

## O que verificações determinísticas podem ou não comprovar

O validador do módulo auxiliar é código comum, sem nenhum modelo envolvido. Para o mesmo texto, ele
sempre retorna o mesmo veredicto. Ele verifica:

- exatamente um título de nível um
- uma seção `## Narrative`
- uma narrativa de 100 a 140 palavras
- uma seção `## Visitor questions` com exatamente três itens numerados
- se todo item numerado termina com ponto de interrogação
- nenhum vocabulário proibido (`software`, `codebase`, `repository`, `terminal`, `GitHub Copilot`)

Esse é um contrato **estrutural**, e ele pode de fato ser imposto. Não é um contrato **factual**.
Uma exposição com estrutura perfeita ainda pode conter uma afirmação que nenhum fato aprovado
sustenta. O relatório termina dizendo exatamente isso, e essa frase marca o limite honesto deste
aplicativo:

```text
Structural checks do not prove factual grounding. Unsupported claims require human review or a separate evaluator.
```

Você não vai escrever o validador. A lição é aprender a *reagir* a um veredicto automático — e
saber exatamente o que ele não cobre.

## Conecte o validador

Abra `src/index.ts` e adicione `formatValidation` e `validateExhibit` à importação de
`./curator.js`:

```typescript
import {
  approvedFactLookupName,
  askLine,
  askYesNo,
  boundFacts,
  closeTerminal,
  createApprovedFactLookup,
  factSets,
  formatValidation,
  generationTimeoutMs,
  readFacts,
  streamExhibit,
  validateExhibit,
} from "./curator.js";
```

Depois, dentro do `try` de `main`, substitua as linhas `console.log();` e `await runSession(...)`,
que vêm logo após a confirmação dos fatos, por este trecho, que guarda a exposição retornada e
imprime o relatório:

```typescript
    console.log();
    const exhibit = await runSession(
      generationConfig(approvedFacts),
      buildExhibitPrompt(),
      generationTimeoutMs,
    );

    console.log();
    console.log(formatValidation(validateExhibit(exhibit)));
```

**Confira no código:** `src/curator.ts` é a resposta concreta para "quem comprova isto é o
aplicativo, não o modelo". `validateExhibit` divide o texto em linhas, conta as correspondências de
`titlePattern`, localiza os títulos `## Narrative` e `## Visitor questions`, conta as palavras da
narrativa com `wordPattern`, coleta os itens numerados com `questionPattern` e procura no texto
inteiro os cinco termos de `prohibitedVocabulary`. Cada regra que falha acrescenta uma frase simples
a `errors`, e `formatValidation` transforma isso no relatório que você imprime. Nenhum modelo
participa em momento algum.

## Execute

```bash
npm start
```

A exposição aparece em streaming como antes e, em seguida, um veredicto é impresso logo abaixo:

```text
Structural checks passed.
- One level-one title: true
- Narrative section: true
- Narrative length: 126 words (within 100-140: true)
- Visitor questions section: true
- Numbered questions: 3 (exactly three: true)
- Every item is a question: true
- Prohibited vocabulary: none

Structural checks do not prove factual grounding. Unsupported claims require human review or a separate evaluator.
```

Uma execução que falha é igualmente informativa, e mais cedo ou mais tarde você verá uma — o
tamanho da narrativa costuma ser o culpado:

```text
Structural checks found issues:
- One level-one title: true
- Narrative section: true
- Narrative length: 163 words (within 100-140: false)
- Visitor questions section: true
- Numbered questions: 3 (exactly three: true)
- Every item is a question: true
- Prohibited vocabulary: none
  - The narrative must contain 100-140 words; found 163.

Structural checks do not prove factual grounding. Unsupported claims require human review or a separate evaluator.
```

Mesmo assim, a execução termina com sucesso. Isso é intencional: o relatório serve para um curador
humano decidir se publica ou não o texto; ele não é um bloqueio de build. Gere a exposição de novo
ou ajuste a lista de fatos e tente outra vez.

Provoque uma falha de propósito para ver a regra de vocabulário em ação. Informe este único fato
próprio:

```text
The museum's ticketing terminal was installed in 1998.
```

A exposição vai repetir a palavra `terminal`, e o relatório vai apontá-la — a verificação lê a
saída, não a sua intenção.

## Verifique seu entendimento

- O relatório diz que a estrutura passou. O que ele *não* disse sobre a exposição?
- Uma falha estrutural não interrompe o programa. Em que situação transformá-la em erro bloqueante
  seria correto, e em qual seria errado?
- O validador é determinístico. Por que, para um museu, isso vale mais do que um revisor baseado em
  modelo um pouco mais inteligente?

## Saiba mais

- [Hook de prompt do usuário enviado (*user-prompt-submitted*)](https://github.com/github/copilot-sdk/blob/main/docs/hooks/user-prompt-submitted.md):
  como verificar ou rejeitar um prompt em código antes que o runtime o envie.
- [Hook de prompt do usuário transformado (*user-prompt-transformed*)](https://github.com/github/copilot-sdk/blob/main/docs/hooks/user-prompt-transformed.md):
  como ler o prompt que o runtime de fato montou para o modelo.
- [Visão geral dos hooks](https://github.com/github/copilot-sdk/blob/main/docs/hooks/hooks-overview.md):
  onde cada hook entra em um turno, caso você queira uma verificação imposta pelo runtime em vez de
  uma executada depois.

Continue para a [Etapa 7: Pesquise com o MCP da Wikipedia](museum-07-wikipedia-research.md).
