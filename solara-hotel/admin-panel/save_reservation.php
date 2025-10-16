<?php
include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // sanitize basic inputs
    $guest_name   = $_POST['guest_name'] ?? '';
    $guest_email  = $_POST['guest_email'] ?? '';
    $guest_phone  = $_POST['guest_phone'] ?? '';
    $room_type    = $_POST['room_type'] ?? '';
    $price_per_night = floatval($_POST['price_per_night'] ?? 0);
    $check_in     = $_POST['check_in'] ?? '';
    $check_out    = $_POST['check_out'] ?? '';
    $adults       = intval($_POST['adults'] ?? 1);
    $children     = intval($_POST['children'] ?? 0);
    $rooms        = intval($_POST['rooms'] ?? 1);
    $special_requests = $_POST['special_requests'] ?? '';

    // compute nights safely using DateTime    $nights = 1;
    if ($check_in && $check_out) {
        try {
            $d1 = new DateTime($check_in);
            $d2 = new DateTime($check_out);
            $interval = $d1->diff($d2);
            $nights = max(1, (int)$interval->days);
        } catch (Exception $e) {
            $nights = 1;
        }
    }

    $roomTotal = $price_per_night * $nights * $rooms;
    $serviceFee = 50;
    $taxes = round($roomTotal * 0.15); // 15% tax
    $calculated_total = $roomTotal + $serviceFee + $taxes;
    $calculated_total = number_format($calculated_total, 2, '.', '');

    // prepared insert
    $stmt = $conn->prepare(
        "INSERT INTO reservations
         (guest_name, guest_email, guest_phone, room_type, price_per_night, check_in, check_out, adults, children, rooms, total_price, special_requests)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->bind_param(
        "ssssdssiiids",
        $guest_name,
        $guest_email,
        $guest_phone,
        $room_type,
        $price_per_night,
        $check_in,
        $check_out,
        $adults,
        $children,
        $rooms,
        $calculated_total,
        $special_requests
    );

    if ($stmt->execute()) {
        echo "<script>alert('Reservation successful!'); window.location.href='webpage.html';</script>";
        exit;
    } else {
        $err = addslashes($stmt->error);
        echo "<script>alert('DB error: {$err}'); window.location.href='webpage.html';</script>";
        exit;
    }
}

$conn->close();
echo "<script>window.location.href='booking.php';</script>";
exit;
?>
