<?php
require_once 'db.php';
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Dashboard</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a class="logo" href="index.html">Malaika</a>
      <nav class="nav">
        <ul>
          <li><a href="dashboard.php" class="active">Dashboard</a></li>
          <li><a href="add_item.php">Add Item</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <div class="container">
    <h2>Items Dashboard</h2>
    <div class="top-actions" style="display:flex;gap:12px;align-items:center;margin-top:12px;">
      <a href="add_item.php" class="btn">+ Add New</a>
      <input id="searchInput" class="search" placeholder="Search by title..." oninput="loadItems(this.value)" style="padding:8px;border-radius:8px;border:1px solid #ddd;">
      <div id="statusMessage" style="margin-left:auto;"></div>
    </div>

    <div id="itemsContainer"></div>
  </div>

  <script src="script.js"></script>
  <script>document.addEventListener('DOMContentLoaded', () => loadItems());</script>
</body>
</html>
