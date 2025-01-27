<?php
require 'vendor/autoload.php'; // Pour MongoDB (composer require mongodb/mongodb)

// Connexion à MongoDB
$mongoClient = new MongoDB\Client("mongodb://localhost:27017");
$usersCollection = $mongoClient->my_database->users;

// Connexion à MySQL
$mysqli = new mysqli("localhost:3000", "root", "", "to-do-list");

if ($mysqli->connect_error) {
    die("Échec de connexion à MySQL : " . $mysqli->connect_error);
}
?>
