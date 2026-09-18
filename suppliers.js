// SUPPLIERS PAGE

function renderSuppliers() {
  loadData();

  const container = document.getElementById('suppliersPage');
  if (!container) return;

  container.innerHTML = '<h1>Suppliers</h1>';

  const suppliers = [...new Set(inventoryData.map(item => item.supplier))];

  if (suppliers.length === 0) {
    container.innerHTML += '<p>No suppliers yet.</p>';
    return;
  }

  suppliers.forEach(supplier => {
    container.innerHTML += `<p>${supplier}</p>`;
  });
}
