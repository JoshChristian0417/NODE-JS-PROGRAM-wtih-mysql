const express = require('express');
const db = require('./db');

const app = express();

app.use(express.json());

// GET - Get all classmates
app.get('/classmates', (req, res) => {
    db.query('SELECT * FROM classmates', (err, results) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});

// GET - Get one classmate
app.get('/classmates/:id', (req, res) => {
    db.query(
        'SELECT * FROM classmates WHERE id = ?',
        [req.params.id],
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: 'classmate not found'
                });
            }

            res.json(results[0]);
        }
    );
});

// POST - Add classmate
app.post('/classmates', (req, res) => {
    const { name, course, age } = req.body;

    const sql = `
        INSERT INTO classmates (name, course, age)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [name, course, age], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.status(201).json({
            message: 'classmate added successfully',
            id: result.insertId
        });
    });
});

// PUT - Update classmate
app.put('/classmates/:id', (req, res) => {
    const { name, course, age } = req.body;

    const sql = `
        UPDATE classmates
        SET name = ?, course = ?, age = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [name, course, age, req.params.id],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'classmate not found'
                });
            }

            res.json({
                message: 'classmate updated successfully'
            });
        }
    );
});

// DELETE - Delete classmate
app.delete('/classmates/:id', (req, res) => {
    db.query(
        'DELETE FROM classmates WHERE id = ?',
        [req.params.id],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'classmate not found'
                });
            }

            res.json({
                message: 'classmate deleted successfully'
            });
        }
    );
});

// Start server
app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});