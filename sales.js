// ===============================
// SALES SYSTEM (Unified with inventory.js + data.js)
// ===============================

// RECORD SALE
function recordSale(item, type) {
  loadData();

  const now = new Date();
  const dateString = now.toLocaleString("en-GB");

  let profitPerUnit = 0;
  let totalProfit = 0;

  if (type === "BOX") {
    profitPerUnit = (item.sellPriceBox || 0) - (item.buyPriceBox || 0);
    totalProfit = profitPerUnit;
  }

  if (type === "PACK") {
    profitPerUnit = (item.sellPricePack || 0) - ((item.buyPriceBox || 0) / (item.packsPerBox || 1));
    totalProfit = profitPerUnit;
  }

  const sale = {
    id: Date.now(),
    inventoryId: item.id,
    name: item.name,
    type: type,
    category: item.category || "",
    supplier: item.supplier || "",
    buyPrice: type === "BOX" ? item.buyPriceBox : item.buyPriceBox / item.packsPerBox,
    sellPrice: type === "BOX" ? item.sellPriceBox : item.sellPricePack,
    marketPrice: item.marketPrice || 0,
    profitPerUnit,
    totalProfit,
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

  if ((item.quantityBoxes || 0) <= 0) {
    alert("No boxes left in stock.");
    return;
  }

  // Reduce box count
  item.quantityBoxes -= 1;

  saveData();
  recordSale(item, "BOX");
  renderInventory();
}

// ===============================
// SELL PACK (Option A: reduce packs inside box first)
// ===============================
function sellPack(id) {
  loadData();

  const item = inventoryData.find(i => i.id === id);
  if (!item) return;

  // Total packs inside boxes
  let packsInBoxes = (item.quantityBoxes || 0) * (item.packsPerBox || 0);

  // Loose packs
  let loosePacks = item.manualPacks || 0;

  // Total packs
  let totalPacks = packsInBoxes + loosePacks;

  if (totalPacks <= 0) {
    alert("No packs left in stock.");
    return;
  }

  // OPTION A: Reduce packs inside boxes first
  if (packsInBoxes > 0) {
    packsInBoxes -= 1;

    // Recalculate boxes + leftover packs inside last box
    const fullBoxes = Math.floor(packsInBoxes / item.packsPerBox);
    const leftoverPacks = packsInBoxes % item.packsPerBox;

    item.quantityBoxes = fullBoxes;
    item.manualPacks = leftoverPacks + loosePacks;
  } else {
    // If no packs in boxes, reduce loose packs
    item.manualPacks -= 1;
  }

  saveData();
  recordSale(item, "PACK");
  renderInventory();
}

// ===============================
// RENDER SALES PAGE
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

  salesData.forEach((sale) => {
    const card = document.createElement("div");
    card.className = "sales-card";

    card.innerHTML = `
      <h3>${sale.name} (${sale.type})</h3>

      <img src="${sale.image || 'Logo.png'}" alt="${sale.name}"
           style="width:120px; border:1px solid #333; margin:10px 0;">

      <p><strong>Category:</strong> ${sale.category}</p>
      <p><strong>Supplier:</strong> ${sale.supplier}</p>
      <p><strong>Notes:</strong> ${sale.notes || "—"}</p>

      <p><strong>Buy price:</strong> £${sale.buyPrice.toFixed(2)}</p>
      <p><strong>Sell price:</strong> £${sale.sellPrice.toFixed(2)}</p>
      <p><strong>Market price:</strong> £${sale.marketPrice.toFixed(2)}</p>

      <p><strong>Profit per unit:</strong> £${sale.profitPerUnit.toFixed(2)}</p>
      <p><strong>Total profit:</strong> £${sale.totalProfit.toFixed(2)}</p>

      <p><strong>Quantity sold:</strong> ${sale.quantitySold}</p>
      <p><strong>Date:</strong> ${sale.date}</p>

      <button onclick="undoSale(${sale.id})">Undo</button>
      <button onclick="deleteSale(${sale.id})">Delete</button>
    `;

    container.appendChild(card);
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
// UNDO SALE (restore stock)
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

