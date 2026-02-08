const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- Country & Investment Plan Endpoints ---

// Get all countries
app.get('/api/countries', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM countries');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching countries:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get plans for a specific country
app.get('/api/plans/country/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.execute('SELECT * FROM investment_plans WHERE country_id = ?', [id]);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching plans:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update user country
app.put('/api/user/country', async (req, res) => {
    const { userId, countryId } = req.body;

    if (!userId || !countryId) {
        return res.status(400).json({ success: false, message: 'Missing userId or countryId' });
    }

    try {
        await pool.execute(
            'UPDATE users SET selected_country_id = ? WHERE id = ?',
            [countryId, userId]
        );

        // Fetch updated user to return
        const [rows] = await pool.execute('SELECT id, username, email, full_name, role, selected_country_id FROM users WHERE id = ?', [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, user: rows[0] });
    } catch (err) {
        console.error('Error updating user country:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000;

// Database connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Middleware to check database connection
app.use(async (req, res, next) => {
    try {
        await pool.getConnection();
        next();
    } catch (err) {
        console.error('Database connection failed:', err);
        res.status(500).json({ success: false, message: 'Database connection failed' });
    }
});

// Register Endpoint
app.post('/api/register', async (req, res) => {
    const { username, email, password, full_name } = req.body;

    if (!username || !email || !password || !full_name) {
        return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    try {
        // Check if user already exists
        const [existing] = await pool.execute(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existing.length > 0) {
            const isEmail = existing.some(u => u.email === email);
            return res.status(409).json({
                success: false,
                message: isEmail ? 'Email already exists' : 'Username already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user
        const [result] = await pool.execute(
            'INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)',
            [username, email, hashedPassword, full_name, 'client']
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            userId: result.insertId
        });

    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ success: false, message: 'Server error during registration' });
    }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Please provide username and password' });
    }

    try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Update last login (fire and forget)
        pool.execute('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                full_name: user.full_name,
                role: user.role
            }
        });

    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Auth Server running on http://localhost:${PORT}`);
});
