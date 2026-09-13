// TRADES PAGE LOGIC

let tradesData = [];

// Load trades from localStorage
function loadTrades() {
  const saved = localStorage.getItem('tradesData');
  tradesData = saved ? JSON.parse(saved) : [];
}

// Save trades to localStorage
function saveTrades() {
  localStorage.setItem('tradesData', JSON.stringify(tradesData));
}

// Render trades page
function renderTrades() {
  loadTrades();

  const container = document.getElementById('tradesPage');
  if (!container) return;

  container.innerHTML = `
    <h1>Trades</h1>

    <form id="tradeForm">
      <input type="number" step="0.01" id="tradeGive" placeholder="You Give (£)" required>
      <input type="number" step="0.01" id="tradeReceive" placeholder="You Receive (£)" required>
      <textarea id="tradeNotes" placeholder="Notes"></textarea>
      <button type="submit">Add Trade</button>
    </form>

    <div id="tradesList"></div>
  `;

  const list = document.getElementById('tradesList');

  if (tradesData.length === 0) {
    list.innerHTML = '<p>No trades recorded yet.</p>';
    return;
  }

  tradesData.forEach((trade, index) => {
    const balance = trade.receive - trade.give;

    const div = document.createElement('div');
    div.className = 'item-card';

    div.innerHTML = `
      <div class="item-header">
        <h3>Trade #${index + 1}</h3>
        <span class="item-meta">${new Date(trade.date).toLocaleString()}</span>
      </div>

      <div class="item-meta">
        You Give: £${trade.give.toFixed(2)}<br>
        You Receive: £${trade.receive.toFixed(2)}<br>
        Balance: <span style="color:${balance >= 0 ? 'lime' : 'red'};">
          £${balance.toFixed(2)}
        </span><br>
        Notes: ${trade.notes || '—'}
      </div>

      <button class="sell-button" onclick="deleteTrade(${index})"
        style="background:red; color:white;">
        Delete Trade
      </button>
    `;

    list.appendChild(div);
  });

  // Add trade form logic
  document.getElementById('tradeForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const newTrade = {
      id: crypto.randomUUID(),
      give: Number(document.getElementById('tradeGive').value),
      receive: Number(document.getElementById('tradeReceive').value),
      notes: document.getElementById('tradeNotes').value || '',
      date: new Date().toISOString()
    };

    tradesData.push(newTrade);
    saveTrades();
    renderTrades();
  });
}

// Delete trade
function deleteTrade(index) {
  tradesData.splice(index, 1);
  saveTrades();
  renderTrades();
}
