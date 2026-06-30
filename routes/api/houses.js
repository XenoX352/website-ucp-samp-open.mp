const express = require('express');
const router = express.Router();
const pool = require('../../database');
const requireAuth = require('../../middleware/auth');

router.get('/', requireAuth, async (req, res) => {
  try {
    const [houses] = await pool.query(
      `SELECT h.* FROM houses h JOIN characters c ON h.houseOwner = c.pID WHERE c.UCP = ?`,
      [req.user.UCP]
    );
    res.json({ houses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const houseId = req.params.id;

    const [houseRows] = await pool.query(
      `SELECT h.*, c.Name as houseOwnerName FROM houses h JOIN characters c ON h.houseOwner = c.pID WHERE h.houseID = ? AND c.UCP = ?`,
      [houseId, req.user.UCP]
    );
    if (houseRows.length === 0) {
      return res.status(404).json({ error: 'House not found' });
    }
    const house = houseRows[0];

    const [members] = await pool.query(
      `SELECT c.Name, c.pID FROM house_members hm JOIN characters c ON hm.playerID = c.pID WHERE hm.houseID = ?`,
      [houseId]
    );

    const [inventory] = await pool.query(
      'SELECT * FROM house_inventory WHERE houseID = ?',
      [houseId]
    );

    const [vehicles] = await pool.query(
      'SELECT * FROM house_vehicles WHERE houseID = ?',
      [houseId]
    );

    res.json({
      house,
      members,
      inventory,
      vehicles
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;