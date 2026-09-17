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
      <img src="${item.image}" alt="${item.name}" class="inventory-image">

      <h3>${item.name}</h3>
      <p><strong>Category:</strong> ${item.category}</p>
      <p><strong>Supplier:</strong> ${item.supplier}</p>

      <p><strong>Buy price:</strong> £${item.buyPrice.toFixed(2)}</p>
      <p><strong>Sell price:</strong> £${item.sellPrice.toFixed(2)}</p>
      <p><strong>Quantity:</strong> ${item.quantity}</p>
      <p><strong>Market price (UK):</strong> £${item.marketPrice.toFixed(2)}</p>

      <p><strong>Notes:</strong> ${item.notes || "—"}</p>

      <button onclick="sellItem(${item.id})">Sell</button>
      <button onclick="editItem(${item.id})">Edit</button>
      <button onclick="deleteItem(${item.id})">Delete</button>
      <button onclick="giftItem(${item.id})">Gift</button>
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
// EDIT ITEM (simple example)
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

  // You can extend this to "save changes" with a separate button if you want.
}

// ===============================
// SELL ITEM (placeholder hook)
// ===============================

function sellItem(id) {
  const item = inventoryData.find(i => i.id === id);
  if (!item) return;

  // Here you would open a sale form or move data into sales.js
  // For now, just a simple alert so you know it’s wired:
  alert(`Prepare sale for: ${item.name}`);
}

// ===============================
// GIFT SYSTEM
// ===============================

function giftItem(id) {
  // Find the item
  const item = inventoryData.find(i => i.id === id);
  if (!item) return;

  // Load existing expenses
  const expensesData = JSON.parse(localStorage.getItem("expensesData") || "[]");

  // Add expense entry for the gift
  expensesData.push({
    id: Date.now(),
    description: `Gift: ${item.name}`,
    amount: item.buyPrice * item.quantity,
    date: new Date().toISOString().split("T")[0],
    category: "Gift / Promotion"
  });

  localStorage.setItem("expensesData", JSON.stringify(expensesData));

  // Remove item from inventory
  inventoryData = inventoryData.filter(i => i.id !== id);
  saveData();

  // Refresh UI
  renderInventory();
  if (typeof renderExpenses === "function") renderExpenses();
  if (typeof renderSummary === "function") renderSummary();
}
