// ===============================
// INVENTORY PAGE LOGIC
// ===============================

function renderInventory() {
  loadData();

  const container = document.getElementById('inventoryList');
  if (!container) return;

  if (!inventoryData || inventoryData.length === 0) {
    container.innerHTML = "<p>No items in inventory yet.</p>";
    return;
  }

  container.innerHTML = inventoryData.map(item => `
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
          <span><strong>Buy price:</strong> £${item.buyPrice.toFixed(2)}</span>
          <span><strong>Sell price:</strong> £${item.sellPrice.toFixed(2)}</span>
          <span><strong>Quantity:</strong> ${item.quantity}</span>
          <span><strong>Market price (UK):</strong> £${item.marketPrice.toFixed(2)}</span>
        </div>

        <div class="inv-meta">
          <span><strong>Notes:</strong> ${item.notes || "—"}</span>
        </div>

        <div class="inv-actions">
          <button onclick="sellItem(${item.id})">Sell</button>
          <button onclick="editItem(${item.id})">Edit</button>
          <button onclick="deleteItem(${item.id})">Delete</button>
          <button onclick="giftItem(${item.id})">Gift</button>
        </div>
      </div>

    </div>
  `).join("");
}

// ===============================
// ADD ITEM
// ===============================

document.getElementById('inventoryForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const name = document.getElementById('invName').value;
  const category = document.getElementById('invCategory').value;
  const supplier = document.getElementById('invSupplier').value;
  const buyPrice = parseFloat(document.getElementById('invBuyPrice').value);
  const sellPrice = parseFloat(document.getElementById('invSellPrice').value);
  const quantity = parseInt(document.getElementById('invQuantity').value, 10);
  const marketPrice = parseFloat(document.getElementById('invMarketPrice').value);
  const image = document.getElementById('invImage').value;
  const notes = document.getElementById('invNotes').value;

  const newItem = {
    id: Date.now(),
    name,
    category,
    supplier,
    buyPrice,
    sellPrice,
    quantity,
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
  document.getElementById('invBuyPrice').value = item.buyPrice;
  document.getElementById('invSellPrice').value = item.sellPrice;
  document.getElementById('invQuantity').value = item.quantity;
  document.getElementById('invMarketPrice').value = item.marketPrice;
  document.getElementById('invImage').value = item.image;
  document.getElementById('invNotes').value = item.notes || "";
}

// ===============================
// SELL ITEM (placeholder)
// ===============================

function sellItem(id) {
  const item = inventoryData.find(i => i.id === id);
  if (!item) return;

  alert(`Prepare sale for: ${item.name}`);
}

// ===============================
// GIFT SYSTEM
// ===============================

function giftItem(id) {
  const item = inventoryData.find(i => i.id === id);
  if (!item) return;

  const expensesData = JSON.parse(localStorage.getItem("expensesData") || "[]");

  expensesData.push({
    id: Date.now(),
    description: `Gift: ${item.name}`,
    amount: item.buyPrice * item.quantity,
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
