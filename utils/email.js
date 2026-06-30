const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendVerificationCode(to, username, code) {
  const mailOptions = {
    from: `"Morch Community" <${process.env.EMAIL_FROM}>`,
    to,
    subject: 'Verification Code - Morch Community',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1A1E26; color: #FFFFFF; padding: 30px; border-radius: 12px; border: 1px solid #D4AF37;">
        <h2 style="color: #D4AF37;">Hello ${username}!</h2>
        <p>Your verification code is:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="background: #0F141E; padding: 20px 40px; border-radius: 12px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #D4AF37; border: 1px solid #D4AF37;">${code}</span>
        </div>
        <p style="color: #7A8392; font-size: 12px;">This code expires in 10 minutes.</p>
      </div>
    `
  };
  return transporter.sendMail(mailOptions);
}

module.exports = { sendVerificationCode };