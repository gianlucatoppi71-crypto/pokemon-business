// ===============================
// INVENTORY SYSTEM
// ===============================

let editMode = null;

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

  // Create Excel-Style Table Wrapper
  const tableWrapper = document.createElement('div');
  tableWrapper.className = 'excel-table-wrapper';

  const table = document.createElement('table');
  table.className = 'excel-inventory-table';

  // Table Headers
  table.innerHTML = `
    <thead>
      <tr>
        <th>Image</th>
        <th>Product Name</th>
        <th>Category</th>
        <th>Supplier</th>
        <th>Buy Price Box</th>
        <th>Sell Price Box</th>
        <th>Sell Price Pack</th>
        <th>Packs/Box</th>
        <th>Boxes</th>
        <th>Loose Packs</th>
        <th>Total Packs</th>
        <th>Sale Type</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody id="excelTableBody"></tbody>
  `;

  tableWrapper.appendChild(table);
  container.appendChild(tableWrapper);

  const tbody = document.getElementById('excelTableBody');

  inventoryData.forEach((item) => {
    // If it's a PACK type, use quantityPacks as total, otherwise calculate BOX counts
    const totalPacks =
      item.type === "BOX"
        ? (parseInt(item.quantityBoxes) * parseInt(item.packsPerBox || 0)) + parseInt(item.manualPacks || 0)
        : parseInt(item.quantityPacks || 0);

    const row = document.createElement('tr');
    row.className = 'excel-row';

    const saleTypeId = `saleType_${item.id}`;

    // Gracefully handle default display values for PACK types vs BOX types
    const displayBuyPriceBox = item.type === "BOX" ? `£${(item.buyPriceBox || 0).toFixed(2)}` : `£${(item.buyPricePack || 0).toFixed(2)} (Pack)`;
    const displaySellPriceBox = item.type === "BOX" ? `£${(item.sellPriceBox || 0).toFixed(2)}` : "—";

    row.innerHTML = `
      <td class="cell-center">
        <img src="${item.image || 'Logo.png'}" alt="${item.name}" class="table-thumb">
      </td>
      <td class="cell-bold">${item.name}</td>
      <td>${item.category || '—'}</td>
      <td>${item.supplier || '—'}</td>
      <td class="cell-price">${displayBuyPriceBox}</td>
      <td class="cell-price">${displaySellPriceBox}</td>
      <td class="cell-price">£${(item.sellPricePack || 0).toFixed(2)}</td>
      <td class="cell-center">${item.packsPerBox || 0}</td>
      <td class="cell-center">${item.quantityBoxes || 0}</td>
      <td class="cell-center">${item.manualPacks || 0}</td>
      <td class="cell-center cell-bold">${totalPacks}</td>
      <td>
        <select id="${saleTypeId}" class="table-dropdown">
          <option value="business">Sell to Customer</option>
          <option value="personal">Add to Personal Collection</option>
        </select>
      </td>
      <td>
        <div class="table-actions">
          <button class="btn-table btn-sell" onclick="sellBox(${item.id})">Sell BOX</button>
          <button class="btn-table btn-sell" onclick="sellPack(${item.id})">Sell PACK</button>
          <button class="btn-table btn-edit" onclick="editItem(${item.id})">Edit</button>
          <button class="btn-table btn-copy" onclick="copyItem(${item.id})">Copy</button>
          <button class="btn-table btn-delete" onclick="deleteItem(${item.id})">Delete</button>
        </div>
      </td>
    `;

    tbody.appendChild(row);
  });
}

// ===============================
// ADD / UPDATE ITEM
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
  let buyPricePack = 0;
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

    // Use query selector safely to read the pack calculation input variant fields if active
    const boxPackSellInput = document.querySelector('#boxFields #invSellPricePack');
    if (boxPackSellInput && boxPackSellInput.value) {
      sellPricePack = parseFloat(boxPackSellInput.value) || 0;
    } else {
      sellPricePack = packsPerBox > 0 ? sellPriceBox / packsPerBox : 0;
    }
  }

  if (type === "PACK") {
    buyPricePack = parseFloat(document.getElementById('invBuyPricePack').value) || 0;
    
    // Safely look up the second sell field hidden inside packFields container wrap
    const packFieldsContainer = document.getElementById('packFields');
    const packSellInput = packFieldsContainer ? packFieldsContainer.querySelector('#invSellPricePack') : null;
    sellPricePack = packSellInput ? parseFloat(packSellInput.value) || 0 : 0;
    
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
    buyPricePack,
    sellPriceBox,
    sellPricePack,
    packsPerBox,
    quantityBoxes,
    manualPacks,
    quantityPacks,
    openedBoxes: 0,
    marketPrice,
    image,
    notes
  };

  if (editMode) {
    inventoryData = inventoryData.filter(i => i.id !== editMode);
    editMode = null;
    document.getElementById('addBtn').textContent = "Add to inventory";
  }

  inventoryData.push(item);
  saveData();
  renderInventory();

  document.getElementById('inventoryForm').reset();
  
  // Force reset visibility of optional structural box fields
  document.getElementById('boxFields').style.display = "none";
  document.getElementById('packFields').style.display = "none";
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

  const typeSelect = document.getElementById('invType');
  const boxFields = document.getElementById('boxFields');
  const packFields = document.getElementById('packFields');

  typeSelect.value = item.type;

  if (item.type === "BOX") {
    boxFields.style.display = "block";
    packFields.style.display = "none";
  } else {
    boxFields.style.display = "none";
    packFields.style.display = "block";
  }

  document.getElementById('invName').value = item.name;
  document.getElementById('invCategory').value = item.category || '';
  document.getElementById('invSupplier').value = item.supplier || '';

  if (item.type === "BOX") {
    document.getElementById('invBuyPriceBox').value = item.buyPriceBox || 0;
    document.getElementById('invSellPriceBox').value = item.sellPriceBox || 0;
    document.getElementById('invPacksPerBox').value = item.packsPerBox || 0;
    document.getElementById('invQuantityBoxes').value = item.quantityBoxes || 0;
    document.getElementById('invManualPacks').value = item.manualPacks || 0;
    
    const boxPackSellInput = boxFields.querySelector('#invSellPricePack');
    if (boxPackSellInput) boxPackSellInput.value = item.sellPricePack || 0;
  }

  if (item.type === "PACK") {
    document.getElementById('invBuyPricePack').value = item.buyPricePack || 0;
    document.getElementById('invQuantityPacks').value = item.quantityPacks || 0;
    
    const packSellInput = packFields.querySelector('#invSellPricePack');
    if (packSellInput) packSellInput.value = item.sellPricePack || 0;
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
