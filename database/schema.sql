-- Database Schema for AUREUS Wealth Management (Updated for Countries & Plans)

CREATE DATABASE IF NOT EXISTS aureus_wealth;
USE aureus_wealth;

-- DROP tables if they exist to ensure clean schema (CAUTION: deletes data)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS investment_plans;
DROP TABLE IF EXISTS countries;
SET FOREIGN_KEY_CHECKS = 1;

-- Countries table
CREATE TABLE countries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code CHAR(2) NOT NULL UNIQUE,
    flag VARCHAR(10) -- Emoji flag
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('client', 'admin') DEFAULT 'client',
    full_name VARCHAR(100),
    selected_country_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    FOREIGN KEY (selected_country_id) REFERENCES countries(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Investment Plans table
CREATE TABLE IF NOT EXISTS investment_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    roi VARCHAR(20) NOT NULL, -- e.g., "6-8%"
    min_deposit VARCHAR(50) NOT NULL, -- e.g., "$50,000"
    risk ENUM('Low', 'Moderate', 'High', 'Very High') DEFAULT 'Moderate',
    focus VARCHAR(255),
    country_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Data: Countries
INSERT IGNORE INTO countries (id, name, code, flag) VALUES 
(1, 'USA', 'US', '🇺🇸'),
(2, 'France', 'FR', '🇫🇷'),
(3, 'Cameroon', 'CM', '🇨🇲'),
(4, 'Nigeria', 'NG', '🇳🇬'),
(5, 'United Kingdom', 'GB', '🇬🇧');

-- Seed Data: Investment Plans (USA)
INSERT IGNORE INTO investment_plans (name, roi, min_deposit, risk, focus, country_id) VALUES 
('Balanced Tech Portfolio', '8-12%', '$100,000', 'Moderate', 'US Tech Giants & REITs', 1),
('S&P 500 Dividend Fund', '4-7%', '$25,000', 'Low', 'Dividend-paying Blue Chips', 1);

-- Seed Data: Investment Plans (France)
INSERT IGNORE INTO investment_plans (name, roi, min_deposit, risk, focus, country_id) VALUES 
('European Green Energy', '6-9%', '€50,000', 'Moderate', 'EU Core Renewable Assets', 2),
('Paris Real Estate Bond', '4-5%', '€100,000', 'Low', 'Luxury Commercial Property', 2);

-- Seed Data: Investment Plans (Cameroon)
INSERT IGNORE INTO investment_plans (name, roi, min_deposit, risk, focus, country_id) VALUES 
('Agri-Growth Initiative', '15-20%', '500,000 XAF', 'High', 'Cocoa & Coffee Exporting', 3),
('Douala Infrastructure Fund', '10-12%', '2,000,000 XAF', 'Moderate', 'Urban Real Estate Development', 3);

-- Seed Data: Default Demo Users
INSERT IGNORE INTO users (username, email, password, role, full_name, selected_country_id) VALUES 
('client_demo', 'client@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'client', 'John Client', 1),
('admin_user', 'admin@aureus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Lead Admin', 1);
