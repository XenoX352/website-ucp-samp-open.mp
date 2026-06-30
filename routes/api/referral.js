const express = require('express');
const router = express.Router();
const pool = require('../../database');
const requireAuth = require('../../middleware/auth');

router.get('/', requireAuth, async (req, res) => {
  try {
    const [user] = await pool.query('SELECT UCP, referral_code, mgold FROM playerucp WHERE ID = ?', [req.user.ID]);
    if (user.length === 0) return res.status(404).json({ error: 'User not found' });

    const [invited] = await pool.query('SELECT ID, UCP, RegisterDate FROM playerucp WHERE referred_by = ? ORDER BY RegisterDate DESC', [req.user.ID]);
    const [rewards] = await pool.query('SELECT id, mgold_earned, created_at FROM referral_rewards WHERE inviter_id = ? ORDER BY created_at DESC', [req.user.ID]);
    const [shopItems] = await pool.query('SELECT * FROM mgold_shop WHERE is_active = 1 AND (stock > 0 OR stock = -1)');

    const invitedCount = invited.length;
    let nextMilestone = null;
    if (invitedCount < 5) nextMilestone = 5;
    else if (invitedCount < 30) nextMilestone = 30;
    else if (invitedCount < 100) nextMilestone = 100;

    res.json({
      user: user[0],
      invited,
      rewards,
      shopItems,
      invitedCount,
      nextMilestone
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/redeem/:itemId', requireAuth, async (req, res) => {
  const itemId = req.params.itemId;
  try {
    const [item] = await pool.query('SELECT * FROM mgold_shop WHERE id = ? AND is_active = 1', [itemId]);
    if (item.length === 0) return res.status(404).json({ error: 'Item not found' });

    const [user] = await pool.query('SELECT mgold, UCP FROM playerucp WHERE ID = ?', [req.user.ID]);
    if (user[0].mgold < item[0].mgold_price) return res.status(400).json({ error: 'Insufficient mgold' });

    await pool.query('UPDATE playerucp SET mgold = mgold - ? WHERE ID = ?', [item[0].mgold_price, req.user.ID]);

    if (item[0].item_type === 'money') {
      const amount = parseInt(item[0].item_data) || 4000;
      await pool.query('UPDATE characters SET BankMoney = BankMoney + ? WHERE UCP = ? AND pID = (SELECT pID FROM characters WHERE UCP = ? LIMIT 1)', [amount, user[0].UCP, user[0].UCP]);
      return res.json({ success: true, message: `$${amount.toLocaleString()} added to your bank!` });
    }

    if (item[0].stock > 0) {
      await pool.query('UPDATE mgold_shop SET stock = stock - 1 WHERE id = ?', [itemId]);
    }

    res.json({ success: true, message: 'Reward claimed! Contact admin for delivery if needed.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Redemption failed' });
  }
});

module.exports = router;