<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Flux TCG Collector App</title>
  <link rel="stylesheet" href="style.css?v=1004">
  <!-- Stable Chart.js library to prevent network runtime blocks -->
  <script src="https://jsdelivr.net"></script>
</head>
<body>

<div class="app">

  <!-- SIDEBAR NAVIGATION -->
  <aside class="sidebar">
    <img src="Logo.png" alt="Flux TCG Logo" class="app-logo">

    <nav>
      <button onclick="showPage('inventory')">Inventory</button>
      <button onclick="showPage('sales')">Sales</button>
      <button onclick="showPage('summary')">Summary</button>
      <button onclick="showPage('suppliers')">Suppliers</button>
      <button onclick="showPage('trades')">Trades</button>
      <button onclick="showPage('portfolio')">Portfolio</button>
      <button onclick="showPage('expenses')">Expenses</button>
      <button onclick="showPage('invoice')">Invoice</button>
      <button onclick="openCustomerPage()">Customer List</button>
    </nav>

    <div class="tax-info">
      <h3>Tax Summary</h3>
      <div id="taxSummary"></div>
    </div>
  </aside>

  <!-- MAIN APPLICATION VIEWPORT -->
  <main class="main">
    <!-- INVENTORY PAGE -->
    <section id="inventoryPage" class="page">
      <h1>Inventory Ledger</h1>

      <form id="inventoryForm" onsubmit="addInventoryItem(event)">
        <select id="invType" required>
          <option value="">Select product type</option>
          <option value="BOX">BOX</option>
          <option value="PACK">PACK</option>
        </select>

        <input type="text" id="invName" placeholder="Product name" required>

        <select id="invCategory" required>
          <option value="">Select category</option>
          <option>Booster Box</option>
          <option>Booster Pack</option>
          <option>Elite Trainer Box (ETB)</option>
          <option>Collection Box</option>
          <option>Premium Collection</option>
          <option>Special Set</option>
          <option>Tin</option>
          <option>Blister</option>
          <option>Sleeved Pack</option>
          <option>Promo Pack</option>
          <option>Japanese Box</option>
          <option>Korean Box</option>
          <option>Chinese Box</option>
          <option>Deck</option>
          <option>Bundle</option>
          <option>Other</option>
        </select>

        <select id="invSupplier" required></select>

        <div id="boxFields" style="display:none">
          <input type="number" step="0.01" id="invBuyPriceBox" placeholder="Buy price per BOX (£)">
          <input type="number" id="invPacksPerBox" placeholder="Packs per box">
          <input type="number" step="0.01" id="invSellPriceBox" placeholder="Sell price per BOX (£)">
          <input type="number" step="0.01" id="invSellPricePack" placeholder="Sell price per PACK (£)">
          <input type="number" id="invQuantityBoxes" placeholder="Quantity of BOXES">
          <input type="number" id="invManualPacks" placeholder="Loose packs (optional)">
        </div>

        <div id="packFields" style="display:none">
          <input type="number" step="0.01" id="invBuyPricePack" placeholder="Buy price per PACK (£)">
          <input type="number" step="0.01" id="invSellPricePack" placeholder="Sell price per PACK (£)">
          <input type="number" id="invQuantityPacks" placeholder="Quantity of PACKS">
        </div>

        <input type="number" step="0.01" id="invMarketPrice" placeholder="UK market price (£)">
        <input type="text" id="invImage" placeholder="Image URL (optional)">
        <textarea id="invNotes" placeholder="Notes (optional)"></textarea>

        <button type="submit" id="addBtn">Add to inventory</button>
      </form>

      <div id="inventoryList" class="inventory-container"></div>
    </section>

    <!-- SALES PAGE -->
    <section id="salesPage" class="page" style="display:none">
      <h1>Sales Ledger History</h1>
      <div class="sales-dashboard-bar">
        <div class="sales-dashboard-layout">
          <div id="salesDashboard"></div>
          <div class="sales-chart-wrapper">
            <div id="personalExpensesPanel" class="dashboard-card" style="width:100%; text-align:center; margin-bottom:20px;"></div>
            <div id="salesProductSummary" class="sales-product-summary"></div>
            <div id="personalCollectionPanel" class="personal-collection-panel"></div>
          </div>
        </div>
      </div>
      <div id="salesList"></div>
    </section>

    <!-- SUMMARY PAGE -->
    <section id="summaryPage" class="page" style="display:none">
      <h1>Summary Dashboard</h1>
      <div id="summaryContent"></div>
    </section>

    <!-- SUPPLIERS PAGE -->
    <section id="suppliersPage" class="page" style="display:none">
      <h1>Suppliers</h1>
      <form id="supplierForm" onsubmit="addSupplier(event)">
        <input type="text" id="supName" placeholder="Supplier name" required>
        <input type="text" id="supAddress" placeholder="Address (optional)">
        <input type="text" id="supWebsite" placeholder="Website URL (optional)">
        <textarea id="supNotes" placeholder="Notes (optional)"></textarea>
        <button type="submit">Add Supplier</button>
      </form>
      <div id="supplierList" class="supplier-container"></div>
    </section>

    <!-- TRADES PAGE -->
    <section id="tradesPage" class="page" style="display:none">
      <h1>Trades Management</h1>
      <div id="tradesList"></div>
    </section>

    <!-- PORTFOLIO PAGE -->
    <section id="portfolioPage" class="page" style="display:none">
      <h1>Portfolio Tracking</h1>
      <form id="portfolioForm" onsubmit="addPortfolio(event)">
        <input type="text" id="portName" placeholder="Portfolio name" required>
        <input type="text" id="portDesc" placeholder="Description" required>
        <input type="text" id="portImage" placeholder="Image URL" required>
        <input type="text" id="portLink" placeholder="Link to app" required>
        <button type="submit">Add Portfolio</button>
      </form>
      <div id="portfolioList" class="portfolio-container"></div>
    </section>

    <!-- EXPENSES PAGE -->
    <section id="expensesPage" class="page" style="display:none">
      <h1>Expenses</h1>
      <form id="expensesForm" onsubmit="addExpense(event)">
        <input type="text" id="expDesc" placeholder="Expense description" required>
        <input type="number" step="0.01" id="expAmount" placeholder="Amount (£)" required>
        <input type="date" id="expDate" required>
        <input type="text" id="expCategory" placeholder="Category (optional)">
        <button type="submit">Add Expense</button>
      </form>
      <div id="expensesList"></div>
    </section>

    <!-- INVOICE PAGE -->
    <section id="invoicePage" class="page" style="display:none">
      <h1>Invoices</h1>
      <div id="invoiceContent"></div>
    </section>

    <!-- CUSTOMER LIST PAGE -->
    <section id="customerPage" class="page" style="display:none">
      <iframe id="customerFrame" src="" style="width:100%; height:100vh; border:none;"></iframe>
    </section>

  </main>
