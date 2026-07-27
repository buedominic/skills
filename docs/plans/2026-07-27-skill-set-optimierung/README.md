# Plan — Skill-Set-Optimierung

Spec: [`docs/specs/2026-07-27-skill-set-optimierung-design.md`](../../specs/2026-07-27-skill-set-optimierung-design.md)
Manifest: [`workflow-state.json`](workflow-state.json)

Sieben Phasen. Die Reihenfolge ist nicht kosmetisch: die Test-Anker stehen
zuerst und **rot** (Gruppe C des Repos ist genau dafür da), die Doktrin geht
vor den Skills, die sie zitieren, und die Portabilität kommt nach der
Invocation-Achse, die sie abbilden muss.

| # | Phase | Berührt | Kern |
|---|---|---|---|
| [01](01-test-anker.md) | Test-Anker rot schreiben | `tests/` | Soll-Zustand als Assertions, bevor eine Zeile Skill fällt |
| [02](02-doktrin-entduplizieren.md) | Doktrin entduplizieren | Doktrin, `projekt-setup`, `kontext-audit` | Gedriftetes Duplikat streichen, Leitwort einführen |
| [03](03-invocation-achse.md) | Invocation-Achse | 9 × `SKILL.md` | 5 umflaggen, 4 Descriptions auf ≤ 1.150 Zeichen |
| [04](04-router-skill.md) | Router-Skill | `context-kit` | Anlässe und Übergänge — keine Description-Kopie |
| [05](05-vorlage-und-negation.md) | Vorlage + Negation | Vorlage, 9 × `SKILL.md` | Achse als Autorenregel, chirurgischer Umbau |
| [06](06-portabilitaet.md) | Portabilität | `install.sh`, `portabilitaet.md` | Achse für Cursor/Codex emulieren |
| [07](07-abschluss.md) | Abschluss | README, Manifeste, Manifest | Diff-Protokoll, Versionen, offener Punkt |

## Verifikation

`node tests/validate-context-doctrine.mjs` — Baseline vor Beginn: **44/44
grün**. Zusätzlich in Phase 06: `bash -n install.sh` plus ein Trockenlauf
gegen den Scratchpad. Beides gehört in `verifyCommands` des Manifests, sonst
weicht der Plan von der Config ab, gegen die Stufe 6 prüft.

Kein `package.json`, kein `pwsh` im Container —
`tests/validate-feature-workflow.ps1` bleibt in diesem Lauf ungeprüft.

### Wie „grün" zwischen Phase 01 und 07 zu lesen ist

Phase 01 schreibt die neuen Assertions **absichtlich rot**, und `F3`
(Router existiert) bleibt es bis Phase 04. Der Gesamtlauf liefert in dieser
Zeit Exit 1 — „Verifikation: Suite grün" ist in den Phasen 02–06 also gar
nicht erfüllbar und wäre eine Aufforderung, den Anker vorzeitig
abzuschwächen.

Es gilt stattdessen: das Skript druckt eine `OK`/`FAIL`-Zeile **pro
Assertion**. Jede Phase liest die Zeilen ihrer eigenen Gruppe. Der Lauf ist
für eine Phase bestanden, wenn

1. die Assertions **ihrer** Gruppe grün sind,
2. die **44 Baseline-Assertions** grün sind, und
3. jede noch rote Assertion einer **späteren** Phase zugeordnet ist.

Punkt 3 ist der eigentliche Schutz: eine rote Assertion ohne zuständige
Phase ist ein Fehlschlag, kein Zwischenstand. Er braucht die Zuordnung —
sie steht hier, sonst ist die Regel nicht durchsetzbar:

| Assertion | Wird grün in |
|---|---|
| `C` Kurzfassungs-Blöcke weg, Doktrin trägt das Leitwort | 02 |
| `D` Leitwort-Definition genau 3× unter `plugins/` — *Anker entsteht erst in 02* | 02 |
| `F1` / `F2` Invocation-Mengen | 03 |
| `G` Grundlast ≤ 1.150 | 03 |
| `B` Budget über alle `SKILL.md` | 03 |
| `F3` Router existiert und trägt das Feld | 04 |
| `C` Vorlage nennt `disable-model-invocation` | 05 |

Vollständig grün ist damit ab Phase 05; die Phasen 06 und 07 halten den
Stand und fügen keine Anker hinzu.

