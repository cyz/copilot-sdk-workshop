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

:::language dotnet
Abra `Program.cs`. Capture a exposição retornada e imprima o relatório:

```csharp
    Console.WriteLine();
    var exhibit = await RunSessionAsync(
        GenerationConfig(approvedFacts),
        BuildExhibitPrompt(),
        CuratorStreamer.GenerationTimeout);

    Console.WriteLine();
    Console.WriteLine(CuratorValidation.FormatValidation(CuratorValidation.ValidateExhibit(exhibit)));

    return 0;
```

`CuratorValidation` já está no namespace `MuseumExhibitStudio.Helpers` que você importou na
Etapa 2, então não há nada novo para adicionar no início do arquivo.

**Confira no código:** `Helpers/CuratorValidation.cs` é a resposta concreta para "o aplicativo
comprova isto, não o modelo". `ValidateExhibit` divide o texto em linhas, conta correspondências de
`TitlePattern`, localiza os títulos `## Narrative` e `## Visitor questions`, conta palavras da
narrativa com `WordPattern`, coleta itens numerados com `QuestionPattern` e varre o texto inteiro
em busca dos cinco termos em `ProhibitedVocabulary`. Cada regra que falha acrescenta uma frase
simples a `Errors`, e `FormatValidation` renderiza isso no relatório que você imprime. Nenhum
modelo participa em momento algum.
:::

:::language nodejs
Abra `src/index.ts` e adicione `formatValidation` e `validateExhibit` à importação de
`./curator.js`. Depois, dentro do `try` de `main`, substitua as linhas `console.log();` e `await runSession(...)`,
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
:::

:::language python
Abra `main.py`. Adicione `format_validation` e `validate_exhibit` à importação do módulo auxiliar,
depois capture a exposição retornada e imprima o relatório:

```python
    try:
        print()
        exhibit = await run_session(
            generation_config(facts),
            build_exhibit_prompt(),
            GENERATION_TIMEOUT_SECONDS,
        )

        print()
        print(format_validation(validate_exhibit(exhibit)))
        return 0
```

**Confira no código:** `curator.py` é a resposta concreta para "o aplicativo comprova isto, não o
modelo". `validate_exhibit` divide o texto em linhas, conta correspondências de `_TITLE_PATTERN`,
localiza os títulos `## Narrative` e `## Visitor questions`, conta palavras da narrativa com
`_WORD_PATTERN`, coleta itens numerados com `_QUESTION_PATTERN` e varre o texto inteiro em busca
dos cinco termos em `PROHIBITED_VOCABULARY`. Cada regra que falha acrescenta uma frase simples a
`errors`, e `format_validation` renderiza isso no relatório que você imprime. Nenhum modelo
participa em momento algum.
:::

:::language go
Abra `main.go`. Capture a exposição retornada e imprima o relatório:

```go
	fmt.Println()
	exhibit, err := runSession(ctx, exhibitConfig, buildExhibitPrompt(), GenerationTimeout)
	if err != nil {
		return err
	}

	fmt.Println()
	fmt.Println(FormatValidation(ValidateExhibit(exhibit)))
	return nil
```

`FormatValidation` e `ValidateExhibit` ficam em `curator.go`, no mesmo pacote, então não há import
para adicionar.

**Confira no código:** `curator.go` é a resposta concreta para "o aplicativo comprova isto, não o
modelo". `ValidateExhibit` divide o texto em linhas, conta correspondências do padrão de título,
localiza os títulos `## Narrative` e `## Visitor questions`, conta palavras da narrativa, coleta
itens numerados e varre o texto em minúsculas em busca dos cinco termos em `prohibitedVocabulary`.
Cada regra que falha acrescenta uma frase simples a `validation.Errors`, e `FormatValidation`
renderiza isso no relatório que você imprime. Nenhum modelo participa em momento algum.
:::

:::language rust
Abra `src/main.rs`. Adicione `format_validation` e `validate_exhibit` à importação da crate,
depois capture a exposição retornada e imprima o relatório:

```rust
    println!();
    let exhibit = run_session(
        generation_config(&facts)?,
        build_exhibit_prompt(),
        GENERATION_TIMEOUT,
    )
    .await?;

    println!();
    println!("{}", format_validation(&validate_exhibit(&exhibit)));

    Ok(())
```

**Confira no código:** `src/lib.rs` é a resposta concreta para "o aplicativo comprova isto, não o
modelo". `validate_exhibit` divide o texto em linhas, conta correspondências do padrão de título,
localiza os títulos `## Narrative` e `## Visitor questions`, conta palavras da narrativa, coleta
itens numerados e varre o texto em minúsculas em busca dos cinco termos em
`PROHIBITED_VOCABULARY`. Cada regra que falha insere uma frase simples em `errors`, e
`format_validation` renderiza isso no relatório que você imprime. Nenhum modelo participa em
momento algum.
:::

:::language java
Abra `src/main/java/workshop/MuseumExhibitStudio.java`. Capture a exposição retornada e imprima o
relatório:

```java
            System.out.println();
            String exhibit = runSession(
                    generationConfig(facts),
                    buildExhibitPrompt(),
                    CuratorStreamer.GENERATION_TIMEOUT);

            System.out.println();
            System.out.println(CuratorValidation.formatValidation(CuratorValidation.validateExhibit(exhibit)));
```

`CuratorValidation` fica no mesmo pacote `workshop`, então não há import para adicionar.

**Confira no código:** `CuratorValidation.java` é a resposta concreta para "o aplicativo comprova
isto, não o modelo". `validateExhibit` divide o texto em linhas, conta correspondências de
`TITLE_PATTERN`, localiza os títulos `## Narrative` e `## Visitor questions`, conta palavras da
narrativa com `WORD_PATTERN`, coleta itens numerados com `QUESTION_PATTERN` e varre o texto em
minúsculas em busca dos cinco termos em `PROHIBITED_VOCABULARY`. Cada regra que falha acrescenta
uma frase simples a `errors`, e `formatValidation` renderiza isso no relatório que você imprime.
Nenhum modelo participa em momento algum.
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
