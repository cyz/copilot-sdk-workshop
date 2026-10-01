# Museum Exhibit Studio starter

Work directly inside `start-museum/nodejs`. After you change into it, open that same folder in your
editor (`code .` from inside it, or any other editor's open-folder command) and keep your terminal
there. The starter contains pinned dependencies, a minimal executable, and one pre-built curator
helper module, `src/curator.ts`. The helpers hold the plumbing you never have to write: the approved
fact sets and their bounds, the pre-built `approved_fact_lookup` local tool that hands those facts to
the curator, a streaming function, deterministic exhibit validation, the scoped Wikipedia MCP server
and its deny-by-default permission handler, the single-file `exhibit.html` write permission, and
small terminal prompts. You never edit the helpers.

The starter does **not** include the curator system message, the exhibit prompt, session
configuration, tool registration, or any orchestration. You write those in `src/index.ts` during the
lessons: one session, then streaming, then the curator voice, the fact tool registration and its
prompt, one session runner that owns the guardrails, the validation report, scoped Wikipedia
research, and an optional `exhibit.html` page. The entrypoint carries comments marking exactly where
each step's code goes. Start at [`workshop/museum-00-preflight.md`](../workshop/museum-00-preflight.md)
or, in Brazilian Portuguese, at [`workshop/pt-BR/museum-00-preflight.md`](../workshop/pt-BR/museum-00-preflight.md).

```bash
cd start-museum/nodejs
npm ci --ignore-scripts --no-audit --fund=false
npm run build
npm start
```

Running the starter prints its identity and does not start Copilot or require authentication.
Because you edit these files in place, your work shows up in `git status`. That is expected. Run
`git checkout -- .` from the repository root to restore a clean starter.

The starter already pins the dependencies the finished application needs, so you never edit
`package.json` during the workshop.
