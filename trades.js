function renderTrades() {
  loadData();

  const list = document.getElementById('tradesList');
  if (!list) return;

  list.innerHTML = '';

  if (!Array.isArray(tradesData) || tradesData.length === 0) {
    list.innerHTML = '<p>No trades yet.</p>';
    return;
  }

  tradesData.forEach(t => {
    const div = document.createElement('div');
    div.className = 'item-card';

    div.innerHTML = `
      <h3>${t.title || 'Trade'}</h3>
      <div class="item-meta">
        With: ${t.partner || '—'}<br>
        Value: £${Number(t.value || 0).toFixed(2)}<br>
        Notes: ${t.notes || '—'}
      </div>
    `;

    list.appendChild(div);
  });
}
