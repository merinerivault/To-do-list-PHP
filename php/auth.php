<?php
require 'db.php'; // Connexion aux bases

session_start();

$action = $_GET['action'] ?? '';

if ($action === 'register') {
    $data = json_decode(file_get_contents('php://input'), true);
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($username) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Tous les champs sont obligatoires.']);
        exit;
    }

    $collection = $mongoClient->tododb->users;
    $existingUser = $collection->findOne(['username' => $username]);

    if ($existingUser) {
        echo json_encode(['success' => false, 'message' => 'Utilisateur déjà existant.']);
        exit;
    }

    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    $collection->insertOne(['username' => $username, 'password' => $hashedPassword]);

    echo json_encode(['success' => true, 'message' => 'Inscription réussie.']);
    exit;
}

if ($action === 'login') {
    $data = json_decode(file_get_contents('php://input'), true);
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    $collection = $mongoClient->tododb->users;
    $user = $collection->findOne(['username' => $username]);

    if ($user && password_verify($password, $user->password)) {
        $_SESSION['user_id'] = (string) $user->_id;
        echo json_encode(['success' => true, 'message' => 'Connexion réussie.']);
        exit;
    }

    echo json_encode(['success' => false, 'message' => 'Nom d\'utilisateur ou mot de passe incorrect.']);
    exit;
}

if ($action === 'logout') {
    session_destroy();
    echo json_encode(['success' => true, 'message' => 'Déconnexion réussie.']);
    exit;
}

echo json_encode(['success' => false, 'message' => 'Action non valide.']);
?>


