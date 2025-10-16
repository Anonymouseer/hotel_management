<?php
include 'db.php';

header('Content-Type: application/json');

$sql = "SELECT * FROM reservations ORDER BY created_at DESC";
$result = $conn->query($sql);

$reservations = [];
while ($row = $result->fetch_assoc()) {
    $reservations[] = $row;
}

echo json_encode($reservations);

$conn->close();
?>
