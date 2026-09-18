// SALES PAGE LOGIC

function renderSalesInventory() {
  loadData();

  const list = document.getElementById('salesList');
  if (!list) return;

  list.innerHTML = '';

  if (salesData.length === 0) {
    list.innerHTML = '<p>No sales yet.</p>';
    return;
  }

  salesData.forEach((sale) => {
    const div = document.createElement('div');
    div.className = 'sale-card';

    div.innerHTML = `
      <h3>${sale.name}</h3>

      <img src="${sale.image}" alt="${sale.name}"
           style="width:120px; border:1px solid #333; margin:10px 0;">

      <div class="sale-meta">
        <strong>Category:</strong> ${sale.category}<br>
        <strong>Supplier:</strong> ${sale.supplier}<br>
        <strong>Notes:</strong> ${sale.notes || '—'}
      </div>

      <div class="sale-prices">
        <strong>Buy price:</strong> £${sale.buyPrice.toFixed(2)}<br>
        <strong>Sell price:</strong> £${sale.sellPrice.toFixed(2)}<br>
        <strong>Market price:</strong> £${sale.marketPrice.toFixed(2)}
      </div>

      <div class="sale-profit">
        <strong>Profit per unit:</strong> £${sale.profitPerUnit.toFixed(2)}<br>
        <strong>Total profit:</strong> £${sale.totalProfit.toFixed(2)}
      </div>

      <div class="sale-meta">
        <strong>Quantity sold:</strong> ${sale.quantitySold}<br>
        <strong>Date:</strong> ${new Date(sale.date).toLocaleString()}
      </div>
    `;

    list.appendChild(div);
  });
}
