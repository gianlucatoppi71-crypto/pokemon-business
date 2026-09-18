// ===============================
// INVENTORY PAGE LOGIC (UPGRADED)
// ===============================

function renderInventory() {
  loadData();

  const container = document.getElementById('inventoryList');
  if (!container) return;

  if (!inventoryData || inventoryData.length === 0) {
    container.innerHTML = "<p>No items in inventory yet.</p>";
    return;
  }

  container.innerHTML = inventoryData.map(item => {

    // AUTO CALCULATIONS
    const buyPricePack = item.packsPerBox > 0 ? item.buyPriceBox / item.packsPerBox : 0;
    const totalPacksFromBoxes = item.quantityBoxes * item.packsPerBox;
    const totalPacks = totalPacksFromBoxes + item.manualPacks;

    const profitBox = item.sellPriceBox - item.buyPriceBox;
    const profitPack = item.sellPricePack - buyPricePack;

    return `
      <div class="inventory-card">

        <!-- LEFT SIDE: IMAGE -->
        <div class="inv-left">
          <img src="${item.image}" alt="${item.name}">
        </div>

        <!-- RIGHT SIDE: INFO -->
        <div class="inv-right">
          <h3>${item.name}</h3>

          <div class="inv-meta">
            <span><strong>Category:</strong> ${item.category}</span>
            <span><strong>Supplier:</strong> ${item.supplier}</span>
          </div>

          <div class="inv-prices">
            <span><strong>Buy (BOX):</strong> £${item.buyPriceBox.toFixed(2)}</span>
            <span><strong>Packs per box:</strong> ${item.packsPerBox}</span>
            <span><strong>Buy (PACK):</strong> £${buyPricePack.toFixed(2)}</span>

            <span><strong>Sell (BOX):</strong> £${item.sellPriceBox.toFixed(2)}</span>
            <span><strong>Sell (PACK):</strong> £${item.sellPricePack.toFixed(2)}</span>

            <span><strong>Boxes:</strong> ${item.quantityBoxes}</span>
            <span><strong>Manual packs:</strong> ${item.manualPacks}</span>
            <span><strong>Total packs:</strong> ${totalPacks}</span>

            <span><strong>Profit (BOX):</strong> £${profitBox.toFixed(2)}</span>
            <span><strong>Profit (PACK):</strong> £${profitPack.toFixed(2)}</span>

            <span><strong>Market price (UK):</strong> £${item.marketPrice.toFixed(2)}</span>
          </div>

          <div class="inv-meta">
            <span><strong>Notes:</strong> ${item.notes || "—"}</span>
          </div>

          <div class="inv-actions">
            <button onclick="sellBox(${item.id})">Sell BOX</button>
            <button onclick="sellPack(${item.id})">Sell PACK</button>
            <button onclick="editItem(${item.id})">Edit</button>
            <button onclick="deleteItem(${item.id})">Delete</button>
            <button onclick="giftItem(${item.id})">Gift</button>
          </div>
        </div>

      </div>
    `;
  }).join("");
}

// ===============================
// ADD ITEM (UPGRADED)
// ===============================

document.getElementById('inventoryForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const name = document.getElementById('invName').value;
  const category = document.getElementById('invCategory').value;
  const supplier = document.getElementById('invSupplier').value;

  const buyPriceBox = parseFloat(document.getElementById('invBuyPriceBox').value);
  const packsPerBox = parseInt(document.getElementById('invPacksPerBox').value, 10);

  const sellPriceBox = parseFloat(document.getElementById('invSellPriceBox').value);
  const sellPricePack = parseFloat(document.getElementById('invSellPricePack').value);

  const quantityBoxes = parseInt(document.getElementById('invQuantityBoxes').value, 10);
  const manualPacks = parseInt(document.getElementById('invManualPacks').value || "0", 10);

  const marketPrice = parseFloat(document.getElementById('invMarketPrice').value);
  const image = document.getElementById('invImage').value;
  const notes = document.getElementById('invNotes').value;

  const newItem = {
    id: Date.now(),
    name,
    category,
    supplier,

    buyPriceBox,
    packsPerBox,
    sellPriceBox,
    sellPricePack,

    quantityBoxes,
    manualPacks,

    marketPrice,
    image,
    notes
  };

  inventoryData.push(newItem);
  saveData();
  renderInventory();

  event.target.reset();
});

// ===============================
// DELETE ITEM
// ===============================

function deleteItem(id) {
  inventoryData = inventoryData.filter(item => item.id !== id);
  saveData();
  renderInventory();
}

// ===============================
// EDIT ITEM (UPGRADED)
// ===============================

function editItem(id) {
  const item = inventoryData.find(i => i.id === id);
  if (!item) return;

  document.getElementById('invName').value = item.name;
  document.getElementById('invCategory').value = item.category;
  document.getElementById('invSupplier').value = item.supplier;

  document.getElementById('invBuyPriceBox').value = item.buyPriceBox;
  document.getElementById('invPacksPerBox').value = item.packsPerBox;

  document.getElementById('invSellPriceBox').value = item.sellPriceBox;
  document.getElementById('invSellPricePack').value = item.sellPricePack;

  document.getElementById('invQuantityBoxes').value = item.quantityBoxes;
  document.getElementById('invManualPacks').value = item.manualPacks;

  document.getElementById('invMarketPrice').value = item.marketPrice;
  document.getElementById('invImage').value = item.image;
  document.getElementById('invNotes').value = item.notes || "";
}

// ===============================
// SELL BOX
// ===============================

function sellBox(id) {
  const item = inventoryData.find(i => i.id === id);
  if (!item) return;

  if (item.quantityBoxes <= 0) {
    alert("No boxes left to sell.");
    return;
  }

  item.quantityBoxes -= 1;
  item.manualPacks -= item.packsPerBox;

  if (item.manualPacks < 0) item.manualPacks = 0;

  saveData();
  renderInventory();
}

// ===============================
// SELL PACK
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

  saveData();
  renderInventory();
}

// ===============================
// GIFT SYSTEM (unchanged)
// ===============================

function giftItem(id) {
  const item = inventoryData.find(i => i.id === id);
  if (!item) return;

  const expensesData = JSON.parse(localStorage.getItem("expensesData") || "[]");

  expensesData.push({
    id: Date.now(),
    description: `Gift: ${item.name}`,
    amount: item.buyPriceBox * item.quantityBoxes,
    date: new Date().toISOString().split("T")[0],
    category: "Gift / Promotion"
  });

  localStorage.setItem("expensesData", JSON.stringify(expensesData));

  inventoryData = inventoryData.filter(i => i.id !== id);
  saveData();

  renderInventory();
  if (typeof renderExpenses === "function") renderExpenses();
  if (typeof renderSummary === "function") renderSummary();
}
