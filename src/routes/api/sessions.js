import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
const router = express.Router();

router.post('/register', async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const user = new User({ first_name, last_name, email, age, password });
    await user.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', passport.authenticate('login', { session: false }), (req, res) => {
  const token = jwt.sign(
    { id: req.user._id, email: req.user.email },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '1h' }
  );
  res.json({ token, message: 'Login exitoso' });
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logout exitoso. Elimina el token del cliente.' });
});

router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
  res.json({
    id: req.user._id,
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    age: req.user.age,
    role: req.user.role
  });
});

export default router;