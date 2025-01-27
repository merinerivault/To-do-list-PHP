<?php
require 'db.php';
session_start();

if (!isset($_SESSION['username'])) {
    die("Vous devez être connecté.");
}

// Ajout de tâche
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $task = $_POST['task'];
    $stmt = $pdo->prepare("INSERT INTO tasks (username, task) VALUES (?, ?)");
    $stmt->execute([$_SESSION['username'], $task]);
    echo "Tâche ajoutée.";
}

// Récupération des tâches
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->prepare("SELECT * FROM tasks WHERE username = ?");
    $stmt->execute([$_SESSION['username']]);
    $tasks = $stmt->fetchAll();
    echo json_encode($tasks);
}
?>
