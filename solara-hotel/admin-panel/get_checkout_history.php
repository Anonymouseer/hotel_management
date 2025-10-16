<?php
include 'db.php';

header('Content-Type: application/json');

try {
    // Get all checkout history, ordered by most recent first
    $query = "SELECT * FROM checkout_history ORDER BY checkout_date DESC";
    $result = $conn->query($query);

    if (!$result) {
        echo json_encode(['success' => false, 'error' => 'Query failed: ' . $conn->error]);
        exit;
    }

    $checkouts = [];
    while ($row = $result->fetch_assoc()) {
        $checkouts[] = $row;
    }

    echo json_encode([
        'success' => true,
        'data' => $checkouts,
        'count' => count($checkouts)
    ]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Exception: ' . $e->getMessage()]);
}

$conn->close();
?>