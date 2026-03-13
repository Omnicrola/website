<?php

function thumbnailUrl($url) {
    $lastSlash = strrpos($url, '/');
    $dir = $lastSlash !== false ? substr($url, 0, $lastSlash) : '';
    $filename = $lastSlash !== false ? substr($url, $lastSlash + 1) : $url;
    $lastDot = strrpos($filename, '.');
    $baseName = $lastDot !== false ? substr($filename, 0, $lastDot) : $filename;
    return ($dir ? $dir . '/thumbnail' : 'thumbnail') . '/' . $baseName . '-thumb.jpg';
}
