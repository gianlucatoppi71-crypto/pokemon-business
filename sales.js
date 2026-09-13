function renderSalesInventory() {
  loadData();

  const list = document.getElementById('salesList');
  if (!list) return;

  list.innerHTML = '';

  if (!Array.isArray(salesData) || salesData.length === 0) {
    list.innerHTML = '<p>No sales yet.</p>';
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

      <img src="${sale.image || ''}" alt="${sale.name}"
           style="width:120px; border:1px solid #333; margin:10px 0;">

      <div class="item-meta">
        Sell price: £${Number(sale.price || sale.sellPrice || 0).toFixed(2)}<br>
        Cost: £${Number(sale.cost || 0).toFixed(2)}<br>
        Profit: £${Number(sale.profit || 0).toFixed(2)}<br>
        Payment: ${sale.payment || 'Unknown'}
      </div>
    `;

    list.appendChild(div);
  });
}
