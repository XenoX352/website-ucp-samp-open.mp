const express = require('express');
const router = express.Router();
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const pool = require('../../database');
const requireAuth = require('../../middleware/auth');
const { hashPassword, verifyPassword } = require('../../utils/argon2');

router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT UCP, email, discordid, discord_username, FirstIP, LastIP, 
              AdminLevel, mgold, referral_code, TOTPEnabled, phone
       FROM playerucp WHERE ID = ?`,
      [req.user.ID]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/change-ucp', requireAuth, async (req, res) => {
  const { newUCP } = req.body;
  if (!newUCP || newUCP.length < 3 || newUCP.length > 24) {
    return res.status(400).json({ error: 'UCP name must be 3-24 characters' });
  }
  if (!/^[a-zA-Z0-9_]+$/.test(newUCP)) {
    return res.status(400).json({ error: 'Only letters, numbers, and underscores allowed' });
  }
  try {
    const [existing] = await pool.query('SELECT ID FROM playerucp WHERE UCP = ? AND ID != ?', [newUCP, req.user.ID]);
    if (existing.length > 0) return res.status(409).json({ error: 'UCP name already taken' });

    await pool.query('UPDATE playerucp SET UCP = ? WHERE ID = ?', [newUCP, req.user.ID]);
    await pool.query('UPDATE characters SET UCP = ? WHERE UCP = ?', [newUCP, req.user.UCP]);
    await pool.query('UPDATE plants SET owner = ? WHERE owner = ?', [newUCP, req.user.UCP]);
    await pool.query('UPDATE farmer SET username = ? WHERE username = ?', [newUCP, req.user.UCP]);
    await pool.query('UPDATE player_seeds SET username = ? WHERE username = ?', [newUCP, req.user.UCP]);

    req.user.UCP = newUCP;
    res.json({ success: true, message: 'UCP name updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});

router.post('/change-email', requireAuth, async (req, res) => {
  const { newEmail } = req.body;
  if (!newEmail || !newEmail.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }
  try {
    const [existing] = await pool.query('SELECT ID FROM playerucp WHERE email = ? AND ID != ?', [newEmail, req.user.ID]);
    if (existing.length > 0) return res.status(409).json({ error: 'Email already in use' });

    await pool.query('UPDATE playerucp SET email = ? WHERE ID = ?', [newEmail, req.user.ID]);
    res.json({ success: true, message: 'Email updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});

router.post('/change-discord', requireAuth, async (req, res) => {
  const { discordId } = req.body;
  if (!discordId || !/^\d{17,20}$/.test(discordId)) {
    return res.status(400).json({ error: 'Discord ID must be 17-20 digits' });
  }
  try {
    const [existing] = await pool.query('SELECT ID FROM playerucp WHERE discordid = ? AND ID != ?', [discordId, req.user.ID]);
    if (existing.length > 0) return res.status(409).json({ error: 'Discord ID already linked' });

    await pool.query('UPDATE playerucp SET discordid = ?, discord_username = NULL WHERE ID = ?', [discordId, req.user.ID]);
    res.json({ success: true, message: 'Discord ID updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});

router.post('/change-password', requireAuth, async (req, res) => {
  const { current, newPassword, confirm } = req.body;
  if (newPassword !== confirm) return res.status(400).json({ error: 'Passwords do not match' });
  if (!newPassword || newPassword.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

  try {
    const [rows] = await pool.query('SELECT Password FROM playerucp WHERE ID = ?', [req.user.ID]);
    const valid = await verifyPassword(rows[0].Password, current);
    if (!valid) return res.status(400).json({ error: 'Current password is incorrect' });

    const hashed = await hashPassword(newPassword);
    await pool.query('UPDATE playerucp SET Password = ? WHERE ID = ?', [hashed, req.user.ID]);
    res.json({ success: true, message: 'Password updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});

router.get('/enable-2fa', requireAuth, async (req, res) => {
  const secret = speakeasy.generateSecret({ length: 20 });
  try {
    await pool.query('UPDATE playerucp SET TOTPSecret = ? WHERE ID = ?', [secret.base32, req.user.ID]);
    const otpauthUrl = speakeasy.otpauthURL({
      secret: secret.ascii,
      label: `Morch:${req.user.UCP}`,
      issuer: 'Morch Community'
    });
    QRCode.toDataURL(otpauthUrl, (err, dataUrl) => {
      if (err) return res.status(500).json({ error: 'QR generation failed' });
      res.json({ secret: secret.base32, qr: dataUrl });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to setup 2FA' });
  }
});

router.post('/verify-2fa', requireAuth, async (req, res) => {
  const { token } = req.body;
  try {
    const [rows] = await pool.query('SELECT TOTPSecret FROM playerucp WHERE ID = ?', [req.user.ID]);
    const verified = speakeasy.totp.verify({
      secret: rows[0].TOTPSecret,
      encoding: 'base32',
      token
    });
    if (!verified) return res.status(400).json({ error: 'Invalid token' });

    await pool.query('UPDATE playerucp SET TOTPEnabled = 1 WHERE ID = ?', [req.user.ID]);
    res.json({ success: true, message: '2FA enabled' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Verification failed' });
  }
});

router.post('/disable-2fa', requireAuth, async (req, res) => {
  try {
    await pool.query('UPDATE playerucp SET TOTPEnabled = 0, TOTPSecret = NULL WHERE ID = ?', [req.user.ID]);
    res.json({ success: true, message: '2FA disabled' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to disable 2FA' });
  }
});

module.exports = router;