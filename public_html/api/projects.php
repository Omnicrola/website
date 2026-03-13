<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../../private_data/project_db.php';

$stmt = $pdo->query(
    'SELECT id, name, slug, tags, description_short, status, updated FROM projects'
);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

$ss_stmt = $pdo->prepare(
    'SELECT url FROM screenshots WHERE project_id = ? ORDER BY ss_id LIMIT 3'
);

foreach ($rows as &$row) {
    $ss_stmt->execute([$row['id']]);
    $row['screenshots'] = $ss_stmt->fetchAll(PDO::FETCH_COLUMN);
}

echo json_encode($rows);
