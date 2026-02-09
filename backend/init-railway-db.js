// Railway Database Initializer
// Run this with: node init-railway-db.js

const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDatabase() {
    console.log('🔌 Connecting to Railway MySQL...');

    // Get connection details from Railway variables
    // Make sure these are set in your .env file or Railway will provide them
    const connection = await mysql.createConnection({
        host: process.env.MYSQLHOST,
        user: process.env.MYSQLUSER,
        password: process.env.MYSQLPASSWORD,
        database: process.env.MYSQLDATABASE,
        port: process.env.MYSQLPORT || 3306
    });

    console.log('✅ Connected to database');

    try {
        // Drop existing tables
        console.log('🗑️  Dropping existing tables...');
        await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
        await connection.execute('DROP TABLE IF EXISTS users');
        await connection.execute('DROP TABLE IF EXISTS investment_plans');
        await connection.execute('DROP TABLE IF EXISTS countries');
        await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

        // Create countries table
        console.log('📋 Creating countries table...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS countries (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                code CHAR(2) NOT NULL UNIQUE,
                phone_code VARCHAR(10),
                flag VARCHAR(10)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        // Create users table
        console.log('👥 Creating users table...');
        await connection.execute(`
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
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        // Create investment_plans table
        console.log('💼 Creating investment_plans table...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS investment_plans (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                roi VARCHAR(20) NOT NULL,
                min_deposit VARCHAR(50) NOT NULL,
                risk ENUM('Low', 'Moderate', 'High', 'Very High') DEFAULT 'Moderate',
                focus VARCHAR(255),
                country_id INT DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        // Insert countries
        console.log('🌍 Inserting countries...');
        await connection.execute(`
            INSERT INTO countries (id, name, code, phone_code, flag) VALUES 
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
            (20, 'Egypt', 'EG', '20', '🇪🇬')
        `);

        // Insert admin user
        console.log('👤 Creating admin user...');
        await connection.execute(`
            INSERT INTO users (username, email, password, full_name, role) VALUES 
            ('admin_user', 'admin@prosperinvest.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Admin', 'admin')
        `);

        console.log('✅ Database initialized successfully!');
        console.log('📊 Summary:');
        console.log('   - 3 tables created');
        console.log('   - 20 countries inserted');
        console.log('   - 1 admin user created');
        console.log('');
        console.log('🔑 Admin credentials:');
        console.log('   Username: admin_user');
        console.log('   Email: admin@prosperinvest.com');
        console.log('   Password: password');

    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
    } finally {
        await connection.end();
        console.log('🔌 Connection closed');
    }
}

initializeDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Failed to initialize database:', error);
        process.exit(1);
    });
