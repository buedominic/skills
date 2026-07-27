# Fehlerverhalten

- Dispatch scheitert oder liefert weder parsebaren Status noch Artefakt → einmal
  gezielt nachfassen, danach dokumentierter Orchestrator-Fallback oder harter
  Block. Review oder Implementation nie still überspringen.
- Agent-Slot-Limit erreicht → Rollen-Thread schliessen oder wiederverwenden.
- Branch-Hook blockt → du bist auf dem Default-Branch (Stufe 5: erst Branch).
- Manifest/Repo-Divergenz oder roter Preflight (dirty Worktree, falscher Branch,
  Slug-Kollision) → blockieren, Diagnose dokumentieren, User-Entscheid.
