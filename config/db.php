<?php
require 'vendor/autoload.php'; // Pour MongoDB (composer require mongodb/mongodb)

// Connexion à MongoDB
$mongoClient = new MongoDB\Client("mongodb://localhost:27017");
$usersCollection = $mongoClient->my_database->users;

// Connexion à MySQL
$mysqli = new mysqli("localhost", "root", "", "tasks_database");

if ($mysqli->connect_error) {
    die("Échec de connexion à MySQL : " . $mysqli->connect_error);
}
?>
