// INVENTORY PAGE LOGIC

function renderInventory() {
  loadData();

  const list = document.getElementById('inventoryList');
  if (!list) return;

  list.innerHTML = '';

  if (inventoryData.length === 0) {
    list.innerHTML = '<p>No inventory yet. Add a product above.</p>';
    return;
  }

  inventoryData.forEach((item, index) => {
    const { profitPerUnit, totalProfit, marginPercent } = calculateItemProfit(item);

    const div = document.createElement('div');
    div.className = 'item-card';

    div.innerHTML = `
      <div class="item-header">
        <h3>${item.name}</h3>
        <span class="item-meta">${item.category} • ${item.supplier}</span>
      </div>

      <!-- PRODUCT IMAGE -->
      <img src="${item.image}" alt="${item.name}" 
           style="width:120px; border:1px solid #333; margin:10px 0;">

      <div class="item-meta">
        Qty: ${item.quantity}<br>
        Buy: £${item.buyPrice.toFixed(2)} • Sell: £${item.sellPrice.toFixed(2)}<br>
        UK market: £${item.marketPrice.toFixed(2)}
      </div>

      <div class="item-profit">
        <span style="color:gold">Profit per unit: £${profitPerUnit.toFixed(2)}</span>
        <span style="color:lime">Total profit: £${totalProfit.toFixed(2)}</span>
        <span>Margin: ${marginPercent.toFixed(1)}%</span>
      </div>

      <div class="item-meta">
        Notes: ${item.notes || '—'}
      </div>

      <button class="sell-button" onclick="sellItem(${index})">
        Sell from Sales page
      </button>
    `;

    list.appendChild(div);
  });
}


// ADD ITEM TO INVENTORY
document.getElementById('inventoryForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const item = {
    id: crypto.randomUUID(),
    name: document.getElementById('invName').value,
    category: document.getElementById('invCategory').value,
    supplier: document.getElementById('invSupplier').value,
    buyPrice: Number(document.getElementById('invBuyPrice').value),
    sellPrice: Number(document.getElementById('invSellPrice').value),
    quantity: Number(document.getElementById('invQuantity').value),
    marketPrice: Number(document.getElementById('invMarketPrice').value),
    image: document.getElementById('invImage').value,   // IMAGE SUPPORT
    notes: document.getElementById('invNotes').value || ''
  };

  inventoryData.push(item);
  saveData();
  renderInventory();
  renderSalesInventory();
  renderTaxSummary();

  e.target.reset();
});


// SELL ITEM (MOVE TO SALES PAGE)
function sellItem(index) {
  const item = inventoryData[index];
  if (!item) return;

  if (item.quantity <= 0) return;

  const { profitPerUnit } = calculateItemProfit(item);

  // Add sale entry
  salesData.push({
    id: crypto.randomUUID(),
    name: item.name,
    sellPrice: item.sellPrice,
    profit: profitPerUnit,
    image: item.image,   // IMAGE SUPPORT
    date: new Date().toISOString()
  });

  // Reduce inventory quantity
  item.quantity -= 1;

  // Remove item if quantity hits zero
  if (item.quantity <= 0) {
    inventoryData.splice(index, 1);
  }

  saveData();
  renderInventory();
  renderSalesInventory();
  renderTaxSummary();
}
