# fix-env.ps1
# This script repairs the system PATH to include Node.js and npm

$nodePath = "C:\Program Files\nodejs"
$errorActionPreference = "SilentlyContinue"

if (-not (Test-Path $nodePath)) {
    Write-Host "Error: Node.js installation not found at $nodePath" -ForegroundColor Red
    return
}

Write-Host "Found Node.js at $nodePath. Updating PATH..." -ForegroundColor Cyan

# Update current session PATH
$env:PATH = "$nodePath;" + $env:PATH

# Update Permanent User PATH
$oldPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($oldPath -notlike "*$nodePath*") {
    $newPath = "$nodePath;" + $oldPath
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    Write-Host "Permanent User PATH updated. Please restart your terminal/IDE for changes to take effect." -ForegroundColor Green
} else {
    Write-Host "Node.js is already in your permanent User PATH." -ForegroundColor Yellow
}

# Verify
Write-Host "`nVerification:" -ForegroundColor Cyan
& node -v
& npm -v

Write-Host "`nEnvironment fixed! If 'npm' still doesn't work in other windows, please RESTART VS Code." -ForegroundColor Green
