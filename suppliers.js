// SUPPLIERS PAGE LOGIC

let suppliersData = [];

// Load suppliers from localStorage
function loadSuppliers() {
  const saved = localStorage.getItem('suppliersData');
  suppliersData = saved ? JSON.parse(saved) : [];
}

// Save suppliers to localStorage
function saveSuppliers() {
  localStorage.setItem('suppliersData', JSON.stringify(suppliersData));
}

// Render suppliers list
function renderSuppliers() {
  loadSuppliers();

  const container = document.getElementById('suppliersPage');
  if (!container) return;

  container.innerHTML = `
    <h1>Suppliers</h1>

    <form id="supplierForm">
      <input type="text" id="supName" placeholder="Supplier name" required>
      <input type="text" id="supWebsite" placeholder="Website URL">
      <textarea id="supNotes" placeholder="Notes"></textarea>
      <button type="submit">Add Supplier</button>
    </form>

    <div id="suppliersList"></div>
  `;

  const list = document.getElementById('suppliersList');

  if (suppliersData.length === 0) {
    list.innerHTML = '<p>No suppliers added yet.</p>';
    return;
  }

  suppliersData.forEach((sup, index) => {
    const div = document.createElement('div');
    div.className = 'item-card';

    div.innerHTML = `
      <div class="item-header">
        <h3>${sup.name}</h3>
      </div>

      <div class="item-meta">
        Website: ${
          sup.website
            ? `<a href="${sup.website}" target="_blank">${sup.website}</a>`
            : '—'
        }<br>
        Notes: ${sup.notes || '—'}
      </div>

      <button class="sell-button" onclick="deleteSupplier(${index})"
        style="background:red; color:white;">
        Delete Supplier
      </button>
    `;

    list.appendChild(div);
  });

  // Add supplier form logic
  document.getElementById('supplierForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const newSupplier = {
      id: crypto.randomUUID(),
      name: document.getElementById('supName').value,
      website: document.getElementById('supWebsite').value,
      notes: document.getElementById('supNotes').value || ''
    };

    suppliersData.push(newSupplier);
    saveSuppliers();
    renderSuppliers();
  });
}

// Delete supplier
function deleteSupplier(index) {
  suppliersData.splice(index, 1);
  saveSuppliers();
  renderSuppliers();
}
