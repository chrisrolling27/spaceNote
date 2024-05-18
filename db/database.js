const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.db');
const schemaPath = path.resolve(__dirname, 'schema.sql');
const seedsPath = path.resolve(__dirname, 'seeds.sql');

const dbExists = fs.existsSync(dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to database');
        if (!dbExists) {
            initializeDatabase();
        }
    }
});

function initializeDatabase() {
    // Read and execute schema.sql
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    db.exec(schema, (err) => {
        if (err) {
            console.error('Could not initialize database schema', err);
        } else {
            console.log('Database schema initialized');
            // Read and execute seeds.sql
            const seeds = fs.readFileSync(seedsPath, 'utf-8');
            db.exec(seeds, (err) => {
                if (err) {
                    console.error('Could not seed database', err);
                } else {
                    console.log('Database seeded');
                }
            });
        }
    });
}

module.exports = db;
