# Step 4: Ground it in approved facts

> **Time:** 15 minutes

## What you'll build

Until now the curator has been writing from model memory. That is unacceptable for a museum: an
exhibit label is an institutional claim, and "the model knew it" is not a source.

In this step the educator supplies the facts and the **application** hands them to the curator
through a tool it owns. You register the pre-built `approved_fact_lookup` tool, make it the one
tool the model may call, and write a prompt that orders the curator to call it before writing a
word. You also let the educator pick one of three approved fact sets or type their own.

## Why the facts belong behind a tool, not inside the prompt

You could paste the fact list into the prompt text. Many applications do. But then the facts are
just more words in a request the model is free to read loosely, and every run carries the whole
catalog whether the model needs it or not.

A [**local tool**](https://github.com/github/copilot-sdk/blob/main/docs/getting-started.md#how-tools-work)
is different. It runs inside your process, your code decides what it returns, and the transcript
records the moment the model asked for it. `approved_fact_lookup` is that tool. It takes no
arguments and returns the bounded approved fact list, so two runs on the same fact set ask the same
question and get the same answer — grounding stays deterministic.

The helpers already own the tool and the bounds. `boundFacts` trims every fact, drops blanks, and
rejects the batch when it is empty, longer than 20 facts, or contains a fact over 500 characters.
The tool factory applies those bounds to whatever it is given, so the model can never be handed an
unbounded list. Bounds are not politeness: an unbounded fact list is unpredictable cost, latency,
and attack surface.

`skip permission` is set on this tool because it only reads application-owned data that the
educator just approved on screen. The external Wikipedia process in Step 7 gets a permission
boundary instead.

## Two lists, two different jobs

Registering a tool takes two settings, and confusing them is the most common mistake in this
workshop:

- **`tools`** carries the *implementation*. This is where the runtime learns that a function called
  `approved_fact_lookup` exists and how to execute it.
- **`availableTools`** is the *allowlist*. It names which tools the model is permitted to call in
  this session. A tool that is registered but not allowlisted cannot be called.

You need both. Step 5 returns to the allowlist and shows what it prevents.

The prompt is the third piece, and it is the weakest one: it *asks* the model to call the tool. It
does not make the call happen, and it cannot stop a call. Keep the explicit "call
`approved_fact_lookup` first" instruction — at this stage you want the tool call to be reliable so
you can see it.

## Register the tool and build the prompt

Open `src/index.ts` and widen the helper import:

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

Add the prompt builder and the fact-set chooser below the system message:

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

Replace `main` with:

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

`buildExhibitPrompt` takes no facts at all now — it names the tool instead.
`createApprovedFactLookup` calls `boundFacts` internally, so the bound holds no matter who builds
the tool.

**Look inside:** `src/curator.ts` holds all of this, and it is worth reading because it is a real
`defineTool` definition rather than plumbing. `createApprovedFactLookup` closes over the bounded
list the educator just approved and defines `approved_fact_lookup` with
`parameters: { type: "object", properties: {}, additionalProperties: false }`, so the model cannot
steer what comes back — it asks, and it receives exactly that list. `skipPermission: true` is set
right there because the data is application-owned. The three fact sets and the `maximumFactCount`
(20) and `maximumFactLength` (500) bounds enforced by `boundFacts` are in the same file.

## Run it

```bash
npm start
```

The application now interviews you before it writes anything, and the curator visibly fetches its
facts before it writes a word:

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

The `[tool:start] approved_fact_lookup` line is the whole point of this step. The curator did not
recall the reef — it asked your application for the facts, and your application answered.

## Prove the tool is doing the work

Run it again and choose set 1 or 3. The exhibit changes subject completely, and the tool event
appears again each time. Nothing in the prompt changed between those runs: the same prompt text
produced a Terracotta Army exhibit because the tool returned different data. That is the difference
between a prompt that carries data and an application that owns it.

Then answer `n` at the confirmation, type two or three facts of your own, and submit a blank line.
The curator writes about your subject instead — your typed facts went into the tool, and the tool
handed them back to the model.

Try the failure case too. Answer `n` and immediately submit a blank line without typing any facts.
The run stops with `Provide at least one approved fact.` — the tool factory refused to be built
around an empty list, so no request was ever sent. Step 5 turns that crash into a civil error
message.

## Check your understanding

- You registered the tool in two places. What would happen if you put `approved_fact_lookup` in the
  tool list but left it out of the allowlist?
- The prompt says "Call `approved_fact_lookup` first." Does that sentence guarantee the call
  happens? What in this step made the tool *available* to be called at all?
- The tool takes no arguments and always returns the same bounded list for a given fact set. What
  would you lose if it took a free-text query argument instead?
- The output structure is requested in the prompt. What has actually verified that the model
  followed it so far?

## Learn more

- [Working with hooks](https://github.com/github/copilot-sdk/blob/main/docs/features/hooks.md):
  callbacks the runtime invokes around each tool call, for auditing or policy your code owns.
- [Post-tool-use hook](https://github.com/github/copilot-sdk/blob/main/docs/hooks/post-tool-use.md):
  inspecting or rewriting what a tool returned before the model reads it.
- [Context clearing and terminal tools](https://github.com/github/copilot-sdk/blob/main/docs/features/context-management.md):
  what a tool can do to the conversation itself, and why most tools should not.

Continue to [Set the guardrails](museum-05-guardrails.md).
