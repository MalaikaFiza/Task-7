<?php
require_once 'db.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: dashboard.php');
    exit;
}
$title = trim($_POST['title'] ?? '');
$description = trim($_POST['description'] ?? '');

if ($title === '' || $description === '') {
    // minimal server-side check - you can improve with user feedback page
    header('Location: add_item.php?error=1');
    exit;
}

$stmt = $conn->prepare("INSERT INTO items (title, description) VALUES (?, ?)");
$stmt->bind_param('ss', $title, $description);
$stmt->execute();
$stmt->close();

header('Location: dashboard.php?added=1');
exit;
