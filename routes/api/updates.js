const express = require('express');
const router = express.Router();
const pool = require('../../database');

router.get('/', async (req, res) => {
  try {
    const [updates] = await pool.query('SELECT * FROM updates ORDER BY created_at DESC LIMIT 10');
    res.json(updates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;