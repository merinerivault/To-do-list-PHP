<?php
require 'db.php'; // Importer la connexion

session_start();

$action = $_GET['action'] ?? '';

if ($action === 'register') {
    // Récupérer les données du formulaire
    $data = json_decode(file_get_contents('php://input'), true);
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($username) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Tous les champs sont obligatoires.']);
        exit;
    }

    // Vérifier si l'utilisateur existe déjà
    $collection = $mongoClient->tododb->users;
    $existingUser = $collection->findOne(['username' => $username]);

    if ($existingUser) {
        echo json_encode(['success' => false, 'message' => 'Nom d\'utilisateur déjà utilisé.']);
        exit;
    }

    // Vérifier la sécurité du mot de passe (minimum 8 caractères)
    if (strlen($password) < 8) {
        echo json_encode(['success' => false, 'message' => 'Le mot de passe doit contenir au moins 8 caractères.']);
        exit;
    }

    // Hash du mot de passe
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Enregistrer dans MongoDB
    $collection->insertOne(['username' => $username, 'password' => $hashedPassword]);

    echo json_encode(['success' => true, 'message' => 'Inscription réussie.']);
    exit;
}

if ($action === 'login') {
    $data = json_decode(file_get_contents('php://input'), true);
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($username) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Tous les champs sont obligatoires.']);
        exit;
    }

    // Vérifier si l'utilisateur existe
    $collection = $mongoClient->tododb->users;
    $user = $collection->findOne(['username' => $username]);

    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'Utilisateur non trouvé.']);
        exit;
    }

    // Vérifier le mot de passe
    if (password_verify($password, $user->password)) {
        $_SESSION['user_id'] = (string) $user->_id; // Stocker l'ID utilisateur dans la session
        echo json_encode(['success' => true, 'message' => 'Connexion réussie.']);
        exit;
    }

    echo json_encode(['success' => false, 'message' => 'Mot de passe incorrect.']);
    exit;
}

echo json_encode(['success' => false, 'message' => 'Action non valide.']);

