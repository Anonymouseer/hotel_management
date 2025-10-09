<?php
$servername = "localhost";
$username   = "root";   // default XAMPP user
$password   = "";       // no password by default
$dbname     = "hotel_system";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $conn->connect_error
    ]);
    exit;
}

// Set charset (important for special characters)
$conn->set_charset("utf8mb4");
?>