# generate-thumbnails.ps1
# Scans all images in /images/projects and creates 500px-wide thumbnails
# in a "thumbnails" subfolder within each directory containing images.

param(
    [string]$ProjectsPath = "$PSScriptRoot\images\projects"
)

Add-Type -AssemblyName System.Drawing

$thumbnailWidth = 500
$imageExtensions = @(".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp")

function New-Thumbnail {
    param(
        [string]$SourcePath,
        [string]$DestPath,
        [int]$Width
    )

    $image = [System.Drawing.Image]::FromFile($SourcePath)
    try {
        $aspectRatio = $image.Height / $image.Width
        $newHeight = [int]($Width * $aspectRatio)

        $thumbnail = New-Object System.Drawing.Bitmap($Width, $newHeight)
        $graphics = [System.Drawing.Graphics]::FromImage($thumbnail)
        try {
            $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
            $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
            $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
            $graphics.DrawImage($image, 0, 0, $Width, $newHeight)

            $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
            $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
                [System.Drawing.Imaging.Encoder]::Quality, 85L
            )
            $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
                Where-Object { $_.MimeType -eq "image/jpeg" } |
                Select-Object -First 1
            $thumbnail.Save($DestPath, $jpegCodec, $encoderParams)
        } finally {
            $graphics.Dispose()
            $thumbnail.Dispose()
        }
    } finally {
        $image.Dispose()
    }
}

# Collect all directories that contain image files (including the root projects dir)
$dirsWithImages = Get-ChildItem -Path $ProjectsPath -Recurse -File |
    Where-Object { $imageExtensions -contains $_.Extension.ToLower() -and $_.DirectoryName -notmatch '\\thumbnail(\\|$)' } |
    Select-Object -ExpandProperty DirectoryName -Unique

foreach ($dir in $dirsWithImages) {
    $thumbDir = Join-Path $dir "thumbnail"

    # Delete existing thumbnails folder if it exists
    if (Test-Path $thumbDir) {
        Write-Host "Removing existing thumbnails folder: $thumbDir"
        Remove-Item -Path $thumbDir -Recurse -Force
    }

    New-Item -ItemType Directory -Path $thumbDir | Out-Null
    Write-Host "Created: $thumbDir"

    $images = Get-ChildItem -Path $dir -File |
        Where-Object { $imageExtensions -contains $_.Extension.ToLower() }

    foreach ($img in $images) {
        $baseName = [System.IO.Path]::GetFileNameWithoutExtension($img.Name)
        $destFile = Join-Path $thumbDir "$baseName-thumb.jpg"

        Write-Host "  Generating thumbnail: $($img.Name) -> $baseName-thumb.jpg"
        New-Thumbnail -SourcePath $img.FullName -DestPath $destFile -Width $thumbnailWidth
    }
}

Write-Host "`nDone. Thumbnails generated at ${thumbnailWidth}px wide."
