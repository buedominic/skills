---
name: web-audit
description: Web-Seite auf Accessibility, Performance und SEO prüfen.
disable-model-invocation: true
---

# Web-Audit — Accessibility, Performance, SEO

Die drei kritischen Dimensionen, die weder Design-Skills noch
Security-Review abdecken.
**Befund vor Eingriff:** erst erheben und klassifizieren, dann vorlegen —
geändert wird auf Zusage.

## Ablauf

### 0. Scope klären

Welche Seiten/Routen? (Default: die wichtigsten öffentlichen Seiten plus
eine repräsentative eingeloggte Ansicht.) Läuft die App lokal (→
Laufzeit-Prüfung möglich) oder nur statische Analyse?

### 1. Statische Analyse (Code, ohne Browser)

**Accessibility (WCAG-Grundpfeiler):**
- Semantik: genau ein `h1` pro Seite, lückenlose Heading-Hierarchie,
  Landmarks (`main`/`nav`/`footer`), Listen als Listen.
- Bedienbarkeit: klickbare `div`/`span` statt `button`/`a`; Fokus-Stile
  entfernt (`outline: none` ohne Ersatz)?
- Formulare: jedes Eingabefeld mit gebundenem `label`; Fehlermeldungen
  programmatisch verknüpft.
- Bilder: `alt` auf informativen Bildern (leeres `alt=""` für dekorative).
- ARIA: nur wo natives HTML nicht reicht — falsches ARIA ist schlimmer
  als keines.
- `lang`-Attribut am Dokument.

**SEO/Meta (pro Route):**
- `title` (einzigartig, ≤ ~60 Zeichen) + `meta description`.
- Open-Graph- und Twitter-Card-Tags inkl. Vorschaubild.
- `robots.txt`, `sitemap.xml`, `canonical` bei Duplikat-Gefahr.
- Strukturierte Daten (JSON-LD), wo ein passender Typ existiert
  (Event, Organization, FAQ …).
- Inhalte serverseitig gerendert bzw. crawlbar (kein leeres HTML-Gerüst
  für die Kernaussage)?

**Performance-Kandidaten:**
- Bilder: Format (WebP/AVIF), Dimensionen (`width`/`height` gegen
  Layout-Shift), Lazy-Loading below the fold, Hero-Bild als
  LCP-Kandidat optimiert.
- Client-Bundle: grosse Dependencies für Kleinaufgaben, fehlendes
  Code-Splitting, Client-Framework für rein statischen Inhalt.
- Blockierendes: synchrone Third-Party-Scripts im `head`, Fonts ohne
  `font-display`.
- Daten: N+1-API-Aufrufe, fehlende Cache-Header auf statischen Assets.

### 2. Laufzeit-Prüfung (falls Browser verfügbar)

Via Playwright/Chromium (das offizielle `webapp-testing`-Skill von
Anthropic eignet sich als Unterbau) oder Chrome-MCP; sonst diesen Schritt
überspringen und im Report als „nicht geprüft" kennzeichnen:

- **Tastatur-Durchlauf:** alles Interaktive per Tab erreichbar, Fokus
  sichtbar, sinnvolle Reihenfolge, keine Fokus-Falle, Modals schliessbar
  per Esc.
- **Kontrast-Stichproben:** Text mind. 4.5:1 (gross: 3:1) — an den
  realen, gerenderten Farben messen.
- **Ladeverhalten (Näherung, kein echtes Lighthouse):** Zeit bis zum
  grössten sichtbaren Element, sichtbare Layout-Sprünge beim Laden,
  Grösse der übertragenen Assets.
- Konsole auf Fehler/Warnungen.

### 3. Klassifizierung

| Stufe | Beispiele |
|---|---|
| KRITISCH | per Tastatur unbedienbare Kernfunktion; informative Bilder ohne `alt`; Text-Kontrast < 3:1; fehlender `title`; Kernaussage nicht crawlbar; LCP-Kandidat mehrere MB |
| HOCH | Heading-Chaos; fehlende OG-Tags; Layout-Shifts; blockierende Scripts; fehlende `meta description` |
| POLITUR | fehlende strukturierte Daten; `font-display`; Lazy-Loading-Feintuning |

Jeder Befund: `{ dimension, stufe, stelle (datei:zeile bzw. URL),
befund, fix (1 Satz) }`.

### 4. Report + Bestätigung

Kompakter Report, nach Stufe sortiert. Dann EINE gebündelte
`AskUserQuestion`: alles / nur KRITISCH+HOCH / nur Report.

### 5. Umsetzung (nach Bestätigung)

Thematisch gebündelte Commits (a11y / seo / perf getrennt). Nach den
Fixes: Verifikations-Suite des Projekts + gezielter Re-Check der
behobenen Punkte.

## Leitplanken

- Keine Behauptung ohne Fundstelle; Laufzeit-Messwerte als Näherung
  kennzeichnen.
- Kein Design-Umbau unter dem Deckmantel von A11y: Farbwerte nur minimal
  anpassen (Kontrast erfüllen, Charakter erhalten) — grössere visuelle
  Eingriffe sind ein Design-Entscheid des Users.
- Alt-Texte beschreiben den Inhalt, nicht „Bild von …"; keine
  Keyword-Stopferei in Meta-Texten.
- Keine PII/Secrets aus der Laufzeit-Prüfung in den Report.
