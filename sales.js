// LOAD SAVED SALES
let savedSales = localStorage.getItem("salesData");
if(savedSales){
  sales = JSON.parse(savedSales);
} else {
  sales = [];
}

// SAVE SALES
function saveSales(){
  localStorage.setItem("salesData", JSON.stringify(sales));
}

function initSales(){
  const div = document.getElementById("salesContainer");
  div.innerHTML = `
    <h2>Sales</h2>
    <button onclick="addSale()">Add Sale</button>
    <button onclick="addPromo()">Add Promotional Item</button>

    <table class="salesTable">
      <thead>
        <tr>
          <th>Item</th>
          <th>Cost</th>
          <th>Sale Price</th>
          <th>Profit</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody id="salesList"></tbody>
    </table>

    <div id="taxSummary" class="taxBox"></div>
  `;

  renderSales();
  renderTaxSummary();
}

function addSale(){
  const item = prompt("Item:");
  const cost = parseFloat(prompt("Cost (£):"));
  const price = parseFloat(prompt("Sale price (£):"));
  const date = new Date().toLocaleDateString();

  const profit = price - cost;

  sales.push({ item, cost, price, profit, date, promo: false });

  saveSales();
  renderSales();
  renderTaxSummary();
}

function addPromo(){
  const item = prompt("Promotional item:");
  const cost = parseFloat(prompt("Cost (£):"));
  const reason = prompt("Reason:");
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
      <td>${s.item}${s.promo ? " (Promo)" : ""}</td>
      <td>£${s.cost}</td>
      <td>${s.promo ? "FREE" : "£" + s.price}</td>
      <td>${s.promo ? "Expense" : "£" + s.profit}</td>
      <td>${s.date}</td>
    </tr>
  `).join("");
}

function renderTaxSummary(){
  const box = document.getElementById("taxSummary");

  let totalSales = sales.reduce((sum, s) => sum + s.price, 0);
  let totalCost = sales.reduce((sum, s) => sum + s.cost, 0);
  let totalProfit = sales.reduce((sum, s) => sum + s.profit, 0);

  box.innerHTML = `
    <h3>Tax Summary</h3>
    <p>Total Sales: £${totalSales}</p>
    <p>Total Cost: £${totalCost}</p>
    <p>Total Profit: £${totalProfit}</p>
  `;
}
