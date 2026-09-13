// INVENTORY PAGE LOGIC — FINAL STABLE VERSION

let editingIndex = null;

// SAFETY: ensure item has all fields
function normalizeItem(item) {
  return {
    id: item.id || crypto.randomUUID(),
    name: item.name || "",
    category: item.category || "",
    supplier: item.supplier || "",
    buyPrice: Number(item.buyPrice || 0),
    sellPrice: Number(item.sellPrice || 0),
    quantity: Number(item.quantity || 0),
    marketPrice: Number(item.marketPrice || 0),
    image: item.image || "",
    notes: item.notes || ""
  };
}

// SAFETY: calculate profit without crashing
function calculateItemProfit(item) {
  const buy = Number(item.buyPrice || 0);
  const sell = Number(item.sellPrice || 0);
  const qty = Number(item.quantity || 0);

  const profitPerUnit = sell - buy;
  const totalProfit = profitPerUnit * qty;
  const marginPercent = buy > 0 ? (profitPerUnit / buy) * 100 : 0;

  return { profitPerUnit, totalProfit, marginPercent };
}

// RENDER INVENTORY
function renderInventory() {
  loadData();

  const list = document.getElementById('inventoryList');
  if (!list) return;

  list.innerHTML = '';

  if (!Array.isArray(inventoryData)) inventoryData = [];

  if (inventoryData.length === 0) {
    list.innerHTML = '<p>No inventory yet. Add a product above.</p>';
    return;
  }

  inventoryData = inventoryData.map(normalizeItem);

  inventoryData.forEach((item, index) => {
    const { profitPerUnit, totalProfit, marginPercent } = calculateItemProfit(item);

    const div = document.createElement('div');
    div.className = 'item-card';

    div.innerHTML = `
      <div class="item-header">
        <h3>${item.name}</h3>
        <span class="item-meta">${item.category} • ${item.supplier}</span>
      </div>

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

      <div style="margin-top:10px;">
        <button class="sell-button" onclick="sellItem(${index})">Sell</button>
        <button class="sell-button" style="background:#ffa500;" onclick="editItem(${index})">Edit</button>
        <button class="sell-button" style="background:#888;" onclick="copyItem(${index})">Copy</button>
        <button class="sell-button" style="background:red; color:white;" onclick="deleteItem(${index})">Delete</button>
      </div>
    `;

    list.appendChild(div);
  });
}

// ADD / EDIT ITEM
document.getElementById('inventoryForm').addEventListener('submit', (e) => {
  e.preventDefault();

  loadData();

  const item = normalizeItem({
    id: editingIndex === null ? crypto.randomUUID() : inventoryData[editingIndex].id,
    name: document.getElementById('invName').value,
    category: document.getElementById('invCategory').value,
    supplier: document.getElementById('invSupplier').value,
    buyPrice: document.getElementById('invBuyPrice').value,
    sellPrice: document.getElementById('invSellPrice').value,
    quantity: document.getElementById('invQuantity').value,
    marketPrice: document.getElementById('invMarketPrice').value,
    image: document.getElementById('invImage').value,
    notes: document.getElementById('invNotes').value
  });

  if (editingIndex === null) {
    inventoryData.push(item);
  } else {
    inventoryData[editingIndex] = item;
    editingIndex = null;
  }

  saveData();
  renderInventory();
  renderSalesInventory();
  renderTaxSummary();

  e.target.reset();
});

// EDIT ITEM
function editItem(index) {
  loadData();
  const item = normalizeItem(inventoryData[index]);
  editingIndex = index;

  document.getElementById('invName').value = item.name;
  document.getElementById('invCategory').value = item.category;
  document.getElementById('invSupplier').value = item.supplier;
  document.getElementById('invBuyPrice').value = item.buyPrice;
  document.getElementById('invSellPrice').value = item.sellPrice;
  document.getElementById('invQuantity').value = item.quantity;
  document.getElementById('invMarketPrice').value = item.marketPrice;
  document.getElementById('invImage').value = item.image;
  document.getElementById('invNotes').value = item.notes;
}

// COPY ITEM
function copyItem(index) {
  loadData();
  const item = normalizeItem(inventoryData[index]);

  const copy = normalizeItem({
    ...item,
    id: crypto.randomUUID(),
    name: item.name + ' (copy)'
  });

  inventoryData.push(copy);
  saveData();
  renderInventory();
  renderSalesInventory();
  renderTaxSummary();
}

// DELETE ITEM
function deleteItem(index) {
  loadData();
  inventoryData.splice(index, 1);
  saveData();
  renderInventory();
  renderSalesInventory();
  renderTaxSummary();
}

// SELL ITEM — FINAL COMPATIBLE VERSION
function sellItem(index) {
  loadData();

  const item = normalizeItem(inventoryData[index]);
  if (!item || item.quantity <= 0) return;

  const buy = Number(item.buyPrice || 0);
  const sell = Number(item.sellPrice || 0);
  const profitPerUnit = sell - buy;

  const sale = {
    id: crypto.randomUUID(),
    name: item.name,
    price: sell,
    cost: buy,
    profit: profitPerUnit,
    image: item.image,
    payment: "Unknown",
    date: new Date().toISOString()
  };

  salesData.push(sale);

  item.quantity -= 1;

  if (item.quantity <= 0) {
    inventoryData.splice(index, 1);
  } else {
    inventoryData[index] = item;
  }

  saveData();
  renderInventory();
  renderSalesInventory();
  renderSummary();
  renderTaxSummary();
}

