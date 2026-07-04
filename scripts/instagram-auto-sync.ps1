# Scheduled Instagram sync: pulls new posts into photography-portfolio,
# refreshes main-portfolio's gallery, and commits the result. Registered
# as the "PortfolioInstagramSync" Windows scheduled task (daily).
#
# No-ops quietly until an Instagram source is configured in
# photography-portfolio (.env.local BEHOLD_FEED_URL or .instagram-token).
#
# Set $Push = $true once deployment is wired to origin.
$Push = $false

$ErrorActionPreference = "Stop"
$repo = Split-Path -Parent $PSScriptRoot
$log = Join-Path $env:LOCALAPPDATA "portfolio-instagram-sync.log"

function Log($message) {
    "$(Get-Date -Format s) $message" | Out-File $log -Append -Encoding utf8
}

$photoSite = Join-Path $repo "photography-portfolio"
$envFile = Join-Path $photoSite ".env.local"
$tokenFile = Join-Path $photoSite ".instagram-token"
$hasFeed = (Test-Path $envFile) -and
    (Select-String -Path $envFile -Pattern "^BEHOLD_FEED_URL=.+" -Quiet)
if (-not $hasFeed -and -not (Test-Path $tokenFile)) {
    Log "no Instagram source configured yet; skipping"
    exit 0
}

try {
    Set-Location $photoSite
    node scripts/sync-instagram.mjs *>> $log
    if ($LASTEXITCODE -ne 0) { throw "sync-instagram failed ($LASTEXITCODE)" }

    Set-Location (Join-Path $repo "main-portfolio")
    node scripts/import-photos.mjs *>> $log
    if ($LASTEXITCODE -ne 0) { throw "import-photos failed ($LASTEXITCODE)" }

    Set-Location $repo
    git add --all -- `
        photography-portfolio/public/photos `
        photography-portfolio/src/lib/photo-manifest.json `
        main-portfolio/public/photos `
        main-portfolio/public/og.jpg `
        main-portfolio/src/lib/photo-manifest.json
    git diff --cached --quiet
    if ($LASTEXITCODE -ne 0) {
        git commit -m "chore: instagram sync $(Get-Date -Format yyyy-MM-dd)"
        Log "committed new photos"
        if ($Push) {
            git push
            Log "pushed"
        }
    }
    else {
        Log "no new posts"
    }
}
catch {
    Log "ERROR: $_"
    exit 1
}
