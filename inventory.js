// ===============================
// INVENTORY SYSTEM (Unified with sales.js)
// Uses inventoryData, salesData, loadData(), saveData() from data.js
// ===============================

let editMode = null; // store ID of item being edited

// ===============================
// RENDER INVENTORY
// ===============================
function renderInventory() {
  loadData();

  const container = document.getElementById('inventoryList');
  if (!container) return;

  container.innerHTML = '';

  if (!inventoryData || inventoryData.length === 0) {
    container.innerHTML = '<p>No inventory yet.</p>';
    return;
  }

  inventoryData.forEach((item) => {
    const totalPacks =
      item.type === "BOX"
        ? ((item.quantityBoxes || 0) * (item.packsPerBox || 0)) + (item.manualPacks || 0)
        : (item.quantityPacks || 0);

    const card = document.createElement('div');
    card.className = 'inventory-card';

    card.innerHTML = `
      <h3>${item.name}</h3>

      <img src="${item.image || 'Logo.png'}" alt="${item.name}"
           style="width:120px; border:1px solid #333; margin:10px 0;">

      <p><strong>Category:</strong> ${item.category || '—'}</p>
      <p><strong>Supplier:</strong> ${item.supplier || '—'}</p>

      <p><strong>Buy price per BOX:</strong> £${(item.buyPriceBox || 0).toFixed(2)}</p>
      <p><strong>Sell price per BOX:</strong> £${(item.sellPriceBox || 0).toFixed(2)}</p>
      <p><strong>Sell price per PACK:</strong> £${(item.sellPricePack || 0).toFixed(2)}</p>

      <p><strong>Packs per box:</strong> ${item.packsPerBox || 0}</p>
      <p><strong>Quantity of BOXES:</strong> ${item.quantityBoxes || 0}</p>
      <p><strong>Loose packs:</strong> ${item.manualPacks || 0}</p>
      <p><strong>Total packs:</strong> ${totalPacks}</p>

      <p><strong>Market price (UK):</strong> £${(item.marketPrice || 0).toFixed(2)}</p>
      <p><strong>Notes:</strong> ${item.notes || '—'}</p>

      <button onclick="sellBox(${item.id})">Sell BOX</button>
      <button onclick="sellPack(${item.id})">Sell PACK</button>
      <button onclick="editItem(${item.id})">Edit</button>
      <button onclick="copyItem(${item.id})">Copy</button>
      <button onclick="deleteItem(${item.id})">Delete</button>
    `;

    container.appendChild(card);
  });
}

// ===============================
// ADD OR UPDATE INVENTORY ITEM
// ===============================
function addInventoryItem(event) {
  event.preventDefault();
  loadData();

  const type = document.getElementById('invType').value;
  const name = document.getElementById('invName').value.trim();
  const category = document.getElementById('invCategory').value.trim();
  const supplier = document.getElementById('invSupplier').value.trim();

  if (!name || !type) return;

  let buyPriceBox = 0;
  let sellPriceBox = 0;
  let sellPricePack = 0;
  let packsPerBox = 0;
  let quantityBoxes = 0;
  let manualPacks = 0;
  let quantityPacks = 0;

  if (type === "BOX") {
    buyPriceBox = parseFloat(document.getElementById('invBuyPriceBox').value) || 0;
    sellPriceBox = parseFloat(document.getElementById('invSellPriceBox').value) || 0;
    packsPerBox = parseInt(document.getElementById('invPacksPerBox').value) || 0;
    quantityBoxes = parseInt(document.getElementById('invQuantityBoxes').value) || 0;
    manualPacks = parseInt(document.getElementById('invManualPacks').value) || 0;

    // AUTO-CALCULATE PACK PRICE
    sellPricePack = packsPerBox > 0 ? sellPriceBox / packsPerBox : 0;
  }

  if (type === "PACK") {
    sellPricePack = parseFloat(document.getElementById('invSellPricePack').value) || 0;
    quantityPacks = parseInt(document.getElementById('invQuantityPacks').value) || 0;
  }

  const marketPrice = parseFloat(document.getElementById('invMarketPrice').value) || 0;
  const image = document.getElementById('invImage').value.trim();
  const notes = document.getElementById('invNotes').value.trim();

  const item = {
    id: editMode ? editMode : Date.now(),
    type,
    name,
    category,
    supplier,
    buyPriceBox,
    sellPriceBox,
    sellPricePack,
    buyPricePack: 0,
    packsPerBox,
    quantityBoxes,
    manualPacks,
    quantityPacks,
    marketPrice,
    image,
    notes
  };

  // UPDATE MODE
  if (editMode) {
    inventoryData = inventoryData.filter(i => i.id !== editMode);
    editMode = null;
    document.getElementById('addBtn').textContent = "Add to inventory";
  }

  inventoryData.push(item);
  saveData();
  renderInventory();

  document.getElementById('inventoryForm').reset();
}

// ===============================
// EDIT ITEM
// ===============================
function editItem(id) {
  loadData();

  const item = inventoryData.find(i => i.id === id);
  if (!item) return;

  editMode = id;
  document.getElementById('addBtn').textContent = "Update product";

  document.getElementById('invType').value = item.type;
  document.getElementById('invName').value = item.name;
  document.getElementById('invCategory').value = item.category || '';
  document.getElementById('invSupplier').value = item.supplier || '';

  if (item.type === "BOX") {
    document.getElementById('invBuyPriceBox').value = item.buyPriceBox || 0;
    document.getElementById('invSellPriceBox').value = item.sellPriceBox || 0;
    document.getElementById('invPacksPerBox').value = item.packsPerBox || 0;
    document.getElementById('invQuantityBoxes').value = item.quantityBoxes || 0;
    document.getElementById('invManualPacks').value = item.manualPacks || 0;
  }

  if (item.type === "PACK") {
    document.getElementById('invSellPricePack').value = item.sellPricePack || 0;
    document.getElementById('invQuantityPacks').value = item.quantityPacks || 0;
  }

  document.getElementById('invMarketPrice').value = item.marketPrice || 0;
  document.getElementById('invImage').value = item.image || '';
  document.getElementById('invNotes').value = item.notes || '';
}

// ===============================
// COPY ITEM
// ===============================
function copyItem(id) {
  loadData();

  const item = inventoryData.find(i => i.id === id);
  if (!item) return;

  const copy = { ...item, id: Date.now() };
  inventoryData.push(copy);
  saveData();
  renderInventory();
}

// ===============================
// DELETE ITEM
// ===============================
function deleteItem(id) {
  loadData();

  inventoryData = inventoryData.filter(i => i.id !== id);
  saveData();
  renderInventory();
}

// ===============================
// INITIAL LOAD
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  renderInventory();
});
