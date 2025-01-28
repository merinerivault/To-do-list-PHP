<?php
require 'vendor/autoload.php'; // Bibliothèque MongoDB

// Connexion MongoDB
$mongoClient = new MongoDB\Client("mongodb://localhost:27017");

// Connexion MySQL
try {
    $pdo = new PDO('mysql:host=localhost;dbname=to-do-list', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Erreur de connexion MySQL : " . $e->getMessage());
}
?>


