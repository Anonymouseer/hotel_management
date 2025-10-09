<?php
// Database connection
$servername = "localhost";
$username   = "root";          // your MySQL username
$password   = "";              // your MySQL password
$dbname     = "solara_hotel_db"; // your database name

$conn = new mysqli($servername, $username, $password, $dbname);

// Check DB connection
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed."]));
}

// Receive POST data safely
$firstName          = $conn->real_escape_string($_POST['firstName'] ?? '');
$lastName           = $conn->real_escape_string($_POST['lastName'] ?? '');
$company            = $conn->real_escape_string($_POST['company'] ?? '');
$email              = $conn->real_escape_string($_POST['email'] ?? '');
$confirmEmail       = $conn->real_escape_string($_POST['confirmEmail'] ?? '');
$phone              = $conn->real_escape_string($_POST['phone'] ?? '');
$phoneType          = $conn->real_escape_string($_POST['phoneType'] ?? '');
$address            = $conn->real_escape_string($_POST['address'] ?? '');
$address2           = $conn->real_escape_string($_POST['address2'] ?? '');
$city               = $conn->real_escape_string($_POST['city'] ?? '');
$region             = $conn->real_escape_string($_POST['region'] ?? '');
$zip                = $conn->real_escape_string($_POST['zip'] ?? '');
$country            = $conn->real_escape_string($_POST['country'] ?? '');
$eventType          = $conn->real_escape_string($_POST['eventType'] ?? '');
$preferredVenue     = $conn->real_escape_string($_POST['preferredVenue'] ?? '');
$eventDate          = $conn->real_escape_string($_POST['eventDate'] ?? '');
$guestCount         = $conn->real_escape_string($_POST['guestCount'] ?? '');
$budgetRange        = $conn->real_escape_string($_POST['budgetRange'] ?? '');
$specialRequirements = $conn->real_escape_string($_POST['specialRequirements'] ?? '');
$referralSource     = $conn->real_escape_string($_POST['referralSource'] ?? '');
$agreeTerms         = isset($_POST['agreeTerms']) ? 1 : 0;

// Handle array field (additionalServices)
if (isset($_POST['additionalServices'])) {
    $additionalServices = implode(', ', $_POST['additionalServices']);
} else {
    $additionalServices = '';
}

// Validation
if ($email !== $confirmEmail) {
    echo json_encode(["status" => "error", "message" => "Emails do not match."]);
    exit;
}

// Insert into database
$sql = "INSERT INTO inquiries (
    first_name, last_name, company, email, phone, phone_type, 
    address, address2, city, region, zip, country,
    event_type, preferred_venue, event_date, guest_count, budget_range,
    additional_services, special_requirements, referral_source, agree_terms
) VALUES (
    '$firstName', '$lastName', '$company', '$email', '$phone', '$phoneType',
    '$address', '$address2', '$city', '$region', '$zip', '$country',
    '$eventType', '$preferredVenue', '$eventDate', '$guestCount', '$budgetRange',
    '$additionalServices', '$specialRequirements', '$referralSource', '$agreeTerms'
)";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success", "message" => "Inquiry saved successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Error: " . $conn->error]);
}

$conn->close();
