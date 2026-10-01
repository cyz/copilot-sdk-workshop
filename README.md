# GitHub Copilot SDK Workshop: Museum Exhibit Studio

Start today: http://github.github.com/copilot-sdk-workshop/

A hands-on GitHub Copilot SDK workshop in Node.js and TypeScript. You build **Museum Exhibit
Studio**, a non-SDLC curator agent that transforms educator-approved facts into visitor-ready exhibit
copy behind deterministic application boundaries. The site and lessons are available in English and
Brazilian Portuguese.

In the workshop, you'll:

1. Create a Copilot client and conversation session.
2. Separate durable agent policy from task-specific data.
3. Choose between a local application-owned tool, an MCP server, and a tightly scoped allowlist.
4. Enforce capability, input, timeout, validation, and lifecycle boundaries in application code.
5. Explain what the model can infer and what the application must prove.

Plan on about 90 minutes. Machine setup happens separately in an untimed preflight.

## Start the workshop

Open the GitHub Pages URL produced by the repository's **Deploy to GitHub Pages** workflow, choose
the content language, and start the workshop. The site derives its Pages base URL at runtime, so
there is no hardcoded organization or user Pages hostname.

To preview the site from a clone:

```bash
git clone https://github.com/github/copilot-sdk-workshop.git
cd copilot-sdk-workshop
python3 -m http.server 8000
```

Open <http://localhost:8000/docs/>. Do not open `step.html` with a `file://` URL; browsers block
the Markdown requests used by the lesson viewer.

## Prerequisites

- [Node.js 22.12 or newer](https://nodejs.org/) and npm
- [GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli)
- GitHub Copilot subscription or trial

Preflight walks through installation checks, authentication, expected output, and troubleshooting.

## Repository layout

```text
copilot-sdk-workshop/
|-- docs/                                   GitHub Pages site and lesson viewer
|-- workshop/                               Lessons in English
|   `-- pt-BR/                              Lessons in Brazilian Portuguese
|-- start-museum/nodejs/                    Starter project learners grow in place
|-- finished/nodejs/museum-exhibit-studio/  Completed application
|-- scripts/                                Content, build, and deployment validation
`-- .github/workflows/                      Validation and Pages deployment
```

## Validate a change

```bash
bash scripts/validate-workshop.sh
```

The command checks that every lesson listed in the lesson viewer exists in English and Brazilian
Portuguese, that translated lessons keep the same code blocks and links as the English ones, that
the starter helper module matches the finished app, and that the site navigation and localization
tests pass. It then installs and type-checks the starter and the finished app without
authenticating Copilot or sending a prompt.

Run one part at a time with `content` or `nodejs`:

```bash
bash scripts/validate-workshop.sh content
bash scripts/validate-workshop.sh nodejs
```

## Museum Exhibit Studio workshop

The starter lives under `start-museum/nodejs`, with the completed application under
`finished/nodejs/museum-exhibit-studio`. The starter ships one pre-built curator helper module,
`src/curator.ts`, that learners never edit: approved fact sets and their bounds, a streaming
function, deterministic exhibit validation, the scoped Wikipedia MCP server with its deny-by-default
permission handler, the single-file `exhibit.html` write permission, and small terminal prompts.

Learners work directly in `start-museum/nodejs` and grow `src/index.ts` across the lessons, running
it at every step. They write only the session setup, the curator and research system messages, the
prompt builders, one session runner that owns the lifecycle and guardrails, and `main`. The finished
sample is what a learner ends up with, not a separate reference architecture.

The learner-facing track begins at
[`workshop/museum-00-preflight.md`](workshop/museum-00-preflight.md), then runs through seven core
steps — first session, streaming, curator voice, approved facts, guardrails, structural checks, and
Wikipedia MCP research — plus an optional interactive `exhibit.html` capstone. Brazilian Portuguese
lessons live in [`workshop/pt-BR/`](workshop/pt-BR/); there, the prompts and user-facing messages
are shown in Portuguese, while the code structure and the `## Narrative`, `## Visitor questions`, and
`## Sources` headings that the helper module parses stay in English.

## Deployment

After validation passes, push to `main`. The
[Pages workflow](.github/workflows/deploy.yml) publishes `docs/` plus the Markdown lessons in
`workshop/`. Build and content validation run separately in the validation workflow.

Enable GitHub Pages in repository settings and choose **GitHub Actions** as the source. The
deployment job reports the canonical workshop URL in its environment.

The deployment workflow verifies every published HTML page, site asset, and Markdown lesson. It
checks the URL returned by GitHub Pages by default. To validate a future public or custom domain
instead, set the repository Actions variable `WORKSHOP_SITE_URL` to that site's base URL. You can
run the same check manually:

```bash
WORKSHOP_SITE_URL=https://workshop.example.com/ python3 scripts/validate_deployment.py
```

## References

- [GitHub Copilot SDK for Node.js/TypeScript](https://github.com/github/copilot-sdk/tree/main/nodejs)
- [Copilot SDK cookbook](https://github.com/github/copilot-sdk/tree/main/cookbook)
- [Copilot SDK API and source](https://github.com/github/copilot-sdk)
- [Install the GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli)
- [Model Context Protocol](https://modelcontextprotocol.io/)

## License

This project is licensed under the [MIT License](LICENSE).

This workshop is provided as-is for educational purposes. It is intended to
demonstrate concepts and patterns rather than serve as a complete production
service.
