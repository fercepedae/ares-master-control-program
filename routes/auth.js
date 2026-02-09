const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Nuclear visible marker to confirm this file is the active auth route
//console.log("🔥🔥🔥 AUTH ROUTE VERSION NUEVA 🔥🔥🔥");

// Register user
router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!password) return res.status(400).json({ message: 'password is required' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const fallbackUsername = username || name || (email ? email.split('@')[0] : undefined);
    if (!fallbackUsername) return res.status(400).json({ message: 'username is required' });

    const user = await User.create({ username: fallbackUsername, email, password: hashedPassword });
    res.status(201).json({ message: 'Usuario registrado', id: user._id });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Login (by email or username)
router.post('/login', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    console.log('BODY:', req.body);
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    if (!password) return res.status(400).json({ message: 'password required' });

    const conditions = [];
    if (email) conditions.push({ email });
    if (username) conditions.push({ username });
    console.log('Searching with:', conditions);
    if (conditions.length === 0) return res.status(400).json({ message: 'email or username required' });

    const user = await User.findOne({ $or: conditions });
    console.log('User found:', !!user, user ? { id: user._id.toString(), email: user.email, username: user.username } : null);
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    const ok = await bcrypt.compare(password, user.password);
    console.log('Password ok:', ok);
    if (!ok) return res.status(401).json({ message: 'Credenciales inválidas' });

    if (!process.env.JWT_SECRET) return res.status(500).json({ message: 'JWT_SECRET no configurado' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
