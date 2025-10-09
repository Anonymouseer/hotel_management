-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 30, 2025 at 05:42 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hotel_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `checkout_history`
--

CREATE TABLE `checkout_history` (
  `id` int(11) NOT NULL,
  `guest_id` int(11) DEFAULT NULL,
  `guest_name` varchar(255) DEFAULT NULL,
  `guest_email` varchar(255) DEFAULT NULL,
  `guest_phone` varchar(50) DEFAULT NULL,
  `room_type` varchar(100) DEFAULT NULL,
  `room_number` varchar(20) DEFAULT NULL,
  `check_in` date DEFAULT NULL,
  `check_out` date DEFAULT NULL,
  `adults` int(11) DEFAULT 1,
  `children` int(11) DEFAULT 0,
  `rooms` int(11) DEFAULT 1,
  `total_price` decimal(10,2) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `checkout_notes` text DEFAULT NULL,
  `checkout_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `checkout_history`
--

INSERT INTO `checkout_history` (`id`, `guest_id`, `guest_name`, `guest_email`, `guest_phone`, `room_type`, `room_number`, `check_in`, `check_out`, `adults`, `children`, `rooms`, `total_price`, `payment_method`, `checkout_notes`, `checkout_date`) VALUES
(14, 18, 'Aedanne Keith Arcilla', 'aedanarcilla08@gmail.com', '09561856120', 'Deluxe Villa', '701', '2025-09-30', '2025-10-01', 2, 2, 1, 9013.00, 'cash', '', '2025-09-30 15:28:54');

-- --------------------------------------------------------

-- --------------------------------------------------------
--
--
-- Table structure for table `guests`
--

CREATE TABLE `guests` (
  `id` int(11) NOT NULL,
  `guest_name` varchar(255) NOT NULL,
  `guest_email` varchar(255) DEFAULT NULL,
  `guest_phone` varchar(20) DEFAULT NULL,
  `room_type` varchar(100) DEFAULT NULL,
  `room_number` varchar(10) DEFAULT NULL,
  `check_in` date DEFAULT NULL,
  `check_out` date DEFAULT NULL,
  `adults` int(11) DEFAULT NULL,
  `children` int(11) DEFAULT NULL,
  `rooms` int(11) DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `special_requests` text DEFAULT NULL,
  `checked_in_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `guest_name` varchar(100) NOT NULL,
  `guest_email` varchar(100) NOT NULL,
  `guest_phone` varchar(20) NOT NULL,
  `room_type` enum('Regular Suite','Twin Bed Penthouse','Skyline Suite','Deluxe Villa') NOT NULL,
  `price_per_night` decimal(10,2) NOT NULL,
  `check_in` date NOT NULL,
  `check_out` date NOT NULL,
  `adults` int(11) NOT NULL,
  `children` int(11) NOT NULL,
  `rooms` int(11) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `special_requests` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `food_sales`
--

CREATE TABLE `food_sales` (
  `id` int(11) NOT NULL,
  `transaction_id` varchar(50) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `sale_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `guest_id` int(11) DEFAULT NULL,
  `room_number` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `id` int(11) NOT NULL,
  `room_number` varchar(20) NOT NULL,
  `room_type` varchar(100) NOT NULL,
  `floor` int(11) DEFAULT NULL,
  `status` enum('available','occupied','maintenance','cleaning','checkout') DEFAULT 'available',
  `guest_id` int(11) DEFAULT NULL,
  `price_per_night` decimal(10,2) DEFAULT NULL,
  `max_occupancy` int(11) DEFAULT 2,
  `amenities` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id`, `room_number`, `room_type`, `floor`, `status`, `guest_id`, `price_per_night`, `max_occupancy`, `amenities`, `notes`, `last_updated`) VALUES
(1, '201', 'Regular Suite', 2, 'available', NULL, 499.00, 2, NULL, NULL, '2025-09-30 14:58:50'),
(2, '202', 'Regular Suite', 2, 'available', NULL, 499.00, 2, NULL, NULL, '2025-09-30 03:58:23'),
(3, '203', 'Regular Suite', 2, 'available', NULL, 499.00, 2, NULL, NULL, '2025-09-30 03:58:23'),
(4, '204', 'Regular Suite', 2, 'available', NULL, 499.00, 2, NULL, NULL, '2025-09-30 03:58:23'),
(5, '205', 'Regular Suite', 2, 'available', NULL, 499.00, 2, NULL, NULL, '2025-09-30 03:58:23'),
(6, '206', 'Regular Suite', 2, 'available', NULL, 499.00, 2, NULL, NULL, '2025-09-30 07:20:40'),
(7, '301', 'Twin Bed Penthouse', 3, 'available', NULL, 899.00, 2, NULL, NULL, '2025-09-30 15:26:54'),
(8, '302', 'Twin Bed Penthouse', 3, 'available', NULL, 899.00, 2, NULL, NULL, '2025-09-30 15:29:28'),
(9, '303', 'Twin Bed Penthouse', 3, 'available', NULL, 899.00, 2, NULL, NULL, '2025-09-30 03:58:23'),
(10, '304', 'Twin Bed Penthouse', 3, 'available', NULL, 899.00, 2, NULL, NULL, '2025-09-30 03:58:23'),
(11, '501', 'Skyline Suite', 5, 'available', NULL, 1099.00, 3, NULL, NULL, '2025-09-30 03:58:23'),
(12, '502', 'Skyline Suite', 5, 'available', NULL, 1099.00, 3, NULL, NULL, '2025-09-30 03:58:23'),
(13, '503', 'Skyline Suite', 5, 'available', NULL, 1099.00, 3, NULL, NULL, '2025-09-30 03:58:23'),
(14, '601', 'Skyline Suite', 6, 'available', NULL, 1099.00, 3, NULL, NULL, '2025-09-30 03:58:23'),
(15, '602', 'Skyline Suite', 6, 'available', NULL, 1099.00, 3, NULL, NULL, '2025-09-30 03:58:23'),
(16, '701', 'Deluxe Villa', 7, 'available', NULL, 1299.00, 4, NULL, NULL, '2025-09-30 15:28:54'),
(17, '702', 'Deluxe Villa', 7, 'available', NULL, 1299.00, 4, NULL, NULL, '2025-09-30 03:58:23'),
(18, '801', 'Deluxe Villa', 8, 'available', NULL, 1299.00, 4, NULL, NULL, '2025-09-30 03:58:23'),
(19, '802', 'Deluxe Villa', 8, 'available', NULL, 1299.00, 4, NULL, NULL, '2025-09-30 07:47:19');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `checkout_history`
--
ALTER TABLE `checkout_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_checkout_date` (`checkout_date`);


--
-- Indexes for table `food_sales`
--
ALTER TABLE `food_sales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_transaction_id` (`transaction_id`);

--
-- Indexes for table `guests`
--
ALTER TABLE `guests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `room_number` (`room_number`),
  ADD KEY `idx_room_type` (`room_type`),
  ADD KEY `idx_status` (`status`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `checkout_history`
--
ALTER TABLE `checkout_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `food_sales`
--
ALTER TABLE `food_sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `guests`
--
ALTER TABLE `guests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
