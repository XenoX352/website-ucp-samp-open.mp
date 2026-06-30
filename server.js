require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const cors = require('cors');
const path = require('path');
const pool = require('./database');
const { hashPassword } = require('./utils/argon2');

const app = express();

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionStore = new MySQLStore({}, pool);

app.use(session({
  key: 'morch_sid',
  secret: process.env.SESSION_SECRET || 'morch-secret-key-change-me',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: 'http://localhost:3001/api/auth/discord/callback',
    scope: ['identify', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const discordId = profile.id;
      const discordUsername = profile.username;
      const email = profile.email || `${discordId}@discord.placeholder`;
      
      let [rows] = await pool.query('SELECT * FROM playerucp WHERE discordid = ?', [discordId]);
      if (rows.length === 0) {
        let ucp = discordUsername.replace(/[^a-zA-Z0-9_]/g, '').substring(0, 24);
        const [existing] = await pool.query('SELECT ID FROM playerucp WHERE UCP = ?', [ucp]);
        if (existing.length > 0) ucp = ucp + Math.floor(Math.random() * 1000);
        const hashed = await hashPassword(discordId + (process.env.SESSION_SECRET || 'fallback'));
        const [result] = await pool.query(
          'INSERT INTO playerucp (UCP, email, Password, discordid, discord_username, RegisterDate, registered_via_discord, email_verified) VALUES (?, ?, ?, ?, ?, NOW(), 1, 1)',
          [ucp, email, hashed, discordId, discordUsername]
        );
        return done(null, { ID: result.insertId, UCP: ucp, discord_username: discordUsername, AdminLevel: 0 });
      } else {
        const user = rows[0];
        await pool.query('UPDATE playerucp SET discord_username = ?, LastLogin = NOW() WHERE ID = ?', [discordUsername, user.ID]);
        return done(null, { ID: user.ID, UCP: user.UCP, discord_username: discordUsername, AdminLevel: user.AdminLevel || 0 });
      }
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => done(null, user.ID));
passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await pool.query('SELECT ID, UCP, discord_username, email_verified, AdminLevel FROM playerucp WHERE ID = ?', [id]);
    if (rows.length === 0) return done(null, false);
    done(null, rows[0]);
  } catch (err) {
    done(err);
  }
});

app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/dashboard', require('./routes/api/dashboard'));
app.use('/api/characters', require('./routes/api/characters'));
app.use('/api/referral', require('./routes/api/referral'));
app.use('/api/donate', require('./routes/api/donate'));
app.use('/api/settings', require('./routes/api/settings'));
app.use('/api/vehicles', require('./routes/api/vehicles'));
app.use('/api/announcements', require('./routes/api/announcements'));
app.use('/api/admin', require('./routes/api/admin'));


app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));