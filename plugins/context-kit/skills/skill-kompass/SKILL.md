---
name: skill-kompass
description: Welcher Skill passt gerade? Anlässe und Übergänge der installierten Skills.
disable-model-invocation: true
---

# Skill-Kompass — welcher Skill passt gerade?

Fünf Skills sind user-invoked: sie kosten keine Grundlast, dafür musst du
wissen, dass es sie gibt. Dieser Kompass ist die Antwort darauf — er nennt
**Anlässe und Übergänge**, nicht die Skills. Was ein Skill *tut*, steht in
seinem Frontmatter und im README; hier steht, **wann du greifst und was
danach kommt**.

Sechs Skills tauchen hier nur als Anschluss auf (`kontext-audit`,
`prior-art-check`, `bug-triage`, `adr`, `grilling`, `domain-modeling`) — sie
sind model-invoked, Claude greift bei passender Lage selbst zu. Du musst sie
nicht erinnern.

## Der Hauptweg: Idee → Merge

1. Etwas Nicht-Triviales soll gebaut werden → **`/prior-art-check`**
   zuerst. Er kommt oft von selbst; wenn nicht, ist er die billigste
   Viertelstunde des ganzen Vorhabens.
2. Ergebnis BUY oder ADAPT, oder der Entscheid bindet künftige Sessions →
   **`/adr`**, bevor die Spec geschrieben wird.
3. Dann **`/spec-to-implementation`**. Es hält genau zweimal an. Gate 1 ist
   seit Kurzem kein Fragebogen mehr, sondern eine Schleife (`/grilling`):
   eine Frage, warten, nächste, bis beide Seiten dasselbe verstehen. Das
   dauert länger als drei gebündelte Runden — und fängt genau die
   Missverständnisse, die sonst erst im fertigen Ergebnis auffallen. Gate 2
   ist wieder eine einzelne Ja/Nein-Frage.
4. Kleine Sache? Der Skill schlägt den Light-Mode selbst vor. Annehmen —
   der volle Apparat lohnt sich unter drei Dateien nicht.

## Die Einstiege daneben

| Ausgangslage | Einstieg | Führt zu |
|---|---|---|
| Neues Repo, Claude kennt es noch nicht | **`/projekt-setup`** | einmalig; danach trägt die `CLAUDE.md` den Rest |
| Jemand meldet einen Fehler, unklar woher | `/bug-triage` | Mini-Dokument → Light-Mode der Pipeline |
| Doku fühlt sich falsch an, `CLAUDE.md` wächst | `/kontext-audit` | Report, dann Aufräum-Commits |
| Pakete veraltet, Advisory reingekommen | **`/dependency-audit`** | risikogestufter Update-Plan |
| Seite konvertiert nicht, neue Landing Page | **`/landing-page`** | danach `/web-audit` für den vollen Check |
| Seite ist langsam, unzugänglich, unsichtbar | **`/web-audit`** | Befundliste mit Fundstellen |
| Merge oder Rebase steckt im Konflikt | **`/resolving-merge-conflicts`** | Auflösung Hunk für Hunk, zu Ende geführt |
| Ein Plan soll auseinandergenommen werden | `/grilling` | Zusammenfassung der Entscheide |
| Ein Begriff ist unscharf oder umstritten | `/domain-modeling` | Eintrag in `CONTEXT.md` |

Fett = du musst es tippen. Der Rest kommt von selbst.

## Die Übergänge, die man leicht übersieht

- **`/bug-triage` fixt nicht.** Es endet mit dem Dokument; der Fix läuft
  danach als Light-Mode. Wer den Übergang überspringt, verliert die
  Review-Runde.
- **`/landing-page` prüft nur seine eigene Checkliste.** Der volle
  Accessibility- und Performance-Durchgang ist `/web-audit`, danach.
- **`/prior-art-check` entscheidet nicht.** Er empfiehlt; der Entscheid
  fällt in Gate 1 der Pipeline oder als `/adr`.
- **`/grilling` baut nichts.** Es endet mit Verständnis; was daraus folgt,
  entscheidest du oder der aufrufende Workflow.
- **`/domain-modeling` schreibt keine ADRs.** Es erkennt den Anlass und
  reicht an `/adr` weiter — dort liegen Format und Nummernkreis.
- **`/kontext-audit` läuft nie automatisch.** Es ist ein Eingriff in die
  Steuerungs-Artefakte — den stösst du an, nicht die Session.
- **`/projekt-setup` überschreibt keine bestehende `CLAUDE.md`.** Gibt es
  schon eine, wird daraus ein Umbau-Vorschlag.

## Wenn nichts passt

Die Skills decken Aufnahme, Pflege, Bauen und Prüfen ab — nicht das
Denken davor. Für eine noch unscharfe Idee lohnt eher ein Gespräch als ein
Skill; die Pipeline greift ab dem Punkt, an dem du sagen kannst, was
entstehen soll.
