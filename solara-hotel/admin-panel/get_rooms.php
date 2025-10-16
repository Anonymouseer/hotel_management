<?php
include 'db.php';

header('Content-Type: application/json');

try {
    // Get all rooms with guest information if occupied
    $sql = "SELECT r.*, g.guest_name, g.guest_email, g.guest_phone, g.check_in, g.check_out 
            FROM rooms r 
            LEFT JOIN guests g ON r.guest_id = g.id 
            ORDER BY r.floor, r.room_number";
    
    $result = $conn->query($sql);
    
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