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
CREATE TABLE IF NOT EXISTS countries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code CHAR(2) NOT NULL UNIQUE,
    phone_code VARCHAR(10), -- e.g., "1", "237", "33"
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
    roi VARCHAR(20) NOT NULL,
    min_deposit VARCHAR(50) NOT NULL,
    risk ENUM('Low', 'Moderate', 'High', 'Very High') DEFAULT 'Moderate',
    focus VARCHAR(255),
    country_id INT DEFAULT NULL, -- NULL means Global / All Countries
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Data: Countries
INSERT IGNORE INTO countries (id, name, code, phone_code, flag) VALUES 
(1, 'USA', 'US', '1', '🇺🇸'),
(2, 'France', 'FR', '33', '🇫🇷'),
(3, 'Cameroon', 'CM', '237', '🇨🇲'),
(4, 'Nigeria', 'NG', '234', '🇳🇬'),
(5, 'United Kingdom', 'GB', '44', '🇬🇧'),
(6, 'Germany', 'DE', '49', '🇩🇪'),
(7, 'Canada', 'CA', '1', '🇨🇦'),
(8, 'Japan', 'JP', '81', '🇯🇵'),
(9, 'China', 'CN', '86', '🇨🇳'),
(10, 'Australia', 'AU', '61', '🇦🇺'),
(11, 'Brazil', 'BR', '55', '🇧🇷'),
(12, 'South Africa', 'ZA', '27', '🇿🇦'),
(13, 'Ivory Coast', 'CI', '225', '🇨🇮'),
(14, 'Senegal', 'SN', '221', '🇸🇳'),
(15, 'United Arab Emirates', 'AE', '971', '🇦🇪'),
(16, 'Switzerland', 'CH', '41', '🇨🇭'),
(17, 'Singapore', 'SG', '65', '🇸🇬'),
(18, 'India', 'IN', '91', '🇮🇳'),
(19, 'Mexico', 'MX', '52', '🇲🇽'),
(20, 'Egypt', 'EG', '20', '🇪🇬');

-- Seed Data: Admin User (password is 'password')
INSERT IGNORE INTO users (username, email, password, full_name, role) VALUES 
('admin_user', 'admin@prosperinvest.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Admin', 'admin');
