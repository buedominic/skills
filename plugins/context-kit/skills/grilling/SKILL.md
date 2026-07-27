---
name: grilling
description: Use before building, when a plan or design should be stress-tested one question at a time (e.g. "grill mich", "stress-test", "lösch meine Annahmen").
---

# Grilling — Anforderungen im Wechsel klären

Ein Interview, das so lange läuft, bis Mensch und Agent dasselbe verstehen.
Der Rest dieses Skill-Sets bündelt Rückfragen, um Unterbrechungen zu sparen;
dieser Skill macht das Gegenteil. Er wird gewählt, wenn Alignment mehr wert
ist als Tempo — und das ist er immer dann, wenn ein Missverständnis erst im
fertigen Ergebnis sichtbar würde.

**Zuerst ansagen, was passiert.** Ein Satz: dass jetzt einzeln gefragt wird,
wie lange das ungefähr dauert, und dass „reicht, lass uns bauen" die
Schleife jederzeit beendet. Der Skill kann auch ungefragt starten — dann
muss der Ausstieg in einem Satz möglich sein.

## Die Schleife

**Eine Frage. Warten. Nächste.** Mehrere Fragen auf einmal sind der Modus,
den dieser Skill ersetzt: sie erzeugen Sammelantworten, in denen die
schwierigste Frage untergeht.

Vier Regeln tragen den Wert — nicht die Anzahl der Fragen:

1. **Fakten selbst holen, Entscheide vorlegen.** Was im Repo, in Dateien
   oder per Tool nachschlagbar ist, wird nachgeschlagen. Gefragt wird nur,
   was der User entscheiden **muss**. Das ist die Grenze zwischen einem
   Interview und einem Verhör: wer nach Ableitbarem fragt, verlagert Arbeit.
2. **Je Frage eine Empfehlung.** „Ich würde X, weil Y — einverstanden?"
   schlägt „Was möchtest du?". Eine Frage ohne Vorschlag erledigt nichts,
   sie reicht das Problem weiter.
3. **Den Entscheidungsbaum abgehen, nicht die Liste.** Antworten machen
   Folgefragen gegenstandslos oder erzeugen neue. Die nächste Frage folgt
   aus der letzten Antwort — eine vorab geschriebene Fragenliste ist wieder
   das Bündel.
4. **Erst auf Bestätigung handeln.** Die Schleife endet, wenn der User das
   geteilte Verständnis bestätigt, nicht wenn dem Agenten die Fragen
   ausgehen.

## Woran man merkt, dass es reicht

Die Schleife ist fertig, wenn eine **Zusammenfassung der Entscheide** ohne
Lücken formulierbar ist: Problem, Nutzer, Randbedingungen, Nicht-Ziele,
offene Annahmen. Gelingt das nicht, fehlt genau dort noch eine Frage.

Diese Zusammenfassung ist der Ausgang des Skills. Läuft er als Teil eines
Workflows, wird sie das Material für das Dokument, das danach entsteht —
was hier entschieden wurde, gehört in die Spec und nicht in den
Gesprächsverlauf, sonst überlebt es die Session nicht.

## Begriffe, die dabei fallen

Wird ein Begriff strittig oder unscharf — zwei Leute meinen Verschiedenes
mit demselben Wort — greift `/domain-modeling`. Bedingung: das Projekt führt
ein `CONTEXT.md`, **oder** die Unschärfe blockiert gerade eine Antwort.

Sonst nicht. Ein Grilling über eine Idee ohne Codebase hat kein Glossar zu
pflegen, und jede Sitzung zum Glossar-Termin zu machen wäre Zwang statt
Nutzen.

## Leitplanken

- **Der Skill baut nichts.** Er endet mit Verständnis; was daraus folgt,
  entscheidet der User oder der aufrufende Workflow.
- Sammelt sich Ungeduld („ist doch klar", kurze Antworten), ist das ein
  Signal: entweder wird nach Ableitbarem gefragt (Regel 1 verletzt) oder
  das Thema ist geklärt. Beides ansprechen statt weiterfragen.
- Nach drei Fragen ohne neue Erkenntnis: zusammenfassen und bestätigen
  lassen. Vollständigkeit ist das Ziel, nicht Länge.
