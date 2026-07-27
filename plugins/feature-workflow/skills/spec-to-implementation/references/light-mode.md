# Light-Mode (Grösse `light`)

**Qualifikation (Heuristik):** kein Schema-/Migrations-Change · Kern-Diff
≤ ~3 Dateien (Tests zählen nicht) · kein neues Event / kein neuer Endpoint ·
kein Security-Touchpoint (Auth/Rollen). Bei Qualifikation aktiv **vorschlagen**;
kurze User-Bestätigung ist Pflicht, Übersteuern jederzeit möglich. Wird die
Heuristik mittendrin verletzt → anhalten, auf FULL eskalieren, nicht still weiter.

| Schritt | Inhalt |
|---|---|
| L0 | Preflight + Manifest (`mode: "light"`) |
| L1 | **Ein** Mini-Dokument `<specsDir>/<datum>-<slug>-fix.md`: Problem, Root-Cause (falls bekannt), Fix-Ansatz, Akzeptanz (3–5 Bullets) — Commit auf Default-Branch |
| L2 | **Eine** Review-Runde (Reviewer-Weiche wie FULL); Triage; ein Squash-Commit |
| L3 | Implementation auf `fix/<name>` (TDD wie im Plan); Ledger und Codex-Runtime-Vertrag gelten analog |
| L4 | Verifikation: Typecheck + betroffene Test-Suites + Build (Integration nur bei API-/DB-Berührung) |
| L5 | Finish: Backlog/Status (5-Zeilen-Format), Merge auf Bestätigung |

Kein Gate 1 (Klärung formlos bei Bedarf), kein Plan-Approval-Gate, kein
Diff-Review (Stufe 6b — der Diff ist hier ≤ 3 Dateien und lief durch L2), kein
Smoke-Gate-Apparat (manuelle Bestätigung oder gezielter Browser-Check, im
Manifest notiert) — die Merge-Bestätigung bleibt.
