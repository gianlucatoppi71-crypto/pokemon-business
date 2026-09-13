function initSummary(){
  const div = document.getElementById("summary");
  div.innerHTML = `
    <h2>Summary</h2>
    <p>Total Inventory Items: ${inventory.length}</p>
    <p>Total Singles: ${singles.length}</p>
    <p>Total Trades: ${trades.length}</p>
    <p>Total Suppliers: ${suppliers.length}</p>
    <p>Total Sales: ${sales.length}</p>
  `;
}
