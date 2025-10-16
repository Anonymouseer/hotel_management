<?php
include 'db.php';

header('Content-Type: application/json');

// Get POST data
$id = $_POST['id'] ?? null;
$payment_method = $_POST['payment_method'] ?? 'Cash';
$checkout_notes = $_POST['notes'] ?? '';

if (!$id) {
    echo json_encode(['success' => false, 'error' => 'Guest ID is required']);
    exit;
}

try {
    // Start transaction
    $conn->begin_transaction();

    // First, get the guest data from guests table
    $stmt = $conn->prepare("SELECT * FROM guests WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $guest = $result->fetch_assoc();

    if (!$guest) {
        throw new Exception('Guest not found');
    }

    // Insert into checkout_history
    $stmt2 = $conn->prepare("
        INSERT INTO checkout_history 
        (guest_id, guest_name, guest_email, guest_phone, room_type, room_number, 
         check_in, check_out, adults, children, rooms, total_price, payment_method, checkout_notes) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $room_number = $guest['room_number'] ?? null;
    $adults = $guest['adults'] ?? 1;
    $children = $guest['children'] ?? 0;
    $rooms = $guest['rooms'] ?? 1;
    $total_price = $guest['total_price'] ?? 0;

    $stmt2->bind_param(
        "isssssssiidsss",
        $guest['id'],
        $guest['guest_name'],
        $guest['guest_email'],
        $guest['guest_phone'],
        $guest['room_type'],
        $room_number,
        $guest['check_in'],
        $guest['check_out'],
        $adults,
        $children,
        $rooms,
        $total_price,
        $payment_method,
        $checkout_notes
    );

    if (!$stmt2->execute()) {
        throw new Exception('Failed to save checkout history: ' . $stmt2->error);
    }

    // Update room status back to available and clear guest_id
    if ($room_number) {
        $stmt3 = $conn->prepare("UPDATE rooms SET status = 'available', guest_id = NULL WHERE room_number = ?");
        $stmt3->bind_param("s", $room_number);

        if (!$stmt3->execute()) {
            throw new Exception('Failed to update room status: ' . $stmt3->error);
        }
    }

    // Delete from guests table
    $stmt4 = $conn->prepare("DELETE FROM guests WHERE id = ?");
    $stmt4->bind_param("i", $id);

    if (!$stmt4->execute()) {
        throw new Exception('Failed to remove guest from active list: ' . $stmt4->error);
    }

    // Commit transaction
    $conn->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Guest checked out successfully',
        'guest_name' => $guest['guest_name'],
        'room_number' => $room_number
    ]);

    $stmt->close();
    $stmt2->close();
    if (isset($stmt3)) $stmt3->close();
    $stmt4->close();
} catch (Exception $e) {
    // Rollback on error
    $conn->rollback();
    echo json_encode(['success' => false, 'error' => 'Exception: ' . $e->getMessage()]);
}

$conn->close();
