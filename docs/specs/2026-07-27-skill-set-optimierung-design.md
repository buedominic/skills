# Skill-Set-Optimierung — Invocation-Achse, Duplikate, Steuerungsform

Lauf 1 von zwei. Dieser Lauf räumt den **Bestand** auf; die Übernahmen aus
`mattpocock/skills` (grilling, domain-modeling, Diff-Review, TDD-Referenz)
sind Lauf 2 und hier ausdrücklich Nicht-Ziel.

## Problem

Das Skill-Set ist inhaltlich stark, aber es fehlt ihm eine Achse, und es
verletzt an drei Stellen seine eigene Doktrin.

**Die fehlende Achse — Invocation.** Alle neun Skills sind model-invoked.
Ihre `description`-Felder summieren sich auf **3.375 Zeichen**, die in jeder
Session jedes Projekts geladen werden — auch die von `/landing-page`, wenn
gerade eine Datenbank migriert wird. Fünf dieser Skills sind Orchestratoren,
die man ohnehin tippt; ihre Auto-Auffindbarkeit ist bezahlte Last ohne
Gegenwert. `SKILL.template.md:20` setzt „immer geladen" sogar als
unveränderliche Eigenschaft voraus — die Wahl existiert in der eigenen
Autoren-Doktrin nicht.

**Die drei Selbstverstösse.**

1. `spec-to-implementation` hat eine `description` von **506 Zeichen** —
   über dem Budget von ≤ ~500, das `kontext-audit:60` selbst aufstellt.
2. `projekt-setup:24-38` und `kontext-audit:20-33` tragen beide eine
   „Kurzfassung" der Doktrin, und sie sind **gedriftet**: die Gotcha-
   Definition steht nur in der einen, „umso tiefer je seltener" nur in der
   anderen. Das ist der Befund, den `kontext-audit` Schritt 4 selbst als
   `CRITICAL` klassifiziert. Der Fallback ist zudem weitgehend unnötig:
   `install.sh:43-48` kopiert die Doktrin in jedes `references/`.
3. `kontext-audit` Schritt 4 klassifiziert Über-Constraints in
   *Zielprojekten*; die Skills selbst steuern durchgehend per Verbot. Die
   Vorlage kennt den Urteils-Anker (`SKILL.template.md:42-53`) — angewendet
   wurde er auf den Bestand nur teilweise.

## Entscheide (Gate 1)

| Frage | Entscheid |
|---|---|
| Invocation | 5 user-invoked (`projekt-setup`, `spec-to-implementation`, `dependency-audit`, `web-audit`, `landing-page`), 4 model-invoked (`kontext-audit`, `adr`, `bug-triage`, `prior-art-check`) |
| Router | Neuer user-invoked Skill in `context-kit` |
| Doktrin-Kurzfassung | Ersatzlos streichen, ersetzt durch eine Herkunfts-Zeile |
| Umbau-Tiefe | Chirurgisch — nur ohne realen Failure-Mode, plus Leitwort-Kollaps |

Die vier model-invoked Skills sind es aus einem Grund, nicht aus Gewohnheit:
`/adr` und `/prior-art-check` werden von anderen Skills als Anschluss
benannt, `/bug-triage` soll bei einer rohen Fehlermeldung von selbst
greifen, `/kontext-audit` bei spürbarer Doku-Drift.

## Scope

**Neun `SKILL.md`** — Frontmatter (Invocation), `description` (Trigger statt
Identität), chirurgischer Negations-Durchgang, Leitwort-Kollaps.

**`templates/skill-vorlage/SKILL.template.md`** — die Invocation-Achse als
Autorenregel. Ohne das bleibt die Vorlage stale und der nächste Skill
wiederholt den Fehler.

**`install.sh` + `docs/portabilitaet.md`** — `disable-model-invocation` ist
Claude-nativ. Cursor-Rules entstehen heute für *jeden* Skill mit
`description` + `alwaysApply: false` (`install.sh:190-199`) — Cursors
„Agent Requested"-Modus, der genau per description lädt. Ohne Anpassung
gilt die Achse nur in Claude.

**`plugins/context-kit/skills/<router>/`** — neuer Skill.

