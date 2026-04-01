# Mandalika Talent Assessment

Full-stack talent assessment app built with Next.js 14 App Router, TypeScript, Tailwind CSS, and Vercel KV-compatible storage.

## Scope

- Landing page at `/`
- 3-part assessment flow at `/assessment`
- Participant result page at `/result/[id]`
- Password-protected leader dashboard at `/leader`
- 26 tetrad Most-Least questions
- 26 ML-SJT questions
- 5 essay questions with Anthropic essay analysis
- Exact gate, downgrade, profile flag, and alert logic from the master document

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `KV_REST_API_URL` | Recommended | Vercel KV REST URL |
| `KV_REST_API_TOKEN` | Recommended | Vercel KV REST token |
| `LEADER_PASSWORD` | No | Leader dashboard password. Defaults to `mandalika2024` |
| `ANTHROPIC_API_KEY` | Optional | Enables essay AI analysis |
| `ANTHROPIC_MODEL` | Optional | Defaults to `claude-sonnet-4-20250514` |
| `ORG_NAME` | Optional | Brand label shown in the UI |

Without KV, submissions fall back to in-memory storage for local development only.

## Local Development

```powershell
Copy-Item .env.local.example .env.local
$env:PATH = "$PWD\.tools\node-v24.14.1-win-x64;$env:PATH"
.\.tools\node-v24.14.1-win-x64\npm.cmd install
.\.tools\node-v24.14.1-win-x64\npm.cmd run dev
```

## Verification

```powershell
$env:PATH = "$PWD\.tools\node-v24.14.1-win-x64;$env:PATH"
.\.tools\node-v24.14.1-win-x64\npm.cmd run typecheck
.\.tools\node-v24.14.1-win-x64\npm.cmd run build
```

## Note on Storage Package

The requested implementation uses `@vercel/kv`, but the package is now marked deprecated upstream. The current code matches the requested brief; for a longer-lived deployment, plan a follow-up migration to the current Upstash Redis integration path on Vercel.
