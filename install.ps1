# Universal-Installer für buedominic/skills (Windows/PowerShell).
# Eine Wahrheit: SKILL.md/agents-*.md bleiben die einzige Quelle;
# Client-Formate werden generiert.
#
# Nutzung:
#   .\install.ps1 claude [pfad]      → <projekt>\.claude\settings.json (Plugins pinnen; committen → Cloud-Sessions installieren automatisch)
#   .\install.ps1 claude-copy [pfad] → <projekt>\.claude\skills + .claude\agents (Kopien im Repo, ohne Plugin-System)
#   .\install.ps1 codex              → $HOME\.agents\skills + $HOME\.codex\agents
#   .\install.ps1 codex -Project     → .agents\skills + .codex\agents
#   .\install.ps1 cursor [pfad]      → <projekt>\.agents\** + .cursor\rules\*.mdc
#   .\install.ps1 copilot [pfad]     → <projekt>\.agents\** + .github\prompts\*.prompt.md + AGENTS.md-Block
#   .\install.ps1 agents [pfad]      → <projekt>\.agents\** + AGENTS.md-Block (generisch)
param(
    [Parameter(Mandatory = $true)][ValidateSet('claude', 'claude-copy', 'codex', 'cursor', 'copilot', 'agents')][string]$Client,
    [string]$Path = '.',
    [switch]$Project
)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path

function Get-FrontmatterValue([string]$File, [string]$Key) {
    $Lines = Get-Content -Encoding UTF8 $File
    $DelimIdx = @(); for ($i = 0; $i -lt $Lines.Count; $i++) { if ($Lines[$i] -eq '---') { $DelimIdx += $i } }
    if ($DelimIdx.Count -lt 2) { return '' }
    $Front = $Lines[($DelimIdx[0] + 1)..($DelimIdx[1] - 1)]
    $EscapedKey = [regex]::Escape($Key)
    return (($Front | Where-Object { $_ -match "^${EscapedKey}:" } | Select-Object -First 1) -replace "^${EscapedKey}:\s*", '')
}

function Get-FrontmatterDescription([string]$File) {
    $Value = Get-FrontmatterValue $File 'description'
    return $Value
}

function Get-Body([string]$File) {
    $Lines = Get-Content -Encoding UTF8 $File
    $DelimIdx = @(); for ($i = 0; $i -lt $Lines.Count; $i++) { if ($Lines[$i] -eq '---') { $DelimIdx += $i } }
    if ($DelimIdx.Count -lt 2) { return '' }
    return ($Lines[($DelimIdx[1] + 1)..($Lines.Count - 1)]) -join "`n"
}

function Get-SkillDirs { Get-ChildItem -Path (Join-Path $Root 'plugins') -Directory | ForEach-Object {
        $S = Join-Path $_.FullName 'skills'
        if (Test-Path $S) { Get-ChildItem -Path $S -Directory }
    } }

function Copy-Skills([string]$Target) {
    New-Item -ItemType Directory -Force -Path $Target | Out-Null
    Get-SkillDirs | ForEach-Object {
        $Dest = Join-Path $Target $_.Name
        if (Test-Path $Dest) { Remove-Item -Recurse -Force $Dest }
        Copy-Item -Recurse -Path $_.FullName -Destination $Dest
        # Plugin-weite Doku in die references/ → jeder Skill selbsttragend
        $PluginRoot = Split-Path (Split-Path $_.FullName -Parent) -Parent
        $PluginDocs = Join-Path $PluginRoot 'docs'
        if (Test-Path $PluginDocs) {
            $Refs = Join-Path $Dest 'references'
            New-Item -ItemType Directory -Force -Path $Refs | Out-Null
            Copy-Item -Recurse -Force -Path (Join-Path $PluginDocs '*') -Destination $Refs
        }
        # Rollen-Prompts als Fallback mitliefern, falls Codex keinen benannten
        # Custom Agent auswählen kann. Quelle bleiben plugins/<plugin>/agents/*.md.
        $PluginAgents = Join-Path $PluginRoot 'agents'
        if (Test-Path $PluginAgents) {
            $RoleRefs = Join-Path $Dest 'references\roles'
            New-Item -ItemType Directory -Force -Path $RoleRefs | Out-Null
            Copy-Item -Force -Path (Join-Path $PluginAgents '*.md') -Destination $RoleRefs
        }
        Write-Host "  - $($_.Name)"
    }
}

