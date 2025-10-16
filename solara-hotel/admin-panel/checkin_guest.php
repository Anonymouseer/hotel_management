<?php
include 'db.php';

header('Content-Type: application/json');

// Get the JSON data
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

    // Insert into guests table (checked-in guests)
    $stmt = $conn->prepare("
        INSERT INTO guests 
        (guest_name, guest_email, guest_phone, room_type, room_number, 
         check_in, check_out, adults, children, rooms, total_price, special_requests, checked_in_at) 
        VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, NOW())
    ");

    // Extract check_out from duration or use provided check_out
    $check_out = $data['check_out'] ?? date('Y-m-d', strtotime('+1 day'));
    $adults = $data['adults'] ?? 1;
    $children = $data['children'] ?? 0;
    $rooms = $data['rooms'] ?? 1;
    $total_price = $data['total_price'] ?? 0;

    $stmt->bind_param(
        "ssssssiidss",
        $data['guest_name'],
        $data['guest_email'],
        $data['guest_phone'],
        $data['room_type'],
        $data['room_number'],
        $check_out,
        $adults,
        $children,
        $rooms,
        $total_price,
        $data['special_requests']
    );

    if (!$stmt->execute()) {
        throw new Exception('Failed to create guest record: ' . $stmt->error);
    }

    $guest_id = $conn->insert_id;

    // Update room status to occupied and link to guest
    $stmt2 = $conn->prepare("
        UPDATE rooms 
        SET status = 'occupied', guest_id = ?, last_updated = NOW() 
        WHERE id = ? AND status = 'available'
    ");

    $stmt2->bind_param("ii", $guest_id, $data['room_id']);

    if (!$stmt2->execute()) {
        throw new Exception('Failed to update room status: ' . $stmt2->error);
    }

    if ($stmt2->affected_rows === 0) {
        throw new Exception('Room is no longer available or does not exist');
    }

    // If there's a reservation_id, delete from reservations table
    if (isset($data['reservation_id']) && $data['reservation_id']) {
        $delete_stmt = $conn->prepare("DELETE FROM reservations WHERE id = ?");
        $delete_stmt->bind_param("i", $data['reservation_id']);
        $delete_stmt->execute();
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
