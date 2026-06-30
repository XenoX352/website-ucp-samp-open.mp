const express = require('express');
const router = express.Router();
const pool = require('../../database');

function requireAdmin(req, res, next) {
  if (!req.user || req.user.AdminLevel < 1) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

router.use(requireAdmin);

router.get('/stats', async (req, res) => {
  try {
    const [ucp] = await pool.query('SELECT COUNT(*) as count FROM playerucp');
    const [chars] = await pool.query('SELECT COUNT(*) as count FROM characters');
    const [vehs] = await pool.query('SELECT COUNT(*) as count FROM vehicle');
    const [houses] = await pool.query('SELECT COUNT(*) as count FROM houses');
    const [biz] = await pool.query('SELECT COUNT(*) as count FROM business');
    const [bans] = await pool.query('SELECT COUNT(*) as count FROM playerban');
    const [online] = await pool.query('SELECT COUNT(*) as count FROM playerucp WHERE IsOnline = 1');
    const [donations] = await pool.query('SELECT COUNT(*) as count FROM donations');

    res.json({
      totalUCP: ucp[0].count,
      totalCharacters: chars[0].count,
      totalVehicles: vehs[0].count,
      totalHouses: houses[0].count,
      totalBusinesses: biz[0].count,
      totalBans: bans[0].count,
      onlinePlayers: online[0].count,
      totalDonations: donations[0].count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/ucp', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const [rows] = await pool.query(
      'SELECT ID, UCP, email, discordid, discord_username, AdminLevel, IsOnline, RegisterDate, LastLogin, mgold FROM playerucp ORDER BY ID DESC LIMIT ? OFFSET ?',
      [parseInt(limit), offset]
    );
    const [count] = await pool.query('SELECT COUNT(*) as total FROM playerucp');
    res.json({ data: rows, total: count[0].total, page: parseInt(page) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/ucp/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM playerucp WHERE ID = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/ucp/:id', async (req, res) => {
  const { UCP, email, discordid, AdminLevel, mgold } = req.body;
  try {
    await pool.query(
      'UPDATE playerucp SET UCP = ?, email = ?, discordid = ?, AdminLevel = ?, mgold = ? WHERE ID = ?',
      [UCP || '', email || '', discordid || '', AdminLevel || 0, mgold || 0, req.params.id]
    );
    res.json({ success: true, message: 'Updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});

router.delete('/ucp/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM playerucp WHERE ID = ?', [req.params.id]);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

router.get('/characters', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const [rows] = await pool.query('SELECT * FROM characters ORDER BY pID DESC LIMIT ? OFFSET ?', [parseInt(limit), offset]);
    const [count] = await pool.query('SELECT COUNT(*) as total FROM characters');
    res.json({ data: rows, total: count[0].total, page: parseInt(page) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/characters/:id', async (req, res) => {
  const { Name, Money, BankMoney, Level, AdminLevel, Skin, Health, Armor } = req.body;
  try {
    await pool.query(
      'UPDATE characters SET Name=?, Money=?, BankMoney=?, Level=?, AdminLevel=?, Skin=?, Health=?, Armor=? WHERE pID=?',
      [Name, Money, BankMoney, Level, AdminLevel, Skin, Health, Armor, req.params.id]
    );
    res.json({ success: true, message: 'Updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});

router.delete('/characters/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM characters WHERE pID = ?', [req.params.id]);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

router.get('/vehicles', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const [rows] = await pool.query(
      'SELECT v.*, c.Name as owner_name FROM vehicle v LEFT JOIN characters c ON v.vehOwner = c.pID ORDER BY vehID DESC LIMIT ? OFFSET ?',
      [parseInt(limit), offset]
    );
    const [count] = await pool.query('SELECT COUNT(*) as total FROM vehicle');
    res.json({ data: rows, total: count[0].total, page: parseInt(page) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/vehicles/:id', async (req, res) => {
  const { vehModel, vehPlate, vehHealth, vehFuel, vehLocked, vehInsurance } = req.body;
  try {
    await pool.query(
      'UPDATE vehicle SET vehModel=?, vehPlate=?, vehHealth=?, vehFuel=?, vehLocked=?, vehInsurance=? WHERE vehID=?',
      [vehModel, vehPlate, vehHealth, vehFuel, vehLocked, vehInsurance, req.params.id]
    );
    res.json({ success: true, message: 'Updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});

router.delete('/vehicles/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM vehicle WHERE vehID = ?', [req.params.id]);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

router.get('/houses', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT h.*, c.Name as owner_name FROM houses h LEFT JOIN characters c ON h.houseOwner = c.pID ORDER BY houseID DESC'
    );
    res.json({ data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/houses/:id', async (req, res) => {
  const { houseAddress, housePrice, houseVault, houseLocked, houseLevel } = req.body;
  try {
    await pool.query(
      'UPDATE houses SET houseAddress=?, housePrice=?, houseVault=?, houseLocked=?, houseLevel=? WHERE houseID=?',
      [houseAddress, housePrice, houseVault, houseLocked, houseLevel, req.params.id]
    );
    res.json({ success: true, message: 'Updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});

router.delete('/houses/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM houses WHERE houseID = ?', [req.params.id]);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

router.get('/businesses', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM business ORDER BY bizID DESC');
    res.json({ data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/businesses/:id', async (req, res) => {
  const { bizName, bizOwner, bizPrice, bizVault } = req.body;
  try {
    await pool.query(
      'UPDATE business SET bizName=?, bizOwner=?, bizPrice=?, bizVault=? WHERE bizID=?',
      [bizName, bizOwner, bizPrice, bizVault, req.params.id]
    );
    res.json({ success: true, message: 'Updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});

router.get('/logs', async (req, res) => {
  const { type, page = 1, limit = 30 } = req.query;
  const offset = (page - 1) * limit;
  try {
    let rows, count;
    const params = [parseInt(limit), offset];

    switch (type) {
      case 'faction':
        [rows] = await pool.query(
          'SELECT fl.*, f.factionName FROM faction_logs fl JOIN factions f ON fl.factionID = f.factionID ORDER BY fl.logID DESC LIMIT ? OFFSET ?',
          params
        );
        [count] = await pool.query('SELECT COUNT(*) as total FROM faction_logs');
        break;
      case 'ban':
        [rows] = await pool.query('SELECT * FROM playerban ORDER BY id DESC LIMIT ? OFFSET ?', params);
        [count] = await pool.query('SELECT COUNT(*) as total FROM playerban');
        break;
      case 'donation':
        [rows] = await pool.query(
          'SELECT d.*, p.UCP FROM donations d JOIN playerucp p ON d.user_id = p.ID ORDER BY d.id DESC LIMIT ? OFFSET ?',
          params
        );
        [count] = await pool.query('SELECT COUNT(*) as total FROM donations');
        break;
      default:
        [rows] = await pool.query(
          'SELECT fl.*, f.factionName FROM faction_logs fl JOIN factions f ON fl.factionID = f.factionID ORDER BY fl.logID DESC LIMIT ? OFFSET ?',
          params
        );
        [count] = await pool.query('SELECT COUNT(*) as total FROM faction_logs');
    }

    res.json({ data: rows, total: count[0].total, page: parseInt(page) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/bans', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM playerban ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/bans', async (req, res) => {
  const { UCP, BannedBy, Reason } = req.body;
  try {
    await pool.query(
      'INSERT INTO playerban (UCP, BannedBy, DateBanned, Reason) VALUES (?, ?, NOW(), ?)',
      [UCP, BannedBy, Reason]
    );
    res.json({ success: true, message: 'Player banned' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ban failed' });
  }
});

router.delete('/bans/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM playerban WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Ban removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unban failed' });
  }
});

router.get('/donations', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT d.*, p.UCP FROM donations d JOIN playerucp p ON d.user_id = p.ID ORDER BY d.id DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/donations/:id', async (req, res) => {
  const { status } = req.body;
  try {
    await pool.query('UPDATE donations SET status = ?, completed_at = NOW() WHERE id = ?', [status, req.params.id]);
    res.json({ success: true, message: 'Updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});

router.get('/announcements', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM announcements ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/announcements', async (req, res) => {
  const { title, content, description, author } = req.body;
  try {
    await pool.query(
      'INSERT INTO announcements (title, content, description, author) VALUES (?, ?, ?, ?)',
      [title, content, description, author]
    );
    res.json({ success: true, message: 'Announcement created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Create failed' });
  }
});

router.delete('/announcements/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM announcements WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;