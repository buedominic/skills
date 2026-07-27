---
name: landing-page
description: Landing Page bauen oder überarbeiten: Struktur, Copy, Conversion, Launch-Checkliste.
disable-model-invocation: true
---

# Landing-Page — Struktur, Copy, Conversion

Der konzeptionelle Teil einer Landing Page: was auf die Seite gehört, in
welcher Reihenfolge, mit welchen Worten — und die Pflicht-Checkliste vor
dem Launch. Die **visuelle** Gestaltung übernimmt das offizielle
`frontend-design`-Plugin, falls installiert (Design-Richtung VOR dem
Coden festlegen); sonst eine eigene, bewusste Design-Entscheidung treffen
und dokumentieren.

## Ablauf

### 1. Fundament (gebündelt erfragen, max. 1 Runde `AskUserQuestion`)

- **Zielgruppe:** Wer landet hier, aus welchem Anlass, mit welchem
  Wissensstand?
- **Das EINE Nutzenversprechen:** Welches Problem löst das Angebot, in
  einem Satz in der Sprache der Besucher?
- **Die EINE gewünschte Aktion (CTA):** anmelden, kaufen, Demo buchen,
  Kontakt? (Eine primäre Aktion — nicht drei.)
- **Beweise:** Was existiert wirklich — Testimonials, Nutzerzahlen,
  Referenz-Logos, Screenshots, Bewertungen?
- **Ton:** seriös, verspielt, technisch …? (fliesst in die
  Design-Richtung ein)

### 2. Struktur (jede Sektion hat einen Zweck — leere weglassen)

| Sektion | Zweck |
|---|---|
| **Hero** | Nutzenversprechen als Headline in Besucher-Sprache + unterstützende Subline + primärer CTA, alles above the fold; Hero-Visual zeigt das Produkt im Einsatz |
| **Problem → Lösung** | Das Problem benennen, wie es der Besucher erlebt; dann die Lösung als Weg, nicht als Feature-Liste |
| **Features als Nutzen** | 3–5 Kernfunktionen, jede als Ergebnis formuliert („Auswertung in Minuten statt Stunden") |
| **Social Proof** | NUR echtes Material aus Schritt 1 — Zitate mit Name/Kontext, Zahlen, Logos |
| **Einwände** | FAQ/Preis/Garantie: die 3–5 Fragen, die vom Klick abhalten |
| **Abschluss-CTA** | Nutzenversprechen in einem Satz wiederholen + derselbe primäre CTA |

### 3. Copy-Prinzipien

- Nutzen vor Funktion; konkret statt Superlativ („in 10 Minuten
  einsatzbereit" schlägt „revolutionär einfach").
- Ein primärer CTA, überall identisch formuliert, als Verb des Besuchers
  („Projekt erstellen", nicht „Absenden").
- Besucher-Vokabular verwenden (wie sie das Problem googeln würden),
  Fachjargon nur, wenn die Zielgruppe ihn spricht.
- Headline-Test: Versteht ein Fremder in 5 Sekunden, was es ist, für wen
  und warum es besser ist?

### 4. Umsetzung

Falls `frontend-design` installiert: als Sub-Skill nutzen — erst
Design-Richtung (Zielgruppe/Ton aus Schritt 1 übergeben), dann bauen.
Statischer Inhalt braucht kein Client-Framework; die Seite muss ohne
JavaScript lesbar sein.

### 5. Launch-Checkliste (Pflicht, vor der Abnahme)

Mini-Ausschnitt aus `/web-audit` — für den vollen Check danach
`/web-audit` fahren:

- [ ] `title` + `meta description`; OG-/Twitter-Card mit Vorschaubild
- [ ] genau ein `h1`; `alt`-Texte; `lang`-Attribut
- [ ] Mobile-first geprüft; Bilder responsive mit `width`/`height`
- [ ] Hero-Bild optimiert (LCP!), Fonts mit `font-display`
- [ ] CTA per Tastatur erreichbar, Kontrast erfüllt
- [ ] Rechtliches je nach Land (Impressum, Datenschutz) verlinkt

### 6. Abnahme

Screenshots (mobil + Desktop) dem User zeigen; erst nach dessen OK ist
die Seite „fertig".

## Leitplanken

- **Keine erfundenen Beweise:** keine ausgedachten Testimonials, Zahlen
  oder Logos — fehlt Material, fällt die Sektion weg.
- **Keine Dark Patterns:** kein Fake-Countdown, keine vorgetäuschte
  Knappheit, keine versteckten Kosten.
- Ein primäres Ziel pro Seite — wer zwei Zielgruppen hat, braucht zwei
  Seiten (oder klare Pfade), nicht eine überladene.
- Copy-Entscheide sind Produkt-Entscheide: bei Ton/Positionierung im
  Zweifel den User entscheiden lassen, nicht stilsicher raten.
