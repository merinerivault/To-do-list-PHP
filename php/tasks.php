<?php
require 'db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Non autorisé']);
    exit;
}

$action = $_GET['action'] ?? '';

if ($action === 'read') {
    // Lire les tâches depuis SQL
    $stmt = $pdo->prepare('SELECT * FROM tasks WHERE user_id = ?');
    $stmt->execute([$_SESSION['user_id']]);
    $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($tasks);
    exit;
}

if ($action === 'create') {
    $data = json_decode(file_get_contents('php://input'), true);
    $text = $data['text'] ?? '';
    $completed = $data['completed'] ?? false;

    $stmt = $pdo->prepare('INSERT INTO tasks (user_id, text, completed) VALUES (?, ?, ?)');
    $stmt->execute([$_SESSION['user_id'], $text, (int)$completed]);

    echo json_encode(['success' => true]);
    exit;
}

// Ajoutez ici les actions "update" et "delete".
?>

