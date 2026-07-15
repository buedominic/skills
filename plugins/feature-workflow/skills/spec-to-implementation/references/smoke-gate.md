# Smoke-Gate (Stufe 7)

End-to-End-Nachweis der Akzeptanz-Bullets nach grüner Verifikation. Erst
beim Eintritt in Stufe 7 lesen.

## Varianten-Wahl

Nach grüner Stufe 6 einmalige gebündelte User-Rückfrage mit zwei Optionen (KEIN
drittes Workflow-Gate — nur die Varianten-Wahl eines Pflicht-Schritts):

- **Smoke jetzt automatisiert durchführen** — Routine unten, Verfahren je
  `environment.browser`:

  | `browser` | Verfahren |
  |---|---|
  | `chrome-mcp` | gebatchte Browser-Operationen über das Chrome-MCP (Tabs via MCP-Lifecycle-Tools) |
  | `playwright` | headless Chromium via Playwright-Script; gleiches Akzeptanz-Bullet-Modell, gleiche Leitplanken; Evidenz = Screenshot + Console-Dump |
  | `manual` | nicht verfügbar → nur die zweite Option anbieten |

- **Manuell erledigt — bestätigen** — User hat den Smoke selbst gefahren;
  Manifest: `smoke.status = "manual-confirmed"` + `confirmedAt` + `note`.

Hat das Feature keine Browser-Oberfläche (CLI, Library, API-only), ist der
„Smoke" der passende End-to-End-Nachweis (CLI-Aufruf, API-Call) — gleiche
Regeln, ohne Browser.

## Smoke-Quelle

Der Smoke prüft ausschliesslich die `## Akzeptanz`-Bullets der gerade
umgesetzten Spec. Klassifikation je Bullet:

