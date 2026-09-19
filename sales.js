// ===============================
// SALES PAGE LOGIC (BOX + PACK SYSTEM, NEW SYSTEM)
// ===============================
// Uses global salesData, inventoryData, loadData(), saveData() from data.js
// Do NOT redeclare salesData or inventoryData here.

// ===============================
// RECORD SALE (BOX or PACK)
// ===============================

function recordSale(item, type, quantitySold) {
  const date = new Date().toISOString();

  let buyPrice = 0;
  let sellPrice = 0;

  if (type === "BOX") {
    buyPrice = item.buyPriceBox || 0;
    sellPrice = item.sellPriceBox || 0;
  } else {
    buyPrice = item.type === "BOX"
      ? (item.packsPerBox > 0 ? (item.buyPriceBox || 0) / item.packsPerBox : 0)
      : (item.buyPricePack || 0);

    sellPrice = item.sellPricePack || 0;
  }

  const profitPerUnit = sellPrice - buyPrice;
  const totalProfit = profitPerUnit * quantitySold;

  const saleEntry = {
    id: Date.now(),
    inventoryId: item.id || null, // link back to inventory item if needed
    name: item.name,
    image: item.image,
    category: item.category,
    supplier: item.supplier,
    notes: item.notes || "—",
    date,
    type,
    quantitySold,
    buyPrice,
    sellPrice,
    marketPrice: item.marketPrice || 0,
    profitPerUnit,
    totalProfit
  };

  salesData.push(saleEntry);
  saveData();
  renderSalesInventory();
}

// ===============================
// SELL BOX
// ===============================

function sellBox(id) {
  loadData();

  const item = inventoryData.find(i => i.id === id);
  if (!item || item.type !== "BOX") return;

  if ((item.quantityBoxes || 0) <= 0) {
    alert("No boxes left.");
    return;
  }

  // Record sale first
  recordSale(item, "BOX", 1);

  // Reduce inventory
  item.quantityBoxes = (item.quantityBoxes || 0) - 1;

  // Remove item if empty
  if ((item.quantityBoxes || 0) <= 0 && (item.manualPacks || 0) <= 0) {
    inventoryData = inventoryData.filter(i => i.id !== id);
  }

  saveData();
  renderInventory();
}

// ===============================
// SELL PACK
// ===============================

function sellPack(id) {
  loadData();

  const item = inventoryData.find(i => i.id === id);
  if (!item) return;

  const qty = prompt("How many packs do you want to sell?");
  if (!qty || isNaN(qty)) return;

  const amount = parseInt(qty);

  let totalPacks = item.type === "BOX"
    ? ((item.quantityBoxes || 0) * (item.packsPerBox || 0)) + (item.manualPacks || 0)
    : (item.quantityPacks || 0);

  if (amount > totalPacks) {
    alert("Not enough packs available.");
    return;
  }

  // BOX PRODUCT PACK REDUCTION
  if (item.type === "BOX") {
    let packsFromBoxes = (item.quantityBoxes || 0) * (item.packsPerBox || 0);

    if (amount <= packsFromBoxes) {
      const boxesUsed = Math.floor(amount / (item.packsPerBox || 1));
      item.quantityBoxes = (item.quantityBoxes || 0) - boxesUsed;

      const leftover = amount % (item.packsPerBox || 1);
      item.manualPacks = (item.manualPacks || 0) - leftover;
    } else {
      item.manualPacks = (item.manualPacks || 0) - (amount - packsFromBoxes);
      item.quantityBoxes = 0;
    }

    if (item.manualPacks < 0) item.manualPacks = 0;
  }

  // PACK PRODUCT REDUCTION
  if (item.type === "PACK") {
    item.quantityPacks = (item.quantityPacks || 0) - amount;
    if (item.quantityPacks < 0) item.quantityPacks = 0;
  }

  // Record sale
  recordSale(item, "PACK", amount);

  // Remove item if empty
  if ((item.type === "BOX" && (item.quantityBoxes || 0) <= 0 && (item.manualPacks || 0) <= 0) ||
      (item.type === "PACK" && (item.quantityPacks || 0) <= 0)) {
    inventoryData = inventoryData.filter(i => i.id !== id);
  }

  saveData();
  renderInventory();
}

