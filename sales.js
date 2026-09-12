function initSales(){
  const div = document.getElementById("sales");
  div.innerHTML = `
    <h2>Sales</h2>
    <button onclick="addSale()">Add Sale</button>
    <table class="salesTable">
      <thead>
        <tr>
          <th>Item</th>
          <th>Price</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody id="salesList"></tbody>
    </table>
  `;
  renderSales();
}

function addSale(){
  const item = prompt("Item sold:");
  const price = prompt("Price:");
  const date = new Date().toLocaleDateString();
  sales.push({item, price, date});
  renderSales();
}
function addPromo(){
  const item = prompt("Promotional item name:");
  const cost = parseFloat(prompt("Cost (£):"));
  const reason = prompt("Reason for promotion (advertising, influencer, shop promotion):");
  const date = new Date().toLocaleDateString();

  sales.push({
    item,
    cost,
    price: 0,
    profit: -cost,
    date,
    promo: true,
    reason
  });

  saveSales();
  renderSales();
  renderTaxSummary();
}

function renderSales(){
  const list = document.getElementById("salesList");
  list.innerHTML = sales.map(s => `
    <tr>
      <td>${s.item}</td>
      <td>£${s.price}</td>
      <td>${s.date}</td>
    </tr>
  `).join("");
}
