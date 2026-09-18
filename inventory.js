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
    const isBox = item.type === "BOX";
    const isPack = item.type === "PACK";

    const totalPacks = isBox
      ? (item.quantityBoxes * item.packsPerBox) + item.manualPacks
      : item.quantityPacks;

    const buyPricePack = isBox
      ? (item.packsPerBox > 0 ? item.buyPriceBox / item.packsPerBox : 0)
      : item.buyPricePack;

    return `
      <div class="inventory-card">

        <!-- LEFT SIDE: IMAGE -->
        <div class="inv-left">
          <img src="${item.image || 'img/default.png'}" alt="${item.name}">
        </div>

        <!-- RIGHT SIDE: INFO -->
        <div class="inv-right">
          <h3>${item.name}</h3>

          <div class="inv-meta">
            <span><strong>Category:</strong> ${item.category}</span>
            <span><strong>Supplier:</strong> ${item.supplier}</span>
          </div>

          <div class="inv-prices">
            ${isBox ? `
              <span><strong>Buy price per BOX:</strong> £${item.buyPriceBox.toFixed(2)}</span>
              <span><strong>Sell price per BOX:</strong> £${item.sellPriceBox.toFixed(2)}</span>
              <span><strong>Sell price per PACK:</strong> £${item.sellPricePack.toFixed(2)}</span>
              <span><strong>Packs per box:</strong> ${item.packsPerBox}</span>
            ` : `
              <span><strong>Buy price per PACK:</strong> £${item.buyPricePack.toFixed(2)}</span>
              <span><strong>Sell price per PACK:</strong> £${item.sellPricePack.toFixed(2)}</span>
            `}
          </div>

          <div class="inv-prices">
            ${isBox ? `
              <span><strong>Quantity of BOXES:</strong> ${item.quantityBoxes}</span>
              <span><strong>Loose packs:</strong> ${item.manualPacks}</span>
            ` : `
              <span><strong>Quantity of PACKS:</strong> ${item.quantityPacks}</span>
            `}
            <span><strong>Total packs:</strong> ${totalPacks}</span>
            <span><strong>Market price (UK):</strong> £${item.marketPrice || 0}</span>
          </div>

          <div class="inv-meta">
            <span><strong>Notes:</strong> ${item.notes || "—"}</span>
          </div>

          <div class="inv-actions">
            ${isBox ? `<button onclick="sellBox(${item.id})">Sell BOX</button>` : ""}
            <button onclick="sellPack(${item.id})">Sell PACK</button>
            <button onclick="editItem(${item.id})">Edit</button>
            <button onclick="copyItem(${item.id})">Copy</button>
            <button onclick="addQuantity(${item.id})">Add Qty</button>
            <button onclick="deleteItem(${item.id})">Delete</button>
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

  const type = document.getElementById('invType').value;
  const name = document.getElementById('invName').value;
  const category = document.getElementById('invCategory').value;
  const supplier = document.getElementById('invSupplier').value;
  const image = document.getElementById('invImage').value;
  const notes = document.getElementById('invNotes').value;
  const marketPrice = parseFloat(document.getElementById('invMarketPrice').value) || 0;

  let newItem = {
    id: Date.now(),
    type,
    name,
    category,
    supplier,
    image,
    notes,
    marketPrice
  };

  if (type === "BOX") {
    newItem.buyPriceBox = parseFloat(document.getElementById('invBuyPriceBox').value) || 0;
    newItem.sellPriceBox = parseFloat(document.getElementById('invSellPriceBox').value) || 0;
    newItem.sellPricePack = parseFloat(document.getElementById('invSellPricePack').value) || 0;
    newItem.packsPerBox = parseInt(document.getElementById('invPacksPerBox').value) || 0;
    newItem.quantityBoxes = parseInt(document.getElementById('invQuantityBoxes').value) || 0;
    newItem.manualPacks = parseInt(document.getElementById('invManualPacks').value) || 0;
  }

  if (type === "PACK") {
    newItem.buyPricePack = parseFloat(document.getElementById('invBuyPricePack').value) || 0;
    newItem.sellPricePack = parseFloat(document.getElementById('invSellPricePack').value) || 0;
    newItem.quantityPacks = parseInt(document.getElementById('invQuantityPacks').value) || 0;
  }

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
// COPY ITEM
// ===============================

function copyItem(id) {
  const item = inventoryData.find(i => i.id === id);
  if (!item) return;

  const copy = JSON.parse(JSON.stringify(item));
  copy.id = Date.now();

  inventoryData.push(copy);
  saveData();
  renderInventory();
}

// ===============================
// EDIT ITEM
// ===============================

function editItem(id) {
  const item = inventoryData.find(i => i.id === id);
  if (!item) return;

  document.getElementById('invType').value = item.type;
  document.getElementById('invName').value = item.name;
  document.getElementById('invCategory').value = item.category;
  document.getElementById('invSupplier').value = item.supplier;
  document.getElementById('invImage').value = item.image;
  document.getElementById('invNotes').value = item.notes || "";
  document.getElementById('invMarketPrice').value = item.marketPrice || 0;

  if (item.type === "BOX") {
    document.getElementById('invBuyPriceBox').value = item.buyPriceBox;
    document.getElementById('invSellPriceBox').value = item.sellPriceBox;
    document.getElementById('invSellPricePack').value = item.sellPricePack;
    document.getElementById('invPacksPerBox').value = item.packsPerBox;
    document.getElementById('invQuantityBoxes').value = item.quantityBoxes;
    document.getElementById('invManualPacks').value = item.manualPacks;
  }

  if (item.type === "PACK") {
    document.getElementById('invBuyPricePack').value = item.buyPricePack;
    document.getElementById('invSellPricePack').value = item.sellPricePack;
    document.getElementById('invQuantityPacks').value = item.quantityPacks;
  }
}

// ===============================
// ADD QUANTITY POPUP
// ===============================

function addQuantity(id) {
  const qty = prompt("Enter quantity to add:");

  if (!qty || isNaN(qty)) return;

  const item = inventoryData.find(i => i.id === id);
  if (!item) return;

  if (item.type === "BOX") {
    item.quantityBoxes += parseInt(qty);
  } else {
    item.quantityPacks += parseInt(qty);
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

  const qty = prompt("How many packs to sell?");
  if (!qty || isNaN(qty)) return;

  const amount = parseInt(qty);

  let totalPacks = item.type === "BOX"
    ? (item.quantityBoxes * item.packsPerBox) + item.manualPacks
    : item.quantityPacks;

  if (amount > totalPacks) {
    alert("Not enough packs in inventory.");
    return;
  }

  const profit = (item.sellPricePack - (item.type === "BOX"
    ? item.buyPriceBox / item.packsPerBox
    : item.buyPricePack)) * amount;

  salesData.push({
    id: Date.now(),
    name: item.name,
    type: "PACK",
    quantity: amount,
    profit,
    date: new Date().toISOString().split("T")[0]
  });

  if (item.type === "BOX") {
    let packsFromBoxes = item.quantityBoxes * item.packsPerBox;

    if (amount <= packsFromBoxes) {
      const boxesUsed = Math.floor(amount / item.packsPerBox);
      item.quantityBoxes -= boxesUsed;
      const leftover = amount % item.packsPerBox;
      item.manualPacks -= leftover;
    } else {
      item.manualPacks -= amount - packsFromBoxes;
      item.quantityBoxes = 0;
    }
  } else {
    item.quantityPacks -= amount;
  }

  if ((item.type === "BOX" && item.quantityBoxes <= 0 && item.manualPacks <= 0) ||
      (item.type === "PACK" && item.quantityPacks <= 0)) {
    inventoryData = inventoryData.filter(i => i.id !== id);
  }

  saveData();
  renderInventory();
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

  const profit = item.sellPriceBox - item.buyPriceBox;

  salesData.push({
    id: Date.now(),
    name: item.name,
    type: "BOX",
    quantity: 1,
    profit,
    date: new Date().toISOString().split("T")[0]
  });

  item.quantityBoxes -= 1;

  if (item.quantityBoxes <= 0 && item.manualPacks <= 0) {
    inventoryData = inventoryData.filter(i => i.id !== id);
  }

  saveData();
  renderInventory();
}
