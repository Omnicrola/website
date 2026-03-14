<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../../private_data/project_db.php';
require_once __DIR__ . '/utilities.php';

// ?random_screenshots=N — return N random screenshots from all projects
if (isset($_GET['random_screenshots']) && is_numeric($_GET['random_screenshots'])) {
    $count = max(1, (int)$_GET['random_screenshots']);
    $stmt = $pdo->query(
        "SELECT url, label FROM (
            SELECT url, label,
                   ROW_NUMBER() OVER (PARTITION BY project_id ORDER BY RAND()) AS rn
            FROM screenshots
        ) ranked
        WHERE rn = 1
        ORDER BY RAND()
        LIMIT $count"
    );
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(array_map(fn($ss) => [
        'url'           => $ss['url'],
        'label'         => $ss['label'],
        'thumbnail_url' => thumbnailUrl($ss['url'])
    ], $rows));
    exit;
}

// ?limit=N — return the N most recently updated projects
$limit = isset($_GET['limit']) && is_numeric($_GET['limit']) ? max(1, (int)$_GET['limit']) : null;

if ($limit !== null) {
    $stmt = $pdo->query(
        "SELECT id, name, slug, tags, description_short, status, updated FROM projects ORDER BY updated DESC LIMIT $limit"
    );
} else {
    $stmt = $pdo->query(
        'SELECT id, name, slug, tags, description_short, status, updated FROM projects ORDER BY updated DESC'
    );
}
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

$ss_stmt = $pdo->prepare(
    'SELECT url, label FROM screenshots WHERE project_id = ? ORDER BY sort_order LIMIT 3'
);

foreach ($rows as &$row) {
    $ss_stmt->execute([$row['id']]);
    $screenshots = $ss_stmt->fetchAll(PDO::FETCH_ASSOC);
    $row['screenshots'] = array_map(fn($ss) => [
        'url'           => $ss['url'],
        'label'         => $ss['label'],
        'thumbnail_url' => thumbnailUrl($ss['url'])
    ], $screenshots);
}

echo json_encode($rows);
