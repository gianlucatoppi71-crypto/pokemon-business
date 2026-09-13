function initSales(){
  const div = document.getElementById("salesContainer");
  div.innerHTML = `
    <h2>Sales</h2>
    <button onclick="addSale()">Add Sale</button>
    <div id="salesList"></div>
  `;
  renderSales();
}

function addSale(){
  const item = prompt("Item sold:");
  const price = prompt("Sale price:");
  sales.push({item, price});
  renderSales();
}

function renderSales(){
  const list = document.getElementById("salesList");
  list.innerHTML = sales.map(s => `
    <div class="itemCard">
      <h3>${s.item}</h3>
      <p>£${s.price}</p>
    </div>
  `).join("");
}
