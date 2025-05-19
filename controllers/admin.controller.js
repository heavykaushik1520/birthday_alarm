// controllers/admin.controller.js
const db = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createAdmin = async (req, res) => {
  const { userName, password } = req.body;
  try {
    const admin = await db.Admin.create({ userName, password });
    res.status(201).json({ message: 'Admin created', adminId: admin.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginAdmin = async (req, res) => {
  const { userName, password } = req.body;
  try {
    const admin = await db.Admin.findOne({ where: { userName } });

    if (!admin) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        role: admin.role,
        userName: admin.userName,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '5m' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: admin.id,
        userName: admin.userName,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const logoutAdmin = async (req, res) => {
  try {
    // This assumes JWT is handled by client; no server-side session to destroy.
    res.status(200).json({ message: 'Logout successful. Please clear token on client side.' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
};


module.exports = {
  createAdmin,
  loginAdmin,
  logoutAdmin,
};