// ===============================
// SALES ACTIONS: DELETE / COPY / EDIT / UNDO
// ===============================

function deleteSale(id) {
  loadData();
  salesData = salesData.filter(sale => sale.id !== id);
  saveData();
  renderSalesInventory();
}

function copySale(id) {
  loadData();
  const sale = salesData.find(s => s.id === id);
  if (!sale) return;

  const copy = { ...sale, id: Date.now(), date: new Date().toISOString() };
  salesData.push(copy);
  saveData();
  renderSalesInventory();
}

function editSale(id) {
  loadData();
  const sale = salesData.find(s => s.id === id);
  if (!sale) return;

  const newQty = prompt("New quantity sold:", sale.quantitySold || 0);
  if (!newQty || isNaN(newQty)) return;

  const qty = parseInt(newQty);

  // Recalculate profit based on new quantity
  sale.quantitySold = qty;
  sale.totalProfit = (sale.profitPerUnit || 0) * qty;

  saveData();
  renderSalesInventory();
}

function undoSale(id) {
  loadData();
  const sale = salesData.find(s => s.id === id);
  if (!sale) return;

  // Try to restore inventory if linked
  if (sale.inventoryId) {
    const item = inventoryData.find(i => i.id === sale.inventoryId);
    if (item) {
      if (sale.type === "BOX") {
        item.quantityBoxes = (item.quantityBoxes || 0) + (sale.quantitySold || 0);
      } else if (sale.type === "PACK") {
        if (item.type === "BOX") {
          item.manualPacks = (item.manualPacks || 0) + (sale.quantitySold || 0);
        } else if (item.type === "PACK") {
          item.quantityPacks = (item.quantityPacks || 0) + (sale.quantitySold || 0);
        }
      }
    }
  }

  // Remove sale
  salesData = salesData.filter(s => s.id !== id);

  saveData();
  renderSalesInventory();
  renderInventory();
}

// ===============================
// RENDER SALES PAGE
// ===============================

function renderSalesInventory() {
  loadData();

  const list = document.getElementById('salesList');
  if (!list) return;

  list.innerHTML = '';

  if (!salesData || salesData.length === 0) {
    list.innerHTML = '<p>No sales yet.</p>';
    return;
  }

  salesData.forEach((sale) => {
    const div = document.createElement('div');
    div.className = 'sale-card';

    div.innerHTML = `
      <h3>${sale.name} (${sale.type})</h3>

      <img src="${sale.image || 'Logo.png'}" alt="${sale.name}"
           style="width:120px; border:1px solid #333; margin:10px 0;">

      <div class="sale-meta">
        <strong>Category:</strong> ${sale.category || "—"}<br>
        <strong>Supplier:</strong> ${sale.supplier || "—"}<br>
        <strong>Notes:</strong> ${sale.notes || "—"}
      </div>

      <div class="sale-prices">
        <strong>Buy price:</strong> £${(sale.buyPrice || 0).toFixed(2)}<br>
        <strong>Sell price:</strong> £${(sale.sellPrice || 0).toFixed(2)}<br>
        <strong>Market price:</strong> £${(sale.marketPrice || 0).toFixed(2)}
      </div>

      <div class="sale-profit">
        <strong>Profit per unit:</strong> £${(sale.profitPerUnit || 0).toFixed(2)}<br>
        <strong>Total profit:</strong> £${(sale.totalProfit || 0).toFixed(2)}
      </div>

      <div class="sale-meta">
        <strong>Quantity sold:</strong> ${sale.quantitySold || 0}<br>
        <strong>Date:</strong> ${sale.date ? new Date(sale.date).toLocaleString() : "—"}
      </div>

      <div class="sale-actions" style="margin-top:10px;">
        <button onclick="editSale(${sale.id})">Edit</button>
        <button onclick="copySale(${sale.id})">Copy</button>
        <button onclick="deleteSale(${sale.id})">Delete</button>
        <button onclick="undoSale(${sale.id})">Undo</button>
      </div>
    `;

    list.appendChild(div);
  });
}
