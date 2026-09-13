function initPortfolio(){
  const totalInventory = inventory.length;
  const totalSingles = singles.length;
  const totalTrades = trades.length;
  const totalSuppliers = suppliers.length;
  const totalSales = sales.length;

  const div = document.getElementById("portfolioContainer");

  div.innerHTML = `
    <h2>Portfolio</h2>

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
  `;
}
