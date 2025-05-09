-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 22, 2025 at 08:59 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `contenthub`
--

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `category` varchar(50) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'published',
  `image_url` varchar(255) DEFAULT NULL,
  `views` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `title`, `content`, `category`, `status`, `image_url`, `views`, `created_at`, `updated_at`) VALUES
(1, 'Getting Started with Node.js', 'Learn the basics of Node.js and how to build server-side applications with JavaScript.', 'Technology', 'published', 'https://images.unsplash.com/photo-1542831371-29b0f74f9713', 0, '2025-04-22 06:10:10', '2025-04-22 06:10:10'),
(2, 'Express.js Fundamentals', 'Understanding Express.js, the most popular Node.js framework,', 'Development', 'published', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c', 0, '2025-04-22 06:10:10', '2025-04-22 01:04:00'),
(3, 'Working with MySQL Databases', 'Learn how to connect Node.js applications to MySQL databases.', 'Database', 'published', 'https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19', 0, '2025-04-22 06:10:10', '2025-04-22 06:10:10'),
(5, 'The Rise of Artificial Intelligence in Modern Technology', 'Artificial Intelligence (AI) has transformed numerous industries over the last decade, from healthcare and finance to entertainment and logistics. It powers everything from voice assistants like Siri and Alexa to self-driving cars and personalized marketing strategies. The technology enables systems to learn from data, improve over time, and automate complex tasks, significantly increasing efficiency and accuracy.\n\nAI is not only reshaping existing industries but also creating new ones. With advancements in machine learning, deep learning, and neural networks, AI continues to drive innovation. As it becomes more integrated into everyday life, ethical concerns about privacy, job displacement, and algorithmic biases arise, making it critical for developers and policymakers to balance innovation with responsibility.\n\nAs we move forward, AI is expected to further enhance the digital landscape, offering smarter solutions and more personalized experiences. While there are challenges, the potential benefits of AI are immense, and it is clear that the technology will play a central role in shaping the future.', 'Technology', 'draft', 'https://miro.medium.com/v2/resize:fit:1400/1*zr8278lMqa9W9SeX1BPNyQ.png', 0, '2025-04-22 06:33:24', '2025-04-22 06:33:24');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
