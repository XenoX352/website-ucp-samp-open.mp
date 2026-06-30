const express = require('express');
const router = express.Router();
const pool = require('../../database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const proofStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'public/uploads/proofs';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'proof-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadProof = multer({
  storage: proofStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    cb(null, mimetype && extname);
  }
});

function requireAuth(req, res, next) {
  if (!req.user) return res.redirect('/login');
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.AdminLevel < 1) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

router.get('/', requireAuth, async (req, res) => {
  try {
    const [donations] = await pool.query(
      'SELECT * FROM donations WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
      [req.user.ID]
    );
    const [testimonials] = await pool.query(
      `SELECT d.id, d.amount, d.testimoni, d.testimoni_image, d.testimoni_created_at,
              d.admin_reply, d.admin_reply_at, p.UCP as user_ucp
       FROM donations d
       JOIN playerucp p ON d.user_id = p.ID
       WHERE d.status = 'completed' AND d.testimoni IS NOT NULL AND d.is_public = 1
       ORDER BY d.testimoni_created_at DESC`
    );
    res.json({ donations, testimonials });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/submit', requireAuth, uploadProof.single('proof'), async (req, res) => {
  const { amount, payment_method } = req.body;
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Invalid donation amount' });
  }
  const proofPath = req.file ? '/uploads/proofs/' + req.file.filename : null;
  try {
    await pool.query(
      'INSERT INTO donations (user_id, amount, payment_method, status, proof_image, created_at) VALUES (?, ?, ?, "pending", ?, NOW())',
      [req.user.ID, amount, payment_method || 'qris', proofPath]
    );
    res.json({ success: true, message: 'Donation submitted! Proof will be reviewed.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit donation' });
  }
});

router.post('/testimoni/:id', requireAuth, async (req, res) => {
  const donationId = req.params.id;
  const { testimoni } = req.body;
  if (!testimoni || testimoni.length < 10) {
    return res.status(400).json({ error: 'Testimoni must be at least 10 characters' });
  }
  try {
    const [donation] = await pool.query(
      'SELECT user_id, status, testimoni FROM donations WHERE id = ?',
      [donationId]
    );
    if (donation.length === 0) return res.status(404).json({ error: 'Donation not found' });
    if (donation[0].user_id !== req.user.ID) return res.status(403).json({ error: 'Not your donation' });
    if (donation[0].status !== 'completed') return res.status(400).json({ error: 'Donation not verified yet' });
    if (donation[0].testimoni) return res.status(400).json({ error: 'Testimoni already submitted' });

    await pool.query(
      'UPDATE donations SET testimoni = ?, testimoni_created_at = NOW() WHERE id = ?',
      [testimoni, donationId]
    );
    res.json({ success: true, message: 'Testimoni posted!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit testimoni' });
  }
});

router.post('/reply/:id', requireAdmin, async (req, res) => {
  const donationId = req.params.id;
  const { reply } = req.body;
  if (!reply || reply.length < 5) {
    return res.status(400).json({ error: 'Reply must be at least 5 characters' });
  }
  try {
    await pool.query(
      'UPDATE donations SET admin_reply = ?, admin_reply_at = NOW() WHERE id = ?',
      [reply, donationId]
    );
    res.json({ success: true, message: 'Reply posted!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to reply' });
  }
});

module.exports = router;