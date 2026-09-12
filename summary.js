function initSummary(){
  const div = document.getElementById("summaryContainer");
  div.innerHTML = `
    <h2>Summary</h2>
    <p>Inventory items: ${inventory.length}</p>
    <p>Sales records: ${sales.length}</p>
  `;
}
