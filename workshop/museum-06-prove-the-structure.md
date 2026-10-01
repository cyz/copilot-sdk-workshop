# Step 6: Prove the structure

> **Time:** 10 minutes

## What you'll build

A PASS/FAIL report printed under every exhibit. Two lines of new code: capture the text the session
runner already returned, then hand it to the pre-built validator.

## What deterministic checks can and cannot prove

The validator in the helper module is ordinary code with no model in it. Given the same text it
always returns the same verdict. It checks:

- exactly one level-one title
- a `## Narrative` section
- a narrative of 100–140 words
- a `## Visitor questions` section with exactly three numbered items
- every numbered item ending in a question mark
- no prohibited vocabulary (`software`, `codebase`, `repository`, `terminal`, `GitHub Copilot`)

That is a **structural** contract, and it is genuinely enforceable. It is not a **factual** one.
A perfectly structured exhibit can still contain a claim no approved fact supports. The report ends
by saying so, and that sentence is the honest boundary of this application:

```text
Structural checks do not prove factual grounding. Unsupported claims require human review or a separate evaluator.
```

You are not writing the validator. Learning to *react* to a machine verdict — and to know exactly
what it does not cover — is the lesson.

## Wire the validator

Open `src/index.ts`. Add `formatValidation` and `validateExhibit` to the helper
import:

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

Then capture the returned exhibit and print the report:

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

**Look inside:** `src/curator.ts` is the concrete answer to "the application proves this, not the
model". `validateExhibit` splits the text into lines, counts `titlePattern` matches, locates the
`## Narrative` and `## Visitor questions` headings, counts narrative words with `wordPattern`,
collects numbered items with `questionPattern`, and scans the whole text for the five terms in
`prohibitedVocabulary`. Each failed rule appends a plain sentence to `errors`, and
`formatValidation` renders those into the report you print. No model is involved at any point.

## Run it

```bash
npm start
```

The exhibit streams as before, and then a verdict appears under it:

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

A failing run is just as informative, and you will see one eventually — narrative length is the
usual culprit:

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

The run still exits successfully. That is deliberate: the report is for a human curator deciding
whether to publish, not a build gate. Rerun the exhibit, or tighten the fact list, and try again.

Force a failure on purpose to see the vocabulary rule fire. Supply your own single fact:

```text
The museum's ticketing terminal was installed in 1998.
```

The exhibit will repeat the word `terminal`, and the report flags it — the check reads the output,
not your intent.

## Check your understanding

- The report says the structure passed. What has it *not* told you about the exhibit?
- Structural failure does not stop the program. When would making it a hard failure be right, and
  when would it be wrong?
- The validator is deterministic. Why does that matter more for a museum than a slightly smarter
  model-based reviewer would?

## Learn more

- [User prompt submitted hook](https://github.com/github/copilot-sdk/blob/main/docs/hooks/user-prompt-submitted.md):
  checking or rejecting a prompt in code before the runtime sends it.
- [User prompt transformed hook](https://github.com/github/copilot-sdk/blob/main/docs/hooks/user-prompt-transformed.md):
  reading the model-facing prompt the runtime actually built.
- [Hooks overview](https://github.com/github/copilot-sdk/blob/main/docs/hooks/hooks-overview.md):
  where each hook sits in a turn, if you want a check the runtime enforces rather than one you run
  afterwards.

Continue to [Research with Wikipedia MCP](museum-07-wikipedia-research.md).
