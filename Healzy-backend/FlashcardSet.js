const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  term: { type: String, required: true },
  definition: { type: String, required: true },
});

const flashcardSetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  cards: [cardSchema],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('FlashcardSet', flashcardSetSchema);
