// ===============================
// INVOICE DATA MANAGEMENT
// ===============================

let invoiceData = [];

// Safe data loading with error handling
function loadInvoiceData() {
  try {
    const saved = localStorage.getItem('invoiceData');
    invoiceData = saved ? JSON.parse(saved) : [];
    if (!Array.isArray(invoiceData)) {
      invoiceData = [];
    }
  } catch (error) {
    console.error('Error loading invoice data:', error);
    localStorage.removeItem('invoiceData');
    invoiceData = [];
  }
}

// ===============================
// SAVE INVOICE
// ===============================

function saveInvoice() {
  
  // Validation
  const supplier = document.getElementById('invoiceSupplier').value.trim();
  const number = document.getElementById('invoiceNumber').value.trim();
  const date = document.getElementById('invoiceDate').value;
  const subtotal = parseFloat(document.getElementById('invoiceSubtotal').value) || 0;
  const shipping = parseFloat(document.getElementById('invoiceShipping').value) || 0;
  const total = parseFloat(document.getElementById('invoiceTotal').value) || 0;
  const notes = document.getElementById('invoiceNotes').value.trim();
  
  if (!supplier || !number || !date || total <= 0) {
    alert('Please fill in all required fields (Supplier, Invoice #, Date, Total)');
    return;
  }

  const invoice = {
    id: Date.now(),
    supplier,
    number,
    date,
    subtotal,
    shipping,
    total,
    notes
  };

  invoiceData.push(invoice);

  try {
    localStorage.setItem('invoiceData', JSON.stringify(invoiceData));
  } catch (error) {
    console.error('Error saving invoice:', error);
    alert('Failed to save invoice');
    return;
  }

  document.getElementById('invoiceForm').reset();
  renderInvoices();
}

// ===============================
// RENDER INVOICES
// ===============================

function renderInvoices() {
  
  loadInvoiceData();
  
  const listContainer = document.getElementById('invoiceList');
  if (!listContainer) return;

  let totalSpend = 0;
  const supplierTotals = {};

  // Calculate totals
  invoiceData.forEach(invoice => {
    totalSpend += invoice.total || 0;
    if (!supplierTotals[invoice.supplier]) {
      supplierTotals[invoice.supplier] = 0;
    }
    supplierTotals[invoice.supplier] += invoice.total || 0;
  });

  // Update dashboard
  updateInvoiceDashboard(totalSpend, supplierTotals);

  // Render invoice list
  listContainer.innerHTML = '';

  if (invoiceData.length === 0) {
    listContainer.innerHTML = `
      <div class="invoice-empty">
        <p>No invoices yet. Add one to get started.</p>
      </div>
    `;
    return;
  }

  invoiceData
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .forEach(invoice => {
      const card = createInvoiceCard(invoice);
      listContainer.appendChild(card);
    });
}

// ===============================
// UPDATE DASHBOARD
// ===============================

function updateInvoiceDashboard(totalSpend, supplierTotals) {
  
  const spendBox = document.getElementById('totalInvoiceSpend');
  const countBox = document.getElementById('invoiceCount');
  const avgBox = document.getElementById('averageInvoice');
  const topSupplierBox = document.getElementById('topSupplier');

  if (spendBox) {
    spendBox.textContent = `£${totalSpend.toFixed(2)}`;
  }

  if (countBox) {
    countBox.textContent = invoiceData.length;
  }

  const averageInvoice = invoiceData.length > 0 ? totalSpend / invoiceData.length : 0;
  if (avgBox) {
    avgBox.textContent = `£${averageInvoice.toFixed(2)}`;
  }

  let topSupplier = 'None';
  let highestSpend = 0;

  Object.keys(supplierTotals).forEach(name => {
    if (supplierTotals[name] > highestSpend) {
      highestSpend = supplierTotals[name];
      topSupplier = name;
    }
  });

  if (topSupplierBox) {
    topSupplierBox.textContent = topSupplier;
  }
}

// ===============================
// CREATE INVOICE CARD
// ===============================

function createInvoiceCard(invoice) {
  
  const card = document.createElement('div');
  card.className = 'invoice-card';

  const headerHTML = `
    <div class="invoice-header">
      <div class="invoice-title">
        <h3>${escapeHtml(invoice.supplier)}</h3>
        <span class="invoice-number">#${escapeHtml(invoice.number)}</span>
      </div>
      <button class="invoice-delete-btn" onclick="deleteInvoice(${invoice.id})">
        Delete
      </button>
    </div>
  `;

  const detailsHTML = `
    <div class="invoice-details">
      <div class="detail-row">
        <span class="detail-label">Date:</span>
        <span class="detail-value">${formatDate(invoice.date)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Subtotal:</span>
        <span class="detail-value">£${invoice.subtotal.toFixed(2)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Shipping:</span>
        <span class="detail-value">£${invoice.shipping.toFixed(2)}</span>
      </div>
      <div class="detail-row highlight">
        <span class="detail-label"><strong>Total:</strong></span>
        <span class="detail-value"><strong>£${invoice.total.toFixed(2)}</strong></span>
      </div>
    </div>
  `;

  const notesHTML = invoice.notes ? `
    <div class="invoice-notes">
      <strong>Notes:</strong>
      <p>${escapeHtml(invoice.notes)}</p>
    </div>
  ` : '';

  card.innerHTML = headerHTML + detailsHTML + notesHTML;
  return card;
}

// ===============================
// DELETE INVOICE
// ===============================

function deleteInvoice(id) {
  
  if (!confirm('Are you sure you want to delete this invoice?')) {
    return;
  }

  invoiceData = invoiceData.filter(invoice => invoice.id !== id);

  try {
    localStorage.setItem('invoiceData', JSON.stringify(invoiceData));
  } catch (error) {
    console.error('Error deleting invoice:', error);
    alert('Failed to delete invoice');
    return;
  }

  renderInvoices();
}

// ===============================
// UTILITY FUNCTIONS
// ===============================

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
}

// ===============================
// INITIALIZE ON PAGE LOAD
// ===============================

document.addEventListener('DOMContentLoaded', () => {
  loadInvoiceData();
  renderInvoices();
});
