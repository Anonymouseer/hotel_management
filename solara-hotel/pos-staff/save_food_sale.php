<?php
header('Content-Type: application/json');

// The db.php file is two directories up from /pos/
require_once __DIR__ . '/../../db.php'; 

$response = ['success' => false, 'error' => 'An unknown error occurred.'];

// Get the raw POST data
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

if (empty($data) || empty($data['items']) || !isset($data['transaction_id']) || !isset($data['customerName']) || !isset($data['tableLocation'])) {
    $response['error'] = 'Invalid data received.';
    echo json_encode($response);
    exit;
}

if ($conn->connect_error) {
    $response['error'] = "Database connection failed: " . $conn->connect_error;
    echo json_encode($response);
    exit;
}

try {
    $conn->begin_transaction();

    // Check if guest_name exists in guests table to get guest_id
    $guest_name = $data['customerName'];
    $guest_id = null;
    if (!empty($guest_name)) {
        $guest_stmt = $conn->prepare("SELECT id FROM guests WHERE guest_name = ? LIMIT 1");
        $guest_stmt->bind_param("s", $guest_name);
        $guest_stmt->execute();
        $guest_result = $guest_stmt->get_result();
        if ($guest_row = $guest_result->fetch_assoc()) {
            $guest_id = $guest_row['id'];
        }
    }

    $stmt = $conn->prepare(
        "INSERT INTO food_sales (transaction_id, item_name, quantity, price, total_price, guest_id, room_number) VALUES (?, ?, ?, ?, ?, ?, ?)"
    );

    if (!$stmt) {
        throw new Exception("Prepare statement failed: " . $conn->error);
    }

    $transaction_id = $data['transaction_id'];
    // Bind parameters outside the loop. The variables will be updated inside the loop.
    $stmt->bind_param("ssiddsi", $transaction_id, $item_name, $quantity, $price, $total, $guest_id, $tableLocation);

    foreach ($data['items'] as $item) {
        $item_name = $item['name'];
        $quantity = $item['quantity'];
        $price = $item['price'];
        $total = $item['total'];
        $tableLocation = $data['tableLocation']; // This is the customer/room name
        
        if (!$stmt->execute()) { 
            throw new Exception("Failed to save item: " . $stmt->error); 
        }
    }

    $conn->commit();
    $response['success'] = true;

} catch (Exception $e) {
    $conn->rollback();
    $response['error'] = $e->getMessage();
}

$conn->close();
echo json_encode($response);
?>