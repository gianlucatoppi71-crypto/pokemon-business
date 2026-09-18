// ===============================
// SALES PAGE LOGIC (UPGRADED)
// ===============================

// salesData is stored in localStorage
let salesData = JSON.parse(localStorage.getItem("salesData") || "[]");

function saveSales() {
  localStorage.setItem("salesData", JSON.stringify(salesData));
}

// ===============================
// RECORD SALE (BOX or PACK)
// ===============================

function recordSale(item, type) {
  const date = new Date().toISOString();

  // Calculate buy cost per pack
  const buyPricePack = item.packsPerBox > 0 ? item.buyPriceBox / item.packsPerBox : 0;

  let saleEntry = {
    id: Date.now(),
    name: item.name,
    image: item.image,
    category: item.category,
    supplier: item.supplier,
    notes: item.notes || "—",
    date,

    // dynamic fields
    type, // "BOX" or "PACK"
    quantitySold: 1,
    buyPrice: type === "BOX" ? item.buyPriceBox : buyPricePack,
    sellPrice: type === "BOX" ? item.sellPriceBox : item.sellPricePack,
    marketPrice: item.marketPrice,

    profitPerUnit:
      type === "BOX"
        ? item.sellPriceBox - item.buyPriceBox
        : item.sellPricePack - buyPricePack,

    totalProfit:
      type === "BOX"
        ? item.sellPriceBox - item.buyPriceBox
        : item.sellPricePack - buyPricePack
  };

  salesData.push(saleEntry);
  saveSales();
  renderSalesInventory();
}

// ===============================
// SELL BOX (called from inventory.js)
// ===============================

function sellBox(id) {
  const item = inventoryData.find(i => i.id === id);
  if (!item) return;

  if (item.quantityBoxes <= 0) {
    alert("No boxes left to sell.");
    return;
  }

  // Reduce inventory
  item.quantityBoxes -= 1;

  // Remove packs inside the box
  item.manualPacks -= item.packsPerBox;
  if (item.manualPacks < 0) item.manualPacks = 0;

  // Record sale
  recordSale(item, "BOX");

  saveData();
  renderInventory();
}

// ===============================
// SELL PACK (called from inventory.js)
// ===============================

function sellPack(id) {
  const item = inventoryData.find(i => i.id === id);
  if (!item) return;

  const totalPacks = item.quantityBoxes * item.packsPerBox + item.manualPacks;

  if (totalPacks <= 0) {
    alert("No packs left to sell.");
    return;
  }

  // Sell manual packs first
  if (item.manualPacks > 0) {
    item.manualPacks -= 1;
  } else {
    // Sell from boxes
    const totalBoxPacks = item.quantityBoxes * item.packsPerBox;

    if (totalBoxPacks > 0) {
      const newTotalBoxPacks = totalBoxPacks - 1;
      const newBoxes = Math.floor(newTotalBoxPacks / item.packsPerBox);
      item.quantityBoxes = newBoxes;
    }
  }

  // Record sale
  recordSale(item, "PACK");

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

      <img src="${sale.image}" alt="${sale.name}"
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
