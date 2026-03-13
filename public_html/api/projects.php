<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../../private_data/project_db.php';

$stmt = $pdo->query(
    'SELECT id, name, slug, tags, description_short, status, updated FROM projects'
);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

require_once __DIR__ . '/utilities.php';

$ss_stmt = $pdo->prepare(
    'SELECT url, label FROM screenshots WHERE project_id = ? ORDER BY sort_order LIMIT 3'
);

foreach ($rows as &$row) {
    $ss_stmt->execute([$row['id']]);
    $screenshots = $ss_stmt->fetchAll(PDO::FETCH_ASSOC);
    $row['screenshots'] = array_map(fn($ss) => [
        'url' => $ss['url'],
        'label' => $ss['label'],
        'thumbnail_url' => thumbnailUrl($ss['url'])
    ], $screenshots);
}

echo json_encode($rows);
