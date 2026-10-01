# Step 1: Your first curator session

> **Time:** 10 minutes

## What you'll build

Real museum copy, in your terminal, in about ten minutes. You connect to the Copilot runtime, open
one conversation, send a single prompt, and print what comes back.

No system message. No facts catalog. No tools. No interfaces. Nothing to implement against — you
call the SDK directly, and the pre-built curator helpers stay untouched until Step 2 needs them.

## Meet the client and the session

The [**Copilot runtime**](https://github.com/github/copilot-sdk/blob/main/docs/features/agent-loop.md)
receives prompts, calls models, and manages tools. The **client** connects your application to that
runtime. A **session** is one continuing conversation: it holds the messages and tool results that
make up context.

Keep one client alive for a piece of work, then create a session for each independent conversation.
Right now the application is simply `client -> session -> printed response`.

## Answer permission requests before you send

The runtime does not decide on its own whether a tool call may run. It asks the application, and the
session's [permission handler](https://github.com/github/copilot-sdk/blob/main/docs/hooks/pre-tool-use.md)
is what answers. When a session is created without one, the request is not denied — it is emitted as
an event and left pending for manual resolution, so the run stops and waits for an answer that never
arrives.

Give this first session an approve-all handler so every request has an answer. It approves requests
when managed settings are disabled, and it is a default rather than a safety measure: Step 5 shows
what actually constrains this session, and Steps 7 and 8 replace it with narrow, scoped handlers.

## Write the session

Open `src/index.ts` and **replace the entire file**:

```typescript
import { approveAll, CopilotClient } from "@github/copilot-sdk";

async function main(): Promise<void> {
  console.log("=== Museum Exhibit Studio ===");
  console.log();

  const client = new CopilotClient();
  await client.start();
  const session = await client.createSession({
    clientName: "museum-exhibit-studio",
    onPermissionRequest: approveAll,
  });

  const response = await session.sendAndWait({
    prompt: "Write two sentences of museum wall text about the Apollo 11 Moon landing.",
  });
  console.log(response?.data && "content" in response.data ? response.data.content : response);

  await session.disconnect();
  await client.stop();
}

void main();
```

`sendAndWait` blocks until the session goes idle, so you get the finished answer in one call.
`approveAll` is imported from the SDK alongside `CopilotClient`.

`src/curator.ts` beside this file is the pre-built helper module you start calling in Step 2. You
never edit it — you read it.

## Run it

```bash
npm start
```

Your exact wording will vary, but the output has this shape:

```text
=== Museum Exhibit Studio ===

The Apollo 11 mission carried three astronauts toward the Moon in July 1969. Days later,
two of them stepped onto its surface while the world listened.
```

Two sentences of museum-ish prose arrive after a short pause. Nothing streams yet, no tone is
enforced yet, and nothing stops the model from reaching past the subject you asked about. Those are
the next three steps.

## Check your understanding

- What does the session hold that the client does not?
- The response arrived all at once after a pause. Which part of the current code causes that?
- The session answered every permission request instead of leaving it pending. Did that make the
  session safer, or only make it able to finish?
- Nothing in this step restricts what the model may claim about Apollo 11. What is the only thing
  keeping the answer roughly on topic right now?

## Learn more

- [Build your first Copilot-powered app](https://docs.github.com/en/copilot/how-tos/copilot-sdk/getting-started):
  GitHub's tutorial for the same first client, session, and prompt.
- [Session resume and persistence](https://github.com/github/copilot-sdk/blob/main/docs/features/session-persistence.md):
  what a session keeps, and how to pick a conversation back up later.
- [Authentication](https://github.com/github/copilot-sdk/blob/main/docs/auth/README.md):
  the credentials a client can use once you move past `copilot login`.

Continue to [Stream the curator](museum-02-stream-the-curator.md).