**`tests/validate-context-doctrine.mjs`** — Assertions für den Soll-Zustand,
nach dem etablierten Muster der Gruppe C (zuerst rot).

**`README.md` + `marketplace.json` + `plugin.json`** — Übersicht, Versionen.

## Nicht-Ziele

- Übernahmen aus `mattpocock/skills` (Lauf 2).
- `codebase-design` / `improve-codebase-architecture` — eigener Entscheid.
- Fachliche Änderungen an Ablauf, Schwellen oder Leitplanken. Gegenstand
  sind Platzierung, Auffindbarkeit und die *Form* der Steuerung.
- `handoff`, `prototype` — verworfen, das Manifest und das Rich-References-
  Prinzip decken sie ab.

## Annahmen

1. **`disable-model-invocation: true` ist das gültige Claude-Feld** für
   user-invoked Skills. Belegt durch `mattpocock/skills` (9 Skills nutzen
   es produktiv), nicht durch offizielle Doku, die im Repo vorliegt.
2. **Codex ehrt das Feld vermutlich nicht.** `docs/portabilitaet.md:60`
   beschreibt Auto-Laden per description. Behandelt wie Cursor: durch
   `install.sh` emuliert statt vorausgesetzt.
3. **Skill-zu-Skill-Verweise auf user-invoked Skills sind Prosa an den
   User**, keine programmatische Invokation — z.B. `bug-triage`s Hinweis
   auf den Light-Mode. Sie bleiben gültig; nur die *automatische* Reichweite
   entfällt.
4. **Die Kurzfassung ist verzichtbar**, weil `install.sh` die Doktrin
   mitkopiert. Wer einen einzelnen Ordner von Hand kopiert, verliert sie —
   akzeptiert, dafür sagt die Herkunfts-Zeile, wo sie steht.
5. **`node` ist die Verifikations-Basis.** Kein `package.json`, kein `pwsh`
   im Container; `tests/validate-feature-workflow.ps1` bleibt ungeprüft.
6. **Spec, Plan und Implementation liegen auf einem Branch**
   (`claude/skills-optimization-spec-i2hiix`) statt getrennt — Vorgabe der
   Session schlägt Grundsatz 3 der Pipeline.

## Akzeptanz

Jedes Kriterium ist als Assertion in `tests/validate-context-doctrine.mjs`
prüfbar; die Suite ist am Ende grün und war es zu Beginn (44/44).

- [ ] Genau fünf `SKILL.md` tragen `disable-model-invocation: true`:
      `projekt-setup`, `spec-to-implementation`, `dependency-audit`,
      `web-audit`, `landing-page`.
- [ ] Der neue Router-Skill trägt es ebenfalls und nennt alle neun Skills
      mit ihrem Anlass.
- [ ] Die vier verbleibenden model-invoked `description`-Felder summieren
      sich auf ≤ 1.600 Zeichen (heute 3.375 über neun) — mindestens **52 %**
      weniger Grundlast.
- [ ] Kein `description`-Feld überschreitet 500 Zeichen.
- [ ] Weder `projekt-setup` noch `kontext-audit` enthalten einen
      Doktrin-Kurzfassungs-Block; beide nennen stattdessen den Pfad der
      Doktrin.
- [ ] `SKILL.template.md` erklärt beide Invocation-Modi und wann welcher
      gilt.
- [ ] `install.sh` erzeugt für user-invoked Skills **keine**
      Agent-Requested-Cursor-Rule; `docs/portabilitaet.md` hält fest, wie
      die Achse pro Client abgebildet ist.
- [ ] Der Leitwort-Kollaps ist vollzogen: „Report zuerst, Edits erst nach
      Bestätigung" steht nicht mehr dreimal ausgeschrieben, sondern als ein
      Begriff in der Doktrin plus Verweis.
- [ ] Verhaltens-Regression: kein Ablauf-Schritt, keine Schwelle und keine
      Leitplanke mit realem Failure-Mode wurde entfernt — belegt durch die
      unveränderten Gruppe-A/C-Assertions.
- [ ] `README.md` und `marketplace.json` bilden den neuen Stand ab; alle
      drei `plugin.json` haben eine erhöhte Version.
