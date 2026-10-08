// ===============================================
// FLUX TCG DATA DESK & CORE RECORDING SYSTEM
// ===============================================

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

// ===============================================
// TRANSACTION ACTION AREA: SELL BOX ENGINE
// ===============================================
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
// ===============================================
// TRANSACTION ACTION AREA: SELL PACK ENGINE
// ===============================================
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

// ===============================================
// DATA OPERATIONS: UNDO RECORD & RESTORE STOCK
// ===============================================
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

// ===============================================
// DATA OPERATIONS: REMOVE TRADING HISTORIES
// ===============================================
function deleteSale(saleId) {
  loadData();
  salesData = salesData.filter(s => s.id !== saleId);
  saveData();
  renderSales();
}
// ===============================================
// DISPLAY ENGINE: RENDER MAIN SALES HISTORY LEDGER
// ===============================================
function renderSales() {
  loadData();

  // 1. Process and Render Summary Metrics & Product Breakdown Panel
  const dbDashboard = document.getElementById("salesDashboard");
  if (dbDashboard) {
    let totalSalesProfit = 0;
    let businessSalesCount = salesData.length;
    
    // Map to keep track of total quantities sold per unique item name
    const productTotals = {};

    salesData.forEach(s => {
      totalSalesProfit += (s.totalProfit || 0);
      
      const pName = s.name || "Unknown Product";
      if (!productTotals[pName]) {
        productTotals[pName] = { boxes: 0, packs: 0, image: s.image || "Logo.png" };
      }
      
      if (s.type === "BOX") {
        productTotals[pName].boxes += 1;
      } else if (s.type === "PACK") {
        productTotals[pName].packs += 1;
      }
    });

    // Top Summary banner layout
    let dashboardHtml = `
      <div style="width:100%; box-sizing:border-box; font-family:sans-serif; margin-bottom: 20px;">
        <div class="dashboard-card" style="padding:15px; text-align:center; margin-bottom:20px;">
          <h3 style="margin:0 0 10px 0; color:#ffd700; font-size:18px;">Sales Summary Metrics</h3>
          <div style="display:flex; justify-content:space-around;">
            <p style="margin:0; font-size:14px; color:#aaa;">Recorded Orders: <strong style="color:#fff; font-size:16px;">${businessSalesCount}</strong></p>
            <p style="margin:0; font-size:14px; color:#aaa;">Net Realized Profit: <strong style="color:#00ff88; font-size:16px;">£${totalSalesProfit.toFixed(2)}</strong></p>
          </div>
        </div>

        <h4 style="margin:25px 0 10px 0; color:#ffd700; font-size:14px; text-transform:uppercase; letter-spacing:0.5px;">Product Stock Volume Sold:</h4>
        
        <!-- Horizontal Scrolling Mini Card Container Row -->
        <div id="productBreakdownCards" style="display:flex; gap:16px; overflow-x:auto; padding:6px 0 18px 0; scrollbar-width:thin;">
    `;

    const itemNames = Object.keys(productTotals);
    if (itemNames.length === 0) {
      dashboardHtml += `
        <div class="supplier-breakdown-card" style="min-width: 100%; text-align: center; color: #aaa; font-style: italic;">
          No item volumes cross-referenced yet.
        </div>
      `;
    } else {
      itemNames.forEach(name => {
        const counts = productTotals[name];
        let labelDisplay = "";
        
        // Format layout strings cleanly
        if (counts.boxes > 0 && counts.packs > 0) {
          labelDisplay = `<div>${counts.boxes} Box${counts.boxes > 1 ? 'es' : ''}</div><div>${counts.packs} Pack${counts.packs > 1 ? 's' : ''}</div>`;
        } else if (counts.boxes > 0) {
          labelDisplay = `<div>${counts.boxes} Box${counts.boxes > 1 ? 'es' : ''}</div>`;
        } else {
          labelDisplay = `<div>${counts.packs} Pack${counts.packs > 1 ? 's' : ''}</div>`;
        }
        
        // Generate small micro cards matching your dashboard styles
        dashboardHtml += `
          <div class="supplier-breakdown-card" style="min-width:240px; max-width:280px; display:flex; flex-direction:column; justify-content:space-between; gap:10px;">
            <div style="display:flex; gap:10px; align-items:center;">
              <img src="${counts.image}" style="width:35px; height:35px; object-fit:contain; background:#222; border-radius:4px; border:1px solid #444;" onerror="this.src='Logo.png'">
              <h4 style="margin:0; color:#fff; font-size:14px; line-height:1.3; font-weight:700; overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">${name}</h4>
            </div>
            <div class="supplier-total" style="color:#00ff88; font-size:18px; font-weight:700; border-top:1px solid #333; padding-top:8px; margin-top:5px; line-height:1.4;">
              ${labelDisplay}
            </div>
          </div>
        `;
      });
    }

    dashboardHtml += `
        </div>
      </div>
    `;

    dbDashboard.innerHTML = dashboardHtml;
    dbDashboard.style.border = "none";
    dbDashboard.style.background = "transparent";
  }

  // Hide the auxiliary non-functional chart panels gracefully
  const expPanel = document.getElementById("personalExpensesPanel");
  if (expPanel) expPanel.style.display = "none";

  const prodSummary = document.getElementById("salesProductSummary");
  if (prodSummary) prodSummary.style.display = "none";

  const collectionPanel = document.getElementById("personalCollectionPanel");
  if (collectionPanel) collectionPanel.style.display = "none";

  // 2. Render Main Sales Ledger Grid View
  const container = document.getElementById("salesList");
  if (!container) return;

  container.innerHTML = "";

  if (!salesData || salesData.length === 0) {
    container.innerHTML = "<p style='color:#bbb; padding:15px; font-family:sans-serif;'>No business sales logs recorded yet.</p>";
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
        <img src="${sale.image || 'Logo.png'}" alt="${sale.name}" class="table-thumb" style="width:40px; height:40px; object-fit:contain; border-radius:4px;" onerror="this.src='Logo.png'">
      </td>
      <td class="cell-bold">${sale.name}</td>
      <td class="cell-center"><span class="btn-table btn-sell" style="padding: 3px 6px; pointer-events: none; border-radius:4px; font-size:12px;">${sale.type}</span></td>
      <td>${sale.category || '—'}</td>
      <td>${sale.supplier || '—'}</td>
      <td class="cell-price" style="color: #ccc !important;">£${(sale.buyPrice || 0).toFixed(2)}</td>
      <td class="cell-price">£${(sale.sellPrice || 0).toFixed(2)}</td>
      <td class="${profitClass}" ${profitStyle}>£${(sale.totalProfit || 0).toFixed(2)}</td>
      <td class="cell-center" style="font-size: 13px; font-family: monospace;">${sale.date}</td>
      <td>
        <div class="table-actions" style="display:flex; gap:6px;">
          <button class="btn-table btn-copy" onclick="undoSale(${sale.id})" style="background-color: #2e7d32; color:#fff; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">Undo</button>
          <button class="btn-table btn-delete" onclick="deleteSale(${sale.id})" style="background-color: #d32f2f; color:#fff; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">Delete</button>
        </div>
      </td>
    `;

    tbody.appendChild(row);
  });
}

// Global window registration map hooks
window.renderSales = renderSales;
window.undoSale = undoSale;
window.deleteSale = deleteSale;
