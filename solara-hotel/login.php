<?php
session_start();
require_once 'admin-pannel/db.php';

// Set JSON header
header('Content-Type: application/json');

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Get POST data
$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

// Validate required fields
if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Please enter email and password']);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

// Query user by email
$stmt = $conn->prepare("SELECT user_id, email, password_hash, first_name, last_name, is_active FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
    $stmt->close();
    exit;
}

$user = $result->fetch_assoc();
$stmt->close();

// Check if account is active
if (!$user['is_active']) {
    echo json_encode(['success' => false, 'message' => 'Your account has been deactivated. Please contact support.']);
    exit;
}

// Verify password
if (!password_verify($password, $user['password_hash'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
    exit;
}

// Update last login time
$updateStmt = $conn->prepare("UPDATE users SET last_login = NOW() WHERE user_id = ?");
$updateStmt->bind_param("i", $user['user_id']);
$updateStmt->execute();
$updateStmt->close();

// Set session variables
$_SESSION['user_id'] = $user['user_id'];
$_SESSION['email'] = $user['email'];
$_SESSION['first_name'] = $user['first_name'];
$_SESSION['last_name'] = $user['last_name'];
$_SESSION['logged_in'] = true;

echo json_encode([
    'success' => true,
    'message' => 'Login successful! Welcome back, ' . $user['first_name'] . '!',
    'user' => [
        'user_id' => $user['user_id'],
        'email' => $user['email'],
        'first_name' => $user['first_name'],
        'last_name' => $user['last_name']
    ]
]);

$conn->close();
