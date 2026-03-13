<?php
header('Content-Type: application/json');

if (!isset($_GET['id'])) {
    http_response_code(404);
    echo json_encode(['error' => 'Missing or invalid id parameter']);
    exit;
}

$slug = trim($_GET['id']);

if ($slug === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Missing or invalid id parameter']);
    exit;
}

require_once __DIR__ . '/../../private_data/project_db.php';

$stmt = $pdo->prepare(
    'SELECT id, slug, name, status, updated, description_short, description_long, github_link, youtube_link, play_link, tags FROM projects WHERE slug = ? LIMIT 1'
);
$stmt->execute([$slug]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$row) {
    http_response_code(404);
    echo json_encode(['error' => 'Project not found']);
    exit;
}

require_once __DIR__ . '/utilities.php';

$ss_stmt = $pdo->prepare(
    'SELECT ss_id, url, label FROM screenshots WHERE project_id = ? ORDER BY sort_order'
);
$ss_stmt->execute([$row['id']]);
$screenshots = $ss_stmt->fetchAll(PDO::FETCH_ASSOC);
$row['screenshots'] = array_map(fn($ss) => array_merge($ss, [
    'thumbnail_url' => thumbnailUrl($ss['url'])
]), $screenshots);
$row['description_long'] = array_values(array_filter(preg_split('/\r\n|\r|\n/', $row['description_long'])));

echo json_encode($row);
