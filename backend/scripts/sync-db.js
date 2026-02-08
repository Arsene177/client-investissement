const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function syncDatabase() {
    console.log('🔄 Starting Database Synchronization...');

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME || 'prosper_invest',
        multipleStatements: true
    });

    try {
        const schemaPath = path.join(__dirname, '../../database/schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Reading schema.sql...');

        // Split by semicolons but ignore those within quotes if any (simple split works for this schema)
        // However, with multipleStatements: true, we can just run the whole thing or large chunks.
        // We'll run the whole file at once.

        await connection.query(schemaSql);

        console.log('✅ Database synchronized successfully!');
    } catch (err) {
        console.error('❌ Sync failed:', err.message);
    } finally {
        await connection.end();
        process.exit();
    }
}

syncDatabase();
