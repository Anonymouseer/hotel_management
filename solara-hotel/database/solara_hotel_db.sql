-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 09, 2025 at 05:40 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `solara_hotel_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `inquiries`
--

CREATE TABLE `inquiries` (
  `inquiry_id` int(11) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `company` varchar(150) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `phone_type` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `address2` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `region` varchar(100) DEFAULT NULL,
  `zip` varchar(20) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `event_type` varchar(50) DEFAULT NULL,
  `preferred_venue` varchar(100) DEFAULT NULL,
  `event_date` date DEFAULT NULL,
  `guest_count` int(11) DEFAULT NULL,
  `budget_range` varchar(50) DEFAULT NULL,
  `additional_services` text DEFAULT NULL,
  `special_requirements` text DEFAULT NULL,
  `referral_source` varchar(100) DEFAULT NULL,
  `agree_terms` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `inquiries`
--

INSERT INTO `inquiries` (`inquiry_id`, `first_name`, `last_name`, `company`, `email`, `phone`, `phone_type`, `address`, `address2`, `city`, `region`, `zip`, `country`, `event_type`, `preferred_venue`, `event_date`, `guest_count`, `budget_range`, `additional_services`, `special_requirements`, `referral_source`, `agree_terms`, `created_at`) VALUES
(1, 'Raffy', 'Lapiz', 'Lapiz Family', 'raffylapiz3350@gmail.com', '09456726582', 'primary', '89 sto. nino street', 'Building 09', 'Quezon City', 'Region 4', '1127', 'Philippines', 'debut', 'grand-ballroom', '2025-10-05', 250, '500k+', 'catering', 'Pillows', 'search', 0, '2025-10-04 02:25:53'),
(2, 'Shadrach', 'Reyna', 'Reyna Family', 'reyna123@gmail.com', '09456726582', 'primary', '89 abc, kiko', 'Aprtment 2nd Floor', 'Quezon City', 'Region 9', '1189', 'Philippines', 'birthday', 'garden-pavilion', '2025-10-20', 190, '300k-500k', 'catering, decoration, photography, entertainment', 'Speaker, Microphone', 'social', 0, '2025-10-04 02:36:49'),
(3, 'Geybin', 'Capinpin', 'Capinpin Brothers', 'geybin123@gmail.com', '09456726582', 'primary', '123 Capinpin, Apartment', 'Solara Hotel', 'Quezon City', 'Region 9', '1134', 'Philippines', 'debut', 'grand-ballroom', '2025-10-20', 290, '200k-300k', 'catering, decoration', 'Billiard, Bowling', 'social', 0, '2025-10-04 03:12:00'),
(4, 'Michael', 'Jordan', 'Jordan Family', 'jordan@gmail.com', '09456726582', 'primary', '123 Cubao', 'Solara Hotel', 'Quezon City', 'Region 6', '1190', 'Philippines', 'eventBirthday', 'grand-ballroom', '2025-10-25', 295, '300k-500k', 'catering, decoration', 'Court', 'social', 0, '2025-10-04 03:29:43'),
(5, 'Jake', 'Cruz', 'Cruzes Family', 'jake123@gmail.com', '09456726582', 'primary', '123 ABC', 'Solara Hotel', 'Quezon City', 'Region 4', '1127', 'Philippines', 'debut', 'garden-pavilion', '2025-10-06', 155, '100k-200k', 'photography, entertainment', 'Pillows', 'friend', 0, '2025-10-04 04:33:54'),
(6, 'king', 'raffy', 'raffy family', 'raffylapiz123@gmail.com', '05463217896', 'primary', '12 abc, stree', '2nd Floor Pande manila', 'Quezon City', '10', '1657', 'Philippines', 'debut', 'starlights', '2025-10-10', 190, '200k-300k', 'catering, decoration', 'Pillows', 'search', 0, '2025-10-09 13:19:41'),
(7, 'king', 'raffy', 'raffy family', 'raffylapiz123@gmail.com', '5463217896', 'primary', '12 abc, stree', '2nd Floor Pande manila', 'Quezon City', '10', '1657', 'Philippines', 'Meeting', 'garden-pavilion', '2025-10-18', 190, '300k-500k', 'catering, decoration', 'pillows', 'friend', 0, '2025-10-09 13:21:57');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `inquiries`
--
ALTER TABLE `inquiries`
  ADD PRIMARY KEY (`inquiry_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `inquiries`
--
ALTER TABLE `inquiries`
  MODIFY `inquiry_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
