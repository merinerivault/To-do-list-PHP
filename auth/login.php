<?php
require '../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'];
$password = $data['password'];

// Trouver l'utilisateur
$user = $usersCollection->findOne(['username' => $username]);
if (!$user || !password_verify($password, $user['password'])) {
    http_response_code(401);
    echo json_encode(["message" => "Nom d'utilisateur ou mot de passe incorrect."]);
    exit;
}

// Connexion réussie
echo json_encode(["message" => "Connexion réussie.", "username" => $username]);
?>
