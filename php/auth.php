<?php
require 'db.php';

// Inscription
if (isset($_POST['signup'])) {
    $username = $_POST['username'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    // Vérification si l'utilisateur existe déjà
    $existingUser = $usersCollection->findOne(['username' => $username]);
    if ($existingUser) {
        die("Nom d'utilisateur déjà pris.");
    }

    // Insertion dans la base NoSQL
    $usersCollection->insertOne([
        'username' => $username,
        'password' => $password
    ]);

    echo "Inscription réussie ! <a href='../login.html'>Connectez-vous</a>";
}

// Connexion
if (isset($_POST['login'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Recherche de l'utilisateur
    $user = $usersCollection->findOne(['username' => $username]);
    if ($user && password_verify($password, $user['password'])) {
        session_start();
        $_SESSION['username'] = $username;
        header('Location: ../index.html');
    } else {
        echo "Nom d'utilisateur ou mot de passe incorrect.";
    }
}
?>
