// ===============================
// SALES SYSTEM
// ===============================

// RECORD PERSONAL COLLECTION
function recordPersonalCollection(item, type) {
  loadData();

  const now = new Date();
  const dateString = now.toLocaleString("en-GB");

  let buyPrice = 0;
  if (item.type === "BOX") {
    buyPrice = type === "BOX" ? (item.buyPriceBox || 0) : (item.buyPriceBox || 0) / (item.packsPerBox || 1);
  } else {
    buyPrice = item.buyPricePack || 0;
  }

  const entry = {
    id: Date.now(),
    inventoryId: item.id,
    name: item.name,
    type,
    category: item.category || "",
    supplier: item.supplier || "",
    buyPrice: buyPrice,
    marketPrice: item.marketPrice || 0,
    date: dateString,
    image: item.image || "",
    notes: item.notes || "",
    packsOpened: type === "BOX" ? (item.packsPerBox || 0) : 1
  };

  personalCollectionData.push(entry);
  saveData();
  renderSales();
}

// RECORD BUSINESS SALE
function recordSale(item, type) {
  loadData();

  const now = new Date();
  const dateString = now.toLocaleString("en-GB");

  let profitPerUnit = 0;
  let buyPrice = 0;
  let sellPrice = 0;

  if (item.type === "BOX") {
    if (type === "BOX") {
      buyPrice = item.buyPriceBox || 0;
      sellPrice = item.sellPriceBox || 0;
      profitPerUnit = sellPrice - buyPrice;
    } else {
      buyPrice = (item.buyPriceBox || 0) / (item.packsPerBox || 1);
      sellPrice = item.sellPricePack || 0;
      profitPerUnit = sellPrice - buyPrice;
    }
  } else {
    buyPrice = item.buyPricePack || 0;
    sellPrice = item.sellPricePack || 0;
    profitPerUnit = sellPrice - buyPrice;
  }

  const sale = {
    id: Date.now(),
    inventoryId: item.id,
    name: item.name,
    type,
    category: item.category || "",
    supplier: item.supplier || "",
    buyPrice: buyPrice,
    sellPrice: sellPrice,
    marketPrice: item.marketPrice || 0,
    profitPerUnit,
    totalProfit: profitPerUnit,
    quantitySold: 1,
    date: dateString,
    image: item.image || "",
    notes: item.notes || ""
  };

  salesData.push(sale);
  saveData();
  renderSales();
}

// ===============================
// SELL BOX
// ===============================
function sellBox(id) {
  loadData();

  const item = inventoryData.find(i => i.id === id);
  if (!item) return;

  if (item.type === "PACK") {
    alert("This product is registered as a Pack item, it cannot be sold as a Box.");
    return;
  }

  const saleType = document.getElementById(`saleType_${item.id}`).value;

  if ((item.quantityBoxes || 0) <= 0) {
    alert("No boxes left.");
    return;
  }

  item.quantityBoxes -= 1;
  saveData();

  if (saleType === "personal") {
    recordPersonalCollection(item, "BOX");
  } else {
    recordSale(item, "BOX");
  }

  renderInventory();
}

// ===============================
// SELL PACK
// ===============================
function sellPack(id) {
  loadData();

  const item = inventoryData.find(i => i.id === id);
  if (!item) return;

  const saleType = document.getElementById(`saleType_${item.id}`).value;

  if (item.type === "PACK") {
    let qtyPacks = parseInt(item.quantityPacks || 0);
    if (qtyPacks <= 0) {
      alert("No packs left.");
      return;
    }
    item.quantityPacks = qtyPacks - 1;
  } else {
    const packsPerBox = item.packsPerBox || 0;
    let boxes = item.quantityBoxes || 0;
    let loosePacks = item.manualPacks || 0;
    let openedBoxes = item.openedBoxes || 0;

    let totalPacks = loosePacks + (openedBoxes * packsPerBox) + (boxes * packsPerBox);
    if (totalPacks <= 0) {
      alert("No packs left.");
      return;
    }

    if (loosePacks > 0) {
      loosePacks -= 1;
    } else {
      if (openedBoxes > 0) {
        loosePacks = packsPerBox - 1;
        openedBoxes -= 1;
      } else {
        if (boxes <= 0) {
          alert("No packs left.");
          return;
        }
        boxes -= 1;
        openedBoxes += 1;
        loosePacks = packsPerBox - 1;
      }
    }

    if (openedBoxes > 0 && loosePacks === 0) {
      openedBoxes -= 1;
    }

    item.quantityBoxes = boxes;
    item.manualPacks = loosePacks;
    item.openedBoxes = openedBoxes;
  }

  saveData();

  if (saleType === "personal") {
    recordPersonalCollection(item, "PACK");
  } else {
    recordSale(item, "PACK");
  }

  renderInventory();
}

