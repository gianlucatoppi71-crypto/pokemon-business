<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Gianluca Pokémon Business</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="app">
    <aside class="sidebar">
      <h2>Flux TCG</h2>
      <nav>
        <button onclick="showPage('inventory')">Inventory</button>
        <button onclick="showPage('sales')">Sales</button>
        <!-- Future: singles, trades, suppliers, summary -->
      </nav>
      <div class="tax-info">
        <h3>Tax Summary</h3>
        <div id="taxSummary"></div>
      </div>
    </aside>

    <main class="main">
      <!-- INVENTORY PAGE -->
      <section id="inventoryPage" class="page">
        <h1>Inventory</h1>

        <form id="inventoryForm">
          <input type="text" id="invName" placeholder="Product name" required>
          <input type="text" id="invCategory" placeholder="Category (Singles, Sealed, etc.)" required>
          <input type="text" id="invSupplier" placeholder="Supplier (Invicta, TotalCards, etc.)" required>
          <input type="number" step="0.01" id="invBuyPrice" placeholder="Buy price (£)" required>
          <input type="number" step="0.01" id="invSellPrice" placeholder="Target sell price (£)" required>
          <input type="number" id="invQuantity" placeholder="Quantity" required>
          <input type="number" step="0.01" id="invMarketPrice" placeholder="UK market price (£)" required>
          <textarea id="invNotes" placeholder="Strategy / notes"></textarea>
          <button type="submit">Add to inventory</button>
        </form>

        <div id="inventoryList"></div>
      </section>

      <!-- SALES PAGE -->
      <section id="salesPage" class="page" style="display:none">
        <h1>Sales</h1>
        <div id="salesInventoryList"></div>
      </section>
    </main>
  </div>

  <script src="data.js"></script>
  <script src="inventory.js"></script>
  <script src="sales.js"></script>
  <script>
    function showPage(page) {
      document.getElementById('inventoryPage').style.display =
        page === 'inventory' ? 'block' : 'none';
      document.getElementById('salesPage').style.display =
        page === 'sales' ? 'block' : 'none';
    }

    // Initial page
    showPage('inventory');
    renderInventory();
    renderSalesInventory();
    renderTaxSummary();
  </script>
</body>
</html>
