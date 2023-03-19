-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : mysql
-- Généré le : dim. 19 mars 2023 à 11:01
-- Version du serveur : 8.0.30
-- Version de PHP : 8.0.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `hashkitty`
--

-- --------------------------------------------------------

--
-- Structure de la table `attack_mode`
--

CREATE TABLE `attack_mode` (
  `id` int NOT NULL,
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `mode` tinyint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='The attack modes enable by hashcat';

-- --------------------------------------------------------

--
-- Structure de la table `hashlist`
--

CREATE TABLE `hashlist` (
  `id` int NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastest_modification` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `number_of_cracked_passwords` int DEFAULT NULL,
  `hashtype_id` int NOT NULL,
  `cracked_output_file_name` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `hash_type`
--

CREATE TABLE `hash_type` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `type_number` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='The hash types enable by hashcat';

-- --------------------------------------------------------

--
-- Structure de la table `notification`
--

CREATE TABLE `notification` (
  `id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(10) NOT NULL,
  `message` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `options`
--

CREATE TABLE `options` (
  `id` int NOT NULL,
  `wordlist_id` int NOT NULL,
  `kernel_opti` tinyint(1) DEFAULT '0',
  `rule_name` varchar(100) DEFAULT NULL,
  `mask_query` varchar(100) DEFAULT NULL,
  `mask_filename` varchar(100) DEFAULT NULL,
  `attack_mode_id` int NOT NULL,
  `breakpoint_gpu_temperature` int DEFAULT (90),
  `workload_profile_id` int DEFAULT NULL,
  `cpu_only` tinyint(1) DEFAULT NULL,
  `potfile_name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Contain the options needed for using task and template_task';

-- --------------------------------------------------------

--
-- Structure de la table `task`
--

CREATE TABLE `task` (
  `id` int NOT NULL,
  `name` varchar(30) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `hashlist_id` int NOT NULL,
  `template_task_id` int DEFAULT NULL,
  `options_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ended_at` timestamp NULL DEFAULT NULL,
  `lastest_modification` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_finished` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `template_task`
--

CREATE TABLE `template_task` (
  `id` int NOT NULL COMMENT 'PRIMARY KEY of the table template task',
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` varchar(255) DEFAULT (_utf8mb4''),
  `options_id` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastest_modification` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `wordlist`
--

CREATE TABLE `wordlist` (
  `id` int NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `workload_profile`
--

CREATE TABLE `workload_profile` (
  `id` int NOT NULL,
  `profile_id` int NOT NULL,
  `power_consumation` varchar(15) NOT NULL,
  `desktop_impact` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Workload Profiles that are needed to increase or dicrease the speed of hashcat';

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `attack_mode`
--
ALTER TABLE `attack_mode`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `hashlist`
--
ALTER TABLE `hashlist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hashtype_id` (`hashtype_id`);

--
-- Index pour la table `hash_type`
--
ALTER TABLE `hash_type`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `options`
--
ALTER TABLE `options`
  ADD PRIMARY KEY (`id`),
  ADD KEY `attack_mode_id` (`attack_mode_id`),
  ADD KEY `workload_profile_id` (`workload_profile_id`),
  ADD KEY `wordlist_id` (`wordlist_id`);

--
-- Index pour la table `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hashlist_id` (`hashlist_id`),
  ADD KEY `template_task_id` (`template_task_id`),
  ADD KEY `task_options_id` (`options_id`);

--
-- Index pour la table `template_task`
--
ALTER TABLE `template_task`
  ADD PRIMARY KEY (`id`),
  ADD KEY `options_id` (`options_id`);

--
-- Index pour la table `wordlist`
--
ALTER TABLE `wordlist`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `workload_profile`
--
ALTER TABLE `workload_profile`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `attack_mode`
--
ALTER TABLE `attack_mode`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `hashlist`
--
ALTER TABLE `hashlist`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `hash_type`
--
ALTER TABLE `hash_type`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `options`
--
ALTER TABLE `options`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `task`
--
ALTER TABLE `task`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `template_task`
--
ALTER TABLE `template_task`
  MODIFY `id` int NOT NULL AUTO_INCREMENT COMMENT 'PRIMARY KEY of the table template task';

--
-- AUTO_INCREMENT pour la table `wordlist`
--
ALTER TABLE `wordlist`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `workload_profile`
--
ALTER TABLE `workload_profile`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `hashlist`
--
ALTER TABLE `hashlist`
  ADD CONSTRAINT `hashtype_id` FOREIGN KEY (`hashtype_id`) REFERENCES `hash_type` (`id`);

--
-- Contraintes pour la table `options`
--
ALTER TABLE `options`
  ADD CONSTRAINT `attack_mode_id` FOREIGN KEY (`attack_mode_id`) REFERENCES `attack_mode` (`id`),
  ADD CONSTRAINT `wordlist_id` FOREIGN KEY (`wordlist_id`) REFERENCES `wordlist` (`id`),
  ADD CONSTRAINT `workload_profile_id` FOREIGN KEY (`workload_profile_id`) REFERENCES `workload_profile` (`id`);

--
-- Contraintes pour la table `task`
--
ALTER TABLE `task`
  ADD CONSTRAINT `hashlist_id` FOREIGN KEY (`hashlist_id`) REFERENCES `hashlist` (`id`),
  ADD CONSTRAINT `task_options_id` FOREIGN KEY (`options_id`) REFERENCES `options` (`id`),
  ADD CONSTRAINT `template_task_id` FOREIGN KEY (`template_task_id`) REFERENCES `template_task` (`id`);

--
-- Contraintes pour la table `template_task`
--
ALTER TABLE `template_task`
  ADD CONSTRAINT `options_id` FOREIGN KEY (`options_id`) REFERENCES `options` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;