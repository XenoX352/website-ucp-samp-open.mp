const express = require('express');
const router = express.Router();
const pool = require('../../database');
const requireAuth = require('../../middleware/auth');

router.get('/', requireAuth, async (req, res) => {
  try {
    const [characters] = await pool.query('SELECT * FROM characters WHERE UCP = ?', [req.user.UCP]);
    res.json({ characters });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const characterId = req.params.id;

    const [charRows] = await pool.query('SELECT * FROM characters WHERE pID = ? AND UCP = ?', [characterId, req.user.UCP]);
    if (charRows.length === 0) return res.status(404).json({ error: 'Character not found' });
    const character = charRows[0];

    const [inventory] = await pool.query('SELECT * FROM inventory WHERE ID = ?', [characterId]);

    const [weapons] = await pool.query(
      `SELECT pw.*, 
        CASE 
          WHEN pw.weapon_ammo_type = 0 THEN 'None'
          WHEN pw.weapon_ammo_type = 1 THEN 'JHP'
          WHEN pw.weapon_ammo_type = 2 THEN 'MM'
          WHEN pw.weapon_ammo_type = 3 THEN 'SURPLUS'
        END as ammo_type_name
      FROM player_weapons pw 
      WHERE pw.character_id = ?`,
      [characterId]
    );

    const [skills] = await pool.query('SELECT * FROM player_skills WHERE character_id = ?', [characterId]);

    const [factionMembers] = await pool.query('SELECT * FROM faction_members WHERE charID = ?', [characterId]);
    let faction = null;
    let factionStorage = [];
    let factionWeapons = [];

    if (factionMembers.length > 0) {
      const member = factionMembers[0];
      const [factionRows] = await pool.query('SELECT * FROM factions WHERE factionID = ?', [member.factionID]);
      if (factionRows.length > 0) {
        faction = {
          ...factionRows[0],
          factionRank: member.factionRank,
          factionLeader: member.factionLeader,
          factionDuty: member.factionDuty
        };
        [factionStorage] = await pool.query('SELECT * FROM faction_storage WHERE factionID = ?', [member.factionID]);
        [factionWeapons] = await pool.query('SELECT * FROM faction_weapons WHERE factionID = ?', [member.factionID]);
      }
    }

    const [phoneRows] = await pool.query('SELECT * FROM player_phones WHERE player_id = ?', [characterId]);
    let phone = phoneRows.length > 0 ? phoneRows[0] : null;
    let contacts = [];
    if (phone) {
      [contacts] = await pool.query('SELECT * FROM phone_contacts WHERE phone_id = ?', [phone.id]);
    }

    const [seedsRows] = await pool.query('SELECT * FROM player_seeds WHERE username = ?', [character.UCP]);
    const seeds = seedsRows.length > 0 ? seedsRows[0] : {};
    const [farmerRows] = await pool.query('SELECT * FROM farmer WHERE username = ?', [character.UCP]);
    const farmer = farmerRows.length > 0 ? farmerRows[0] : null;

    const [vehicles] = await pool.query('SELECT * FROM vehicle WHERE vehOwner = ?', [characterId]);

    const [insurance] = await pool.query('SELECT * FROM player_vehicle_insurance WHERE playerID = ?', [characterId]);

    res.json({
      character,
      inventory,
      weapons,
      skills,
      faction,
      factionStorage,
      factionWeapons,
      phone,
      contacts,
      seeds,
      farmer,
      vehicles,
      insurance
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/create', requireAuth, async (req, res) => {
  const { name, age, origin, height, weight, gender, skin, hairColor, eyeColor, skinColor } = req.body;
  if (!name || !/^[A-Z][a-z]+_[A-Z][a-z]+$/.test(name)) return res.status(400).json({ error: 'Invalid name format' });

  try {
    const [existing] = await pool.query('SELECT pID FROM characters WHERE Name = ?', [name]);
    if (existing.length > 0) return res.status(409).json({ error: 'Name already taken' });

    await pool.query(
      `INSERT INTO characters (Name, UCP, Age, Origin, Height, Weight, Gender, Skin, HairColor, EyeColor, SkinColor, Money, BankMoney, Level, PosX, PosY, PosZ, Health, Armor, Hunger, Thirsty)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 500, 1000, 1, 349.8621, -2052.0586, 7.9359, 100, 0, 100, 100)`,
      [name, req.user.UCP, age || 25, origin || 'Los Santos', height || 175, weight || 70, gender || 1, skin || 240, hairColor || 0, eyeColor || 0, skinColor || 0]
    );
    res.json({ success: true, message: 'Character created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create character' });
  }
});

module.exports = router;