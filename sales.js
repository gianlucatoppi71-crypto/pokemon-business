function renderSalesInventory() {
  loadData();

  const list = document.getElementById('salesInventoryList');
  if (!list) return;

  list.innerHTML = '';

  if (salesData.length === 0) {
    list.innerHTML = '<p>No sales recorded yet.</p>';
    return;
  }

  salesData.forEach((sale) => {
    const div = document.createElement('div');
    div.className = 'item-card';

    div.innerHTML = `
      <div class="item-header">
        <h3>${sale.name}</h3>
        <span class="item-meta">${new Date(sale.date).toLocaleString()}</span>
      </div>
      <div class="item-meta">
        Sold price: £${sale.sellPrice.toFixed(2)}
      </div>
      <div class="item-profit">
        <span style="color:lime">Profit: £${sale.profit.toFixed(2)}</span>
      </div>
    `;

    list.appendChild(div);
  });
}