</div>
<!-- APPLICATION SCRIPT MODULES -->
<script src="data.js?v=1004"></script>
<script src="inventory.js?v=1004"></script>
<script src="sales.js?v=1004"></script>
<script src="summary.js?v=1004"></script>
<script src="suppliers.js?v=1004"></script>
<script src="trades.js?v=1004"></script>
<script src="portfolio.js?v=1004"></script>
<script src="expenses.js?v=1004"></script>

<!-- RUNTIME EXECUTION CONTROLLER -->
<script>
  // Fail-Safe State Interfaces
  if (typeof window.inventoryData === 'undefined') window.inventoryData = JSON.parse(localStorage.getItem('inventoryData')) || [];
  if (typeof window.suppliersData === 'undefined') window.suppliersData = JSON.parse(localStorage.getItem('suppliersData')) || [];

  window.onload = () => {
    // Populate suppliers choice selectors on screen mount
    const supSelect = document.getElementById('invSupplier');
    if (supSelect) {
      supSelect.innerHTML = '<option value="None">None</option>';
      window.suppliersData.forEach(s => {
        const sName = s.name || s;
        supSelect.innerHTML += `<option value="${sName}">${sName}</option>`;
      });
    }
    showPage('inventory');
  };

  function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    const targetPage = document.getElementById(page + 'Page');
    if (targetPage) targetPage.style.display = 'block';

    try {
      if (page === 'inventory') {
        if (typeof renderInventory === 'function') renderInventory();
        else internalInventoryGridFallback();
      }
      if (page === 'sales' && typeof renderSales === 'function') renderSales();
      if (page === 'summary' && typeof renderSummary === 'function') renderSummary();
      if (page === 'suppliers' && typeof renderSuppliers === 'function') renderSuppliers();
      if (page === 'trades' && typeof renderTrades === 'function') renderTrades();
      if (page === 'portfolio' && typeof renderPortfolio === 'function') renderPortfolio();
      if (page === 'expenses' && typeof renderExpenses === 'function') renderExpenses();
    } catch (e) {
      console.warn("External module execution fault trapped:", e);
      if (page === 'inventory') internalInventoryGridFallback();
    }

    if (typeof renderTaxSummary === 'function') {
      try { renderTaxSummary(); } catch(err) { updateTaxUIFallback(); }
    } else {
      updateTaxUIFallback();
    }
  }

  function updateTaxUIFallback() {
    const ts = document.getElementById('taxSummary');
    if (ts) ts.innerHTML = `<div style="font-family:sans-serif; font-size:13px; color:#999;">Ledger Storage Protection Armed</div>`;
  }

  // Intercept entries and process calculations if inventory.js fails
  function addInventoryItem(event) {
    event.preventDefault();

    if (window.addInventoryItemAction) {
      try {
        window.addInventoryItemAction(event);
        return;
      } catch (err) { console.error("External routing error, fallback initialized:", err); }
    }

    const newItem = {
      id: Date.now(),
      type: document.getElementById('invType').value,
      name: document.getElementById('invName').value,
      category: document.getElementById('invCategory').value,
      supplier: document.getElementById('invSupplier').value || 'None',
      marketPrice: parseFloat(document.getElementById('invMarketPrice').value) || 0,
      image: document.getElementById('invImage').value || 'Logo.png',
      notes: document.getElementById('invNotes').value || '',
      buyPriceBox: parseFloat(document.getElementById('invBuyPriceBox')?.value) || 0,
      packsPerBox: parseInt(document.getElementById('invPacksPerBox')?.value) || 1,
      sellPriceBox: parseFloat(document.getElementById('invSellPriceBox')?.value) || 0,
      sellPricePack: parseFloat(document.getElementById('invSellPricePack')?.value) || 0,
      quantityBoxes: parseInt(document.getElementById('invQuantityBoxes')?.value) || 0,
      manualPacks: parseInt(document.getElementById('invManualPacks')?.value) || 0,
      buyPricePack: parseFloat(document.getElementById('invBuyPricePack')?.value) || 0,
      quantityPacks: parseInt(document.getElementById('invQuantityPacks')?.value) || 0
    };

    window.inventoryData.push(newItem);
    localStorage.setItem('inventoryData', JSON.stringify(window.inventoryData));
    document.getElementById('inventoryForm').reset();
    internalInventoryGridFallback();
  }

  // Renders structural data loops to shield the table layout view from internal crashes
  function internalInventoryGridFallback() {
    const box = document.getElementById("inventoryList");
    if (!box) return;
    box.innerHTML = "";

    if (!window.inventoryData || window.inventoryData.length === 0) {
      box.innerHTML = "<p style='color:#bbb; padding:20px; font-family:sans-serif;'>Inventory ledger clean. Type entry fields above.</p>";
      return;
    }

    let ui = `
      <div style="overflow-x:auto; margin-top:20px; border:1px solid #333; border-radius:6px;">
        <table style="width:100%; border-collapse:collapse; background:#18181c; text-align:left; font-family:sans-serif; color:#fff;">
          <thead>
            <tr style="background:#242428; border-bottom:2px solid #333;">
              <th style="padding:12px; font-size:13px; color:#ffd700;">Image</th>
              <th style="padding:12px; font-size:13px; color:#ffd700;">Product Title</th>
              <th style="padding:12px; font-size:13px; color:#ffd700;">Type</th>
              <th style="padding:12px; font-size:13px; color:#ffd700;">Category</th>
              <th style="padding:12px; font-size:13px; color:#ffd700;">Supplier</th>
              <th style="padding:12px; font-size:13px; color:#ffd700;">Units Available</th>
              <th style="padding:12px; font-size:13px; color:#ffd700;">Market price</th>
            </tr>
          </thead>
          <tbody>`;

    window.inventoryData.forEach(item => {
      const units = item.type === 'BOX' ? `${item.quantityBoxes || 0} Boxes` : `${item.quantityPacks || 0} Packs`;
      const val = parseFloat(item.marketPrice || 0).toFixed(2);
      const thumbnail = item.image && item.image.trim() !== "" ? item.image : "Logo.png";

      ui += `
        <tr style="border-bottom:1px solid #2a2a30; font-size:14px;">
          <td style="padding:10px;"><img src="${thumbnail}" style="width:40px; height:40px; object-fit:contain; border-radius:4px; background:#222; border:1px solid #444;" onerror="this.src='Logo.png'"></td>
          <td style="padding:10px; font-weight:bold;">${item.name}</td>
          <td style="padding:10px; color:#aaa;">${item.type}</td>
          <td style="padding:10px; color:#aaa;">${item.category}</td>
          <td style="padding:10px; color:#aaa;">${item.supplier}</td>
          <td style="padding:10px; font-weight:bold; color:#00ff88;">${units}</td>
          <td style="padding:10px; font-weight:bold; color:#ffd700;">£${val}</td>
        </tr>`;
    });

    ui += `</tbody></table></div>`;
    box.innerHTML = ui;
  }

  function openCustomerPage() {
    document.getElementById('customerFrame').src = "simple-list.html";
    showPage('customer');
  }

  document.addEventListener('DOMContentLoaded', () => {
    const typeSelect = document.getElementById('invType');
    const boxFields = document.getElementById('boxFields');
    const packFields = document.getElementById('packFields');

    if (typeSelect && boxFields && packFields) {
      typeSelect.addEventListener('change', () => {
        if (typeSelect.value === 'BOX') {
          boxFields.style.display = 'block';
          packFields.style.display = 'none';
        } else if (typeSelect.value === 'PACK') {
          boxFields.style.display = 'none';
          packFields.style.display = 'block';
        } else {
          boxFields.style.display = 'none';
          packFields.style.display = 'none';
        }
      });
    }
  });
</script>
</body>
</html>
