# 01 — Test-Anker rot schreiben

Der Soll-Zustand wird als Assertion formuliert, **bevor** eine Zeile Skill
fällt. Das ist kein importiertes Ritual, sondern das Muster, das
`tests/validate-context-doctrine.mjs:12` selbst schon führt („Gruppe C —
Soll-Zustand der Doktrin; heute absichtlich ROT").

Berührt ausschliesslich `tests/validate-context-doctrine.mjs`.

## Schritte

- [ ] **Helfer `fmField(datei, feld)`** ergänzen, der ein Frontmatter-Feld
      liest (analog zu `fm_desc` in `install.sh:25-27`). Ohne ihn lässt
      sich `disable-model-invocation` nur per Substring prüfen, und dann
      färbt ein Vorkommen im Fliesstext grün.
- [ ] **Gruppe F (neu) — Invocation-Achse.** Assertions:
      - `F1` Genau die fünf Skills `projekt-setup`,
        `spec-to-implementation`, `dependency-audit`, `web-audit`,
        `landing-page` tragen `disable-model-invocation: true`.
      - `F2` Die vier übrigen tragen es **nicht** — als exakte Menge
        geprüft, nicht als Stichprobe, sonst rutscht ein sechster Skill
        unbemerkt durch.
      - `F3` Der Router-Skill existiert und trägt das Feld.
- [ ] **Gruppe G (neu) — Grundlast.** Summe der `description`-Längen aller
      Skills **ohne** `disable-model-invocation` ist ≤ 1.150 Zeichen. Die
      Assertion gibt die Ist-Summe mit aus, damit der Wert bei jedem Lauf
      sichtbar ist statt nur der Haken.
- [ ] **Gruppe B erweitern — Budget als Regression.** Jede `SKILL.md`
      inklusive `templates/skill-vorlage/SKILL.template.md`: `description`
      ≤ 500 Zeichen. Bewusst über *alle* Skills, nicht nur die geladenen —
      so scheitert auch ein künftig hinzugefügter Skill daran.
- [ ] **Gruppe C erweitern — Doktrin und Vorlage.**
      - `projekt-setup` und `kontext-audit` enthalten **keinen**
        Kurzfassungs-Block mehr (Anker: das Blockzitat-Zeichen `>` in
        Verbindung mit „hartes Budget").
      - `SKILL.template.md` nennt `disable-model-invocation`.
      - Die Doktrin trägt das neue Leitwort (Phase 02).

## Was hier bewusst **nicht** verankert wird

Der **Zähler für die Leitwort-Definition** (Analogon zu `D1`) gehört nicht
in diese Phase, sondern ans Ende von Phase 02. Grund: Phase 02 darf
begründet auf „drei wortgleiche Formulierungen statt Kollaps" zurückfallen,
wenn die Definition nicht in eine Zeile passt. Ein hier fixierter Zähler
würde diese Entscheidung **erzwingen** statt sie abzusichern — der Test
schriebe dann die Architektur vor, statt sie zu prüfen.

Ein Test-Anker darf ein Ergebnis fixieren, das bereits entschieden ist. Wo
die Entscheidung noch aussteht, wartet er.
- [ ] **Rot-Nachweis:** `node tests/validate-context-doctrine.mjs` läuft
      und meldet die neuen Assertions als Fehlschlag, die **44 bisherigen
      weiterhin grün**. Exit-Code 1. Die Ausgabe wird in dieser Datei unter
      „Ergebnis" festgehalten.

## Stopp-Bedingung

Schlägt eine der **bestehenden 44** Assertions fehl, ist der Helfer oder
die Gruppen-Registrierung kaputt — anhalten und reparieren, nicht die
Assertion anpassen. Die Baseline ist der Regressionsschutz für alle
folgenden Phasen; wer sie aufweicht, verliert ihn.

## Ergebnis

_(wird beim Ausführen gefüllt: Anzahl grün/rot, welche Assertions rot)_
