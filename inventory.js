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
    div.className = 'inventory-card';

    div.innerHTML = `
      <div class="inv-left">
        <img src="${item.image}" alt="${item.name}">
      </div>

      <div class="inv-right">
        <h3>${item.name}</h3>

        <div class="inv-meta">
          <span><strong>Category:</strong> ${item.category}</span>
          <span><strong>Supplier:</strong> ${item.supplier}</span>
          <span><strong>Qty:</strong> ${item.quantity}</span>
          <span><strong>Notes:</strong> ${item.notes || '—'}</span>
        </div>

        <div class="inv-prices">
          <span><strong>Buy:</strong> £${item.buyPrice.toFixed(2)}</span>
          <span><strong>Sell:</strong> £${item.sellPrice.toFixed(2)}</span>
          <span><strong>Market:</strong> £${item.marketPrice.toFixed(2)}</span>
        </div>

        <div class="inv-profit">
          <span><strong>Profit per unit:</strong> £${profitPerUnit.toFixed(2)}</span>
          <span><strong>Total profit:</strong> £${totalProfit.toFixed(2)}</span>
          <span><strong>Margin:</strong> ${marginPercent.toFixed(1)}%</span>
        </div>

        <div class="inv-actions">
          <button onclick="sellItem(${index})">Sell</button>
          <button onclick="editItem(${index})">Edit</button>
          <button onclick="copyItem(${index})">Copy</button>
          <button onclick="deleteItem(${index})">Delete</button>
        </div>
      </div>
    `;

    list.appendChild(div);
  });
}


// SELL ITEM — FULL SALE RECORD (FIXED)
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


// DELETE ITEM
function deleteItem(index) {
  loadData();
  inventoryData.splice(index, 1);
  saveData();
  renderInventory();
  renderTaxSummary();
}


// COPY ITEM
function copyItem(index) {
  loadData();

  const item = inventoryData[index];
  const newItem = { ...item, id: crypto.randomUUID() };

  inventoryData.push(newItem);
  saveData();
  renderInventory();
  renderTaxSummary();
}


// EDIT ITEM
function editItem(index) {
  loadData();

  const item = inventoryData[index];

  const newName = prompt("New name:", item.name);
  if (newName === null) return;

  const newCategory = prompt("New category:", item.category);
  if (newCategory === null) return;

  const newSupplier = prompt("New supplier:", item.supplier);
  if (newSupplier === null) return;

  const newBuy = prompt("New buy price:", item.buyPrice);
  if (newBuy === null) return;

  const newSell = prompt("New sell price:", item.sellPrice);
  if (newSell === null) return;

  const newQty = prompt("New quantity:", item.quantity);
  if (newQty === null) return;

  const newMarket = prompt("New market price:", item.marketPrice);
  if (newMarket === null) return;

  const newNotes = prompt("New notes:", item.notes);
  if (newNotes === null) return;

  item.name = newName;
  item.category = newCategory;
  item.supplier = newSupplier;
  item.buyPrice = parseFloat(newBuy);
  item.sellPrice = parseFloat(newSell);
  item.quantity = parseInt(newQty);
  item.marketPrice = parseFloat(newMarket);
  item.notes = newNotes;

  saveData();
  renderInventory();
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
