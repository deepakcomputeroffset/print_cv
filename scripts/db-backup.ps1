# ============================================
# PostgreSQL Database Backup Script
# ============================================
# Usage: .\scripts\db-backup.ps1
# Reads DATABASE_URL from .env file automatically
# ============================================

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
# Format: postgresql://user:password@host:port/database?params
if ($dbUrl -match "postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/([^?]+)") {
    $pgUser = $Matches[1]
    $pgPass = $Matches[2]
    $pgHost = $Matches[3]
    $pgPort = $Matches[4]
    $pgDb   = $Matches[5]
} else {
    Write-Host "ERROR: Could not parse DATABASE_URL" -ForegroundColor Red
    Write-Host "Expected format: postgresql://user:password@host:port/database" -ForegroundColor Yellow
    exit 1
}

# Create backups directory
$backupDir = Join-Path $PSScriptRoot "../backups"
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

# Generate filename with timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupFile = Join-Path $backupDir "backup_${pgDb}_${timestamp}.sql"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host " PostgreSQL Database Backup" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Database : $pgDb" -ForegroundColor White
Write-Host "Host     : ${pgHost}:${pgPort}" -ForegroundColor White
Write-Host "User     : $pgUser" -ForegroundColor White
Write-Host "Output   : $backupFile" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan

# Set password env var for pg_dump
$env:PGPASSWORD = $pgPass

# Auto-detect pg_dump if not on PATH
$pgDump = "pg_dump"
if (-not (Get-Command pg_dump -ErrorAction SilentlyContinue)) {
    $found = Get-ChildItem "C:\Program Files\PostgreSQL" -Recurse -Filter "pg_dump.exe" -ErrorAction SilentlyContinue |
        Where-Object { $_.DirectoryName -match "\\bin$" } |
        Select-Object -First 1 -ExpandProperty FullName
    if ($found) {
        $pgDump = $found
        Write-Host "Found pg_dump at: $found" -ForegroundColor Yellow
    }
}

# Run pg_dump
try {
    & $pgDump -h $pgHost -p $pgPort -U $pgUser -d $pgDb -F p -f $backupFile --no-owner --no-acl --verbose 2>&1 | ForEach-Object {
        if ($_ -match "error|fatal" ) {
            Write-Host $_ -ForegroundColor Red
        }
    }

    if ($LASTEXITCODE -eq 0) {
        $fileSize = (Get-Item $backupFile).Length / 1MB
        Write-Host ""
        Write-Host "Backup completed successfully!" -ForegroundColor Green
        Write-Host "File: $backupFile" -ForegroundColor Green
        Write-Host "Size: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Green
    } else {
        Write-Host "Backup failed with exit code: $LASTEXITCODE" -ForegroundColor Red
    }
} catch {
    Write-Host "ERROR: pg_dump not found. Install PostgreSQL client tools." -ForegroundColor Red
    Write-Host "  winget install PostgreSQL.PostgreSQL" -ForegroundColor Yellow
} finally {
    # Clear password from env
    Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
}
