CREATE DATABASE IF NOT EXISTS `upstack-node` CHARACTER SET UTF8mb4 collate utf8mb4_general_ci;
USE `upstack-node`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(30) NOT NULL,
  `firstName` varchar(30) NOT NULL,
  `lastName` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` char(40) NOT NULL,
  `role` varchar(10) NOT NULL,
  `verificationToken` char(40) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=143 DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;
