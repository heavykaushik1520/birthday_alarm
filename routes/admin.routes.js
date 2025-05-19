// routes/admin.routes.js
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');

const { createAdmin , loginAdmin , logoutAdmin} = require("../controllers/admin.controller");
const { authenticate } = require("../middleware/auth");

router.post('/register', createAdmin);
router.post('/login', loginAdmin);
router.post("/logout", logoutAdmin);



router.get('/me', authenticate, async (req, res) => {
  try {
    // At this point, req.user contains the decoded token info: { id, role, userName }
    // Fetch the admin user from the database using the ID from the token
    const admin = await db.Admin.findByPk(req.user.id, {
      attributes: ['id', 'userName', 'role'], // Select the attributes you want to return
    });

    if (!admin) {
      return res.status(404).json({ error: 'Admin user not found' }); // Should ideally not happen if the token is valid
    }

    return res.status(200).json(admin);
  } catch (error) {
    console.error('Error fetching admin data:', error);
    return res.status(500).json({ error: 'Failed to fetch admin data' });
  }
});

// --- New /api/refresh-token route ---
router.post('/refresh-token', authenticate, (req, res) => {
  try {
    // Create a new token with a new expiration time (using the same payload)
    const newToken = jwt.sign(
      { id: req.user.id, role: req.user.role, userName: req.user.userName },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '5m' } // Use the same expiration time as your login
    );

    return res.status(200).json({ token: newToken }); // Send the new token back in the response
  } catch (error) {
    console.error('Error refreshing token:', error);
    return res.status(500).json({ error: 'Failed to refresh token' });
  }
});


module.exports = router;
