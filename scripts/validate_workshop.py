#!/usr/bin/env python3
"""Deterministic content checks for the Node.js Museum Exhibit Studio workshop."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
WORKSHOP = ROOT / "workshop"
LOCALES = ("pt-BR",)
STARTER = ROOT / "start-museum" / "nodejs"
FINISHED = ROOT / "finished" / "nodejs" / "museum-exhibit-studio"
REMOVED_PATHS = (
    "start-accessibility",
    "finished/dotnet",
    "finished/go",
    "finished/java",
    "finished/python",
    "finished/rust",
    "start-museum/dotnet",
    "start-museum/go",
    "start-museum/java",
    "start-museum/python",
    "start-museum/rust",
    "language-registry.js",
    "language-navigation.js",
    "markdown-language-preprocessor.js",
    "target-app/",
)
FENCE = re.compile(r"^\s*(```+|~~~+)")
LINK = re.compile(r"\]\(([^)\s]+)\)")

errors: list[str] = []


def require(condition: bool, message: str) -> None:
    if not condition:
        errors.append(message)


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def lesson_ids() -> list[str]:
    viewer = read(DOCS / "workshop" / "step.html")
    files = re.findall(r"file: 'workshop/([a-z0-9-]+)\.md'", viewer)
    require(bool(files), "docs/workshop/step.html declares no lessons")
    return files


def parse_lesson(path: Path) -> tuple[list[str], list[str], list[str]]:
    """Return (code blocks, link targets, prose lines) for one lesson."""
    blocks: list[str] = []
    links: list[str] = []
    prose: list[str] = []
    fence: str | None = None
    buffer: list[str] = []
    for line in read(path).split("\n"):
        if fence:
            if line.strip().startswith(fence):
                blocks.append("\n".join(buffer))
                fence, buffer = None, []
            else:
                buffer.append(line)
            continue
        match = FENCE.match(line)
        if match:
            fence, buffer = match.group(1), [line.strip()]
            continue
        prose.append(line)
        links.extend(LINK.findall(line))
    require(fence is None, f"{path.relative_to(ROOT)} has an unclosed code fence")
    return blocks, links, prose


def validate_lessons(ids: list[str]) -> None:
    expected = {f"{lesson_id}.md" for lesson_id in ids}
    for directory in (WORKSHOP, *(WORKSHOP / locale for locale in LOCALES)):
        present = {path.name for path in directory.glob("*.md")}
        require(present == expected,
                f"{directory.relative_to(ROOT)} lessons {sorted(present ^ expected)} do not match step.html")

    for lesson_id in ids:
        english = WORKSHOP / f"{lesson_id}.md"
        if not english.exists():
            continue
        en_blocks, en_links, en_prose = parse_lesson(english)
        for target in en_links:
            if re.fullmatch(r"[a-z0-9-]+\.md", target):
                require(target[:-3] in ids, f"{english.relative_to(ROOT)} links to unknown lesson {target}")
        for locale in LOCALES:
            translated = WORKSHOP / locale / f"{lesson_id}.md"
            if not translated.exists():
                continue
            label = translated.relative_to(ROOT)
            blocks, links, prose = parse_lesson(translated)
            require(blocks == en_blocks, f"{label} code blocks differ from the English lesson")
            require(links == en_links, f"{label} link targets differ from the English lesson")
            check_placeholders(label, prose)
        check_placeholders(english.relative_to(ROOT), en_prose)


def check_placeholders(label: Path, prose: list[str]) -> None:
    text = "\n".join(prose)
    require(":::" not in text, f"{label} still contains a language directive")
    require("<language>" not in text, f"{label} still contains a <language> placeholder")
    require("{{" not in text, f"{label} still contains a template placeholder")


def validate_localization(ids: list[str]) -> None:
    localization = read(DOCS / "localization.js")
    for step_id in re.findall(r"'(museum-[a-z0-9-]+)': Object\.freeze", localization):
        require(step_id in ids, f"docs/localization.js translates unknown step {step_id}")


def import_block(source: str) -> str | None:
    match = re.search(r'import \{\n.*?\} from "\./curator\.js";', source, re.S)
    return match.group(0) if match else None


def validate_node_projects(ids: list[str]) -> None:
    require(read(STARTER / "src" / "curator.ts") == read(FINISHED / "src" / "curator.ts"),
            "start-museum/nodejs/src/curator.ts must stay identical to the finished helper module")

    starter_manifest = json.loads(read(STARTER / "package.json"))
    finished_manifest = json.loads(read(FINISHED / "package.json"))
    for section in ("dependencies", "devDependencies", "engines"):
        require(starter_manifest.get(section) == finished_manifest.get(section),
                f"package.json {section} differ between the starter and the finished app")

    finished_import = import_block(read(FINISHED / "src" / "index.ts"))
    last_lesson = read(WORKSHOP / f"{ids[-1]}.md")
    require(finished_import is not None and finished_import in last_lesson,
            f"workshop/{ids[-1]}.md must show the finished app's complete ./curator.js import")


def validate_no_removed_references() -> None:
    candidates = [
        ROOT / "README.md",
        ROOT / "CONTRIBUTING.md",
        *ROOT.joinpath("start-museum").glob("*.md"),
        *FINISHED.glob("*.md"),
        *DOCS.rglob("*.html"),
        *DOCS.rglob("*.js"),
        *WORKSHOP.rglob("*.md"),
        *ROOT.joinpath(".github").rglob("*.yml"),
    ]
    for path in candidates:
        if not path.is_file():
            continue
        text = read(path)
        for removed in REMOVED_PATHS:
            require(removed not in text, f"{path.relative_to(ROOT)} still references removed {removed}")


def main() -> int:
    ids = lesson_ids()
    if ids:
        validate_lessons(ids)
        validate_localization(ids)
        validate_node_projects(ids)
    validate_no_removed_references()

    if errors:
        print("Workshop validation failed:", file=sys.stderr)
        for message in errors:
            print(f"- {message}", file=sys.stderr)
        return 1
    print(f"Validated {len(ids)} lessons in English and {', '.join(LOCALES)}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
