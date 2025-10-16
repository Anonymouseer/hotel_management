<?php
header('Content-Type: application/json');

require_once __DIR__ . '/db.php';

function respond($data) {
	echo json_encode($data);
	exit;
}

try {
	$start = isset($_GET['start']) ? $_GET['start'] : null;
	$end = isset($_GET['end']) ? $_GET['end'] : null;
	$payment = isset($_GET['payment']) ? $_GET['payment'] : '';

	$conditions = [];
	$params = [];
	$types = '';

	if ($start) {
		$conditions[] = 'sale_date >= ?';
		$params[] = $start . ' 00:00:00';
		$types .= 's';
	}
	if ($end) {
		$conditions[] = 'sale_date <= ?';
		$params[] = $end . ' 23:59:59';
		$types .= 's';
	}
	if ($payment !== '') {
		$conditions[] = 'payment_method = ?';
		$params[] = $payment;
		$types .= 's';
	}

	$sql = "SELECT id, receipt_number, cashier_name, payment_method, subtotal_amount, tax_amount, discount_amount, total_amount, sale_date FROM pos_sales";
	if (count($conditions) > 0) {
		$sql .= ' WHERE ' . implode(' AND ', $conditions);
	}
	$sql .= ' ORDER BY sale_date DESC LIMIT 500';

	if (count($params) > 0) {
		$stmt = $conn->prepare($sql);
		if (!$stmt) {
			throw new Exception('Prepare failed: ' . $conn->error);
		}
		$stmt->bind_param($types, ...$params);
		$stmt->execute();
		$result = $stmt->get_result();
	} else {
		$result = $conn->query($sql);
		if (!$result) {
			throw new Exception('Query failed: ' . $conn->error);
		}
	}

	$sales = [];
	while ($row = $result->fetch_assoc()) {
		$sales[] = $row;
	}

	respond(['success' => true, 'data' => $sales]);

} catch (Throwable $e) {
	http_response_code(500);
	respond(['success' => false, 'error' => $e->getMessage()]);
}


