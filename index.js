const express = require("express");
const cors = require("cors");

require("dotenv").config();

const sequelize = require("./config/database");
const adminRoutes = require("./routes/admin.routes");
const employeeRoutes = require("./routes/employee.routes");
const birthdayReminderJob = require("./jobs/birthdayReminder");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Allow requests from frontend
const allowedOrigins = ['http://localhost:5173', 'https://artiststation.co.in'];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Middleware
app.use(express.json()); // to parse JSON requests


app.get('/', (req, res) => {
  res.send('🎉 Birthday Alarm API is working on artiststation.co.in!');
});

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/employees", employeeRoutes);

// DB Connection & Server Startup
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected successfully.");
    return sequelize.sync(); // ensures tables are created
  })
  .then(() => {
    // Start the birthday reminder job after the server starts
    birthdayReminderJob.start(); // Start the job here

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Unable to connect to the database:", err);
  });
