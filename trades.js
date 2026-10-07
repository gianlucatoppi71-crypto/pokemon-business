// ===============================
// FULL TRADE BUILDER SYSTEM (BOX + PACK SUPPORT)
// ===============================

// IMPORTANT: tradesData is already declared in data.js
// REMOVE the duplicate declaration here.

// Load trades from data.js
// tradesData is already available globally

function saveTrades() {
  localStorage.setItem("tradesData", JSON.stringify(tradesData));
}

// ===============================
// RENDER TRADES PAGE
// ===============================

function renderTrades() {
  const container = document.getElementById('tradesPage');
  if (!container) return;

  container.innerHTML = `
    <h1>Trades</h1>

    <form id="tradeForm" class="trade-form">
      <h2>Create Trade</h2>

      <textarea id="tradeNotes" placeholder="Trade notes (optional)"></textarea>

      <h3>Items Received (IN)</h3>
      <div id="tradeInList"></div>
      <button type="button" onclick="addTradeInItem()">Add IN Item</button>

      <h3>Items Given (OUT)</h3>
      <div id="tradeOutList"></div>
      <button type="button" onclick="addTradeOutItem()">Add OUT Item</button>

      <button type="button" onclick="saveTrade()">Save Trade</button>
    </form>

    <h2>Trade History</h2>
    <div id="tradeHistory"></div>
  `;

  renderTradeHistory();
}

// ===============================
// ADD IN ITEM (RECEIVED)
// ===============================

function addTradeInItem() {
  const div = document.createElement("div");
  div.className = "trade-item";

  div.innerHTML = `
    <select class="tradeItemSelect">
      <option value="">Select inventory item</option>
      ${inventoryData.map(i => `
        <option value="${i.id}">${i.name} (${i.type})</option>
      `).join("")}
    </select>

    <input type="number" class="tradeQty" placeholder="Quantity">

    <button type="button" onclick="this.parentElement.remove()">Remove</button>
  `;

  document.getElementById("tradeInList").appendChild(div);
}

// ===============================
// ADD OUT ITEM (GIVEN)
// ===============================

function addTradeOutItem() {
  const div = document.createElement("div");
  div.className = "trade-item";

  div.innerHTML = `
    <select class="tradeItemSelect">
      <option value="">Select inventory item</option>
      ${inventoryData.map(i => `
        <option value="${i.id}">${i.name} (${i.type})</option>
      `).join("")}
    </select>

    <input type="number" class="tradeQty" placeholder="Quantity">

    <button type="button" onclick="this.parentElement.remove()">Remove</button>
  `;

  document.getElementById("tradeOutList").appendChild(div);
}

// ===============================
// SAVE TRADE
// ===============================

function saveTrade() {
  const notes = document.getElementById("tradeNotes").value.trim();

  const inItems = [];
  const outItems = [];

  // Collect IN items
  document.querySelectorAll("#tradeInList .trade-item").forEach(div => {
    const id = div.querySelector(".tradeItemSelect").value;
    const qty = parseInt(div.querySelector(".tradeQty").value);

    if (id && qty > 0) {
      const item = inventoryData.find(i => i.id == id);
      if (item) inItems.push({ item, qty });
    }
  });

  // Collect OUT items
  document.querySelectorAll("#tradeOutList .trade-item").forEach(div => {
    const id = div.querySelector(".tradeItemSelect").value;
    const qty = parseInt(div.querySelector(".tradeQty").value);

    if (id && qty > 0) {
      const item = inventoryData.find(i => i.id == id);
      if (item) outItems.push({ item, qty });
    }
  });

  if (inItems.length === 0 && outItems.length === 0) {
    alert("Trade must include at least one IN or OUT item.");
    return;
  }

  // ===============================
  // CALCULATE VALUES
  // ===============================

  let totalInValue = 0;
  let totalOutValue = 0;

  // IN VALUE
  inItems.forEach(({ item, qty }) => {
    if (item.type === "BOX") {
      totalInValue += qty * item.sellPriceBox;
    } else {
      totalInValue += qty * item.sellPricePack;
    }
  });

  // OUT VALUE
  outItems.forEach(({ item, qty }) => {
    if (item.type === "BOX") {
      totalOutValue += qty * item.sellPriceBox;
    } else {
      totalOutValue += qty * item.sellPricePack;
    }
  });

  const profit = totalInValue - totalOutValue;

  // ===============================
  // UPDATE INVENTORY
  // ===============================

  // Add IN items
  inItems.forEach(({ item, qty }) => {
    if (item.type === "BOX") {
      item.quantityBoxes += qty;
    } else {
      item.quantityPacks += qty;
    }
  });

  // Remove OUT items
  outItems.forEach(({ item, qty }) => {
    if (item.type === "BOX") {
      item.quantityBoxes -= qty;
      if (item.quantityBoxes < 0) item.quantityBoxes = 0;
    } else {
      item.quantityPacks -= qty;
      if (item.quantityPacks < 0) item.quantityPacks = 0;
    }

    // Remove item if empty
    if ((item.type === "BOX" && item.quantityBoxes <= 0 && item.manualPacks <= 0) ||
        (item.type === "PACK" && item.quantityPacks <= 0)) {
      inventoryData = inventoryData.filter(i => i.id !== item.id);
    }
  });

  saveData();

  // ===============================
  // SAVE TRADE ENTRY
  // ===============================

  tradesData.push({
    id: Date.now(),
    date: new Date().toISOString(),
    notes,
    inItems: inItems.map(x => ({ id: x.item.id, name: x.item.name, qty: x.qty, type: x.item.type })),
    outItems: outItems.map(x => ({ id: x.item.id, name: x.item.name, qty: x.qty, type: x.item.type })),
    totalInValue,
    totalOutValue,
    profit
  });

  saveTrades();
  renderTrades();
}

// ===============================
// RENDER TRADE HISTORY
// ===============================

function renderTradeHistory() {
  const container = document.getElementById("tradeHistory");
  if (!container) return;

  if (tradesData.length === 0) {
    container.innerHTML = "<p>No trades yet.</p>";
    return;
  }

  container.innerHTML = tradesData.map(t => `
    <div class="trade-card">
      <h3>Trade on ${new Date(t.date).toLocaleString()}</h3>

      <p><strong>Notes:</strong> ${t.notes || "—"}</p>

      <h4>Items Received (IN)</h4>
      <ul>
        ${t.inItems.map(i => `<li>${i.name} (${i.type}) × ${i.qty}</li>`).join("")}
      </ul>

      <h4>Items Given (OUT)</h4>
      <ul>
        ${t.outItems.map(i => `<li>${i.name} (${i.type}) × ${i.qty}</li>`).join("")}
      </ul>

      <p><strong>Total IN value:</strong> £${t.totalInValue.toFixed(2)}</p>
      <p><strong>Total OUT value:</strong> £${t.totalOutValue.toFixed(2)}</p>

      <p><strong>Profit:</strong> £${t.profit.toFixed(2)}</p>
    </div>
  `).join("");
}
