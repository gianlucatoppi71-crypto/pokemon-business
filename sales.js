// ===============================
// SALES PAGE LOGIC (BOX + PACK SYSTEM)
// ===============================

// Load sales from storage
let salesData = JSON.parse(localStorage.getItem("salesData") || "[]");

function saveSales() {
  localStorage.setItem("salesData", JSON.stringify(salesData));
}

// ===============================
// RECORD SALE (BOX or PACK)
// ===============================

function recordSale(item, type, quantitySold) {
  const date = new Date().toISOString();

  let buyPrice = 0;
  let sellPrice = 0;

  if (type === "BOX") {
    buyPrice = item.buyPriceBox;
    sellPrice = item.sellPriceBox;
  } else {
    buyPrice = item.type === "BOX"
      ? item.buyPriceBox / item.packsPerBox
      : item.buyPricePack;

    sellPrice = item.sellPricePack;
  }

  const profitPerUnit = sellPrice - buyPrice;
  const totalProfit = profitPerUnit * quantitySold;

  const saleEntry = {
    id: Date.now(),
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
  saveSales();
  renderSalesInventory();
}

// ===============================
// SELL BOX
// ===============================

function sellBox(id) {
  const item = inventoryData.find(i => i.id === id);
  if (!item || item.type !== "BOX") return;

  if (item.quantityBoxes <= 0) {
    alert("No boxes left.");
    return;
  }

  // Reduce inventory
  item.quantityBoxes -= 1;

  // Remove packs inside the box
  item.manualPacks -= item.packsPerBox;
  if (item.manualPacks < 0) item.manualPacks = 0;

  // Record sale
  recordSale(item, "BOX", 1);

  // Remove item if empty
  if (item.quantityBoxes <= 0 && item.manualPacks <= 0) {
    inventoryData = inventoryData.filter(i => i.id !== id);
  }

  saveData();
  renderInventory();
}

// ===============================
// SELL PACK
// ===============================

function sellPack(id) {
  const item = inventoryData.find(i => i.id === id);
  if (!item) return;

  const qty = prompt("How many packs do you want to sell?");
  if (!qty || isNaN(qty)) return;

  const amount = parseInt(qty);

  let totalPacks = item.type === "BOX"
    ? (item.quantityBoxes * item.packsPerBox) + item.manualPacks
    : item.quantityPacks;

  if (amount > totalPacks) {
    alert("Not enough packs available.");
    return;
  }

  // BOX PRODUCT PACK REDUCTION
  if (item.type === "BOX") {
    let packsFromBoxes = item.quantityBoxes * item.packsPerBox;

    if (amount <= packsFromBoxes) {
      const boxesUsed = Math.floor(amount / item.packsPerBox);
      item.quantityBoxes -= boxesUsed;

      const leftover = amount % item.packsPerBox;
      item.manualPacks -= leftover;
    } else {
      item.manualPacks -= (amount - packsFromBoxes);
      item.quantityBoxes = 0;
    }

    if (item.manualPacks < 0) item.manualPacks = 0;
  }

  // PACK PRODUCT REDUCTION
  if (item.type === "PACK") {
    item.quantityPacks -= amount;
  }

  // Record sale
  recordSale(item, "PACK", amount);

  // Remove item if empty
  if ((item.type === "BOX" && item.quantityBoxes <= 0 && item.manualPacks <= 0) ||
      (item.type === "PACK" && item.quantityPacks <= 0)) {
    inventoryData = inventoryData.filter(i => i.id !== id);
  }

  saveData();
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

  if (salesData.length === 0) {
    list.innerHTML = '<p>No sales yet.</p>';
    return;
  }

  salesData.forEach((sale) => {
    const div = document.createElement('div');
    div.className = 'sale-card';

    div.innerHTML = `
      <h3>${sale.name} (${sale.type})</h3>

      <img src="${sale.image || 'img/default.png'}" alt="${sale.name}"
           style="width:120px; border:1px solid #333; margin:10px 0;">

      <div class="sale-meta">
        <strong>Category:</strong> ${sale.category}<br>
        <strong>Supplier:</strong> ${sale.supplier}<br>
        <strong>Notes:</strong> ${sale.notes}
      </div>

      <div class="sale-prices">
        <strong>Buy price:</strong> £${sale.buyPrice.toFixed(2)}<br>
        <strong>Sell price:</strong> £${sale.sellPrice.toFixed(2)}<br>
        <strong>Market price:</strong> £${sale.marketPrice.toFixed(2)}
      </div>

      <div class="sale-profit">
        <strong>Profit per unit:</strong> £${sale.profitPerUnit.toFixed(2)}<br>
        <strong>Total profit:</strong> £${sale.totalProfit.toFixed(2)}
      </div>

      <div class="sale-meta">
        <strong>Quantity sold:</strong> ${sale.quantitySold}<br>
        <strong>Date:</strong> ${new Date(sale.date).toLocaleString()}
      </div>
    `;

    list.appendChild(div);
  });
}
