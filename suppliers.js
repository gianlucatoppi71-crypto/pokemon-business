// ===============================
// SUPPLIERS SYSTEM (FULL UPGRADE)
// ===============================

// Load suppliers from localStorage
let suppliersData = JSON.parse(localStorage.getItem("suppliersData") || "[]");

function saveSuppliers() {
  localStorage.setItem("suppliersData", JSON.stringify(suppliersData));
}

// ===============================
// ADD SUPPLIER
// ===============================

function addSupplier(event) {
  event.preventDefault();

  const name = document.getElementById("supName").value;
  const address = document.getElementById("supAddress").value;
  const website = document.getElementById("supWebsite").value;
  const notes = document.getElementById("supNotes").value;

  const newSupplier = {
    id: Date.now(),
    name,
    address,
    website,
    notes,
    totalSpent: 0,
    totalItems: 0
  };

  suppliersData.push(newSupplier);
  saveSuppliers();
  renderSuppliers();

  event.target.reset();
}

// ===============================
// EDIT SUPPLIER
// ===============================

function editSupplier(id) {
  const sup = suppliersData.find(s => s.id === id);
  if (!sup) return;

  document.getElementById("supName").value = sup.name;
  document.getElementById("supAddress").value = sup.address;
  document.getElementById("supWebsite").value = sup.website;
  document.getElementById("supNotes").value = sup.notes;

  // Remove old supplier and re-add on submit
  suppliersData = suppliersData.filter(s => s.id !== id);
  saveSuppliers();
}

// ===============================
// DELETE SUPPLIER
// ===============================

function deleteSupplier(id) {
  if (!confirm("Delete this supplier")) return;

  suppliersData = suppliersData.filter(s => s.id !== id);
  saveSuppliers();
  renderSuppliers();
}

// ===============================
// AUTO-CALCULATE SPENDING FROM INVENTORY
// ===============================

function calculateSupplierStats() {
  suppliersData.forEach(s => {
    s.totalSpent = 0;
    s.totalItems = 0;
  });

  inventoryData.forEach(item => {
    const sup = suppliersData.find(s => s.name === item.supplier);
    if (!sup) return;

    const buyPricePack = item.packsPerBox > 0 ? item.buyPriceBox / item.packsPerBox : 0;

    const totalBoxesCost = item.quantityBoxes * item.buyPriceBox;
    const totalManualPacksCost = item.manualPacks * buyPricePack;

    sup.totalSpent += totalBoxesCost + totalManualPacksCost;
    sup.totalItems += item.quantityBoxes + item.manualPacks;
  });

  saveSuppliers();
}

// ===============================
// RENDER SUPPLIERS PAGE
// ===============================

function renderSuppliers() {
  loadData();
  calculateSupplierStats();

  const container = document.getElementById("suppliersPage");
  if (!container) return;

  container.innerHTML = `
    <h1>Suppliers</h1>

    <form id="supplierForm" onsubmit="addSupplier(event)">
      <input type="text" id="supName" placeholder="Supplier name" required>
      <input type="text" id="supAddress" placeholder="Address (optional)">
      <input type="text" id="supWebsite" placeholder="Website URL (optional)">
      <textarea id="supNotes" placeholder="Notes (optional)"></textarea>
      <button type="submit">Add Supplier</button>
    </form>

    <div id="supplierList" class="supplier-container"></div>
  `;

  const list = document.getElementById("supplierList");

  if (suppliersData.length === 0) {
    list.innerHTML = "<p>No suppliers added yet.</p>";
    return;
  }

  list.innerHTML = suppliersData.map(s => `
    <div class="supplier-card">

      <h3>${s.name}</h3>

      <p><strong>Address:</strong> ${s.address || "—"}</p>
      <p><strong>Website:</strong> ${s.website ? `<a href="${s.website}" target="_blank">${s.website}</a>` : "—"}</p>
      <p><strong>Notes:</strong> ${s.notes || "—"}</p>

      <p><strong>Total spent:</strong> £${s.totalSpent.toFixed(2)}</p>
      <p><strong>Total items bought:</strong> ${s.totalItems}</p>

      <div class="supplier-actions">
        <button onclick="editSupplier(${s.id})">Edit</button>
        <button onclick="deleteSupplier(${s.id})">Delete</button>
      </div>

    </div>
  `).join("");
}
