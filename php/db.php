<?php
// Connexion à la base SQL pour les tâches
$dsn = "mysql:host=localhost;dbname=to-do-list;charset=utf8mb4";
$username = "root";
$password = "";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (PDOException $e) {
    die("Erreur de connexion : " . $e->getMessage());
}

// Connexion à la base NoSQL (MongoDB pour les utilisateurs)
require 'vendor/autoload.php'; // Composer nécessaire
$mongoClient = new MongoDB\Client("mongodb://localhost:27017");
$usersCollection = $mongoClient->todo_app->users;
?>

