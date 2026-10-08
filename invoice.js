let invoiceData =
  JSON.parse(localStorage.getItem('invoiceData')) || [];

function saveInvoice() {

  const invoice = {
    id: Date.now(),
    supplier: document.getElementById('invoiceSupplier').value,
    number: document.getElementById('invoiceNumber').value,
    date: document.getElementById('invoiceDate').value,
    subtotal: parseFloat(document.getElementById('invoiceSubtotal').value) || 0,
    shipping: parseFloat(document.getElementById('invoiceShipping').value) || 0,
    total: parseFloat(document.getElementById('invoiceTotal').value) || 0,
    notes: document.getElementById('invoiceNotes').value
  };

  invoiceData.push(invoice);

  localStorage.setItem(
    'invoiceData',
    JSON.stringify(invoiceData)
  );

  document.getElementById('invoiceForm').reset();

  renderInvoices();
}

function renderInvoices() {

  const list = document.getElementById('invoiceList');
  const breakdown = document.getElementById('supplierBreakdown');

  if (!list) return;

  let totalSpend = 0;

  const supplierTotals = {};

  invoiceData.forEach(invoice => {

    totalSpend += invoice.total || 0;

    if (!supplierTotals[invoice.supplier]) {
      supplierTotals[invoice.supplier] = 0;
    }

    supplierTotals[invoice.supplier] += invoice.total || 0;
  });

  // Dashboard

  const spendBox = document.getElementById('totalInvoiceSpend');
  const countBox = document.getElementById('invoiceCount');
  const avgBox = document.getElementById('averageInvoice');
  const topSupplierBox = document.getElementById('topSupplier');

  if (spendBox)
    spendBox.textContent =
      `£${totalSpend.toFixed(2)}`;

  if (countBox)
    countBox.textContent =
      invoiceData.length;

  const averageInvoice =
    invoiceData.length > 0
      ? totalSpend / invoiceData.length
      : 0;

  if (avgBox)
    avgBox.textContent =
      `£${averageInvoice.toFixed(2)}`;

  let topSupplier = 'None';
  let highestSpend = 0;

  Object.keys(supplierTotals).forEach(name => {

    if (supplierTotals[name] > highestSpend) {

      highestSpend = supplierTotals[name];
      topSupplier = name;
    }
  });

  if (topSupplierBox)
    topSupplierBox.textContent =
      topSupplier;

  // Supplier Breakdown

  if (breakdown) {

    breakdown.innerHTML = '';

    Object.keys(supplierTotals)
      .sort((a, b) => supplierTotals[b] - supplierTotals[a])
      .forEach(name => {

        const row = document.createElement('div');

        row.style.padding = '8px 0';

        row.innerHTML = `
          <strong>${name}</strong>
          <span style="float:right;">
            £${supplierTotals[name].toFixed(2)}
          </span>
        `;

        breakdown.appendChild(row);
      });
  }

  // Invoice History

  list.innerHTML = '';

  invoiceData
    .sort((a, b) => b.id - a.id)
    .forEach(i => {

      const row = document.createElement('div');

      row.className = 'inventory-card';

      row.style.marginBottom = '15px';

      row.innerHTML = `
        <h3>${i.supplier}</h3>

        <p><strong>Invoice:</strong> ${i.number}</p>

        <p><strong>Date:</strong> ${i.date}</p>

        <p><strong>Subtotal:</strong> £${i.subtotal.toFixed(2)}</p>

        <p><strong>Shipping:</strong> £${i.shipping.toFixed(2)}</p>

        <p><strong>Total:</strong> £${i.total.toFixed(2)}</p>

        <p><strong>Notes:</strong> ${i.notes}</p>

        <button
          onclick="deleteInvoice(${i.id})"
          style="
            background:#8b0000;
            color:white;
            border:none;
            padding:10px;
            border-radius:6px;
            cursor:pointer;
          "
        >
          Delete Invoice
        </button>
      `;

      list.appendChild(row);
    });
}

function deleteInvoice(id) {

  if (!confirm('Delete this invoice?')) {
    return;
  }

  invoiceData = invoiceData.filter(
    invoice => invoice.id !== id
  );

  localStorage.setItem(
    'invoiceData',
    JSON.stringify(invoiceData)
  );

  renderInvoices();
}

document.addEventListener(
  'DOMContentLoaded',
  renderInvoices
);
