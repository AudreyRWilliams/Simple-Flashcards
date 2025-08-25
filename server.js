// server.js (Node 14 compatible)
const express = require('express');
const path = require('path');
const fs = require('fs');

const DATA_FILE = path.join(__dirname, 'data.json');

// ---- tiny JSON "DB" helpers ----
function loadDb() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const db = JSON.parse(raw);
    if (!db.decks || !db.cards) return { decks: [], cards: [] };
    return db;
  } catch (e) {
    return { decks: [], cards: [] };
  }
}
function saveDb(db) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf8');
}
function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

let db = loadDb();

// seed one example deck if empty
if (db.decks.length === 0) {
  const deckId = newId();
  db.decks.push({
    id: deckId,
    name: 'Demo: Basic Spanish',
    description: 'English → Spanish basics',
    createdAt: new Date().toISOString()
  });
  db.cards.push(
    { id: newId(), deckId, front: 'Hello', back: 'Hola', createdAt: new Date().toISOString() },
    { id: newId(), deckId, front: 'Thank you', back: 'Gracias', createdAt: new Date().toISOString() }
  );
  saveDb(db);
}

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// list decks (with card counts)
app.get('/api/decks', (req, res) => {
  db = loadDb();
  const decks = db.decks.map(d => ({
    ...d,
    count: db.cards.filter(c => c.deckId === d.id).length
  }));
  res.json(decks);
});

// create deck
app.post('/api/decks', (req, res) => {
  db = loadDb();
  const name = (req.body && req.body.name || '').trim();
  const description = (req.body && req.body.description || '').trim();
  if (!name) return res.status(400).json({ error: 'name is required' });
  const deck = { id: newId(), name, description, createdAt: new Date().toISOString() };
  db.decks.push(deck);
  saveDb(db);
  res.json(deck);
});

// get deck + cards
app.get('/api/decks/:id', (req, res) => {
  db = loadDb();
  const deck = db.decks.find(d => d.id === req.params.id);
  if (!deck) return res.status(404).json({ error: 'deck not found' });
  const cards = db.cards.filter(c => c.deckId === deck.id);
  res.json({ ...deck, cards });
});

// add card
app.post('/api/decks/:id/cards', (req, res) => {
  db = loadDb();
  const deck = db.decks.find(d => d.id === req.params.id);
  if (!deck) return res.status(404).json({ error: 'deck not found' });
  const front = (req.body && req.body.front || '').trim();
  const back = (req.body && req.body.back || '').trim();
  if (!front || !back) return res.status(400).json({ error: 'front and back are required' });
  const card = { id: newId(), deckId: deck.id, front, back, createdAt: new Date().toISOString() };
  db.cards.push(card);
  saveDb(db);
  res.json(card);
});

// delete card
app.delete('/api/cards/:id', (req, res) => {
  db = loadDb();
  const idx = db.cards.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'card not found' });
  db.cards.splice(idx, 1);
  saveDb(db);
  res.json({ ok: true });
});

// health
app.get('/api/ping', (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Flashcards server running at http://localhost:${port}`);
});