function Copy-Roles([string]$Target) {
    New-Item -ItemType Directory -Force -Path $Target | Out-Null
    Get-ChildItem -Path (Join-Path $Root 'plugins') -Directory | ForEach-Object {
        $A = Join-Path $_.FullName 'agents'
        if (Test-Path $A) { Copy-Item -Force -Path (Join-Path $A '*.md') -Destination $Target }
    }
}

function Write-AgentsMdBlock([string]$Proj) {
    $File = Join-Path $Proj 'AGENTS.md'
    $Start = '<!-- buedominic-skills:start -->'; $End = '<!-- buedominic-skills:end -->'
    $Kept = @()
    if (Test-Path $File) {
        $Skip = $false
        foreach ($L in (Get-Content $File)) {
            if ($L -eq $Start) { $Skip = $true }
            if (-not $Skip) { $Kept += $L }
            if ($L -eq $End) { $Skip = $false }
        }
    }
    $Block = @($Start,
        '## Agent-Skills (buedominic/skills — Block wird vom Installer verwaltet)', '',
        'Wiederverwendbare Workflows unter `.agents/skills/`. Passt eine Aufgabe',
        'zur Beschreibung unten, lies ZUERST die jeweilige SKILL.md (inklusive',
        'ihrer references/) und befolge sie. Subagenten-Rollen liegen als Prompts',
        'unter `.agents/roles/` — in einem frischen Kontext verwenden.',
        'Claude-spezifische Tool-Namen übersetzt `.agents/portabilitaet.md`.',
        'Regel ohne Hook-Unterstützung: Source-Edits nur auf feature/-Branches.', '',
        '| Skill | Wann |', '|---|---|')
    Get-SkillDirs | ForEach-Object {
        $Desc = (Get-FrontmatterDescription (Join-Path $_.FullName 'SKILL.md')) -replace '\. .*', '.'
        $Block += "| ``.agents/skills/$($_.Name)/SKILL.md`` | $Desc |"
    }
    $Block += $End
    Set-Content -Path $File -Value (($Kept + $Block) -join "`n") -Encoding UTF8
}

function Install-Neutral([string]$Proj) {
    Write-Host "Skills → $Proj\.agents\skills:"
    Copy-Skills (Join-Path $Proj '.agents\skills')
    Copy-Roles (Join-Path $Proj '.agents\roles')
    Copy-Item -Force -Path (Join-Path $Root 'docs\portabilitaet.md') -Destination (Join-Path $Proj '.agents\portabilitaet.md')
    Write-AgentsMdBlock $Proj
    Write-Host 'AGENTS.md-Block aktualisiert.'
}

