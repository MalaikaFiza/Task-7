<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db.php';

$sql = "SELECT id, title, description, created_at FROM items ORDER BY created_at DESC";
$result = $conn->query($sql);

$items = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $items[] = $row;
    }
}
echo json_encode(['items' => $items]);
