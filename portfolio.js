function initPortfolio(){
  const div = document.getElementById("portfolioContainer");

  const totalInventory = inventory.length;
  const totalSingles = singles.length;
  const totalTrades = trades.length;
  const totalSuppliers = suppliers.length;
  const totalSales = sales.length;

  // Optional: calculate total value of singles + sales
  const totalSinglesValue = singles.reduce((sum, s) => sum + Number(s.price || 0), 0);
  const totalSalesValue = sales.reduce((sum, s) => sum + Number(s.price || 0), 0);

  div.innerHTML = `
    <h2>Portfolio</h2>

    <div class="gridList">

      <div class="itemCard">
        <h3>Inventory Items</h3>
        <p>${totalInventory}</p>
      </div>

      <div class="itemCard">
        <h3>Singles</h3>
        <p>${totalSingles}</p>
      </div>

      <div class="itemCard">
        <h3>Trades</h3>
        <p>${totalTrades}</p>
      </div>

      <div class="itemCard">
        <h3>Suppliers</h3>
        <p>${totalSuppliers}</p>
      </div>

      <div class="itemCard">
        <h3>Sales</h3>
        <p>${totalSales}</p>
      </div>

      <div class="itemCard">
        <h3>Total Singles Value</h3>
        <p>£${totalSinglesValue.toFixed(2)}</p>
      </div>

      <div class="itemCard">
        <h3>Total Sales Value</h3>
        <p>£${totalSalesValue.toFixed(2)}</p>
      </div>

    </div>
  `;
}
