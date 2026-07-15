$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent $PSScriptRoot
$SkillRoot = Join-Path $RepoRoot 'plugins\feature-workflow\skills\spec-to-implementation'

function Assert-True([bool]$Condition, [string]$Message) {
    if (-not $Condition) { throw $Message }
}

$skill = Get-Content -Raw -Encoding UTF8 (Join-Path $SkillRoot 'SKILL.md')
Assert-True ($skill -match '^---\r?\nname: spec-to-implementation\r?\ndescription: .+\r?\n---') 'Invalid SKILL.md frontmatter.'
Assert-True ($skill -notmatch '(?m)^description:.*[<>]') 'Description contains forbidden angle brackets.'
Assert-True ($skill -match '\.superpowers/sdd/progress\.md') 'Progress ledger contract is missing.'
Assert-True ($skill -match 'references/codex-runtime\.md') 'Codex runtime contract is not routed from SKILL.md.'
Assert-True ($skill -match 'target=task') 'Per-task review dispatch is missing.'

$runtime = Get-Content -Raw -Encoding UTF8 (Join-Path $SkillRoot 'references\codex-runtime.md')
Assert-True ($runtime -match 'drei Rollen-Threads') 'Thread budget is missing.'
Assert-True ($runtime -match 'EMPTY_RESULT') 'Empty-result handling is missing.'
Assert-True ($runtime -match 'wiederverwenden') 'Thread reuse fallback is missing.'

$ledger = Get-Content -Raw -Encoding UTF8 (Join-Path $SkillRoot 'references\progress-ledger.md')
Assert-True ($ledger -match 'Task N: complete \(commits <base7>\.\.<head7>, review clean\)') 'Superpowers-compatible completion format is missing.'

$testRoot = Join-Path ([System.IO.Path]::GetTempPath()) ('feature-workflow-test-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $testRoot | Out-Null

try {
    Push-Location $testRoot
    & (Join-Path $RepoRoot 'install.ps1') codex -Project

    $installedSkill = '.agents\skills\spec-to-implementation'
    Assert-True (Test-Path (Join-Path $installedSkill 'SKILL.md')) 'Codex skill was not installed under .agents/skills.'
    Assert-True (Test-Path (Join-Path $installedSkill 'agents\openai.yaml')) 'Codex openai.yaml metadata is missing.'
    Assert-True (Test-Path (Join-Path $installedSkill 'references\roles\implementer.md')) 'Bundled role fallback is missing.'

    $reviewerToml = Get-Content -Raw -Encoding UTF8 '.codex\agents\spec-reviewer.toml'
    $implementerToml = Get-Content -Raw -Encoding UTF8 '.codex\agents\implementer.toml'
    Assert-True ($reviewerToml -match 'sandbox_mode = "read-only"') 'Reviewer is not read-only in Codex.'
    Assert-True ($implementerToml -notmatch 'sandbox_mode = "read-only"') 'Implementer was incorrectly made read-only.'

    python -c "import pathlib,tomllib; [tomllib.loads(p.read_text(encoding='utf-8-sig')) for p in pathlib.Path('.codex/agents').glob('*.toml')]"
    Assert-True ($LASTEXITCODE -eq 0) 'Generated Codex agent TOML is invalid.'
}
finally {
    Pop-Location -ErrorAction SilentlyContinue
    $resolved = [System.IO.Path]::GetFullPath($testRoot)
    $temp = [System.IO.Path]::GetFullPath([System.IO.Path]::GetTempPath())
    Assert-True ($resolved.StartsWith($temp, [System.StringComparison]::OrdinalIgnoreCase)) "Unsafe cleanup path: $resolved"
    Remove-Item -LiteralPath $resolved -Recurse -Force
}

Write-Output 'feature-workflow validation passed'
