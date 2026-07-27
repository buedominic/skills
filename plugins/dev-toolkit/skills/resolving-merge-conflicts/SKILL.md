---
name: resolving-merge-conflicts
description: Laufenden Merge- oder Rebase-Konflikt Hunk für Hunk auflösen und zu Ende führen.
disable-model-invocation: true
---

# Merge-Konflikte auflösen

Ein Konflikt ist keine Textaufgabe, sondern zwei Absichten, die sich an
derselben Stelle treffen. Wer nur die Marker wegräumt, wählt zufällig eine
davon ab.

Dieser Skill führt den laufenden Merge oder Rebase **zu Ende**. Wer
abbrechen will, braucht ihn nicht.

## Ablauf

### 1. Lage aufnehmen

`git status` (Merge oder Rebase? welcher Schritt?), die Konfliktdateien, und
`git log --oneline --left-right <base>...<head>`: welche Commits treffen hier
aufeinander. Erst wenn klar ist, **was gerade zusammengeführt wird**, ergibt
ein einzelner Hunk Sinn.

### 2. Die Absicht beider Seiten finden

Für jeden Konflikt: warum wurde diese Änderung gemacht? Commit-Message,
verlinkter PR, Ticket, notfalls `git log -p` auf die Datei. **Nicht raten** —
eine erratene Absicht führt zu einer Auflösung, die plausibel aussieht und
falsch ist.

Das ist der teuerste Schritt und der, der den Unterschied macht. Zwei
Codeblöcke nebeneinander sagen nicht, welcher gewinnen soll; zwei Absichten
schon.

### 3. Hunk für Hunk auflösen

- **Beide Absichten erhalten**, wo sie sich nicht ausschliessen — das ist der
  Normalfall und wird oft übersehen, weil die Marker eine
  Entweder-oder-Entscheidung suggerieren.
- Sind sie unvereinbar: die Seite wählen, die zum **erklärten Ziel des
  Merges** passt, und den Trade-off notieren (welche Absicht unterliegt,
  und was dadurch verloren geht).
- **Nur auflösen, nichts erfinden.** Neues Verhalten in einer
  Konfliktauflösung findet kein Review: der Diff sieht aus wie eine
  Zusammenführung, und niemand liest ihn als Feature-Änderung. Fällt dabei
  eine nötige Änderung auf, wird sie notiert und danach separat gemacht.

### 4. Prüfen

Die Verifikations-Befehle des Projekts ermitteln (`verifyCommands` aus
`.claude/workflow.config.json`, sonst Typecheck → Tests → Format) und
laufen lassen. Ein Merge, der kompiliert, ist noch kein aufgelöster Merge.
Was der Merge gebrochen hat, wird hier repariert.

### 5. Zu Ende führen

Alles stagen und committen (`git merge --continue` bzw.
`git rebase --continue`). Beim Rebase weiter, bis alle Commits liegen —
jeder Folgeschritt kann neue Konflikte bringen, und die durchlaufen denselben
Ablauf.

## Leitplanken

- **Die Auflösung wird zu Ende geführt.** `git merge --abort` stellt den
  Zustand von vorher her und vernichtet die geleistete Denkarbeit; wer das
  will, ruft diesen Skill nicht auf.
- Bei einem Hunk, in dem beide Seiten dieselbe Logik geändert haben und jede
  Wahl Verhalten kostet: **anhalten und fragen**. Das ist ein
  Produkt-Entscheid, kein Merge-Detail.
- Keine unbeteiligten Zeilen anfassen. Ein Konflikt-Commit, der nebenbei
  formatiert, macht den Diff unlesbar — und der Diff ist hier das Einzige,
  woran ein Reviewer die Auflösung prüfen kann.
