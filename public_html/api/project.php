<?php
header('Content-Type: application/json');

if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    http_response_code(404);
    echo json_encode(['error' => 'Missing or invalid id parameter']);
    exit;
}

$id = (int) $_GET['id'];

require_once __DIR__ . '/../../private_data/project_db.php';

$stmt = $pdo->prepare(
    'SELECT id, slug, name, status, updated, description_short, description_long, github_link, youtube_link, play_link, tags FROM projects WHERE id = ? LIMIT 1'
);
$stmt->execute([$id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$row) {
    http_response_code(404);
    echo json_encode(['error' => 'Project not found']);
    exit;
}

$ss_stmt = $pdo->prepare(
    'SELECT ss_id, url, label FROM screenshots WHERE project_id = ?'
);
$ss_stmt->execute([$id]);
$row['screenshots'] = $ss_stmt->fetchAll(PDO::FETCH_ASSOC);
$row['description_long'] = array_values(array_filter(preg_split('/\r\n|\r|\n/', $row['description_long'])));

echo json_encode($row);
