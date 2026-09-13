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

      <!-- ⭐ ACTION BUTTONS -->
      <div class="item-actions">
        <button class="inv-btn edit" onclick="editItem(${index})">Edit</button>
        <button class="inv-btn copy" onclick="copyItem(${index})">Copy</button>
        <button class="inv-btn delete" onclick="deleteItem(${index})">Delete</button>
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
    image: document.getElementById('invImage').value,
    notes: document.getElementById('invNotes').value || ''
  };

  const editIndex = localStorage.getItem("editIndex");

  if (editIndex !== null) {
    inventoryData[editIndex] = item;
    localStorage.removeItem("editIndex");
  } else {
    inventoryData.push(item);
  }

  saveData();
  renderInventory();
  renderSalesInventory();
  renderTaxSummary();

  e.target.reset();
});


// ⭐ DELETE ITEM
function deleteItem(index) {
  inventoryData.splice(index, 1);
  saveData();
  renderInventory();
  renderSalesInventory();
  renderTaxSummary();
}


// ⭐ COPY ITEM
function copyItem(index) {
  const item = inventoryData[index];
  const newItem = {
    ...item,
    id: crypto.randomUUID(),
    name: item.name + " (copy)"
  };

  inventoryData.push(newItem);
  saveData();
  renderInventory();
  renderSalesInventory();
  renderTaxSummary();
}


// ⭐ EDIT ITEM (LOAD INTO FORM)
function editItem(index) {
  const item = inventoryData[index];

  document.getElementById('invName').value = item.name;
  document.getElementById('invCategory').value = item.category;
  document.getElementById('invSupplier').value = item.supplier;
  document.getElementById('invBuyPrice').value = item.buyPrice;
  document.getElementById('invSellPrice').value = item.sellPrice;
  document.getElementById('invQuantity').value = item.quantity;
  document.getElementById('invMarketPrice').value = item.marketPrice;
  document.getElementById('invImage').value = item.image;
  document.getElementById('invNotes').value = item.notes;

  localStorage.setItem("editIndex", index);
}


// SELL ITEM (MOVE TO SALES PAGE)
function sellItem(index) {
  const item = inventoryData[index];
  if (!item) return;

  if (item.quantity <= 0) return;

  const { profitPerUnit } = calculateItemProfit(item);

  salesData.push({
    id: crypto.randomUUID(),
    name: item.name,
    sellPrice: item.sellPrice,
    profit: profitPerUnit,
    image: item.image,
    date: new Date().toISOString()
  });

  item.quantity -= 1;

  if (item.quantity <= 0) {
    inventoryData.splice(index, 1);
  }

  saveData();
  renderInventory();
  renderSalesInventory();
  renderTaxSummary();
}
