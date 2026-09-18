// ===============================
// INVENTORY PAGE LOGIC (BOX + PACK SYSTEM)
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
    const totalPacks = (item.quantityBoxes * item.packsPerBox) + item.manualPacks;
    const buyPricePack = item.packsPerBox > 0 ? item.buyPriceBox / item.packsPerBox : 0;

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
            <span><strong>Buy price per BOX:</strong> £${item.buyPriceBox.toFixed(2)}</span>
            <span><strong>Sell price per BOX:</strong> £${item.sellPriceBox.toFixed(2)}</span>
            <span><strong>Sell price per PACK:</strong> £${item.sellPricePack.toFixed(2)}</span>
            <span><strong>Packs per box:</strong> ${item.packsPerBox}</span>
          </div>

          <div class="inv-prices">
            <span><strong>Quantity of BOXES:</strong> ${item.quantityBoxes}</span>
            <span><strong>Manual loose packs:</strong> ${item.manualPacks}</span>
            <span><strong>Total packs (boxes + loose):</strong> ${totalPacks}</span>
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
// ADD ITEM
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
    sellPriceBox,
    sellPricePack,
    packsPerBox,
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
// EDIT ITEM
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
// GIFT SYSTEM
// ===============================

function giftItem(id) {
  const item = inventoryData.find(i => i.id === id);
  if (!item) return;

  const expensesData = JSON.parse(localStorage.getItem("expensesData") || "[]");

  const buyPricePack = item.packsPerBox > 0 ? item.buyPriceBox / item.packsPerBox : 0;
  const totalBoxesCost = item.quantityBoxes * item.buyPriceBox;
  const totalManualPacksCost = item.manualPacks * buyPricePack;
  const totalGiftCost = totalBoxesCost + totalManualPacksCost;

  expensesData.push({
    id: Date.now(),
    description: `Gift: ${item.name}`,
    amount: totalGiftCost,
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
