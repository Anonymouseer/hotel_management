<?php
include 'db.php';

header('Content-Type: application/json');

// Get JSON input
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validate required fields
if (!isset($data['guest_name']) || !isset($data['room_number']) || !isset($data['room_id'])) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

try {
    // Start transaction
    $conn->begin_transaction();
    
    // Insert guest record
    $stmt = $conn->prepare("
        INSERT INTO guests (guest_name, guest_email, guest_phone, check_in, special_requests) 
        VALUES (?, ?, ?, NOW(), ?)
    ");
    
    $stmt->bind_param("ssss", 
        $data['guest_name'],
        $data['guest_email'],
        $data['guest_phone'],
        $data['special_requests']
    );
    
    if (!$stmt->execute()) {
        throw new Exception('Failed to create guest record: ' . $stmt->error);
    }
    
    $guest_id = $conn->insert_id;
    
    // Update room status to occupied and assign guest
    $stmt = $conn->prepare("
        UPDATE rooms 
        SET status = 'occupied', guest_id = ?, last_updated = NOW() 
        WHERE id = ? AND status = 'available'
    ");
    
    $stmt->bind_param("ii", $guest_id, $data['room_id']);
    
    if (!$stmt->execute()) {
        throw new Exception('Failed to update room status: ' . $stmt->error);
    }
    
    if ($stmt->affected_rows === 0) {
        throw new Exception('Room is no longer available or does not exist');
    }
    
    // Commit transaction
    $conn->commit();
    
    echo json_encode([
        'success' => true, 
        'message' => 'Check-in completed successfully',
        'guest_id' => $guest_id,
        'room_number' => $data['room_number']
    ]);
    
} catch (Exception $e) {
    // Rollback on error
    $conn->rollback();
    
    echo json_encode([
        'success' => false, 
        'error' => $e->getMessage()
    ]);
}

$conn->close();
?>