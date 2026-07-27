---
name: domain-modeling
description: Use when a project's terms are fuzzy, collide, or a resolved term belongs in CONTEXT.md.
---

# Domain-Modeling — die Sprache des Projekts schärfen

Hält `CONTEXT.md` aktuell: das Glossar der Begriffe, die Aussenstehende
falsch verstehen. Schicht 2 der Kontext-Doktrin — bei Bedarf geladen, ohne
Zeilenschranke, aber ausschliesslich Glossar (keine Spezifikationen, keine
Implementierungs-Entscheide).

Der Nutzen ist Kürze im Betrieb. Wer „Materialisierungs-Kaskade" sagen kann,
braucht dafür nicht jedes Mal drei Nebensätze — und Variablen, Dateien und
Tests heissen durchgängig gleich, weil alle dasselbe Wort verwenden.

**Dieser Skill ist die aktive Pflege.** `CONTEXT.md` zu *lesen*, um die
Projekt-Sprache zu treffen, ist eine Gewohnheit, die jeder Skill hat; hier
geht es ums Ändern.

## Vier Anlässe

1. **Kollision.** Ein Begriff wird anders gebraucht, als das Glossar ihn
   führt. Sofort ansprechen: „Im Glossar heisst *Storno* X, du meinst
   gerade Y — welches gilt?"
2. **Unschärfe.** Ein Wort trägt mehrere Bedeutungen. Einen präzisen
   kanonischen Begriff vorschlagen, statt die Mehrdeutigkeit zu übernehmen:
   „Du sagst *Konto* — meinst du den Kunden oder den Zugang?"
3. **Widerspruch zum Code.** Was gesagt wird, passt nicht zu dem, was der
   Code tut. Beides nebeneinanderlegen und den User entscheiden lassen,
   welche Seite falsch ist.
4. **Klärung.** Ein Begriff ist entschieden und gehört festgehalten.

## Wie geschrieben wird

**Sofort, nicht gesammelt.** Ein geklärter Begriff wandert in derselben
Bewegung ins `CONTEXT.md`. Gesammelte Klärungen gehen verloren — sie
überleben die Session nicht, in der sie entstanden sind.

**Lazy anlegen.** Kein `CONTEXT.md`, bis der erste Begriff steht. Eine leere
Glossar-Datei füllt sich mit Belanglosem.

Format je Eintrag: der Begriff als Überschrift, ein bis zwei Sätze
Bedeutung, und — wo es hilft — die Wörter, die **nicht** gemeint sind. Die
Negativliste ist oft wertvoller als die Definition, weil sie genau die
Verwechslung ausschliesst, die zum Eintrag geführt hat.

**Kanten stresstesten.** Wenn eine Beziehung zwischen Begriffen unklar ist,
einen konkreten Grenzfall erfinden und durchspielen. Ein Szenario zwingt zur
Präzision, wo eine Definition ausweichen kann.

## Grundsatz-Entscheide gehören zu `/adr`

Fällt beim Schärfen ein Entscheid, der **schwer umkehrbar** ist, **ohne
Kontext überraschend** wirkt und **Ergebnis eines echten Trade-offs** war
(alle drei), ist ein ADR fällig. Dann `/adr` vorschlagen — dort liegen
Format, Nummerierung und die Supersede-Mechanik.

Fehlt eines der drei Merkmale, ist kein ADR fällig. Und dieser Skill
schreibt in keinem Fall selbst eines: ein zweiter ADR-Erzeuger neben `/adr`
wäre ein Duplikat mit zwei Formaten und zwei Nummernkreisen.

## Leitplanken

- **Das Glossar ist keine Ablage.** Kommt etwas hinein, das kein Begriff
  ist — ein Ablauf, ein Entscheid, eine Notiz —, gehört es in Spec, ADR
  oder Status.
- Ein Eintrag entsteht aus einer **echten** Verwechslungsgefahr. Begriffe,
  die jeder gleich versteht, kosten Pflege ohne Gegenwert.
- Widerspricht das Glossar dem Code, entscheidet der User, welche Seite
  nachzieht — nicht der Skill.
