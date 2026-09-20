// ===============================
// SALES SYSTEM
// ===============================

// RECORD SALE
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

  if (item.quantityBoxes <= 0) {
    alert("No boxes left.");
    return;
  }

  item.quantityBoxes -= 1;

  saveData();
  recordSale(item, "BOX");
  renderInventory();
}

// ===============================
// SELL PACK
// ===============================
function sellPack(id) {
  loadData();

  const item = inventoryData.find(i => i.id === id);
  if (!item) return;

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
  recordSale(item, "PACK");
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
    renderSalesChart();
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
  renderSalesChart();
}

// ===============================
// SALES DASHBOARD
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
// SALES CHART (Revenue vs Expenses)
// ===============================
function renderSalesChart() {
  loadData();

  const canvas = document.getElementById('salesChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  const labels = salesData.map(s => s.date);
  const revenue = salesData.map(s => s.sellPrice);
  const expenses = salesData.map(s => s.buyPrice);

  if (window.salesChartInstance) {
    window.salesChartInstance.destroy();
  }

  window.salesChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Revenue (£)',
          data: revenue,
          borderColor: '#ffd700',
          backgroundColor: 'rgba(255,215,0,0.2)',
          borderWidth: 2
        },
        {
          label: 'Expenses (£)',
          data: expenses,
          borderColor: '#ff4444',
          backgroundColor: 'rgba(255,68,68,0.2)',
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
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
// INITIAL LOAD
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  renderSales();
});