// ===============================
// UNDO SALE (RESTORE INVENTORY)
// ===============================
function undoSale(saleId) {
  loadData();

  const saleIndex = salesData.findIndex(s => s.id === saleId);
  if (saleIndex === -1) return;

  const sale = salesData[saleIndex];
  const item = inventoryData.find(i => i.id === sale.inventoryId);

  if (item) {
    if (sale.type === "BOX") {
      item.quantityBoxes = (item.quantityBoxes || 0) + 1;
    } else if (sale.type === "PACK") {
      if (item.type === "PACK") {
        item.quantityPacks = (item.quantityPacks || 0) + 1;
      } else {
        item.manualPacks = (item.manualPacks || 0) + 1;
      }
    }
  }

  salesData.splice(saleIndex, 1);
  saveData();
  renderInventory();
  renderSales();
}

// ===============================
// DELETE SALE RECORD
// ===============================
function deleteSale(saleId) {
  loadData();
  salesData = salesData.filter(s => s.id !== saleId);
  saveData();
  renderSales();
}

// ===============================
// RENDER MAIN SALES HISTORY LEDGER
// ===============================
function renderSales() {
  loadData();

  const container = document.getElementById("salesList");
  if (!container) return;

  container.innerHTML = "";

  if (!salesData || salesData.length === 0) {
    container.innerHTML = "<p>No sales recorded yet.</p>";
    return;
  }

  const tableWrapper = document.createElement('div');
  tableWrapper.className = 'excel-table-wrapper';

  const table = document.createElement('table');
  table.className = 'excel-inventory-table';

  table.innerHTML = `
    <thead>
      <tr>
        <th>Image</th>
        <th>Product Name</th>
        <th>Sale Type</th>
        <th>Category</th>
        <th>Supplier</th>
        <th>Cost Price</th>
        <th>Sale Price</th>
        <th>Net Profit</th>
        <th>Date & Time</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody id="excelSalesTableBody"></tbody>
  `;

  tableWrapper.appendChild(table);
  container.appendChild(tableWrapper);

  const tbody = document.getElementById('excelSalesTableBody');

  salesData.forEach((sale) => {
    const row = document.createElement('tr');
    row.className = 'excel-row';

    const profitClass = sale.totalProfit > 0 ? 'cell-price' : 'cell-price cell-bold';
    const profitStyle = sale.totalProfit <= 0 ? 'style="color: #ff8a8a !important;"' : '';

    row.innerHTML = `
      <td class="cell-center">
        <img src="${sale.image || 'Logo.png'}" alt="${sale.name}" class="table-thumb">
      </td>
      <td class="cell-bold">${sale.name}</td>
      <td class="cell-center"><span class="btn-table btn-sell" style="padding: 3px 6px; pointer-events: none;">${sale.type}</span></td>
      <td>${sale.category || '—'}</td>
      <td>${sale.supplier || '—'}</td>
      <td class="cell-price" style="color: #ccc !important;">£${(sale.buyPrice || 0).toFixed(2)}</td>
      <td class="cell-price">£${(sale.sellPrice || 0).toFixed(2)}</td>
      <td class="${profitClass}" ${profitStyle}>£${(sale.totalProfit || 0).toFixed(2)}</td>
      <td class="cell-center" style="font-size: 13px; font-family: monospace;">${sale.date}</td>
      <td>
        <div class="table-actions">
          <button class="btn-table btn-copy" onclick="undoSale(${sale.id})" style="background-color: #2e7d32;">Undo</button>
          <button class="btn-table btn-delete" onclick="deleteSale(${sale.id})">Delete</button>
        </div>
      </td>
    `;

    tbody.appendChild(row);
  });
}
