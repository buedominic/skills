# 04 — Router-Skill

Fünf user-invoked Skills sind fünf Dinge, an die du dich erinnern musst.
Der Router ist die Antwort darauf — und selbst user-invoked, kostet also
null Grundlast.

Ort: `plugins/context-kit/skills/<name>/SKILL.md`. `context-kit` ist das
Meta-Plugin; der Router gehört zum Kontext-Lebenszyklus, nicht zu den
Fach-Skills.

## Die Abgrenzung, die diese Phase trägt

Ein Router, der die neun Skills beschreibt, ist eine **dritte Kopie**
derselben Information — neben dem Frontmatter und der README-Tabelle.
Dieser Lauf beseitigt Duplikate; er darf nicht zwei neue erzeugen.

Deshalb: die **eine Quelle** je Skill bleibt dessen Frontmatter. Der Router
trägt ausschliesslich, was dort nicht steht und auch nicht stehen kann —
**Anlass und Übergänge**. Nicht „was der Skill tut", sondern „wann du zu
ihm greifst und was danach kommt".

## Schritte

- [ ] **Namen wählen.** Er muss dir einfallen, wenn du gerade *nicht*
      weisst, welcher Skill passt — das ist die einzige Situation, in der
      der Router benutzt wird.
- [ ] **Frontmatter:** `disable-model-invocation: true`, `description` als
      menschenlesbare Einzeile.
- [ ] **Die Wege abbilden, nicht die Skills aufzählen.** Der Bestand hat
      erkennbare Ketten, und die sind der eigentliche Inhalt:
      - `/prior-art-check` → Spec (Stufe 1 der Pipeline)
      - `/bug-triage` → Light-Mode der Pipeline
      - Review-Eskalation oder Build/Buy-Entscheid → `/adr`
      - `/projekt-setup` einmalig, `/kontext-audit` bei Drift
      - `/landing-page` → `/web-audit` als voller Check danach
      Je Skill **maximal eine Zeile** Anlass.
- [ ] **Keine Nacherzählung.** Gegenprobe: enthält eine Zeile etwas, das
      wortgleich oder sinngleich schon in der `description` des Skills
      steht, gehört sie nicht in den Router.
- [ ] **README ergänzen, nicht aushöhlen.** Die Plugin-Tabelle im
      `README.md` bleibt vollständig: ihr Publikum sind Leser auf GitHub,
      die den Router weder installiert haben noch ausführen können — ein
      Verweis dorthin würde das README für genau die Leute verschlechtern,
      für die es geschrieben ist. Aufgenommen wird der Router als **neuer
      Eintrag** unter `context-kit`, mit einem Satz dazu, dass er die
      Anlass-Frage in der Session beantwortet. Die Tabelle beschreibt
      *was* die Skills tun, der Router *wann* man greift — zwei Fragen,
      kein Duplikat.
- [ ] **Verifikation:** Assertion `F3` grün (Router existiert, trägt das
      Feld). `node tests/validate-context-doctrine.mjs`.

## Stopp-Bedingung

Wächst der Router über eine Bildschirmseite, ist er zur Nacherzählung
geworden. Dann zurück auf die Anlass-Zeilen — nicht die Seite kürzen,
sondern die Nacherzählung streichen.
