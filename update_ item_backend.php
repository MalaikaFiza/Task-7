<?php
require_once 'db.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: dashboard.php');
    exit;
}
$id = (int)($_POST['id'] ?? 0);
$title = trim($_POST['title'] ?? '');
$description = trim($_POST['description'] ?? '');

if ($id <= 0 || $title === '' || $description === '') {
    header('Location: edit_item.php?id=' . $id . '&error=1');
    exit;
}

$stmt = $conn->prepare("UPDATE items SET title = ?, description = ? WHERE id = ?");
$stmt->bind_param('ssi', $title, $description, $id);
$stmt->execute();
$stmt->close();

header('Location: dashboard.php?updated=1');
exit;
