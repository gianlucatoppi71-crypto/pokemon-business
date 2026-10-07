
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

  invoiceData.forEach(i => {
    totalSpend += i.total;
  });

  document.getElementById('totalInvoiceSpend').textContent =
    `£${totalSpend.toFixed(2)}`;

  document.getElementById('invoiceCount').textContent =
    invoiceData.length;

  list.innerHTML = '';

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
    `;

    list.appendChild(row);
  });

}

document.addEventListener('DOMContentLoaded', renderInvoices);
