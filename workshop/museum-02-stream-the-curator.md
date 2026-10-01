# Step 2: Stream the curator

> **Time:** 10 minutes

## What you'll build

The same prompt, but the answer appears word by word instead of arriving after a silent pause.

You will not write an event loop. The starter already ships a streaming printer in the pre-built
curator helpers: it subscribes to
[session events](https://github.com/github/copilot-sdk/blob/main/docs/features/streaming-events.md),
writes each delta to standard output, reports tool activity, fails on session errors, enforces a
timeout, unsubscribes on every path, and returns the full text it accumulated. Your job is to turn
streaming on and call it.

## Why streaming matters for a curator

Exhibit copy is prose a human has to read and judge. Watching it arrive tells you immediately
whether the tone is right, whether the model is padding, and whether it is drifting off the subject
— long before the run finishes. Streaming also gives you a place to notice tool calls, which
matters from Step 4 onward, when the curator has to call the application's fact tool before it can
write anything.

The helper returns the whole response as a string, so from here on you always have the finished
text to inspect after the stream ends.

## Swap the blocking call for the streamer

Replace the entire contents of `src/index.ts`:

```typescript
import { approveAll, CopilotClient } from "@github/copilot-sdk";
import { streamExhibit } from "./curator.js";

async function main(): Promise<void> {
  console.log("=== Museum Exhibit Studio ===");
  console.log();

  const client = new CopilotClient();
  await client.start();
  const session = await client.createSession({
    clientName: "museum-exhibit-studio",
    onPermissionRequest: approveAll,
    streaming: true,
  });

  await streamExhibit(
    session,
    "Write two sentences of museum wall text about the Apollo 11 Moon landing.",
  );

  await session.disconnect();
  await client.stop();
}

void main();
```

Two changes: `streaming: true` on the session config, and `streamExhibit` in place of
`sendAndWait`. The Step 1 permission handler stays exactly where it was. The helper lives in
`src/curator.ts` and you never edit it.

**Look inside:** open `src/curator.ts` and read `streamExhibit` once. It is the SDK event loop, and
this is the clearest place in the workshop to see how streaming actually works. It subscribes with
`session.on`, writes each `assistant.message_delta` chunk to standard output the moment it arrives,
prints a `[tool:start]` line for every `tool.execution_start` event and a `[tool:done]` line for
every `tool.execution_complete` event, resolves its promise on `session.idle`, and rejects on
`session.error`. A `setTimeout` rejects if neither ever arrives, and `finish` unsubscribes on every
path.

## Run it

```bash
npm start
```

The same kind of answer appears, but this time you watch it being written:

```text
=== Museum Exhibit Studio ===

In July 1969, three astronauts left Earth aboard Apollo 11... 
```

The text grows in place instead of appearing all at once, and the program exits shortly after the
last word. If you see nothing until the very end, the session is not streaming — check that you set
the streaming flag on the session config.

## Check your understanding

- Streaming is switched on in two places conceptually: the session config and the code that reads
  events. Which one did you write, and which one did the helper already own?
- The helper returns the full response text even though it also printed it. Why will that return
  value matter in Step 6?
- If the model never becomes idle, what stops your program from waiting forever?

## Learn more

- [Steering and queueing](https://github.com/github/copilot-sdk/blob/main/docs/features/steering-and-queueing.md):
  sending another message while a turn is still streaming, instead of waiting for it to finish.
- [Usage and billing metrics](https://github.com/github/copilot-sdk/blob/main/docs/features/usage-and-billing.md):
  reading token counts and cost from the same events the printer is already subscribed to.
- [Context clearing](https://github.com/github/copilot-sdk/blob/main/docs/features/context-management.md):
  replacing a conversation inside a session that you want to keep using.

Continue to [Give the curator a voice](museum-03-curator-voice.md).
