<?php
header('Content-Type: application/json');
require_once 'db.php'; // Include your database connection

$response = ['success' => false, 'data' => [], 'error' => ''];

try {
    // Query to fetch food sales, ordered by the most recent
    $sql = "SELECT
                fs.transaction_id, 
                fs.item_name, 
                fs.quantity, 
                fs.price, 
                fs.total_price, 
                fs.sale_date, 
                fs.guest_id,
                COALESCE(g.guest_name, fs.room_number) AS customer_name,
                fs.room_number
            FROM food_sales fs
            LEFT JOIN guests g ON fs.guest_id = g.id
            ORDER BY fs.sale_date DESC, fs.transaction_id";
            
    $result = $conn->query($sql);

    if ($result) {
        $items = $result->fetch_all(MYSQLI_ASSOC);
        $transactions = [];
        foreach ($items as $item) {
            $tid = $item['transaction_id'];
            if (!isset($transactions[$tid])) {
                $transactions[$tid] = [
                    'transaction_id' => $tid,
                    'customer_name' => $item['customer_name'],
                    'sale_date' => $item['sale_date'],
                    'total_transaction_price' => 0,
                    'items' => []
                ];
            }
            $transactions[$tid]['items'][] = $item;
            $transactions[$tid]['total_transaction_price'] += $item['total_price'];
        }
        $response['success'] = true;
        $response['data'] = array_values($transactions); // Re-index the array
    } else {
        throw new Exception("Query failed: " . $conn->error);
    }
} catch (Exception $e) {
    $response['error'] = $e->getMessage();
}

$conn->close();
echo json_encode($response);
?>