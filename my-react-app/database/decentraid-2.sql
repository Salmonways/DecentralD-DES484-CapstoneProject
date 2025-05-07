-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: May 07, 2025 at 06:42 AM
-- Server version: 5.7.39
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `decentraid`
--

-- --------------------------------------------------------

--
-- Table structure for table `credentials`
--

CREATE TABLE `credentials` (
  `id` int(11) NOT NULL,
  `credentialTitle` varchar(255) DEFAULT NULL,
  `credentialType` varchar(255) DEFAULT NULL,
  `subjectDID` varchar(255) DEFAULT NULL,
  `issuerDID` varchar(255) DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `status` varchar(50) DEFAULT 'not found',
  `issuerName` varchar(255) DEFAULT NULL,
  `subjectName` varchar(255) DEFAULT NULL,
  `description` text,
  `metadata` text,
  `tags` text,
  `schemaUrl` text,
  `filePath` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `credentialID` varchar(255) DEFAULT NULL,
  `submittedBy` enum('issuer','user','duplicate') NOT NULL,
  `onChainRevoked` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `credentials`
--

INSERT INTO `credentials` (`id`, `credentialTitle`, `credentialType`, `subjectDID`, `issuerDID`, `issueDate`, `expiryDate`, `status`, `issuerName`, `subjectName`, `description`, `metadata`, `tags`, `schemaUrl`, `filePath`, `created_at`, `credentialID`, `submittedBy`, `onChainRevoked`) VALUES
(86, 'test1', 'Degree', 'did:example:vf5jbrrc5w', 'did:decentrald:2c39dbf7-d23b-4723-a107-2c42025bdf8e', '2025-05-01', '2025-05-01', 'active', 'TOEIC', 'nut', 'test1', 'test1', 'test1', NULL, '/uploads/1746596595480-Screenshot 2568-04-02 at 20.04.10.png', '2025-05-07 05:43:15', 'cred-1746596517546', 'issuer', 0),
(87, 'test2', 'Degree', 'did:example:vf5jbrrc5w', 'did:decentrald:2c39dbf7-d23b-4723-a107-2c42025bdf8e', '2025-05-01', '2025-05-01', 'revoked', 'TOEIC', 'nut', 'test1', 'test1', 'test1', NULL, '/uploads/1746597419541-Screenshot 2568-04-02 at 20.04.10.png', '2025-05-07 05:56:59', 'cred-1746596876127', 'issuer', 1);

-- --------------------------------------------------------

--
-- Table structure for table `credential_requests`
--

CREATE TABLE `credential_requests` (
  `id` int(11) NOT NULL,
  `credentialType` varchar(100) NOT NULL,
  `issuerName` varchar(255) NOT NULL,
  `subjectDID` varchar(255) NOT NULL,
  `issueDate` date NOT NULL,
  `expiryDate` date DEFAULT NULL,
  `description` text NOT NULL,
  `filePath` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `issuerDID` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'not found',
  `credentialID` varchar(255) DEFAULT NULL,
  `submittedBy` enum('user','issuer','duplicate') NOT NULL,
  `onChainRevoked` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `credential_requests`
--

INSERT INTO `credential_requests` (`id`, `credentialType`, `issuerName`, `subjectDID`, `issueDate`, `expiryDate`, `description`, `filePath`, `created_at`, `issuerDID`, `status`, `credentialID`, `submittedBy`, `onChainRevoked`) VALUES
(173, 'Degree', 'TOEIC', 'did:example:vf5jbrrc5w', '2025-05-01', '2025-05-01', 'test1', '/uploads/1746596548416-Screenshot 2568-04-02 at 20.04.10.png', '2025-05-07 05:42:28', 'did:decentrald:2c39dbf7-d23b-4723-a107-2c42025bdf8e', 'active', 'cred-1746596517546', 'user', 0),
(174, 'Degree', 'TOEIC', 'did:example:vf5jbrrc5w', '2025-05-01', '2025-05-01', 'test2', '/uploads/1746597423885-Screenshot 2568-04-02 at 20.04.10.png', '2025-05-07 05:57:03', 'did:decentrald:2c39dbf7-d23b-4723-a107-2c42025bdf8e', 'revoked', 'cred-1746596876127', 'user', 1);

-- --------------------------------------------------------

--
-- Table structure for table `issuers`
--

CREATE TABLE `issuers` (
  `id` int(11) NOT NULL,
  `organizationName` varchar(255) NOT NULL,
  `organizationType` varchar(100) DEFAULT NULL,
  `domain` varchar(255) NOT NULL,
  `organizationEmail` varchar(255) NOT NULL,
  `country` varchar(100) DEFAULT NULL,
  `adminName` varchar(255) NOT NULL,
  `adminEmail` varchar(255) NOT NULL,
  `adminPhone` varchar(50) DEFAULT NULL,
  `issuerDID` varchar(255) DEFAULT NULL,
  `publicKey` text,
  `dnsToken` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `issuers`
--

INSERT INTO `issuers` (`id`, `organizationName`, `organizationType`, `domain`, `organizationEmail`, `country`, `adminName`, `adminEmail`, `adminPhone`, `issuerDID`, `publicKey`, `dnsToken`, `logo`, `password`, `created_at`) VALUES
(1, 'IELTS', 'Testing Service', 'ielts.org', 'ielts@gmail.com', 'United Kingdom', 'Nut Qwe', 'nut@kuay.com', '', '', '', 'xyz123abc', '363500866f35958bd91e6fdfcb3a3090', '$2b$10$hGnzNALar1TI6zYDXogNGODa1KKvNwa7a536gmZ.vg5ym3ooJnyda', '2025-04-26 18:20:43'),
(3, 'TOEIC', 'NGO', 'TOEIC.ac.th', 'TOEIC@gmail.com', 'Thailand', 'test', 'test@gmail.com', 'test', 'did:decentrald:2c39dbf7-d23b-4723-a107-2c42025bdf8e', '', 'xyz123abc', '1745989889864-Screenshot 2568-04-02 at 20.04.10.png', '$2b$10$6YiU4Ic7dS1nEaEihChbeekPegSDBPlOdlvUiDEGWIzAoifJZUEjC', '2025-04-30 05:11:29');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `did` varchar(255) NOT NULL,
  `fullName` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `user_data` json DEFAULT NULL,
  `dateOfBirth` date DEFAULT NULL,
  `nationality` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `did`, `fullName`, `username`, `email`, `password`, `user_data`, `dateOfBirth`, `nationality`) VALUES
(1, 'did:example:0uio468pu8', 'Krittinatt', 'test', 'p@gmail.com', '$2b$10$SbqFzbtmqhpMa67VblagvOo4295kNBwX4cO3.boRf/g02FGYj4k0G', '{\"email\": \"p@gmail.com\", \"fullName\": \"Krittinat\", \"username\": \"test\"}', '2004-10-29', 'Thai'),
(4, 'did:example:bt7fw5pb94', 'Krittinat', 'test1', 'k@gmail.com', '$2b$10$wX9v5qB5at/KFXdS24FEDOYmAZZGzD46t8XDEx9H1MsDFVXkMGXHi', '{\"email\": \"k@gmail.com\", \"fullName\": \"Krittinat\", \"username\": \"test1\"}', NULL, NULL),
(7, 'did:example:vf5jbrrc5w', 'nut', 'nut', 'nut@gmail.com', '$2b$10$zCaqZHwOLYC8pb02GmvDxemt4JkGYhN3VKvd0TDcdNcv1ZrAmBBsW', '{\"email\": \"nut@gmail.com\", \"fullName\": \"nut\", \"username\": \"nut\"}', '2025-05-09', 'thai');

-- --------------------------------------------------------

--
-- Table structure for table `user_settings`
--

CREATE TABLE `user_settings` (
  `id` int(11) NOT NULL,
  `did` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `bio` text,
  `profilePicture` varchar(255) DEFAULT NULL,
  `privacy` tinyint(1) DEFAULT '1',
  `credentialVisibility` tinyint(1) DEFAULT '1',
  `discoverable` tinyint(1) DEFAULT '1',
  `notifEmail` tinyint(1) DEFAULT '1',
  `notifCred` tinyint(1) DEFAULT '1',
  `notifShare` tinyint(1) DEFAULT '1',
  `notifSystem` tinyint(1) DEFAULT '1',
  `language` varchar(50) DEFAULT 'English',
  `blockedUsers` text,
  `connectedWallets` text,
  `twoFA` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `credentials`
--
ALTER TABLE `credentials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `credential_requests`
--
ALTER TABLE `credential_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `issuers`
--
ALTER TABLE `issuers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `domain` (`domain`),
  ADD UNIQUE KEY `organizationEmail` (`organizationEmail`),
  ADD UNIQUE KEY `adminEmail` (`adminEmail`),
  ADD UNIQUE KEY `issuerDID` (`issuerDID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `did` (`did`),
  ADD UNIQUE KEY `did_2` (`did`),
  ADD UNIQUE KEY `did_3` (`did`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `username_2` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_settings`
--
ALTER TABLE `user_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `did` (`did`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `credentials`
--
ALTER TABLE `credentials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT for table `credential_requests`
--
ALTER TABLE `credential_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=175;

--
-- AUTO_INCREMENT for table `issuers`
--
ALTER TABLE `issuers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `user_settings`
--
ALTER TABLE `user_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
