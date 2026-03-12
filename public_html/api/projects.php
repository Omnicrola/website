<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../../private_data/project_db.php';

$stmt = $pdo->query(
    'SELECT id, name, slug, tags, description_short FROM projects'
);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($rows);
