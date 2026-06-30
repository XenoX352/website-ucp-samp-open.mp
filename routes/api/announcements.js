const express = require('express');
const router = express.Router();
const pool = require('../../database');
const requireAuth = require('../../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, content, description, author, created_at FROM announcements ORDER BY created_at DESC LIMIT 10'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;