---
name: adr
description: Use to record an architecture or technology decision as an ADR (e.g. "halte den Entscheid fest", "adr schreiben", after a build/buy decision, a review escalation or a fundamental design choice).
---

# ADR — Architektur-Entscheide festhalten

Ein Entscheid, der künftige Sessions bindet, gehört als ADR (Architecture
Decision Record) ins Repo — sonst wird er in jeder Session neu diskutiert.
ADRs sind Schicht-2-Kontext (bei Bedarf geladen, siehe
context-kit-Doktrin): CLAUDE.md verweist nur auf das Verzeichnis.

## Wann ein ADR fällig ist

- Build/Buy/Adapt-Entscheide (Ergebnis eines `/prior-art-check`).
- Eskalationen aus Review-Runden der Pipeline (echter Produkt-/
  Sicherheits-/Scope-Entscheid durch den User).
- Technologie-/Struktur-Wahlen mit Alternativen (DB, Auth-Ansatz,
  Deployment, Modul-Schnitt).
- NICHT für: umkehrbare Detail-Entscheide, reine Konventionen (→
  CLAUDE.md), Feature-Inhalte (→ Spec).

## Ablauf

1. **Nummer + Datei:** `docs/decisions/NNNN-<slug>.md` (fortlaufend,
   vierstellig; Verzeichnis beim ersten Mal anlegen und in der
   Verweis-Tabelle der CLAUDE.md eintragen).
2. **Inhalt erfragen/zusammentragen** — was nicht aus dem Gespräch/Repo
   hervorgeht, gebündelt nachfragen (max. 1 Runde):

   Das Format ist ein vereinfachtes [MADR](https://adr.github.io/madr/)
   (Markdown Architectural Decision Records) — bei Bedarf voll
   MADR-kompatibel erweiterbar:

   ```markdown
   # NNNN — <Titel des Entscheids>

   - Status: proposed | accepted | rejected | deprecated | superseded by NNNN
   - Datum: YYYY-MM-DD

   ## Kontext
   <Warum stand der Entscheid an? Constraints. 2–4 Sätze.>

   ## Optionen
   <je Option 1–2 Zeilen: Kern + entscheidender Vor-/Nachteil>

   ## Entscheid
   <Was wurde gewählt, in einem Satz — und die 1–2 ausschlaggebenden Gründe.>

   ## Konsequenzen
   <Was wird dadurch leichter/schwerer? Was ist jetzt verbindlich?
    Welche Folgearbeit entsteht?>
   ```

3. **Budget:** ≤ 1 Seite. Detail-Analysen (Benchmarks, lange
   Vergleichstabellen) sind Anhänge oder bleiben in der Spec — das ADR
   hält den Entscheid, nicht die Studie.
4. **Commit** auf den Default-Branch: `docs(adr): NNNN <titel>`.

## Leitplanken

- ADRs sind **append-only**: ein Entscheid wird nie umgeschrieben, sondern
  durch ein neues ADR ersetzt (altes bekommt `Status: superseded by NNNN`).
  Erlaubte nachträgliche Änderungen: nur Status-Übergänge
  (`proposed → accepted/rejected`, `accepted → deprecated/superseded`).
- Ein ADR pro Entscheid — keine Sammel-ADRs.
- Verworfene Optionen MIT Grund festhalten — das verhindert, dass sie in
  sechs Monaten neu evaluiert werden.
- Steht der Entscheid im Widerspruch zu einer CLAUDE.md-Konvention, die
  Konvention im selben Zug nachziehen (eine Wahrheit).
