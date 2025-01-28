<?php
require 'db.php'; // Connexion aux bases
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Non autorisé.']);
    exit;
}

$user_id = $_SESSION['user_id'];
$action = $_GET['action'] ?? '';

if ($action === 'create') {
    $data = json_decode(file_get_contents('php://input'), true);
    $text = $data['text'] ?? '';
    $completed = $data['completed'] ?? false;

    if (empty($text)) {
        echo json_encode(['success' => false, 'message' => 'La tâche est vide.']);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO tasks (user_id, text, completed) VALUES (:user_id, :text, :completed)");
    $stmt->execute([':user_id' => $user_id, ':text' => $text, ':completed' => $completed]);

    echo json_encode(['success' => true, 'message' => 'Tâche ajoutée.']);
    exit;
}

if ($action === 'read') {
    $stmt = $pdo->prepare("SELECT * FROM tasks WHERE user_id = :user_id ORDER BY created_at DESC");
    $stmt->execute([':user_id' => $user_id]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

if ($action === 'update') {
    $data = json_decode(file_get_contents('php://input'), true);
    $text = $data['text'] ?? '';
    $completed = $data['completed'] ?? false;

    $stmt = $pdo->prepare("UPDATE tasks SET completed = :completed WHERE user_id = :user_id AND text = :text");
    $stmt->execute([':user_id' => $user_id, ':text' => $text, ':completed' => $completed]);

    echo json_encode(['success' => true, 'message' => 'Tâche mise à jour.']);
    exit;
}

if ($action === 'delete') {
    $data = json_decode(file_get_contents('php://input'), true);
    $text = $data['text'] ?? '';

    $stmt = $pdo->prepare("DELETE FROM tasks WHERE user_id = :user_id AND text = :text");
    $stmt->execute([':user_id' => $user_id, ':text' => $text]);

    echo json_encode(['success' => true, 'message' => 'Tâche supprimée.']);
    exit;
}

echo json_encode(['success' => false, 'message' => 'Action non valide.']);
?>


