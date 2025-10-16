<?php
include 'db.php';

header('Content-Type: application/json');

$room_id = $_GET['id'] ?? null;

if (!$room_id) {
    echo json_encode(['success' => false, 'error' => 'Room ID required']);
    exit;
}

try {
    $stmt = $conn->prepare("
        SELECT r.*, g.guest_name, g.guest_email, g.guest_phone, 
               g.check_in, g.check_out, g.adults, g.children, g.total_price
        FROM rooms r 
        LEFT JOIN guests g ON r.guest_id = g.id 
        WHERE r.id = ?
    ");

    $stmt->bind_param("i", $room_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode([
            'success' => true,
            'data' => $result->fetch_assoc()
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Room not found'
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
