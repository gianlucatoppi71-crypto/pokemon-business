function initSummary(){
  const div = document.getElementById("summaryContainer");

  div.innerHTML = `
    <h2>Summary</h2>

    <div class="gridList">

      <div class="itemCard">
        <h3>Inventory Items</h3>
        <p>${inventory.length}</p>
      </div>

      <div class="itemCard">
        <h3>Singles</h3>
        <p>${singles.length}</p>
      </div>

      <div class="itemCard">
        <h3>Trades</h3>
        <p>${trades.length}</p>
      </div>

      <div class="itemCard">
        <h3>Suppliers</h3>
        <p>${suppliers.length}</p>
      </div>

      <div class="itemCard">
        <h3>Sales</h3>
        <p>${sales.length}</p>
      </div>

    </div>
  `;
}
