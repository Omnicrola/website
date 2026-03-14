# conform-images.ps1
# Recursively scans a directory for images and:
#   1. Converts any HEIC files to JPG in-place (original HEIC is kept).
#   2. Resizes any image that exceeds a maximum dimension while preserving aspect ratio.
# Thumbnail subdirectories are skipped.
# HEIC conversion requires ImageMagick (magick). Resizing uses .NET System.Drawing.
#
# Usage:
#   .\conform-images.ps1
#   .\conform-images.ps1 -ImagesPath "images\projects\myproject" -MaxSize 2000

param(
    [string]$ImagesPath = "$PSScriptRoot\images",
    [int]$MaxSize = 2048
)

Add-Type -AssemblyName System.Drawing

$magickAvailable  = $null -ne (Get-Command magick -ErrorAction SilentlyContinue)
$imageExtensions  = @(".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp")

function Convert-HeicToJpg {
    param([string]$SourcePath)

    $destPath = [System.IO.Path]::ChangeExtension($SourcePath, ".jpg")

    if (Test-Path $destPath) {
        Write-Host "  Skipping HEIC (JPG already exists): $(Split-Path $SourcePath -Leaf)"
        return
    }

    Write-Host "  Converting HEIC: $(Split-Path $SourcePath -Leaf) -> $(Split-Path $destPath -Leaf)"
    & magick $SourcePath $destPath
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "  Failed to convert: $SourcePath"
    }
}

function Resize-Image {
    param(
        [string]$FilePath,
        [int]$MaxDimension
    )

    $image = [System.Drawing.Image]::FromFile($FilePath)
    try {
        $w = $image.Width
        $h = $image.Height

        if ($w -le $MaxDimension -and $h -le $MaxDimension) {
            return $false  # no resize needed
        }

        $scale = [Math]::Min($MaxDimension / $w, $MaxDimension / $h)
        $newW  = [int]($w * $scale)
        $newH  = [int]($h * $scale)

        $resized  = New-Object System.Drawing.Bitmap($newW, $newH)
        $graphics = [System.Drawing.Graphics]::FromImage($resized)
        try {
            $graphics.InterpolationMode    = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $graphics.SmoothingMode        = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
            $graphics.PixelOffsetMode      = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
            $graphics.CompositingQuality   = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
            $graphics.DrawImage($image, 0, 0, $newW, $newH)

            # Save to temp file first so we don't corrupt the original on failure
            $tmpPath = $FilePath + ".tmp"
            $ext     = [System.IO.Path]::GetExtension($FilePath).ToLower()

            if ($ext -eq ".jpg" -or $ext -eq ".jpeg") {
                $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
                $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
                    [System.Drawing.Imaging.Encoder]::Quality, 90L
                )
                $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
                    Where-Object { $_.MimeType -eq "image/jpeg" } |
                    Select-Object -First 1
                $resized.Save($tmpPath, $codec, $encoderParams)
            } else {
                $resized.Save($tmpPath, $image.RawFormat)
            }
        } finally {
            $graphics.Dispose()
            $resized.Dispose()
        }

        # Release original file handle before overwriting
        $image.Dispose()
        $image = $null

        Move-Item -Path $tmpPath -Destination $FilePath -Force
        return $true

    } finally {
        if ($null -ne $image) { $image.Dispose() }
    }
}

$ImagesPath = Resolve-Path $ImagesPath -ErrorAction Stop

# Convert HEIC images to JPG (requires ImageMagick)
if ($magickAvailable) {
    $heicFiles = Get-ChildItem -Path $ImagesPath -Recurse -File |
        Where-Object { $_.Extension.ToLower() -eq ".heic" -and $_.DirectoryName -notmatch '\\thumbnail(\\|$)' }

    if ($heicFiles) {
        Write-Host "`nConverting HEIC images..."
        foreach ($heic in $heicFiles) {
            Convert-HeicToJpg -SourcePath $heic.FullName
        }
    }
} else {
    Write-Warning "ImageMagick (magick) not found - skipping HEIC conversion. Install from https://imagemagick.org"
}

$allImages = Get-ChildItem -Path $ImagesPath -Recurse -File |
    Where-Object {
        $imageExtensions -contains $_.Extension.ToLower() -and
        $_.DirectoryName -notmatch '\\thumbnail(\\|$)'
    }

if ($allImages.Count -eq 0) {
    Write-Warning "No image files found in: $ImagesPath"
    exit 0
}

$resized = 0
$skipped = 0

foreach ($img in $allImages) {
    $relative = $img.FullName.Substring(([string]$ImagesPath).Length + 1)
    $wasResized = Resize-Image -FilePath $img.FullName -MaxDimension $MaxSize
    if ($wasResized) {
        Write-Host "  Resized: $relative"
        $resized++
    } else {
        Write-Host "  OK (within bounds): $relative"
        $skipped++
    }
}

Write-Host "`nDone. $resized image(s) resized, $skipped already within ${MaxSize}px."