- **browser-testable** — übersetzt in Micro-Steps („öffne X → finde Y →
  klicke Z → erwarte W").
- **notBrowserTestable (pre-derived)** — reine Unit-Test-/DB-/Doku-Aussagen.
  Übersprungen, mit Begründung im Manifest; blockt `passed` NICHT.
- **multiContext** — Realtime-Bullets („Admin macht X → Public-Ansicht
  aktualisiert") brauchen zwei Browser-Kontexte: Public-Kontext zuerst
  (Vor-Zustand), dann Admin-Aktion, dann bounded polling auf den
  Nach-Zustand. Max. 2 Kontexte gleichzeitig.

0 browser-testbare Bullets → `smoke.status = "passed"` mit leerer
Step-Liste und Hinweis; App-Start/Browser komplett überspringen.

## App-Start

1. HTTP-Ping auf `devServer.healthUrl` (aus der Projekt-Config). Antwortet
   die erwartete App (`appMarker` matcht) → reuse, `startedByUs = false`.
   Sonst `devServer.command` im Hintergrund starten, Health-URL bis max.
   90s pollen; `startedByUs = true`, PID/Prozess-Info im Manifest
   (`devServer`-Block) persistieren.
2. Antwortet auf dem Port eine FREMDE App → harter Block, kein stilles
   Ausweichen auf einen anderen Port.
3. Cleanup je Endzustand: bei `passed`/`manual-confirmed`/
   `halted-by-user`/Crash-Resume nur selbst gestartete Prozesse beenden
   (`startedByUs = true`) und selbst geöffnete Tabs/Kontexte schliessen.
   User-Server NIE killen. Beim offenen Failure-Dialog KEIN Cleanup —
   Tabs/Server bleiben für Retry/Fix stehen.

## Disziplin-Regeln (verbindlich)

- Gebatchte Operationen statt einzelner Voll-DOM-Reads; keine kompletten
  Page-Dumps.
- Bounded Polling statt blindem `sleep`: max. 10 Iterationen × 500ms = 5s
  harter Timeout pro Erwartung.
- Max. 7 browser-testbare Bullets pro Run; mehr → harter Block mit Hinweis
  auf Spec-Split oder manuellen Smoke. Kein implizites Subset.
- Tabs/Kontexte EINMAL pro Run öffnen, für alle Bullets wiederverwenden, am
  Ende schliessen. IDs im Manifest (`smoke.tabIds[]`) für gezielten
  Crash-Cleanup.
- Auth: Berühren Bullets geschützte Bereiche → einmaliger Session-Check;
  nicht eingeloggt → harter Block mit Hinweis, sich einzuloggen (bzw. bei
  Playwright: Storage-State bereitzustellen). KEIN Auto-Login — Credentials
  gehören nicht in den Browser-/Agent-Kontext.
- Testdaten-Mutationen mit Prefix `SMOKE-<runId>-…` markieren und in
  `smoke.dataMutations[]` protokollieren. Kein generisches DB-Cleanup.
- Feature-Assertions müssen Dateninhalt prüfen, nicht nur
  Container-Sichtbarkeit. Ein sichtbarer Empty-State zählt nur als Erfolg,
  wenn der Empty-State selbst die Akzeptanzbedingung ist. Fehlen die nötigen
  Seed-Daten → gezielt über bestehende App-/API-Wege herstellen oder den
  Smoke als nicht aussagekräftig blockieren.

## Evidenz + Redaktion (nur im Failure-Pfad)

- Ablage unter `<planDir>/smoke/<runId>/` — Pfad MUSS gitignored sein
  (`git check-ignore` prüfen, sonst Abbruch mit `.gitignore`-Hinweis).
- Screenshot des Viewports; Console max. 50 Einträge × 500 Zeichen.
- Network-Redaktion: URLs auf origin+pathname reduzieren (Query/Fragment
  verwerfen); Auth-Header droppen (cookie, authorization, set-cookie,
  proxy-authorization, x-auth-token, x-csrf-token — case-insensitive,
  Request UND Response); Auth-/Login-Request-Bodies komplett droppen
  (`<redacted: auth-body>`); andere Bodies auf 500 Zeichen truncaten;
  max. 50 Einträge.

## Zustandsmaschine (`smoke.status`)

`pending → running → passed | failed`; aus `failed` via
Vier-Optionen-Dialog: `running` (Retry/Markieren), `fix-loop-running`
(→ `passed` oder `fix-loop-capped`), `halted-by-user`; `manual-confirmed`
direkt aus der Varianten-Wahl. Jeder Übergang wird VOR der Ausführung ins
Manifest committet (auf dem Feature-Branch).

- `runId`-Format `YYYY-MM-DD-HHMMSS-<rand6hex>`; Retry und Fix-Loop
  bekommen JEWEILS eine neue `runId`, alte → `previousRunIds[]` (max 5).
- `lastFailureRunId`/`lastFailureEvidence` sind stabile Evidenz-Anker —
  nur bei einem NEUEN roten Bullet überschreiben, nicht bei Fix-Versuchen.
- `running`/`fix-loop-running` beim Resume als Crash behandeln: gezielter
  Cleanup NUR der eigenen Tabs (`smoke.tabIds[]`) und PID (falls
  `startedByUs`), Status zurücksetzen, Dialog neu stellen.

## Failure-Pfad (fail-fast)

Beim ersten roten Bullet stoppt der Run für diesen Bullet (Folgebullets
hängen am Dialog):

1. Evidenz-Bundle einmalig erfassen (oben).
2. Manifest committen: `smoke.status = "failed"`, `failedAt = <bullet>`,
   `attempts++`, Evidenz-Anker aktualisieren. Tabs/Server bleiben STEHEN.
3. Merge bleibt blockiert. Kein Auto-Fix, kein Auto-Retry.
4. Gebündelte User-Rückfrage mit vier Optionen:
   - **Retry** — Smoke EINMAL komplett neu (alle Bullets von vorn), neue
     runId, Tabs frisch, Server nach Möglichkeit reusen. Für Flakes oder
     nach manuellem User-Fix.
   - **Claude fixt** — geführte Fix-Loop (unten); Tabs/Server werden
     reused.
   - **Markieren** — Bullet als `notBrowserTestable (user-marked)` mit
     User-Begründung ins Manifest; mit dem NÄCHSTEN Bullet weitermachen.
   - **Stoppen** — `smoke.status = "halted-by-user"`, jetzt Cleanup,
     Workflow blockt bis zum manuellen Neustart.

**Akzeptanzgültigkeit (kein Bypass):** `passed` wird NUR gesetzt, wenn ALLE
Bullets `ok` oder (begründet) `notBrowserTestable` sind und KEINER `failed`
ist. Ein `passed` mit ungetestetem Restbullet ist NICHT möglich.

## Fix-Loop (Option „Claude fixt")

Harte Sub-Routine, Cap 3 Versuche, OHNE weitere Zwischen-Gates
(`smoke.status = "fix-loop-running"`). Pro Versuch:

1. **Diagnose** — Evidenz + Bullet lesen, klassifizieren:
   (a) Smoke-Derivation falsch (Selector/Erwartung daneben, kein Code-Bug),
   (b) Testbarkeits-Lücke (fehlendes `data-testid` o.ä. — minimaler Fix),
   (c) echter Implementation-Bug (systematisches Debugging).
2. **Fix** — `implementer`-Rollen-Pool nach dem Runtime-Vertrag verwenden,
   eigener Commit `fix(smoke): …`. In Codex keinen zusätzlichen Thread
   erzeugen, wenn bereits ein Implementer-Thread existiert.
   Bei (a) zusätzlich `smokeAdjustments[]`-Eintrag
   `{ bullet, before: { selector, expect }, after: { selector, expect }, rationale }`.
3. **Re-Smoke NUR des fehlgeschlagenen Bullets.** Rot → Versuch +1.
4. Cap erreicht (3/3 rot) → `fix-loop-capped`, zurück zum
   Vier-Optionen-Dialog.
5. Bullet grün → finaler kompletter Smoke-Re-Run über ALLE Bullets
   (Regressions-Check). Falls Code geändert wurde: ZUSÄTZLICH die volle
   Stufe-6-Verifikations-Suite erneut. Alles grün → `passed`, weiter zu
   Stufe 8.

**Leitplanken (nicht „grün schummeln"):** Niemals den Akzeptanz-Bullet
selbst ändern. Adjustments dürfen die Bullet-Semantik NICHT abschwächen —
gleiche Aussage, nur anderer Selector/Text-Pfad; KEIN Wechsel zu „irgendein
Element ist sichtbar" / „Seite lädt ohne Error". Niemals Timeouts > 5s,
keine „element-not-found = ok"-Fallbacks, keine stillschweigend
weggelassenen Bullets. Kein Eingriff in Spec, Plan oder Manifest-Felder
ausser `smoke.*`. Jede Fix-Iteration ein SEPARATER Commit — einzeln
revertierbar.

## Chat-Output-Regeln

Kein Live-Stream pro Bullet. Pre-Notice 1 Zeile („▶ Smoke startet (N
Bullets, Server reused)"); Erfolgs-Output ~7 Zeilen (Header +
Bullet-Häkchen + Manifest-Pfad, kein Screenshot); Failure-Output ~10 Zeilen
(Bullet-Status + erwartet/gefunden + Evidenz-Pfade + Vier-Optionen-Hinweis);
Fix-Loop 1 Zeile pro Iteration; bei Cap: „Cap erreicht (3/3). Zurück zum
Failure-Dialog."
