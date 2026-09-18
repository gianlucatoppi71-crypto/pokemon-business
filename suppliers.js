// ===============================
// SUPPLIERS SYSTEM (FULLY UPDATED)
// ===============================

// Load suppliers
let suppliersData = JSON.parse(localStorage.getItem("suppliersData") || "[]");

function saveSuppliers() {
  localStorage.setItem("suppliersData", JSON.stringify(suppliersData));
}

// ===============================
// ADD SUPPLIER
// ===============================

function addSupplier(event) {
  event.preventDefault();

  const name = document.getElementById("supName").value.trim();
  const address = document.getElementById("supAddress").value.trim();
  const website = document.getElementById("supWebsite").value.trim();
  const notes = document.getElementById("supNotes").value.trim();

  if (!name) return;

  suppliersData.push({
    id: Date.now(),
    name,
    address,
    website,
    notes
  });

  saveSuppliers();
  renderSuppliers();
  loadSupplierDropdown(); // update inventory dropdown

  event.target.reset();
}

// ===============================
// DELETE SUPPLIER
// ===============================

function deleteSupplier(id) {
  suppliersData = suppliersData.filter(s => s.id !== id);
  saveSuppliers();
  renderSuppliers();
  loadSupplierDropdown();
}

// ===============================
// EDIT SUPPLIER
// ===============================

function editSupplier(id) {
  const s = suppliersData.find(x => x.id === id);
  if (!s) return;

  document.getElementById("supName").value = s.name;
  document.getElementById("supAddress").value = s.address;
  document.getElementById("supWebsite").value = s.website;
  document.getElementById("supNotes").value = s.notes;

  deleteSupplier(id); // remove old entry, new one will replace it
}

// ===============================
// RENDER SUPPLIER LIST
// ===============================

function renderSuppliers() {
  const container = document.getElementById("supplierList");
  if (!container) return;

  if (suppliersData.length === 0) {
    container.innerHTML = "<p>No suppliers added yet.</p>";
    return;
  }

  container.innerHTML = suppliersData.map(s => `
    <div class="supplier-card">
      <h3>${s.name}</h3>

      <p><strong>Address:</strong> ${s.address || "—"}</p>
      <p><strong>Website:</strong> ${s.website || "—"}</p>
      <p><strong>Notes:</strong> ${s.notes || "—"}</p>

      <div class="supplier-actions">
        <button onclick="editSupplier(${s.id})">Edit</button>
        <button onclick="deleteSupplier(${s.id})">Delete</button>
      </div>
    </div>
  `).join("");
}

// ===============================
// LOAD SUPPLIERS INTO INVENTORY DROPDOWN
// ===============================

function loadSupplierDropdown() {
  const select = document.getElementById("invSupplier");
  if (!select) return;

  select.innerHTML = "<option value=''>Select supplier</option>";

  suppliersData.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.name;
    opt.textContent = s.name;
    select.appendChild(opt);
  });
}

// Initial load
renderSuppliers();
loadSupplierDropdown();
