<?php
session_start();

// Function to check if user is logged in
function isLoggedIn() {
    return isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true && isset($_SESSION['user_id']);
}

// Function to require login (redirect if not logged in)
function requireLogin($redirect = 'auth.html') {
    if (!isLoggedIn()) {
        header('Location: ' . $redirect);
        exit;
    }
}

// Function to get current user info
function getCurrentUser() {
    if (!isLoggedIn()) {
        return null;
    }
    
    return [
        'user_id' => $_SESSION['user_id'] ?? null,
        'email' => $_SESSION['email'] ?? null,
        'first_name' => $_SESSION['first_name'] ?? null,
        'last_name' => $_SESSION['last_name'] ?? null
    ];
}
?>