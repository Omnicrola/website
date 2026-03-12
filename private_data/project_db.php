<?php
$host = 'localhost';
$db   = 'omnicro_projects';
$user = 'YOUR_DB_USER';
$pass = 'YOUR_DB_PASS';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
} catch (PDOException $e) {
    http_response_code(503);
    echo json_encode(['error' => 'Database unavailable']);
    exit;
}
