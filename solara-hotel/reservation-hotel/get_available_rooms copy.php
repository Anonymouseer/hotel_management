<?php
include 'db.php';

header('Content-Type: application/json');

$room_type = $_GET['room_type'] ?? null;

try {
    if ($room_type) {
        // Get available rooms of a specific type
        $stmt = $conn->prepare("SELECT * FROM rooms WHERE room_type = ? AND status = 'available' ORDER BY room_number");
        $stmt->bind_param("s", $room_type);
        $stmt->execute();
        $result = $stmt->get_result();
    } else {
        // Get all available rooms
        $result = $conn->query("SELECT * FROM rooms WHERE status = 'available' ORDER BY room_type, room_number");
    }
    
    if (!$result) {
        throw new Exception('Query failed: ' . $conn->error);
    }
    
    $rooms = array();
    while($row = $result->fetch_assoc()) {
        $rooms[] = $row;
    }
    
    echo json_encode([
        'success' => true, 
        'data' => $rooms, 
        'count' => count($rooms)
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false, 
        'error' => $e->getMessage()
    ]);
}

$conn->close();
?>