const express = require('express');
const router = express.Router();
const pool = require('../../database');
const requireAuth = require('../../middleware/auth');

router.get('/stats', requireAuth, async (req, res) => {
  try {
    const [ucpCount] = await pool.query('SELECT COUNT(*) as count FROM playerucp');
    const [charCount] = await pool.query('SELECT COUNT(*) as count FROM characters');
    const [vehCount] = await pool.query('SELECT COUNT(*) as count FROM vehicle');
    const [houseCount] = await pool.query('SELECT COUNT(*) as count FROM houses');
    const [bizCount] = await pool.query('SELECT COUNT(*) as count FROM business');

    const [factionCounts] = await pool.query(
      'SELECT factionID, COUNT(*) as count FROM faction_members GROUP BY factionID'
    );
    const factions = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    factionCounts.forEach(f => { factions[f.factionID] = f.count; });

    const [announcements] = await pool.query(
      'SELECT id, title, content, description, author, created_at FROM announcements ORDER BY created_at DESC LIMIT 5'
    );
    const [updates] = await pool.query(
      'SELECT id, title, description, category, created_at FROM updates ORDER BY created_at DESC LIMIT 5'
    );

    res.json({
      totalUCP: ucpCount[0].count,
      totalCharacters: charCount[0].count,
      totalVehicles: vehCount[0].count,
      totalHouses: houseCount[0].count,
      totalBusinesses: bizCount[0].count,
      factionCounts: factions,
      announcements,
      updates,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/online', requireAuth, async (req, res) => {
  try {
    const [result] = await pool.query('SELECT COUNT(*) as online FROM playerucp WHERE IsOnline = 1');
    res.json({ online: result[0].online });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;