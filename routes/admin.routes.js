// routes/admin.routes.js
const express = require("express");
const router = express.Router();
const { createAdmin , loginAdmin , logoutAdmin} = require("../controllers/admin.controller");

router.post('/register', createAdmin);
router.post('/login', loginAdmin);
router.post("/logout", logoutAdmin);

module.exports = router;
