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

  if (!list) return;

  let totalSpend = 0;

  const supplierTotals = {};

  invoiceData.forEach(i => {

    totalSpend += i.total;

    if (!supplierTotals[i.supplier]) {
      supplierTotals[i.supplier] = 0;
    }

    supplierTotals[i.supplier] += i.total;
  });

  const spendBox = document.getElementById('totalInvoiceSpend');
  const countBox = document.getElementById('invoiceCount');

  if (spendBox) {
    spendBox.textContent = `£${totalSpend.toFixed(2)}`;
  }

  if (countBox) {
    countBox.textContent = invoiceData.length;
  }

  let breakdownHtml = `
    <div class="inventory-card">
      <h3>Supplier Spend Breakdown</h3>
  `;

  let topSupplier = '';
  let topSpend = 0;

  Object.keys(supplierTotals).forEach(name => {

    breakdownHtml += `
      <p>
        <strong>${name}</strong> :
        £${supplierTotals[name].toFixed(2)}
      </p>
    `;

    if (supplierTotals[name] > topSpend) {
      topSpend = supplierTotals[name];
      topSupplier = name;
    }
  });

  if (topSupplier) {
    breakdownHtml += `
      <hr>
      <p>
        <strong>Top Supplier:</strong>
        ${topSupplier}
      </p>
      <p>
        <strong>Total Spend:</strong>
        £${topSpend.toFixed(2)}
      </p>
    `;
  }

  breakdownHtml += `</div>`;

  list.innerHTML = breakdownHtml;

  invoiceData.forEach(i => {

    const row = document.createElement('div');

    row.className = 'inventory-card';

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
          margin-top:10px;
        "
      >
        Delete Invoice
      </button>
    `;

    list.appendChild(row);
  });
}

function deleteInvoice(id) {

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