### Reihenfolge-Konflikt 03 ↔ 05

Beide Phasen fassen dieselben neun `SKILL.md` an, und Phase 05b läuft nach
Phase 03. Dreht der Negations-Durchgang eine `description` positiv um, kann
er die in Phase 03 erreichte Schranke `G` wieder kippen — die Phase selbst
merkt das nicht. Deshalb: **Phase 05b fasst `description`-Felder nicht an.**
Ihr Gegenstand sind Bodies und Leitplanken. Ergibt sich dort doch ein
Befund an einer Description, wandert er zurück in die Regeln von Phase 03
(Trigger statt Identität) und die Gruppe `G` wird erneut gelesen.

## Was dieser Plan bewusst nicht tut

Er ändert **keine fachliche Substanz**: kein Ablauf-Schritt, keine
Schwelle, keine Leitplanke mit realem Failure-Mode. Gegenstand sind
Platzierung, Auffindbarkeit und die Form der Steuerung. Wo eine Änderung
inhaltlich zu werden droht, ist sie in der jeweiligen Phase als
Stopp-Bedingung notiert.

## Offener Punkt, der diesen Lauf überdauert

Ob `disable-model-invocation` in der Runtime wirkt, ist **hier nicht
belegbar** — dieses Repo ist die Quelle der Plugins, nicht ihr
Installationsziel. Der Beleg gehört in die erste Session eines
Zielprojekts. Bis dahin steht er im Manifest unter `openPoints` und im
Abschluss-Bericht.

## Review-Notizen (Stufe 4)

Reviewer: `orchestrator` (kein Subagenten-Dispatch, siehe Manifest
`agentFallbacks`). **6 Runden, 13 Findings, 12 eingearbeitet.** Der Cap von
`maxReviewRounds: 5` wurde auf Ansage des Users angehoben („bis
no_findings") — protokolliert im Manifest.

**Runde 1** — 6 Findings. Der schwerste: der bekannte Einwand gegen
`landing-page` war als Einzeiler abgetan, hätte aber bei einer Drehung an
Gate 2 die Schranke `G` unerreichbar gemacht (1.485 gegen ≤ 1.150). Ferner:
`git diff main...HEAD` hätte Spec und Plan in den Regressions-Nachweis
gezogen; „Verifikation: Suite grün" war zwischen Phase 01 und 04 gar nicht
erfüllbar; Phase 05b hätte die in Phase 03 erreichte Schranke wieder kippen
können; das Cursor-Kriterium prüfte den falschen Zustand; `bash -n` fehlte
in `verifyCommands`.

**Runde 2** — 3 Findings, einer strukturell: der Leitwort-Kollaps
überquert eine **Plugin-Grenze**. `install.sh:43-48` kopiert Doku
plugin-weise, und `plugins/dev-toolkit/` hat kein `docs/` — zwei der drei
Stellen hätten auf einen Begriff verwiesen, den sie nie auflösen können.
Gelöst nach dem Präzedenzfall des Status-Formats (markierte Kopie +
Zähler), mit ausdrücklichem Rückfallpfad, falls der Aufwand den Gewinn
übersteigt.

**Runde 3** — 2 Findings, beide von Runde 2 erzeugt: Phase 01 hätte einen
Test-Anker für ein Ergebnis fixiert, das Phase 02 legitim umkehren darf —
der Test hätte die Architektur vorgeschrieben statt sie zu prüfen. Plus ein
Zählfehler (3 Vorkommen, nicht 2).

**Runde 4** — 1 Finding: der Plan hatte die Spec überholt; die Akzeptanz
nannte starr „die vier Felder ≤ 1.150", während Phase 03 längst beide
Varianten führte.

**Runde 5** — 1 Finding, die Wurzel von Runde 4: der Fix war an einer von
zwei Stellen angebracht worden. Die Gate-2-Abhängigkeit steht jetzt
**einmal** in der Entscheide-Sektion der Spec, alle Kriterien erben sie.

**Runde 6** — `NO_FINDINGS`.

**Bewusst abgelehnt (1):** `landing-page` als user-invoked. Das ist ein
Gate-1-Entscheid des Users; der Review re-litigiert ihn nicht, sondern legt
ihn an Gate 2 zur Drehung vor.
