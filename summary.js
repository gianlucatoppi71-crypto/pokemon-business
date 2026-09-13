// SUMMARY PAGE — FINAL STABLE VERSION

// SAFETY: normalize inventory item
function normalizeItem(item) {
  return {
    id: item.id || crypto.randomUUID(),
    name: item.name || "",
    category: item.category || "",
    supplier: item.supplier || "",
    buyPrice: Number(item.buyPrice || 0),
    sellPrice: Number(item.sellPrice || 0),
    quantity: Number(item.quantity || 0),
    marketPrice: Number(item.marketPrice || 0),
    image: item.image || "",
    notes: item.notes || ""
  };
}

// SAFETY: normalize sale
function normalizeSale(sale) {
  return {
    id: sale.id || crypto.randomUUID(),
    name: sale.name || "",
    price: Number(sale.price || sale.sellPrice || 0),
    cost: Number(sale.cost || 0),
    profit: Number(sale.profit || (sale.price - sale.cost) || 0),
    image: sale.image || "",
    payment: sale.payment || "Unknown",
    date: sale.date || new Date().toISOString()
  };
}

// SAFETY: normalize single card
function normalizeSingle(card) {
  return {
    id: card.id || crypto.randomUUID(),
    name: card.name || "",
    price: Number(card.price || 0),
    cost: Number(card.cost || 0),
    profit: Number(card.profit || (card.price - card.cost) || 0),
    image: card.image || "",
    date: card.date || new Date().toISOString()
  };
}

// SAFETY: normalize trade
function normalizeTrade(trade) {
  return {
    id: trade.id || crypto.randomUUID(),
    giveValue: Number(trade.giveValue || 0),
    receiveValue: Number(trade.receiveValue || 0),
    balance: Number(trade.balance || (trade.receiveValue - trade.giveValue) || 0),
    notes: trade.notes || "",
    date: trade.date || new Date().toISOString()
  };
}

// MAIN SUMMARY RENDER
function renderSummary() {
  loadData();

  const content = document.getElementById("summaryPage");
  if (!content) return;

  // SAFETY: ensure arrays exist
  if (!Array.isArray(inventoryData)) inventoryData = [];
  if (!Array.isArray(salesData)) salesData = [];
  if (!Array.isArray(singlesData)) singlesData = [];
  if (!Array.isArray(tradesData)) tradesData = [];

  // Normalize all data
  inventoryData = inventoryData.map(normalizeItem);
  salesData = salesData.map(normalizeSale);
  singlesData = singlesData.map(normalizeSingle);
  tradesData = tradesData.map(normalizeTrade);

  // CALCULATIONS
  const totalInventoryValue = inventoryData.reduce(
    (sum, item) => sum + (item.buyPrice * item.quantity),
    0
  );

  const totalSales = salesData.reduce(
    (sum, sale) => sum + sale.price,
    0
  );

  const totalSalesProfit = salesData.reduce(
    (sum, sale) => sum + sale.profit,
    0
  );

  const totalSinglesProfit = singlesData.reduce(
    (sum, card) => sum + card.profit,
    0
  );

  const totalTradesBalance = tradesData.reduce(
    (sum, trade) => sum + trade.balance,
    0
  );

  // RENDER HTML
  content.innerHTML = `
    <h1>Business Summary</h1>

    <div class="summary-box">
      <div class="summary-title">Inventory Value</div>
      <div class="summary-value">£${totalInventoryValue.toFixed(2)}</div>
    </div>

    <div class="summary-box">
      <div class="summary-title">Total Sales</div>
      <div class="summary-value">£${totalSales.toFixed(2)}</div>
    </div>

    <div class="summary-box">
      <div class="summary-title">Sales Profit</div>
      <div class="summary-value">£${totalSalesProfit.toFixed(2)}</div>
    </div>

    <div class="summary-box">
      <div class="summary-title">Singles Profit</div>
      <div class="summary-value">£${totalSinglesProfit.toFixed(2)}</div>
    </div>

    <div class="summary-box">
      <div class="summary-title">Trades Balance</div>
      <div class="summary-value">£${totalTradesBalance.toFixed(2)}</div>
    </div>
  `;
}
