## PRD: Repo-native Cursor Doc Review Tool

### 1) Summary

A personal, repo-native documentation tool that supports a tight Cursor authoring loop and async human review without SaaS subscriptions.

- **Authoring**: Smooth in-browser Markdown editor (opened inside Cursor’s in-app browser).
- **Private authoring comments**: Created via UI (Docs-like), stored invisibly in the Markdown file as structured annotations, **not shown to reviewers**.
- **Publish**: CLI renders static HTML snapshots and deploys to **GitHub Pages**.
- **External review comments**: Reviewers comment via **GitHub Issues** (no custom backend).
- **Ingestion**: CLI pulls GitHub Issues feedback into repo as structured JSON for Cursor/agent to read.

### 2) Goals

- Eliminate Google Docs/Notion copy-paste loop.
- Keep everything **self-contained in a repo**: docs, history, config, pulled feedback.
- Enable **async review** via a stable URL (Pages) with durable comment threads (Issues).
- Keep recurring cost at **$0/month** (GitHub-only).

### 3) Non-goals

- Real-time collaborative editing.
- Notion-style databases / blocks / embeds ecosystem.
- Replacing Cursor editor; this is a companion authoring surface.
- Complex permissions beyond GitHub repo permissions.

### 4) Primary users

- **Author (you)**: writes in Cursor, uses editor UI for inline notes to agent, publishes, pulls review feedback.
- **Reviewer**: reads static page, clicks “Comment” on a paragraph/section, leaves feedback in GitHub issue thread.

### 5) Key workflows

#### A) Authoring loop (private, local)

1. Open editor UI inside Cursor (e.g. `http://localhost:PORT/editor?file=docs/planning.md`)
2. Write/refine Markdown.
3. Highlight text / select a block → add a private comment via UI.
4. Private comments are stored as invisible `@cursor` annotations in the markdown source.
5. Cursor agent can read markdown + annotations and act.

#### B) Publish for review (repo → web)

1. `review publish docs/planning.md`
2. Tool strips private annotations.
3. Tool renders static HTML to `dist/…`
4. GitHub Action deploys to Pages.
5. Tool prints Pages URL.

#### C) External review (web → GitHub)

1. Reviewer reads Pages URL.
2. Hovers a block → clicks “Comment”.
3. This opens a prefilled “New Issue” (or Discussion) link.
4. Reviewer submits issue; comments live in GitHub.

#### D) Pull feedback (GitHub → repo)

1. `review pull docs/planning.md`
2. CLI fetches all relevant issues/comments.
3. Writes `.review/comments/planning.json`
4. Cursor agent reads it alongside the markdown.

### 6) Functional requirements

#### Editor UI

- Open and save a markdown file from the repo.
- Render Markdown with basic formatting (headings, lists, code blocks).
- Add private inline comments via UI:

  - comment on block or selected range (range is optional v1+; block-only is acceptable MVP).
  - comment types: `todo`, `question`, `decision`, `note`, `agent`.

- Display private comments in a sidebar and/or gutter markers.
- Hide the underlying annotation syntax from the user.

#### Private annotation storage

- Private comments are serialized into markdown as invisible HTML comments:

  - `<!-- @cursor:<type> ... -->`

- On load, editor parses those and rehydrates UI markers.
- On publish, all `@cursor` annotations are removed.

#### Publishing

- Deterministic static HTML generation for a single doc or multiple docs.
- GitHub Pages deployment:

  - via `gh-pages` branch or Pages workflow artifact

- URLs stable across publishes.

#### Review commenting (external)

- Each rendered block has an anchor and comment link that opens GitHub Issue creation with metadata prefilled:

  - doc path
  - version (optional)
  - block id
  - excerpt / context
  - canonical URL to the block

#### Pulling review feedback

- Fetch issues/comments from GitHub.
- Match them to doc + block.
- Store normalized JSON in repo.

### 7) Non-functional requirements

- Zero paid dependencies.
- Works on macOS.
- Safe by default: private annotations never leak to published HTML.
- Deterministic builds.

### 8) Data formats

#### Repo layout (proposed)

```
docs/
  planning.md
.review/
  config.json
  comments/
    planning.json
  cache/          (optional)
dist/             (generated static site)
```

#### Private annotation format (in markdown; written by editor, not you)

```md
<!-- @cursor:question
Is this boundary too leaky? Consider splitting read/write.
-->
```

#### Pulled review feedback format

```json
{
  "docPath": "docs/planning.md",
  "source": "github-issues",
  "pulledAt": "2025-12-19T21:00:00Z",
  "threads": [
    {
      "issueNumber": 14,
      "url": "...",
      "status": "open",
      "anchor": { "blockId": "b-12" },
      "context": { "excerpt": "We will track engagement via..." },
      "comments": [
        {
          "author": "alice",
          "body": "What defines engagement here?",
          "createdAt": "..."
        }
      ]
    }
  ]
}
```

### 9) MVP milestones

1. CLI `init` + Pages workflow + basic publish.
2. Static HTML renderer with block anchors + “Comment” links to GitHub issue template.
3. CLI `pull` that fetches issues/comments and writes JSON.
4. Editor UI loads/saves markdown + UI-authored private comments stored as `@cursor` annotations.
5. Publish strips annotations.
