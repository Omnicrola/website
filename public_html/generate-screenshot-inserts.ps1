# generate-screenshot-inserts.ps1
# Scans a directory (non-recursive) for image files and generates MySQL INSERT
# statements for the screenshots table. Output is written to a .sql file named
# after the target directory with the current date and time appended.
#
# Usage:
#   .\generate-screenshot-inserts.ps1 -Directory "images\projects\myproject" -ProjectId 7
#   .\generate-screenshot-inserts.ps1 -Directory "images\projects\myproject" -ProjectId 7 -UrlPrefix "myproject"
#
# Parameters:
#   -Directory   Path to the directory to scan (required)
#   -ProjectId   The project_id value to use in INSERT statements (required)
#   -UrlPrefix   Prefix for the url column, e.g. "myproject" -> "myproject/image.jpg"
#                Defaults to the directory's folder name
#   -OutputDir   Where to write the .sql file. Defaults to the script directory.

param(
    [Parameter(Mandatory=$true)]
    [string]$Directory,

    [Parameter(Mandatory=$true)]
    [int]$ProjectId,

    [string]$UrlPrefix = "",

    [string]$OutputDir = ""
)

if (-not $OutputDir) {
    $OutputDir = if ($PSScriptRoot) { $PSScriptRoot } else { $PWD.Path }
}

$imageExtensions = @(".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".heic")

# Resolve the directory to an absolute path
$Directory = Resolve-Path $Directory -ErrorAction Stop

# Default UrlPrefix to the folder name of the target directory
if (-not $UrlPrefix) {
    $UrlPrefix = Split-Path $Directory -Leaf
}

# Collect image files (no recursion, skip thumbnail subdir just in case)
$images = Get-ChildItem -Path $Directory -File |
    Where-Object { $imageExtensions -contains $_.Extension.ToLower() } |
    Sort-Object Name

if ($images.Count -eq 0) {
    Write-Warning "No image files found in: $Directory"
    exit 1
}

# Build INSERT statements
$lines = @()
$lines += "-- Screenshots for project_id = $ProjectId"
$lines += "-- Source directory: $Directory"
$lines += "-- Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$lines += ""

$sortOrder = 1
foreach ($img in $images) {
    $url = "$UrlPrefix/$($img.Name)"
    # Escape single quotes in the url and label for SQL safety
    $urlEscaped = $url -replace "'", "''"
    $lines += "INSERT INTO screenshots (project_id, url, label, sort_order) VALUES ($ProjectId, '$urlEscaped', '', $sortOrder);"
    $sortOrder++
}

# Build output filename: {foldername}_{yyyyMMdd_HHmmss}.sql
$folderName = Split-Path $Directory -Leaf
$timestamp  = Get-Date -Format "yyyyMMdd_HHmmss"
$outputFile = Join-Path $OutputDir "${folderName}_${timestamp}.sql"

$lines | Set-Content -Path $outputFile -Encoding UTF8

Write-Host "Generated $($images.Count) INSERT statement(s) -> $outputFile"
