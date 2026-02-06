# ============================================
# PostgreSQL Database Restore Script
# ============================================
# Usage: .\scripts\db-restore.ps1
#   - Lists available backups and lets you pick one
#   - OR pass a file path directly:
#     .\scripts\db-restore.ps1 -File "backups\backup_railway_2026-02-06_23-40-02.sql"
#
# Restores to LOCAL database from .env (DATABASE_URL)
# ============================================

param(
    [string]$File
)

# Load DATABASE_URL from .env
$envFile = Join-Path $PSScriptRoot "../.env"
if (-not (Test-Path $envFile)) {
    Write-Host "ERROR: .env file not found at $envFile" -ForegroundColor Red
    exit 1
}

$dbUrl = Get-Content $envFile | Where-Object { $_ -match "^DATABASE_URL=" } | ForEach-Object { $_ -replace "^DATABASE_URL=", "" } | ForEach-Object { $_.Trim('"', "'", " ") }

if (-not $dbUrl) {
    Write-Host "ERROR: DATABASE_URL not found in .env" -ForegroundColor Red
    exit 1
}

# Parse the connection string
if ($dbUrl -match "postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/([^?]+)") {
    $pgUser = $Matches[1]
    $pgPass = $Matches[2]
    $pgHost = $Matches[3]
    $pgPort = $Matches[4]
    $pgDb   = $Matches[5]
} else {
    Write-Host "ERROR: Could not parse DATABASE_URL" -ForegroundColor Red
    exit 1
}

# Auto-detect psql if not on PATH
$psqlCmd = "psql"
if (-not (Get-Command psql -ErrorAction SilentlyContinue)) {
    $found = Get-ChildItem "C:\Program Files\PostgreSQL" -Recurse -Filter "psql.exe" -ErrorAction SilentlyContinue |
        Where-Object { $_.DirectoryName -match "\\bin$" } |
        Select-Object -First 1 -ExpandProperty FullName
    if ($found) {
        $psqlCmd = $found
        Write-Host "Found psql at: $found" -ForegroundColor Yellow
    } else {
        Write-Host "ERROR: psql not found. Install PostgreSQL client tools." -ForegroundColor Red
        exit 1
    }
}

# Select backup file
if (-not $File) {
    $backupDir = Join-Path $PSScriptRoot "../backups"
    if (-not (Test-Path $backupDir)) {
        Write-Host "ERROR: No backups/ directory found." -ForegroundColor Red
        exit 1
    }

    $backups = Get-ChildItem $backupDir -Filter "*.sql" | Sort-Object LastWriteTime -Descending
    if ($backups.Count -eq 0) {
        Write-Host "ERROR: No .sql backup files found in backups/" -ForegroundColor Red
        exit 1
    }

    Write-Host ""
    Write-Host "Available backups:" -ForegroundColor Cyan
    Write-Host "-------------------------------------------" -ForegroundColor Gray
    for ($i = 0; $i -lt $backups.Count; $i++) {
        $size = [math]::Round($backups[$i].Length / 1MB, 2)
        $date = $backups[$i].LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss")
        Write-Host "  [$($i + 1)] $($backups[$i].Name)  ($size MB, $date)" -ForegroundColor White
    }
    Write-Host "-------------------------------------------" -ForegroundColor Gray

    $selection = Read-Host "Select backup number (or press Enter for latest)"
    if ([string]::IsNullOrWhiteSpace($selection)) {
        $File = $backups[0].FullName
    } elseif ($selection -match "^\d+$" -and [int]$selection -ge 1 -and [int]$selection -le $backups.Count) {
        $File = $backups[[int]$selection - 1].FullName
    } else {
        Write-Host "Invalid selection." -ForegroundColor Red
        exit 1
    }
}

# Resolve path
$File = Resolve-Path $File -ErrorAction SilentlyContinue
if (-not $File -or -not (Test-Path $File)) {
    Write-Host "ERROR: Backup file not found: $File" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " PostgreSQL Database Restore" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Database : $pgDb" -ForegroundColor White
Write-Host "Host     : ${pgHost}:${pgPort}" -ForegroundColor White
Write-Host "User     : $pgUser" -ForegroundColor White
Write-Host "Backup   : $File" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan

# Confirm
Write-Host ""
Write-Host "WARNING: This will DROP and RECREATE the '$pgDb' database!" -ForegroundColor Red
$confirm = Read-Host "Type 'yes' to continue"
if ($confirm -ne "yes") {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit 0
}

$env:PGPASSWORD = $pgPass

try {
    # Terminate active connections
    Write-Host ""
    Write-Host "Terminating active connections to '$pgDb'..." -ForegroundColor Yellow
    & $psqlCmd -h $pgHost -p $pgPort -U $pgUser -d "postgres" -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$pgDb' AND pid <> pg_backend_pid();" 2>&1 | Out-Null

    # Drop and recreate the database
    Write-Host "Dropping database '$pgDb'..." -ForegroundColor Yellow
    & $psqlCmd -h $pgHost -p $pgPort -U $pgUser -d "postgres" -c "DROP DATABASE IF EXISTS `"$pgDb`";" 2>&1 | Out-Null

    Write-Host "Creating database '$pgDb'..." -ForegroundColor Yellow
    & $psqlCmd -h $pgHost -p $pgPort -U $pgUser -d "postgres" -c "CREATE DATABASE `"$pgDb`";" 2>&1 | Out-Null

    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to create database." -ForegroundColor Red
        exit 1
    }

    # Restore the dump
    Write-Host "Restoring from backup..." -ForegroundColor Yellow
    & $psqlCmd -h $pgHost -p $pgPort -U $pgUser -d $pgDb -f $File -v ON_ERROR_STOP=0 2>&1 | ForEach-Object {
        if ($_ -match "ERROR|FATAL") {
            Write-Host "  $_" -ForegroundColor Red
        }
    }

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "Restore completed successfully!" -ForegroundColor Green
        Write-Host "Database '$pgDb' is ready." -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "Restore finished with warnings (exit code: $LASTEXITCODE)." -ForegroundColor Yellow
        Write-Host "Some non-critical errors may have occurred (e.g. roles, extensions)." -ForegroundColor Yellow
    }
} catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
} finally {
    Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
}
