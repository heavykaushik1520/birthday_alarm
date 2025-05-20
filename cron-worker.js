require("dotenv").config();
const sequelize = require("./config/database");
const birthdayReminderJob = require("./jobs/birthdayReminder");

console.log("🕒 Starting Birthday Reminder Worker...");

sequelize.authenticate()
  .then(() => {
    console.log("✅ Database connected in cron worker.");
    return sequelize.sync();
  })
  .then(() => {
    birthdayReminderJob.start();
    console.log("🎉 Birthday cron job scheduled.");
  })
  .catch((err) => {
    console.error("❌ Cron worker DB connection error:", err);
  });
