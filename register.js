CREATE DATABASE root;

USE root;

CREATE TABLE root (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(255)
);

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Your MySQL password
    database: 'user_database'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database');
});

// Handle user registration
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    // Insert user data into the database
    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(sql, [name, email, password], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'User registered successfully!' });
    });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent page reload

        // Get form values
        const name = document.querySelector("input[placeholder='Enter your name']").value;
        const email = document.querySelector("input[placeholder='Enter your email']").value;
        const password = document.querySelector("input[placeholder='Create password']").value;

        // Validate passwords match
        const confirmPassword = document.querySelector("input[placeholder='Confirm password']").value;
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // Send data to the backend
        fetch("http://localhost:5000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            form.reset(); // Reset form fields
        })
        .catch(error => console.error("Error:", error));
    });
});