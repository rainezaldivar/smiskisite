-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 05, 2025 at 06:26 PM
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
-- Database: `smiski_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT 'default.jpg',
  `category` varchar(255) NOT NULL,
  `stock` int(25) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `description`, `image`, `category`, `stock`, `created_at`, `updated_at`) VALUES
(1, 'SMISKI Series 1', 499.00, 'SMISKI are curious little creatures that love hiding in small spaces and corners of your room. Although they like to stay hidden, you might discover one at night as they mysteriously glow in the dark.', 'series1.png', 'Figurines', 50, '2025-11-04 16:16:38', '2025-11-04 22:23:36'),
(2, 'SMISKI Series 2', 499.00, 'SMISKI are curious little creatures that love hiding in small spaces and corners of your room. Although they like to stay hidden, you might discover one at night as they mysteriously glow in the dark.', 'series2.png', 'Figurines', 0, '2025-11-04 16:16:38', '2025-11-04 22:23:43'),
(3, 'SMISKI Series 3', 499.00, 'SMISKI are curious little creatures that love hiding in small spaces and corners of your room. Although they like to stay hidden, you might discover one at night as they mysteriously glow in the dark.', 'series3.png', 'Figurines', 0, '2025-11-04 16:16:38', '2025-11-04 22:23:48'),
(4, 'SMISKI Series 4', 499.00, 'SMISKI are curious little creatures that love hiding in small spaces and corners of your room. Although they like to stay hidden, you might discover one at night as they mysteriously glow in the dark.', 'series4.png', 'Figurines', 0, '2025-11-04 16:16:38', '2025-11-04 22:23:54'),
(5, 'SMISKI Toilet Series', 499.00, 'SMISKI are curious little creatures that love hiding in small spaces and corners of your room. Although they like to stay hidden, you might discover one at night as they mysteriously glow in the dark.', 'toilet.png', 'Figurines', 35, '2025-11-04 16:16:38', '2025-11-04 22:53:04'),
(6, 'SMISKI Bath Series', 499.00, 'SMISKI are curious little creatures that love hiding in small spaces and corners of your room. Although they like to stay hidden, you might discover one at night as they mysteriously glow in the dark.', 'bath.png', 'Figurines', 85, '2025-11-04 16:16:38', '2025-11-04 22:24:28'),
(7, 'SMISKI Living Series', 499.00, 'SMISKI are curious little creatures that love hiding in small spaces and corners of your room. Although they like to stay hidden, you might discover one at night as they mysteriously glow in the dark.', 'living.png', 'Figurines', 12, '2025-11-04 16:16:38', '2025-11-04 22:24:38'),
(8, 'SMISKI Bed Series', 499.00, 'SMISKI are curious little creatures that love hiding in small spaces and corners of your room. Although they like to stay hidden, you might discover one at night as they mysteriously glow in the dark.', 'bed.png', 'Figurines', 10, '2025-11-04 16:16:38', '2025-11-04 22:25:04'),
(9, 'SMISKI Yoga Series', 499.00, 'SMISKI are curious little creatures that love hiding in small spaces and corners of your room. Although they like to stay hidden, you might discover one at night as they mysteriously glow in the dark.', 'yoga.png', 'Figurines', 8, '2025-11-04 16:16:38', '2025-11-04 22:25:10'),
(10, 'SMISKI Cheer Series', 499.00, 'SMISKI are curious little creatures that love hiding in small spaces and corners of your room. Although they like to stay hidden, you might discover one at night as they mysteriously glow in the dark.', 'cheer.png', 'Figurines', 10, '2025-11-04 16:16:38', '2025-11-04 22:25:18'),
(11, 'SMISKI Museum Series', 499.00, 'SMISKI are curious little creatures that love hiding in small spaces and corners of your room. Although they like to stay hidden, you might discover one at night as they mysteriously glow in the dark.', 'museum.png', 'Figurines', 15, '2025-11-04 16:16:38', '2025-11-04 22:25:23'),
(12, 'SMISKI Work Series', 499.00, 'SMISKI are curious little creatures that love hiding in small spaces and corners of your room. Although they like to stay hidden, you might discover one at night as they mysteriously glow in the dark.', 'work.png', 'Figurines', 73, '2025-11-04 16:16:38', '2025-11-04 22:25:35'),
(13, 'SMISKI Dressing Series', 499.00, 'SMISKI are curious little creatures that love hiding in small spaces and corners of your room. Although they like to stay hidden, you might discover one at night as they mysteriously glow in the dark.', 'dressing.png', 'Figurines', 65, '2025-11-04 16:16:38', '2025-11-04 22:26:29'),
(14, 'SMISKI Exercise Series', 499.00, 'SMISKI are curious little creatures that love hiding in small spaces and corners of your room. Although they like to stay hidden, you might discover one at night as they mysteriously glow in the dark.', 'exercise.png', 'Figurines', 111, '2025-11-04 16:16:38', '2025-11-04 22:26:36'),
(15, 'SMISKI Moving Series', 499.00, 'SMISKI are curious little creatures that love hiding in small spaces and corners of your room. Although they like to stay hidden, you might discover one at night as they mysteriously glow in the dark.', 'moving.png', 'Figurines', 20, '2025-11-04 16:16:38', '2025-11-04 22:26:43'),
(16, 'SMISKI Sunday Series', 499.00, 'SMISKI are curious little creatures that love hiding in small spaces and corners of your room. Although they like to stay hidden, you might discover one at night as they mysteriously glow in the dark.', 'sunday.png', 'Figurines', 30, '2025-11-04 16:16:38', '2025-11-04 22:26:50'),
(17, 'SMISKI Birthday Series', 499.00, 'SMISKI are curious little creatures that love hiding in small spaces and corners of your room. Although they like to stay hidden, you might discover one at night as they mysteriously glow in the dark.', 'birthday.png', 'Figurines', 21, '2025-11-04 16:16:38', '2025-11-04 22:26:58'),
(18, 'SMISKI Hippers Series', 599.00, 'SMISKI are curious little creatures that love hiding in small spaces and corners of your room. Although they like to stay hidden, you might discover one at night as they mysteriously glow in the dark.', 'hippers.png', 'Others', 10, '2025-11-04 16:16:38', '2025-11-04 22:27:04'),
(19, 'SMISKI Sensor Light', 2200.00, 'Lights up automatically for approx. 20 secs. After light goes out, Smiski will start glow in the dark.', 'sensor.png', 'Others', 0, '2025-11-04 19:44:41', '2025-11-04 22:32:04'),
(20, 'SMISKI Strap Accessories Series 1', 299.00, 'Celebrating its 10th anniversary this year, SMISKI, the fairy who watches over you and loves corner, is now available as a mini-sized strap. From inside the surreal and adorable capsules shaped like SMISKI\'s faces, SMISKI with unique personalities emerge and quietly watch over you. From the ever-popular mini figure series \"SMISKI Series 1,\" there are a total of 6 kinds + 1 secret.', 'strap1.png', 'Others', 35, '2025-11-04 19:44:41', '2025-11-04 22:32:12'),
(21, 'SMISKI Strap Accessories Series 2', 299.00, 'Celebrating its 10th anniversary this year, SMISKI, the fairy who watches over you and loves corner, is now available as a mini-sized strap. From inside the surreal and adorable capsules shaped like SMISKI\'s faces, SMISKI with unique personalities emerge and quietly watch over you. From the ever-popular mini figure series \"SMISKI Series 2,\" there are a total of 6 kinds + 1 secret.', 'strap2.png', 'Others', 40, '2025-11-04 19:44:41', '2025-11-04 22:32:20'),
(22, 'SMISKI Toothbrush Stand (Protecting)', 549.00, '“I’m taking cover of your toothbrush…” \r\n\r\nSMISKI Toothbrush Stand! SMISKI are now here to hold your toothbrush! Each seems to be struggling how to carry on. \r\nSMISKI Protecting, SMISKI Holding, SMISKI Hugging, and SMISKI Carrying. Choose your favorite from 4 kinds!', 'protecting.png', 'Others', 20, '2025-11-04 19:44:41', '2025-11-05 00:33:52'),
(23, 'SMISKI Toothbrush Stand (Holding)', 549.00, '“I’m taking cover of your toothbrush…” SMISKI Toothbrush Stand! SMISKI are now here to hold your toothbrush! Each seems to be struggling how to carry on. SMISKI Protecting, SMISKI Holding, SMISKI Hugging, and SMISKI Carrying. Choose your favorite from 4 kinds!', 'holding.png', 'Others', 22, '2025-11-04 19:44:41', '2025-11-04 22:32:35'),
(24, 'SMISKI Toothbrush Stand (Hugging)', 549.00, '“I’m taking cover of your toothbrush…” SMISKI Toothbrush Stand! SMISKI are now here to hold your toothbrush! Each seems to be struggling how to carry on. SMISKI Protecting, SMISKI Holding, SMISKI Hugging, and SMISKI Carrying. Choose your favorite from 4 kinds!', 'hugging.png', 'Others', 18, '2025-11-04 19:44:41', '2025-11-04 22:32:47'),
(25, 'SMISKI Toothbrush Stand (Carrying)', 549.00, '“I’m taking cover of your toothbrush…” SMISKI Toothbrush Stand! SMISKI are now here to hold your toothbrush! Each seems to be struggling how to carry on. SMISKI Protecting, SMISKI Holding, SMISKI Hugging, and SMISKI Carrying. Choose your favorite from 4 kinds!', 'carrying.png', 'Others', 25, '2025-11-04 19:44:41', '2025-11-04 22:33:03'),
(26, 'SMISKI Keychain (Grabbing)', 549.00, '“I have an eye on your keys...” SMISKI Key Chain! SMISKI doing his best to protect keys in your bag is so adorable. It glows in the dark making you easy to find keys missing in bag.', 'keygrabbing.png', 'Others', 30, '2025-11-04 19:44:41', '2025-11-04 22:33:11'),
(27, 'SMISKI Keychain (Carrying)', 549.00, '“I have an eye on your keys...” SMISKI Key Chain! SMISKI doing his best to protect keys in your bag is so adorable. It glows in the dark making you easy to find keys missing in bag.', 'keycarrying.png', 'Others', 30, '2025-11-04 19:44:41', '2025-11-04 22:33:22'),
(28, 'SMISKI Keychain (Pulling)', 549.00, '“I have an eye on your keys...” SMISKI Key Chain! SMISKI doing his best to protect keys in your bag is so adorable. It glows in the dark making you easy to find keys missing in bag.', 'keypulling.png', 'Others', 28, '2025-11-04 19:44:41', '2025-11-04 22:33:35'),
(29, 'SMISKI Zipperbite Vol.1 (Hanging On!)', 399.99, '\"CABLE BITES\", created by Dreams in 2017, which became a global phenomenon with over 10 million units sold worldwide, takes on new form in “ZIPPERBITES”. “SMISKI”, a mysterious creature who watches over you and who loves corners, is added to our lineup of zipper accessories, \"ZIPPERBITE\"! New SMISKI figures have been discovered clinging to your favorite zipper to quietly watch over you. You can attach Smiski Zipperbites to a variety of zippers—jackets or coats, backpacks, pen cases—anything with an appropriately sized zipper pull. \"ZIPPERBITE\", a unique new product from Dreams Inc. is attached by hooking it onto the hole of the zipper pull. SMISKI Hanging is a curious fellow. He is found on your favorite zipper where he hangs quietly, confidently and in control.', 'ziphangon.png', 'Others', 45, '2025-11-04 19:44:41', '2025-11-04 22:33:52'),
(30, 'SMISKI Zipperbite Vol.1 (Hugging Knees)', 399.99, '\"CABLE BITES\", created by Dreams in 2017, which became a global phenomenon with over 10 million units sold worldwide, takes on new form in “ZIPPERBITES”. “SMISKI”, a mysterious creature who watches over you and who loves corners, is added to our lineup of zipper accessories, \"ZIPPERBITE\"! New SMISKI figures have been discovered clinging to your favorite zipper to quietly watch over you. You can attach Smiski Zipperbites to a variety of zippers—jackets or coats, backpacks, pen cases—anything with an appropriately sized zipper pull. \"ZIPPERBITE\", a unique new product from Dreams Inc. is attached by hooking it onto the hole of the zipper pull. SMISKI Hugging Knees sits quietly in a corner where you might find it. When attached to your zipper, SMISKI Hugging Knees is a zen-like figure.', 'ziphugknees.png', 'Others', 50, '2025-11-04 19:44:41', '2025-11-04 22:34:09'),
(31, 'SMISKI Zipperbite Vol.2 (Lotus Pose / Yoga Series)', 399.99, 'The second edition of the popular SMISKI ZIPPERBITE is here! Usually, SMISKI waits in the corner of your room, but with SMISKI ZIPPERBITE they can attach to your bags, pouches, or hoodies—anything with a zipper—to quietly watch over you wherever you go! Attach your favorite SMISKI to any zipper and showcase your unique personal style. SMISKI wants to calm his mind. This pose is said to have a relaxing effect.', 'ziplotus.png', 'Others', 42, '2025-11-04 19:44:41', '2025-11-04 22:34:17'),
(32, 'SMISKI Zipperbite Vol.2 (Falling Down / Moving Series)', 399.99, 'The second edition of the popular SMISKI ZIPPERBITE is here! Usually, SMISKI waits in the corner of your room, but with SMISKI ZIPPERBITE they can attach to your bags, pouches, or hoodies—anything with a zipper—to quietly watch over you wherever you go! Attach your favorite SMISKI to any zipper and showcase your unique personal style. SMISKI trips and falls with his package. Is the package damaged?', 'zipfall.png', 'Others', 38, '2025-11-04 19:44:41', '2025-11-04 22:34:28'),
(33, 'SMISKI Cushion Pouch', 629.00, 'Take SMISKI out with the SMISKI Cushion Pouch! Each pouch is large enough to hold everyday accessories like earphones, cables, and even a small mobile phone battery—and each is lined with a cushioning material to protect what you keep inside! It comes fitted with a “SMISKI Hugging Knees” charm on the zipper. The pouch’s included carabiner makes it easy to attach to any bag, belt loop, backpack for easy convenience! It’s the perfect item for commuting, traveling, or everyday casual outings.', 'pouch.png', 'Others', 0, '2025-11-04 21:45:15', '2025-11-04 22:34:36'),
(34, 'SMISKI Plush Key Chain (Hugging Knees)', 799.00, 'To celebrate the 10th anniversary of SMISKI, the first plush keychain is here! From the mysterious creatures who love hiding in corners, comes the new SMISKI Plush Key Chain. With SMISKI by your side, even ordinary moments become just a little more special. Attach the SMISKI mascot charm to your favorite items and take them along on your adventures! Whether it\'s on your backpack, shoulder bag, or keys, SMISKI can keep you company during your daily commute, school, or weekend outings. Take the SMISKI Plush Keychain with you and create memories that are uniquely yours.', 'plushhugknees.png', 'Others', 25, '2025-11-04 21:45:15', '2025-11-04 22:34:45'),
(35, 'SMISKI Plush Key Chain (Hanging On!)', 799.00, 'To celebrate the 10th anniversary of SMISKI, the first plush keychain is here! From the mysterious creatures who love hiding in corners, comes the new SMISKI Plush Key Chain. With SMISKI by your side, even ordinary moments become just a little more special. Attach the SMISKI mascot charm to your favorite items and take them along on your adventures! Whether it\'s on your backpack, shoulder bag, or keys, SMISKI can keep you company during your daily commute, school, or weekend outings. Take the SMISKI Plush Keychain with you and create memories that are uniquely yours.', 'plushhangon.png', 'Others', 30, '2025-11-04 21:45:15', '2025-11-04 22:35:10'),
(36, 'SMISKI Embroidery Sticker vol.1 (Hugging Knees)', 209.00, 'SMISKI, who is celebrating their 10th anniversary this year, is now available in the form of a stylish self-adhesive embroidery sticker! Easily decorate your surroundings with the self-adhesive sticker backing for your smartphone or notebook—or use them as iron-on patches for your T-shirts and tote bags. Made from embroidered material, each sticker blends perfectly with fabric products and fashion items, making them a great accessory for everyday use! The SMISKI Embroidery Sticker features three poses from the Series 1 mini figure lineup: SMISKI Hugging Knees, SMISKI Lounging, and SMISKI Peeking. Always in the corner hugging onto the knees, staring out into the distance pensive in thought.', 'patchknees.png', 'Others', 40, '2025-11-04 21:45:15', '2025-11-04 22:36:59'),
(37, 'SMISKI Embroidery Sticker vol.1 (Lounging)', 209.00, 'SMISKI, who is celebrating their 10th anniversary this year, is now available in the form of a stylish self-adhesive embroidery sticker! Easily decorate your surroundings with the self-adhesive sticker backing for your smartphone or notebook—or use them as iron-on patches for your T-shirts and tote bags. Made from embroidered material, each sticker blends perfectly with fabric products and fashion items, making them a great accessory for everyday use! The SMISKI Embroidery Sticker features three poses from the Series 1 mini figure lineup: SMISKI Hugging Knees, SMISKI Lounging, and SMISKI Peeking. A lazy Smiski that likes to lie down and lounge about. Does not like anything that involves moving or exercise.', 'patchlounging.png', 'Others', 38, '2025-11-04 21:45:15', '2025-11-04 22:37:10'),
(38, 'SMISKI Embroidery Sticker vol.1 (Peeking)', 209.00, 'SMISKI, who is celebrating their 10th anniversary this year, is now available in the form of a stylish self-adhesive embroidery sticker! Easily decorate your surroundings with the self-adhesive sticker backing for your smartphone or notebook—or use them as iron-on patches for your T-shirts and tote bags. Made from embroidered material, each sticker blends perfectly with fabric products and fashion items, making them a great accessory for everyday use! The SMISKI Embroidery Sticker features three poses from the Series 1 mini figure lineup: SMISKI Hugging Knees, SMISKI Lounging, and SMISKI Peeking. Always hunched over and peeking in from the corner. Needs to gather up courage before approaching anything.', 'patchpeek.png', 'Others', 36, '2025-11-04 21:45:15', '2025-11-04 22:37:24'),
(39, 'SMISKI Embroidery Sticker vol.2 (Peeking 2)', 209.00, 'The new Vol. 2 lineup features three popular poses from the mini figure SMISKI Series 2 and SMISKI Series 3 collections: SMISKI Peeking, SMISKI Pushing, and SMISKI Little. Attach each embroidery sticker directly to your accessories with the self-adhesive backing, or use an iron to secure them as patches to clothing! Thanks to the embroidered texture, they blend naturally with fabric items like clothes or pouches and are perfect for daily use. Decorate your everyday items with a touch of SMISKI whimsy. A playful Smiski who likes to look out at the world from an upside down point of view.', 'patchpeek2.png', 'Others', 42, '2025-11-04 21:45:15', '2025-11-04 22:38:48'),
(40, 'SMISKI Embroidery Sticker vol.2 (Pushing)', 209.00, 'The new Vol. 2 lineup features three popular poses from the mini figure SMISKI Series 2 and SMISKI Series 3 collections: SMISKI Peeking, SMISKI Pushing, and SMISKI Little. Attach each embroidery sticker directly to your accessories with the self-adhesive backing, or use an iron to secure them as patches to clothing! Thanks to the embroidered texture, they blend naturally with fabric items like clothes or pouches and are perfect for daily use. Decorate your everyday items with a touch of SMISKI whimsy. Always pushing things together to create the perfect hiding spot.', 'patchpush.png', 'Others', 37, '2025-11-04 21:45:15', '2025-11-04 22:39:00'),
(41, 'SMISKI Embroidery Sticker vol.2 (Little)', 209.00, 'The new Vol. 2 lineup features three popular poses from the mini figure SMISKI Series 2 and SMISKI Series 3 collections: SMISKI Peeking, SMISKI Pushing, and SMISKI Little. Attach each embroidery sticker directly to your accessories with the self-adhesive backing, or use an iron to secure them as patches to clothing! Thanks to the embroidered texture, they blend naturally with fabric items like clothes or pouches and are perfect for daily use. Decorate your everyday items with a touch of SMISKI whimsy. Little Smiski have made their appearance! For some reason these little ones like to line up against the wall in this pose.', 'patchlittle.png', 'Others', 39, '2025-11-04 21:45:15', '2025-11-04 22:39:14'),
(42, 'SMISKI Touch Lamp', 2549.00, '\"Smiski Daydreaming\", which appeared in \"Living Series\", is now available as a touch light! Smiski is pondering with a small cat on his head that gently illuminates your room.', 'light.png', 'Others', 19, '2025-11-05 00:59:31', '2025-11-05 01:00:47');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','customer') NOT NULL DEFAULT 'customer',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
(9, 'raine', 'hoho@email.com', '$2y$10$SyTPDzrP9i1jKvWlmfkXd.Tss0KsZXNAHrfT.7ybaTQS11lTvjdj6', 'customer', '2025-11-03 17:09:10', '2025-11-03 17:09:10'),
(10, 'admin', 'admin@email.com', 'admin', 'admin', '2025-11-04 01:28:45', '2025-11-04 01:28:45');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