switch ($Client) {
    'claude' {
        $Settings = Join-Path $Path '.claude\settings.json'
        $Template = Join-Path $Root 'templates\claude-settings.example.json'
        if ((Test-Path $Settings) -and (Select-String -Path $Settings -Pattern 'buedominic-skills' -Quiet)) {
            Write-Host "$Settings referenziert buedominic-skills bereits — nichts zu tun."
        }
        elseif (Test-Path $Settings) {
            Write-Host "$Settings existiert bereits. Folgende Keys auf oberster Ebene"
            Write-Host 'manuell zusammenführen (Vorlage: templates\claude-settings.example.json):'
            Write-Host ''
            Get-Content $Template | Write-Host
            exit 1
        }
        else {
            New-Item -ItemType Directory -Force -Path (Join-Path $Path '.claude') | Out-Null
            Copy-Item -Path $Template -Destination $Settings
            Write-Host "→ $Settings geschrieben."
        }
        Write-Host ''
        Write-Host 'Datei ins Projekt-Repo committen — Claude Code registriert den'
        Write-Host 'Marketplace und installiert die Plugins dann bei jedem Session-Start'
        Write-Host 'automatisch, auch in flüchtigen Cloud-/Web-Containern.'
    }
    'claude-copy' {
        Write-Host "Skills → $Path\.claude\skills:"
        Copy-Skills (Join-Path $Path '.claude\skills')
        Copy-Roles (Join-Path $Path '.claude\agents')
        Write-Host "Agents → $Path\.claude\agents"
        Write-Host ''
        Write-Host 'Ins Projekt-Repo committen — die Kopien sind Teil des Klons und laden'
        Write-Host 'in jeder Session (auch Cloud/Web, auch ohne Netzzugriff). Nicht'
        Write-Host 'enthalten: Hooks des feature-workflow-Plugins (nur über die'
        Write-Host 'Plugin-Route bzw. plugins/feature-workflow/templates/).'
        Write-Host 'Update = Repo pullen, Script erneut ausführen.'
    }
    'codex' {
        $SkTarget = if ($Project) { Join-Path (Get-Location) '.agents\skills' } else { Join-Path $HOME '.agents\skills' }
        $AgTarget = if ($Project) { Join-Path (Get-Location) '.codex\agents' } else { Join-Path $HOME '.codex\agents' }
        Write-Host "Skills → ${SkTarget}:"
        Copy-Skills $SkTarget
        New-Item -ItemType Directory -Force -Path $AgTarget | Out-Null
        Get-ChildItem -Path (Join-Path $Root 'plugins') -Directory | ForEach-Object {
            $A = Join-Path $_.FullName 'agents'
            if (-not (Test-Path $A)) { return }
            Get-ChildItem -Path $A -Filter '*.md' | ForEach-Object {
                $Name = $_.BaseName
                $Desc = (Get-FrontmatterDescription $_.FullName) -replace '\\', '\\' -replace '"', '\"'
                $Body = (Get-Body $_.FullName) -replace '\\', '\\' -replace '"""', '\"\"\"'
                $Toml = @(
                    "# Generiert aus plugins/.../agents/$Name.md — Quelle dort ändern, Script erneut ausführen.",
                    ('name = "{0}"' -f $Name),
                    ('description = "{0}"' -f $Desc)
                )
                $Disallowed = Get-FrontmatterValue $_.FullName 'disallowedTools'
                if ($Disallowed -match 'Edit|Write|MultiEdit|NotebookEdit') {
                    $Toml += 'sandbox_mode = "read-only"'
                }
                $Model = Get-FrontmatterValue $_.FullName 'model'
                if ($Model -and $Model -ne 'inherit') { $Toml += ('model = "{0}"' -f $Model) }
                $Toml += @('developer_instructions = """', $Body, '"""')
                $Toml = $Toml -join "`n"
                Set-Content -Path (Join-Path $AgTarget "$Name.toml") -Value $Toml -Encoding UTF8
            }
        }
        Write-Host "Codex-Agenten → $AgTarget"
        Write-Host 'Neue Codex-Session starten (bzw. /skills prüfen).'
    }
    'cursor' {
        Install-Neutral $Path
        $Rules = Join-Path $Path '.cursor\rules'
        New-Item -ItemType Directory -Force -Path $Rules | Out-Null
        Get-SkillDirs | ForEach-Object {
            $Desc = Get-FrontmatterDescription (Join-Path $_.FullName 'SKILL.md')
            $Mdc = @('---', "description: $Desc", 'alwaysApply: false', '---', '',
                "Folge dem Workflow in ``.agents/skills/$($_.Name)/SKILL.md`` (inklusive",
                'seiner `references/`). Claude-spezifische Tool-Namen übersetzt',
                '`.agents/portabilitaet.md`. Subagenten-Rollen: `.agents/roles/`.') -join "`n"
            Set-Content -Path (Join-Path $Rules "$($_.Name).mdc") -Value $Mdc -Encoding UTF8
        }
        Write-Host "Cursor-Rules (Agent-Requested) → $Rules"
    }
    'copilot' {
        Install-Neutral $Path
        $Prompts = Join-Path $Path '.github\prompts'
        New-Item -ItemType Directory -Force -Path $Prompts | Out-Null
        Get-SkillDirs | ForEach-Object {
            $Desc = Get-FrontmatterDescription (Join-Path $_.FullName 'SKILL.md')
            $Prompt = @('---', "description: $Desc", '---', '',
                "Folge dem Workflow in ``.agents/skills/$($_.Name)/SKILL.md`` (inklusive",
                'seiner `references/`). Claude-spezifische Tool-Namen übersetzt',
                '`.agents/portabilitaet.md`. Subagenten-Rollen: `.agents/roles/`.') -join "`n"
            Set-Content -Path (Join-Path $Prompts "$($_.Name).prompt.md") -Value $Prompt -Encoding UTF8
        }
        Write-Host "Copilot-Prompts (/name im Chat) → $Prompts"
        Write-Host 'Copilot Coding Agent liest zusätzlich den AGENTS.md-Block.'
    }
    'agents' {
        Install-Neutral $Path
        Write-Host 'Jeder Client, der AGENTS.md liest, findet die Skills darüber.'
    }
}
