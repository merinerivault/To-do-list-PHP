<?php
require '../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'];
$email = $data['email'];
$password = password_hash($data['password'], PASSWORD_BCRYPT);

// Vérifier si l'utilisateur existe déjà
$existingUser = $usersCollection->findOne(['username' => $username]);
if ($existingUser) {
    http_response_code(400);
    echo json_encode(["message" => "Nom d'utilisateur déjà pris."]);
    exit;
}

// Ajouter l'utilisateur à MongoDB
$usersCollection->insertOne([
    'username' => $username,
    'email' => $email,
    'password' => $password
]);

echo json_encode(["message" => "Inscription réussie."]);
?>
