function renderSuppliers() {
  loadData();

  const list = document.getElementById('suppliersList');
  if (!list) return;

  list.innerHTML = '';

  if (!Array.isArray(suppliersData) || suppliersData.length === 0) {
    list.innerHTML = '<p>No suppliers yet.</p>';
    return;
  }

  suppliersData.forEach(s => {
    const div = document.createElement('div');
    div.className = 'item-card';

    div.innerHTML = `
      <h3>${s.name}</h3>
      <div class="item-meta">
        Contact: ${s.contact || '—'}<br>
        Notes: ${s.notes || '—'}
      </div>
    `;

    list.appendChild(div);
  });
}

