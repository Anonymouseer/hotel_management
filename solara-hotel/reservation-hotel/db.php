<?php
$servername = "localhost"; // or "127.0.0.1"
$username = "root";        // default XAMPP username
$password = "";            // default XAMPP password is empty
$dbname = "hotel_system"; // your actual database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";
