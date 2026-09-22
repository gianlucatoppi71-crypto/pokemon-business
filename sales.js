// ===============================
// SALES SYSTEM
// ===============================

// RECORD PERSONAL COLLECTION
function recordPersonalCollection(item, type) {
  loadData();

  const now = new Date();
  const dateString = now.toLocaleString("en-GB");

  const entry = {
    id: Date.now(),
    inventoryId: item.id,
    name: item.name,
    type,
    category: item.category || "",
    supplier: item.supplier || "",
    buyPrice: type === "BOX"
      ? item.buyPriceBox
      : item.buyPriceBox / item.packsPerBox,
    marketPrice: item.marketPrice || 0,
    date: dateString,
    image: item.image || "",
    notes: item.notes || "",
    packsOpened: type === "BOX" ? item.packsPerBox : 1
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

  if (type === "BOX") {
    profitPerUnit = (item.sellPriceBox || 0) - (item.buyPriceBox || 0);
  }

  if (type === "PACK") {
    profitPerUnit =
      (item.sellPricePack || 0) -
      ((item.buyPriceBox || 0) / (item.packsPerBox || 1));
  }

  const sale = {
    id: Date.now(),
    inventoryId: item.id,
    name: item.name,
    type,
    category: item.category || "",
    supplier: item.supplier || "",
    buyPrice: type === "BOX"
      ? item.buyPriceBox
      : item.buyPriceBox / item.packsPerBox,
    sellPrice: type === "BOX" ? item.sellPriceBox : item.sellPricePack,
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

  const saleType = document.getElementById(`saleType_${item.id}`).value;

  if (item.quantityBoxes <= 0) {
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

  saveData();

  if (saleType === "personal") {
    recordPersonalCollection(item, "PACK");
  } else {
    recordSale(item, "PACK");
  }

  renderInventory();
}

// ===============================
// RENDER SALES
// ===============================
function renderSales() {
  loadData();

  const container = document.getElementById("salesList");
  if (!container) return;

  container.innerHTML = "";

  if (!salesData || salesData.length === 0) {
    container.innerHTML = "<p>No sales yet.</p>";
    renderSalesDashboard();
    renderPersonalExpensesPanel();
    renderSalesProductSummary();
    renderPersonalCollectionPanel();
    return;
  }

  salesData.forEach((sale) => {
    const card = document.createElement("div");
    card.className = "sales-card";

    card.innerHTML = `
      <h3>${sale.name} (${sale.type})</h3>

      <img src="${sale.image || 'Logo.png'}" alt="${sale.name}"
           style="width:120px; border:1px solid #333; margin:10px 0;">

      <p><strong>Buy:</strong> £${sale.buyPrice.toFixed(2)}</p>
      <p><strong>Sell:</strong> £${sale.sellPrice.toFixed(2)}</p>
      <p><strong>Profit:</strong> £${sale.totalProfit.toFixed(2)}</p>
      <p><strong>Date:</strong> ${sale.date}</p>

      <button onclick="undoSale(${sale.id})">Undo</button>
      <button onclick="deleteSale(${sale.id})">Delete</button>
    `;

    container.appendChild(card);
  });

  renderSalesDashboard();
  renderPersonalExpensesPanel();
  renderSalesProductSummary();
  renderPersonalCollectionPanel();
}

// ===============================
// DASHBOARD (4 CARDS)
// ===============================
function renderSalesDashboard() {
  loadData();

  let totalSales = salesData.length;
  let totalRevenue = 0;
  let totalProfit = 0;
  let totalExpenses = 0;

  salesData.forEach(sale => {
    totalRevenue += sale.sellPrice || 0;
    totalProfit += sale.totalProfit || 0;
    totalExpenses += sale.buyPrice || 0;
  });

  const dashboard = document.getElementById("salesDashboard");
  if (!dashboard) return;

  dashboard.innerHTML = `
    <div class="dashboard-card">
      <h3>Total Sales</h3>
      <p>${totalSales}</p>
    </div>

    <div class="dashboard-card">
      <h3>Total Revenue</h3>
      <p>£${totalRevenue.toFixed(2)}</p>
    </div>

    <div class="dashboard-card">
      <h3>Total Expenses</h3>
      <p>£${totalExpenses.toFixed(2)}</p>
    </div>

    <div class="dashboard-card">
      <h3>Total Profit</h3>
      <p>£${totalProfit.toFixed(2)}</p>
    </div>
  `;
}

// ===============================
// NEW BIG PANEL — PERSONAL COLLECTION EXPENSES
// ===============================
function renderPersonalExpensesPanel() {
  loadData();

  const panel = document.getElementById("personalExpensesPanel");
  if (!panel) return;

  let totalSpent = 0;
  let totalPacks = 0;

  personalCollectionData.forEach(entry => {
    totalSpent += entry.buyPrice || 0;
    totalPacks += entry.packsOpened || 0;
  });

  panel.innerHTML = `
    <div class="dashboard-card" style="width:100%; text-align:center;">
      <h3>Personal Collection Expenses</h3>
      <p><strong>Total Spent:</strong> £${totalSpent.toFixed(2)}</p>
      <p><strong>Packs Opened:</strong> ${totalPacks}</p>
    </div>
  `;
}

// ===============================
// PRODUCT SUMMARY PANEL
// ===============================
function renderSalesProductSummary() {
  loadData();

  const summaryBox = document.getElementById("salesProductSummary");
  if (!summaryBox) return;

  const grouped = {};

  salesData.forEach(sale => {
    if (!grouped[sale.name]) {
      grouped[sale.name] = {
        name: sale.name,
        image: sale.image,
        quantity: 0,
        profit: 0,
        types: new Set()
      };
    }

    grouped[sale.name].quantity += sale.quantitySold;
    grouped[sale.name].profit += sale.totalProfit;
    grouped[sale.name].types.add(sale.type);
  });

  summaryBox.innerHTML = `<h3>Products Sold</h3>`;

  Object.values(grouped).forEach(item => {
    summaryBox.innerHTML += `
      <div class="sales-product-item">
        <img src="${item.image || 'Logo.png'}">
        <div>
          <p><strong>${item.name}</strong></p>
          <p>Qty: ${item.quantity}</p>
          <p>Profit: £${item.profit.toFixed(2)}</p>
          <p>Type: ${Array.from(item.types).join(', ')}</p>
        </div>
      </div>
    `;
  });
}

// ===============================
// PERSONAL COLLECTION PANEL
// ===============================
function renderPersonalCollectionPanel() {
  loadData();

  const panel = document.getElementById("personalCollectionPanel");
  if (!panel) return;

  let totalSpent = 0;
  let totalPacks = 0;

  personalCollectionData.forEach(entry => {
    totalSpent += entry.buyPrice || 0;
    totalPacks += entry.packsOpened || 0;
  });

  panel.innerHTML = `
    <h3>Personal Collection</h3>
    <p><strong>Total Spent:</strong> £${totalSpent.toFixed(2)}</p>
    <p><strong>Packs Opened:</strong> ${totalPacks}</p>

    <button id="pcToggleBtn" class="pc-toggle-btn">▶ Show Details</button>

    <div id="pcDetails" style="display:none; margin-top:10px;"></div>
  `;

  const detailsBox = document.getElementById("pcDetails");
  const toggleBtn = document.getElementById("pcToggleBtn");

  toggleBtn.onclick = () => {
    if (detailsBox.style.display === "none") {
      detailsBox.style.display = "block";
      toggleBtn.textContent = "▼ Hide Details";

      detailsBox.innerHTML = personalCollectionData.map(entry => `
        <div class="pc-item">
          <img src="${entry.image || 'Logo.png'}" style="width:80px; margin-right:10px;">
          <p><strong>${entry.name}</strong> (${entry.type})</p>
          <p>Cost: £${entry.buyPrice.toFixed(2)}</p>
          <p>Packs Opened: ${entry.packsOpened}</p>
          <p>Date: ${entry.date}</p>
          <p>Notes: ${entry.notes || '—'}</p>
        </div>
        <hr>
      `).join("");

    } else {
      detailsBox.style.display = "none";
      toggleBtn.textContent = "▶ Show Details";
    }
  };
}

// ===============================
// DELETE SALE
// ===============================
function deleteSale(id) {
  loadData();
  salesData = salesData.filter(s => s.id !== id);
  saveData();
  renderSales();
}

// ===============================
// UNDO SALE
// ===============================
function undoSale(id) {
  loadData();

  const sale = salesData.find(s => s.id === id);
  if (!sale) return;

  const item = inventoryData.find(i => i.id === sale.inventoryId);
  if (!item) return;

  if (sale.type === "BOX") {
    item.quantityBoxes += 1;
  }

  if (sale.type === "PACK") {
    item.manualPacks += 1;
  }

  salesData = salesData.filter(s => s.id !== id);

  saveData();
  renderSales();
  renderInventory();
}

// ===============================
document.addEventListener("DOMContentLoaded", () => {
  renderSales();
});
