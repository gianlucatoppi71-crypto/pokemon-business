let invoiceData =
  JSON.parse(localStorage.getItem('invoiceData')) || [];

if (!Array.isArray(invoiceData)) {
  invoiceData = [];
}

function saveInvoice() {
  const invoice = {
    id: Date.now(),
    supplier: document.getElementById('invoiceSupplier')?.value || '',
    number: document.getElementById('invoiceNumber')?.value || '',
    date: document.getElementById('invoiceDate')?.value || '',
    subtotal: parseFloat(document.getElementById('invoiceSubtotal')?.value) || 0,
    shipping: parseFloat(document.getElementById('invoiceShipping')?.value) || 0,
    total: parseFloat(document.getElementById('invoiceTotal')?.value) || 0,
    notes: document.getElementById('invoiceNotes')?.value || ''
  };

  invoiceData.push(invoice);

  localStorage.setItem(
    'invoiceData',
    JSON.stringify(invoiceData)
  );

  const invoiceForm = document.getElementById('invoiceForm');
  if (invoiceForm) invoiceForm.reset();

  renderInvoices();
}

function renderInvoices() {
  const list = document.getElementById('invoiceList');
  const breakdown = document.getElementById('supplierBreakdown');
  const supplierCards = document.getElementById('supplierCards');

  if (!list) return;

  let totalSpend = 0;
  const supplierTotals = {};

  invoiceData.forEach(invoice => {
    const total = Number(invoice.total) || 0;
    totalSpend += total;

    if (!supplierTotals[invoice.supplier]) {
      supplierTotals[invoice.supplier] = 0;
    }

    supplierTotals[invoice.supplier] += total;
  });

  // DASHBOARD
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

  // SUPPLIER CARDS - HORIZONTAL LAYOUT
  if (supplierCards) {
    supplierCards.innerHTML = '';
    supplierCards.style.display = 'flex';
    supplierCards.style.gap = '15px';
    supplierCards.style.overflowX = 'auto';
    supplierCards.style.paddingBottom = '10px';
    supplierCards.style.marginBottom = '30px';

    Object.keys(supplierTotals)
      .sort((a, b) => supplierTotals[b] - supplierTotals[a])
      .forEach(name => {
        const card = document.createElement('div');

        card.style.background = '#1a1a1a';
        card.style.border = '1px solid #333';
        card.style.borderRadius = '10px';
        card.style.padding = '20px';
        card.style.boxShadow = '0 0 12px rgba(0,0,0,0.4)';
        card.style.minWidth = '280px';
        card.style.flex = '0 0 280px';

        const invoiceCount = invoiceData.filter(i => i.supplier === name).length;
        const percentage = totalSpend > 0 ? ((supplierTotals[name] / totalSpend) * 100).toFixed(1) : '0.0';

        card.innerHTML = `
          <h3 style="
            margin:0 0 15px 0;
            color:#ffd700;
            font-size:16px;
            word-break:break-word;
          ">${name}</h3>

          <div style="
            margin-bottom:15px;
            padding-bottom:15px;
            border-bottom:1px solid #333;
          ">
            <span style="color:#999; font-size:12px;">Total Spend</span><br>
            <span style="font-size:22px; font-weight:bold; color:#fff;">
              £${supplierTotals[name].toFixed(2)}
            </span>
          </div>

          <div style="
            display:flex;
            justify-content:space-between;
            font-size:13px;
            gap:10px;
          ">
            <div>
              <span style="color:#999; display:block; margin-bottom:4px;">Invoices</span>
              <span style="font-weight:bold; color:#ffd700; font-size:16px;">${invoiceCount}</span>
            </div>

            <div style="text-align:right;">
              <span style="color:#999; display:block; margin-bottom:4px;">% of Total</span>
              <span style="font-weight:bold; color:#ffd700; font-size:16px;">${percentage}%</span>
            </div>
          </div>
        `;

        supplierCards.appendChild(card);
      });
  }

  // SUPPLIER BREAKDOWN
  if (breakdown) {
    breakdown.innerHTML = '';

    Object.keys(supplierTotals)
      .sort((a, b) => supplierTotals[b] - supplierTotals[a])
      .forEach(name => {
        const row = document.createElement('div');

        row.style.padding = '10px';
        row.style.marginBottom = '8px';
        row.style.background = '#222';
        row.style.border = '1px solid #333';
        row.style.borderRadius = '6px';

        row.innerHTML = `
          <strong>${name}</strong>
          <span style="float:right;">
            £${supplierTotals[name].toFixed(2)}
          </span>
        `;

        breakdown.appendChild(row);
      });
  }

  // INVOICE HISTORY
  list.innerHTML = '';

  invoiceData
    .sort((a, b) => b.id - a.id)
    .forEach(i => {
      const row = document.createElement('div');

      row.style.background = '#1a1a1a';
      row.style.border = '1px solid #333';
      row.style.borderRadius = '10px';
      row.style.padding = '20px';
      row.style.marginBottom = '20px';
      row.style.boxShadow = '0 0 12px rgba(0,0,0,0.4)';

      row.innerHTML = `
        <div style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:15px;
        ">
          <h3 style="margin:0; color:#ffd700;">${i.supplier}</h3>

          <button
            onclick="deleteInvoice(${i.id})"
            style="
              background:#8b0000;
              color:white;
              border:none;
              border-radius:6px;
              padding:8px 14px;
              cursor:pointer;
            "
          >
            Delete
          </button>
        </div>

        <div style="
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
          gap:15px;
        ">
          <div><strong>Invoice Number</strong><br>${i.number}</div>
          <div><strong>Date</strong><br>${i.date}</div>
          <div><strong>Total</strong><br>£${(Number(i.total) || 0).toFixed(2)}</div>
          <div><strong>Subtotal</strong><br>£${(Number(i.subtotal) || 0).toFixed(2)}</div>
          <div><strong>Shipping</strong><br>£${(Number(i.shipping) || 0).toFixed(2)}</div>
        </div>

        <div style="
          margin-top:15px;
          background:#222;
          padding:12px;
          border-radius:6px;
        ">
          <strong>Notes</strong><br>
          ${i.notes || 'No notes'}
        </div>
      `;

      list.appendChild(row);
    });
}

function deleteInvoice(id) {
  if (!confirm('Delete this invoice?')) {
    return;
  }

  invoiceData = invoiceData.filter(invoice => invoice.id !== id);

  localStorage.setItem(
    'invoiceData',
    JSON.stringify(invoiceData)
  );

  renderInvoices();
}

document.addEventListener('DOMContentLoaded', renderInvoices);
