<?php
$servername = "localhost";
$username   = "root";   // default XAMPP user
$password   = "";       // no password by default
$dbname     = "hotel_system";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname, 3307);

// Check connection
if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}

// Set charset (important for special characters)
$conn->set_charset("utf8mb4");
?>
