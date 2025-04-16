const express = require('express');
const { Client } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');  // Import path module to serve static files

const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.json());  // To parse JSON request bodies
app.use(cors());  // Enable CORS for all origins

// Serve static files (frontend files) from the 'webapp-frontend' directory
app.use(express.static(path.join(__dirname, 'webapp-frontend')));

// PostgreSQL connection
const client = new Client({
    user: 'jugaadsingh',        // replace with your actual username
    host: 'localhost',
    database: 'mydb',           // replace with your DB name
    password: 'singh123',       // replace with your password if you set one
    port: 5432,
});

// Connect to the PostgreSQL database
client.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Database connection error:', err.stack));

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await client.query(
            'SELECT * FROM users WHERE username = $1 AND password = $2',
            [username, password]
        );

        if (result.rows.length > 0) {
            // Log the login attempt in the logins table
            await client.query(
                'INSERT INTO logins (username, login_time) VALUES ($1, NOW())',
                [username]
            );

            res.json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Error handling login:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
