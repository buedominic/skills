# Phase 01 — Portabler Check (TDD-Anker)

Node 22 ist vorhanden, das Repo nutzt bereits `.mjs`
(`plugins/feature-workflow/hooks/guard-branch.mjs`). `pwsh` fehlt in dieser
Umgebung, deshalb kann `tests/validate-feature-workflow.ps1` hier nicht
laufen — seine beiden Assertions werden mit abgedeckt.

## Schritte

- [ ] `tests/validate-context-doctrine.mjs` anlegen. Prüft ohne externe
      Abhängigkeiten, mit Exit-Code 1 bei Fehlern:
      - **Anker** (Grep, wortwörtlich): `Daten-Grenze` und
        `git ls-files --error-unmatch` in `spec-to-implementation/SKILL.md`;
        `Git ist die Wahrheit` ebenda; `approvedAt` im Gate-2-Abschnitt;
        `Keine erfundenen Beweise` in `landing-page`; `Keine PII/Secrets`
        in `bug-triage` und `web-audit`; `.env` in beiden context-kit-Skills.
      - **Frontmatter** aller neun `SKILL.md` plus der Vorlage: `name:`
        vorhanden, `description:` vorhanden und nicht leer.
      - **codex-runtime-Verweis** in `spec-to-implementation/SKILL.md`
        (deckt die zweite PowerShell-Assertion ab).
      - **Status-Format:** genau zwei Vorkommen des Format-Literals
        **unterhalb `plugins/` und `templates/`** (Doktrin +
        `spec-to-implementation`); die Doktrin ist als Quelle
        gekennzeichnet, die Kopie als Plugin-Isolations-Ausnahme.
        Der Scope ist bewusst eng: `docs/specs/` und `docs/plans/` dürfen
        das Format zitieren, ohne den Check zu brechen — sonst wird jede
        künftige Spec, die es erwähnt, zum Fehlschlag.
      - **Befund K/L:** `kontext-audit` enthält keine Behauptung
        „immer geladene Skill-Prompts" mehr, hat eine `description`-Zeile
        in der Budget-Tabelle und nennt `/doctor`.
      - **Zeilen-Bilanz:** gibt die Zeilenzahlen der betroffenen Dateien
        aus. Reine Ausgabe, kein Fehlschlag — die Bewertung bleibt menschlich.
- [ ] Check laufen lassen. Erwartung: **rot** bei der Markierung — das
      Literal kommt heute schon genau zweimal vor (Runde 8 der Spec-Review
      hat die ursprüngliche Drei-Fundstellen-Annahme widerlegt), aber weder
      ist die Doktrin als Quelle gekennzeichnet noch die Kopie in
      `spec-to-implementation` als Ausnahme. Ebenfalls rot: die
      `description`-Budget-Zeile (Befund K) und die `/doctor`-Zeile
      (Befund L) fehlen. Grün müssen alle zehn Anker sein.
- [ ] Rotes Ergebnis im Plan festhalten (welche Assertion, welcher Wert).

## Abnahme

Der Check läuft mit `node tests/validate-context-doctrine.mjs`, meldet
mindestens einen erwarteten Fehlschlag und keinen unerwarteten. Die
Anker-Assertions sind grün — sonst stimmt die Anker-Liste nicht mit dem
Repo überein und muss vor Phase 02 korrigiert werden.
