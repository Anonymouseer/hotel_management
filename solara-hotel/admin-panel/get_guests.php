<?php
include 'db.php';

header('Content-Type: application/json');

$sql = "SELECT * FROM guests ORDER BY checked_in_at DESC";
$result = $conn->query($sql);

$guests = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $guests[] = $row;
    }
}

echo json_encode(['success' => true, 'data' => $guests, 'count' => count($guests)]);

$conn->close();
?>