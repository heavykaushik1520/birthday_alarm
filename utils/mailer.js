const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER, // your email
    pass: process.env.MAIL_PASS, // your app-specific password
  },
  tls: {
    rejectUnauthorized: false, // Disable SSL certificate verification for testing
  },
});

const sendMail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"🚨 Birthday Alarm 🚨" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error(`Error sending mail to ${to}:`, err);
  }
};

module.exports = sendMail;
