const express = require('express');
const passport = require('passport');
const crypto = require('crypto');
const router = express.Router();
const pool = require('../../database');
const { hashPassword, verifyPassword } = require('../../utils/argon2');
const { generateCaptcha } = require('../../utils/captcha.js');
const { sendVerificationCode } = require('../../utils/email.js');
const speakeasy = require('speakeasy');

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getClientIp(req) {
  let ip = req.headers['x-forwarded-for']?.split(',')[0].trim() ||
           req.connection?.remoteAddress ||
           req.socket?.remoteAddress ||
           req.connection?.socket?.remoteAddress ||
           '';
  if (ip.startsWith('::ffff:')) ip = ip.substring(7);
  return ip;
}

router.get('/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  res.json({ user: req.user });
});

router.get('/discord', passport.authenticate('discord'));

router.get('/discord/callback', 
  passport.authenticate('discord', { 
    failureRedirect: '/login',
    successRedirect: '/dashboard'
  })
);

router.get('/discord/callback', (req, res, next) => {
  passport.authenticate('discord', (err, user, info) => {
    if (err) {
      console.error('Discord auth error:', err);
      return res.redirect('/login?error=discord');
    }
    if (!user) {
      return res.redirect('/login?error=nouser');
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error('Login error:', err);
        return res.redirect('/login?error=login');
      }
      return res.redirect('/dashboard');
    });
  })(req, res, next);
});

router.post('/login', async (req, res) => {
  const { login, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM playerucp WHERE UCP = ? OR discord_username = ?', [login, login]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = rows[0];
    const valid = await verifyPassword(user.Password, password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    if (!user.email_verified) return res.status(403).json({ error: 'Email not verified' });
    if (user.TOTPEnabled) {
      req.session.tempUserId = user.ID;
      return res.json({ require2FA: true });
    }

    const ip = getClientIp(req);
    await pool.query('UPDATE playerucp SET LastIP = ?, LastLogin = NOW() WHERE ID = ?', [ip, user.ID]);

    req.login({ ID: user.ID, UCP: user.UCP, discord_username: user.discord_username, AdminLevel: user.AdminLevel }, (err) => {
      if (err) return res.status(500).json({ error: 'Login failed' });
      res.json({ success: true, user: { UCP: user.UCP, discord_username: user.discord_username, AdminLevel: user.AdminLevel } });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/discord', passport.authenticate('discord'));
router.get('/discord/callback', passport.authenticate('discord', { failureRedirect: '/login' }), async (req, res) => {
  const ip = getClientIp(req);
  await pool.query('UPDATE playerucp SET LastIP = ?, LastLogin = NOW() WHERE ID = ?', [ip, req.user.ID]);
  res.redirect('/dashboard');
});

router.post('/register', async (req, res) => {
  const { ucp, email, password, confirm, captcha, discordid, phone, referral } = req.body;
  if (!email || !discordid) return res.status(400).json({ error: 'Email and Discord ID required' });
  if (password !== confirm) return res.status(400).json({ error: 'Passwords do not match' });
  if (parseInt(captcha) !== req.session.captcha) return res.status(400).json({ error: 'Invalid captcha' });
  if (ucp.length < 3 || ucp.length > 24) return res.status(400).json({ error: 'Username 3-24 chars' });
  if (!/^[a-zA-Z0-9_]+$/.test(ucp)) return res.status(400).json({ error: 'Invalid username format' });
  if (!/^\d{17,20}$/.test(discordid)) return res.status(400).json({ error: 'Discord ID 17-20 digits' });

  try {
    const hashed = await hashPassword(password);
    const verificationCode = generateVerificationCode();
    const codeExpires = new Date(Date.now() + 10 * 60 * 1000);
    const referralCode = crypto.randomBytes(4).toString('hex').toUpperCase();
    const ip = getClientIp(req);

    const [result] = await pool.query(
      `INSERT INTO playerucp (UCP, email, Password, RegisterDate, verification_code, code_expires, email_verified, discordid, phone, referral_code, FirstIP) VALUES (?, ?, ?, NOW(), ?, ?, FALSE, ?, ?, ?, ?)`,
      [ucp, email, hashed, verificationCode, codeExpires, discordid, phone || null, referralCode, ip]
    );

    await sendVerificationCode(email, ucp, verificationCode);
    req.session.pendingUserId = result.insertId;
    req.session.pendingEmail = email;
    res.json({ success: true, message: 'Verification code sent' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Email, username, or Discord ID already taken' });
    } else {
      console.error(err);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
});

router.post('/verify', async (req, res) => {
  const { code } = req.body;
  const userId = req.session.pendingUserId;
  if (!userId) return res.status(400).json({ error: 'Session expired' });
  try {
    const [rows] = await pool.query('SELECT verification_code, code_expires FROM playerucp WHERE ID = ?', [userId]);
    if (rows.length === 0) return res.status(404).json({ error: 'Account not found' });
    const user = rows[0];
    if (user.verification_code !== code) return res.status(400).json({ error: 'Invalid code' });
    if (new Date() > new Date(user.code_expires)) return res.status(400).json({ error: 'Code expired' });
    await pool.query('UPDATE playerucp SET email_verified = TRUE, verification_code = NULL, code_expires = NULL WHERE ID = ?', [userId]);
    delete req.session.pendingUserId;
    delete req.session.pendingEmail;
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Verification failed' });
  }
});

router.post('/resend-code', async (req, res) => {
  const userId = req.session.pendingUserId;
  if (!userId) return res.status(400).json({ error: 'Session expired' });
  try {
    const [rows] = await pool.query('SELECT email, UCP FROM playerucp WHERE ID = ?', [userId]);
    if (rows.length === 0) return res.status(404).json({ error: 'Account not found' });
    const newCode = generateVerificationCode();
    const newExpires = new Date(Date.now() + 10 * 60 * 1000);
    await pool.query('UPDATE playerucp SET verification_code = ?, code_expires = ? WHERE ID = ?', [newCode, newExpires, userId]);
    await sendVerificationCode(rows[0].email, rows[0].UCP, newCode);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to resend code' });
  }
});

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/login');
  });
});

router.post('/2fa-verify', async (req, res) => {
  const { token } = req.body;
  const userId = req.session.tempUserId;
  if (!userId) return res.status(400).json({ error: 'Session expired' });
  try {
    const [rows] = await pool.query('SELECT TOTPSecret FROM playerucp WHERE ID = ?', [userId]);
    const verified = speakeasy.totp.verify({ secret: rows[0].TOTPSecret, encoding: 'base32', token });
    if (!verified) return res.status(400).json({ error: 'Invalid token' });
    const [user] = await pool.query('SELECT ID, UCP, discord_username, AdminLevel FROM playerucp WHERE ID = ?', [userId]);
    req.login(user[0], (err) => {
      if (err) return res.status(500).json({ error: 'Login failed' });
      delete req.session.tempUserId;
      res.json({ success: true, user: user[0] });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;