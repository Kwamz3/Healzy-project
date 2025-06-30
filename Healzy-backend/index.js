const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const FlashcardSet = require('./FlashcardSet');
const User = require('./User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const client = new OAuth2Client('914529443484-buh97c6il8hporqps34j6k9p689193cb.apps.googleusercontent.com');

app.use(cors());
app.use(express.json());

// Updated MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => res.send('Healzy API running!'));

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

app.post('/flashcard-sets', authMiddleware, async (req, res) => {
  try {
    const { title, description, cards } = req.body;
    const newSet = new FlashcardSet({ title, description, cards, user: req.userId });
    await newSet.save();
    res.status(201).json(newSet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/flashcard-sets', authMiddleware, async (req, res) => {
  try {
    const sets = await FlashcardSet.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(sets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/flashcard-sets/:id', authMiddleware, async (req, res) => {
  try {
    const set = await FlashcardSet.findOne({ _id: req.params.id, user: req.userId });
    if (!set) return res.status(404).json({ error: 'Set not found' });
    res.json(set);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/flashcard-sets/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description, cards } = req.body;
    const set = await FlashcardSet.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { title, description, cards },
      { new: true, runValidators: true }
    );
    if (!set) return res.status(404).json({ error: 'Set not found' });
    res.json(set);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/flashcard-sets/:id', authMiddleware, async (req, res) => {
  try {
    const set = await FlashcardSet.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!set) return res.status(404).json({ error: 'Set not found' });
    res.json({ message: 'Set deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

app.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already in use' });
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hash, name });
    await user.save();
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { _id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { _id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/auth/google', async (req, res) => {
  const { idToken } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: [
        '914529443484-buh97c6il8hporqps34j6k9p689193cb.apps.googleusercontent.com', // Expo Go
        '914529443484-qkkq06g9aoitrob43l502063lkhtuc89.apps.googleusercontent.com', // iOS/Android
      ],
    });
    const payload = ticket.getPayload();
    // Find or create user in your DB
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = new User({
        email: payload.email,
        name: payload.name,
        password: 'google-oauth', // Placeholder, not used
      });
      await user.save();
    }
    // Create JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { _id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    res.status(401).json({ error: 'Invalid Google token' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
