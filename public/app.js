const el = id => document.getElementById(id);
const decksDiv = el('decks');
const deckView = el('deckView');
const deckTitle = el('deckTitle');
const deckDescText = el('deckDescText');
const cardsDiv = el('cards');
const studyDiv = el('study');

let currentDeckId = null;
let currentCards = [];

async function fetchJSON(url, opts) {
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function loadDecks() {
  const decks = await fetchJSON('/api/decks');
  decksDiv.innerHTML = decks.map(d => `
    <div class="row deck-row">
      <div>
        <strong>${escapeHtml(d.name)}</strong>
        <div class="muted">${escapeHtml(d.description || '')}</div>
      </div>
      <div class="row">
        <span class="pill">${d.count} cards</span>
        <button class="btn" onclick="openDeck('${d.id}')">Open</button>
      </div>
    </div>
  `).join('') || '<div class="muted">No decks yet</div>';
}

async function openDeck(id) {
  const deck = await fetchJSON(`/api/decks/${id}`);
  currentDeckId = deck.id;
  currentCards = deck.cards || [];
  deckTitle.textContent = deck.name;
  deckDescText.textContent = deck.description || '';
  renderCards();
  renderStudy();
  deckView.style.display = '';
  window.scrollTo(0,0);
}

function renderCards() {
  if (!currentCards.length) {
    cardsDiv.innerHTML = '<div class="muted">No cards yet</div>';
    return;
  }
  cardsDiv.innerHTML = currentCards.map(c => `
    <div class="card-row">
      <div><strong>${escapeHtml(c.front)}</strong> — <em>${escapeHtml(c.back)}</em></div>
      <button class="btn danger" onclick="deleteCard('${c.id}')">Delete</button>
    </div>
  `).join('');
}

function renderStudy() {
  if (!currentCards.length) { studyDiv.innerHTML = '<div class="muted">Add cards to study.</div>'; return; }
  let i = 0;
  let showBack = false;
  const wrap = document.createElement('div');
  function draw() {
    const c = currentCards[i];
    wrap.innerHTML = `
      <div class="study-card">
        <div class="q">${escapeHtml(c.front)}</div>
        <div class="a">${showBack ? escapeHtml(c.back) : '<span class="muted">Click "Show answer"</span>'}</div>
        <div class="row">
          ${!showBack ? `<button class="btn" id="showBtn">Show answer</button>` : `
            <button class="btn" id="prevBtn" ${i===0?'disabled':''}>Prev</button>
            <button class="btn primary" id="nextBtn">${i===currentCards.length-1?'Done':'Next'}</button>
          `}
        </div>
      </div>
    `;
    studyDiv.innerHTML = '';
    studyDiv.appendChild(wrap);
    if (!showBack) {
      el('showBtn').onclick = ()=>{ showBack = true; draw(); };
    } else {
      if (el('prevBtn')) el('prevBtn').onclick = ()=>{ if(i>0){i--; showBack=false; draw();} };
      el('nextBtn').onclick = ()=>{ if(i<currentCards.length-1){i++; showBack=false; draw();} else { studyDiv.innerHTML='<div class="muted">Study session done!</div>'; } };
    }
  }
  draw();
}

async function deleteCard(id) {
  await fetchJSON(`/api/cards/${id}`, { method:'DELETE' });
  currentCards = currentCards.filter(c => c.id !== id);
  renderCards();
  renderStudy();
}

el('newDeckForm').addEventListener('submit', async e => {
  e.preventDefault();
  const name = el('deckName').value.trim();
  const description = el('deckDesc').value.trim();
  if (!name) return;
  await fetchJSON('/api/decks', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ name, description })
  });
  el('deckName').value = '';
  el('deckDesc').value = '';
  loadDecks();
});

el('newCardForm').addEventListener('submit', async e => {
  e.preventDefault();
  const front = el('front').value.trim();
  const back = el('back').value.trim();
  if (!front || !back) return;
  const card = await fetchJSON(`/api/decks/${currentDeckId}/cards`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ front, back })
  });
  currentCards.push(card);
  el('front').value = '';
  el('back').value = '';
  renderCards();
  renderStudy();
});

el('backToDecks').addEventListener('click', () => {
  deckView.style.display = 'none';
  loadDecks();
});

// basic HTML escaper
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

// initial load
loadDecks();

// expose for inline handlers
window.openDeck = openDeck;
window.deleteCard = deleteCard;
