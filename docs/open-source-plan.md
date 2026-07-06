# Open-Source Release Plan

Goal: publish this codebase publicly with a clean history — no AI trailers, no
AI authorship, sensibly segregated commits — and nothing legally or privately
encumbered in the tree.

**Legend:** ✅ done · 🔄 in progress · ☐ todo — 👤 you · 🤖 code · 🤝 together

---

## 0. Audit results (2026-07-06) ✅

Verified clean — no action needed:

- ✅ **No secrets anywhere in history.** Every populated value in `.env.local`
  was grepped against all revisions: zero matches. `.env.example` was
  empty-valued in all 16 historical versions. No `.env*`, keystore, `.p8`,
  `.p12`, or Google service files were ever committed. No API-key patterns
  (`appl_…`, `goog_…`, Aptabase, tokens, PEM blocks) anywhere in history.
- ✅ **No agent tooling ever committed** (`.claude/`, `.cursor/`, `tmp/`, …).
- ✅ Privacy docs and in-app `/privacy` page exist.

What the history *does* contain (the cleanup target):

- ❌ 12 commits with `Co-Authored-By: Claude …` trailers and ~36
  `claude.ai/code` session URLs in commit bodies.
- ❌ 35 commits authored/committed as `Claude <noreply@anthropic.com>`.
- ❌ 8 merge commits whose subjects name `claude/*` branches
  (e.g. "Merge pull request #9 from pkalisiewicz/claude/deconstruction-…").
- ❌ Personal email `przemyslaw.kalisiewicz@gmail.com` on all 105 commits
  (acceptable if you're fine with it being public — most maintainers are).

---

## 1. Repo hygiene (before any history work) 🤖

- ✅ Add `LICENSE` (MIT) + `license` field in `package.json`
- ✅ Remove stray tracked file `index.html.spa-backup`
- ✅ Commit in-flight working-tree changes (tip-jar Test Store + native boot)
- ✅ Apple Team ID moved out of `scripts/consts.mjs` into `.env.local`
  (`IOS_DEVELOPMENT_TEAM`)

---

## 2. Content licensing 👤 — BLOCKER

- ✅ **Replaced (2026-07-06)** — all 8 sounds are now CC0/public-domain, with
  per-file provenance in `docs/sounds-attribution.md`. The blocker is gone.
- ✅ Brand assets reserved from the MIT grant — noted in both READMEs.

---

## 3. History strategy 👤 decision, 🤝 execution

Two viable paths. **Option A is recommended** — you asked for "literally
clean," and only A delivers that:

### Option A — fresh public repo (recommended)

GitHub keeps force-pushed-away commits reachable by SHA and shows old PR
branch names (`claude/*`) in PRs #1–#10 forever. A rewritten history pushed
to the *same* repo therefore still leaks AI traces. Instead:

1. Create a new empty GitHub repo (e.g. `improv-toolbox`).
2. From a clean checkout of `main`, start an orphan history:
   ```bash
   git checkout --orphan public-main
   git add -A
   git commit -m "feat: Improv Toolbox 1.0 — initial public release"
   git remote add public git@github.com:pkalisiewicz/improv-toolbox.git
   git push public public-main:main
   ```
   Or, for a curated series instead of one commit: reset the orphan branch and
   `git add` path groups in order (core tools → design system → PWA/SSG →
   native), committing each with a conventional message.
3. Keep this repo private as the full archaeological record.
4. Going forward, commit with the GitHub noreply email if you don't want the
   gmail address public.

### Option B — filter-repo rewrite (keeps 105 commits)

Only worth it if per-commit history matters publicly. Must still be pushed to
a **new** repo (see above). On a fresh clone:

```bash
pip install git-filter-repo
git filter-repo \
  --mailmap <(echo "Przemyslaw Kalisiewicz <przemyslaw.kalisiewicz@gmail.com> Claude <noreply@anthropic.com>") \
  --message-callback '
import re
msg = message.decode()
msg = re.sub(r"(?mi)^co-authored-by: claude.*\n?", "", msg)
msg = re.sub(r"(?m)^https://claude\.ai/code/\S+\n?", "", msg)
msg = re.sub(r"from pkalisiewicz/claude/\S+", "from a feature branch", msg)
return msg.strip().encode() + b"\n"
'
```

Downsides: keeps low-quality messages ("new features", "Add files via
upload"), and "segregating" changes across 105 commits is a manual rebase —
not realistic.

---

## 4. Pre-publish checklist 🤝

- ☐ Sounds resolved (section 2) — blocker
- ☐ `LICENSE` in tree — done once section 1 lands
- ☐ README: add English section (currently Polish-only), build/run
  instructions, license + brand-assets note, screenshot
- ☐ Final secret sweep on the exact tree being published:
  `git grep -iE '(api[_-]?key|secret|token)\s*[:=]' -- ':!package-lock.json'`
- ☐ Verify `.env.local` is untracked in the new repo (`git status`)
- ☐ Enable GitHub secret scanning + push protection on the new repo (Settings
  → Code security) before adding collaborators
