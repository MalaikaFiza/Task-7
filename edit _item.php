<?php
require_once 'db.php';
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) {
    header('Location: dashboard.php');
    exit;
}
$stmt = $conn->prepare("SELECT id, title, description FROM items WHERE id = ?");
$stmt->bind_param('i', $id);
$stmt->execute();
$res = $stmt->get_result();
$item = $res->fetch_assoc();
$stmt->close();
if (!$item) {
    header('Location: dashboard.php');
    exit;
}
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Edit Item</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a class="logo" href="index.html">Malaika</a>
    </div>
  </header>

  <div class="container">
    <h2>Edit Item</h2>
    <form action="update_item_backend.php" method="POST" novalidate>
      <input type="hidden" name="id" value="<?= htmlspecialchars($item['id']) ?>">
      <input name="title" type="text" maxlength="255" value="<?= htmlspecialchars($item['title']) ?>" required>
      <textarea name="description" rows="6" required><?= htmlspecialchars($item['description']) ?></textarea>
      <div style="margin-top:10px;">
        <button class="btn" type="submit">Save Changes</button>
        <a href="dashboard.php" class="btn ghost">Cancel</a>
      </div>
    </form>
  </div>
</body>
</html>
