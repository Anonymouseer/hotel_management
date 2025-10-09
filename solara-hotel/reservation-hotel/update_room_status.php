<?php
include 'db.php';

header('Content-Type: application/json');

$room_id = $_POST['room_id'] ?? null;
$status = $_POST['status'] ?? null;

if (!$room_id || !$status) {
    echo json_encode(['success' => false, 'error' => 'Missing parameters']);
    exit;
}

try {
    $stmt = $conn->prepare("UPDATE rooms SET status = ? WHERE id = ?");
    $stmt->bind_param("si", $status, $room_id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Room status updated']);
    } else {
        echo json_encode(['success' => false, 'error' => $stmt->error]);
    }
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$conn->close();
?>