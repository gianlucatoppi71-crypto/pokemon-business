// INVENTORY PAGE LOGIC

function renderInventory() {
  loadData();

  const list = document.getElementById('inventoryList');
  if (!list) return;

  list.innerHTML = '';

  if (inventoryData.length === 0) {
    list.innerHTML = '<p>No items in inventory.</p>';
    return;
  }

  inventoryData.forEach((item, index) => {
    const { profitPerUnit, totalProfit, marginPercent } = calculateItemProfit(item);

    const div = document.createElement('div');
    div.className = 'item-card';

    div.innerHTML = `
      <div class="item-header">
        <h3>${item.name}</h3>
        <span>Qty: ${item.quantity}</span>
      </div>

      <img src="${item.image}" alt="${item.name}">

      <div class="item-meta">
        <strong>Category:</strong> ${item.category}<br>
        <strong>Supplier:</strong> ${item.supplier}<br>
        <strong>Market price:</strong> £${item.marketPrice.toFixed(2)}<br>
        <strong>Notes:</strong> ${item.notes || '—'}
      </div>

      <div class="item-profit">
        <span><strong>Buy price:</strong> £${item.buyPrice.toFixed(2)}</span>
        <span><strong>Sell price:</strong> £${item.sellPrice.toFixed(2)}</span>
        <span><strong>Profit per unit:</strong> £${profitPerUnit.toFixed(2)}</span>
        <span><strong>Total profit:</strong> £${totalProfit.toFixed(2)}</span>
        <span><strong>Margin:</strong> ${marginPercent.toFixed(1)}%</span>
      </div>

      <button class="sell-button" onclick="sellItem(${index})">
        Sell from Sales page
      </button>
    `;

    list.appendChild(div);
  });
}


// FIXED SELL FUNCTION — FULL SALE RECORD
function sellItem(index) {
  loadData();

  const item = inventoryData[index];
  if (!item) return;

  if (item.quantity <= 0) return;

  const { profitPerUnit } = calculateItemProfit(item);

  const saleRecord = {
    id: crypto.randomUUID(),
    name: item.name,
    category: item.category,
    supplier: item.supplier,
    buyPrice: item.buyPrice,
    sellPrice: item.sellPrice,
    marketPrice: item.marketPrice,
    quantitySold: 1,
    profitPerUnit: profitPerUnit,
    totalProfit: profitPerUnit,
    image: item.image,
    notes: item.notes,
    date: new Date().toISOString()
  };

  salesData.push(saleRecord);

  item.quantity -= 1;

  if (item.quantity <= 0) {
    inventoryData.splice(index, 1);
  }

  saveData();
  renderInventory();
  renderSalesInventory();
  renderTaxSummary();
}


// ADD ITEM TO INVENTORY
document.getElementById('inventoryForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const item = {
    id: crypto.randomUUID(),
    name: document.getElementById('invName').value,
    category: document.getElementById('invCategory').value,
    supplier: document.getElementById('invSupplier').value,
    buyPrice: parseFloat(document.getElementById('invBuyPrice').value),
    sellPrice: parseFloat(document.getElementById('invSellPrice').value),
    quantity: parseInt(document.getElementById('invQuantity').value),
    marketPrice: parseFloat(document.getElementById('invMarketPrice').value),
    image: document.getElementById('invImage').value,
    notes: document.getElementById('invNotes').value
  };

  inventoryData.push(item);
  saveData();
  renderInventory();
  renderTaxSummary();

  this.reset();
});
