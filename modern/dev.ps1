param([ValidateRange(1,65535)][int]$Port = 3000)
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCommand) {
    $runtimeDirectory = Split-Path -Parent $nodeCommand.Source
} else {
    $toolsDirectory = Join-Path (Split-Path -Parent $PSScriptRoot) '.tools'
    $portableRuntime = Get-ChildItem -LiteralPath $toolsDirectory -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -like 'node-v*-win-x64' -and (Test-Path -LiteralPath (Join-Path $_.FullName 'node.exe')) } |
        Sort-Object Name -Descending | Select-Object -First 1
    if (-not $portableRuntime) { throw 'Install Node.js LTS from https://nodejs.org, reopen your terminal, then run this command again.' }
    $runtimeDirectory = $portableRuntime.FullName
}
$env:Path = $runtimeDirectory + ';' + $env:Path
$npmCommand = Join-Path $runtimeDirectory 'npm.cmd'
if (-not (Test-Path -LiteralPath $npmCommand)) { throw 'npm.cmd was not found beside Node.js. Install Node.js LTS with npm.' }
if (-not (Test-Path -LiteralPath 'node_modules/next/package.json')) {
    & $npmCommand ci
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}
& $npmCommand run dev -- --port $Port
exit $LASTEXITCODE
