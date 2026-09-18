// ===============================
// SALES PAGE LOGIC (BOX + PACK SYSTEM)
// ===============================
// Uses global salesData and saveData() from data.js
// Do NOT redeclare salesData here.

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
  saveData();          // uses global saveData from data.js
  renderSalesInventory();
}

// ===============================
// RENDER SALES PAGE
// ===============================

function renderSalesInventory() {
  loadData(); // refresh salesData from storage

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

