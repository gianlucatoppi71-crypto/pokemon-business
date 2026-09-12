// LOAD SALES
let savedSales = localStorage.getItem("salesData");
if (savedSales) {
  sales = JSON.parse(savedSales);
} else {
  sales = [];
}

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
          <th>Actions</th>
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
  const cost = parseFloat(prompt("Cost per item (£):"));
  const price = parseFloat(prompt("Sale price (£):"));
  const qty = parseInt(prompt("Quantity sold:"), 10);
  const date = new Date().toLocaleDateString();

  if (!item || isNaN(cost) || isNaN(price) || isNaN(qty)) {
    alert("Invalid input.");
    return;
  }

  const profit = (price - cost) * qty;

  sales.push({ item, cost, price, qty, profit, date, promo: false });

  saveSales();
  renderSales();
  renderTaxSummary();
}

function addPromo(){
  const item = prompt("Promotional item:");
  const cost = parseFloat(prompt("Cost (£):"));
  const reason = prompt("Reason:");
  const date = new Date().toLocaleDateString();

  if (!item || isNaN(cost)) {
    alert("Invalid input.");
    return;
  }

  sales.push({
    item,
    cost,
    price: 0,
    qty: 0,
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

  list.innerHTML = sales.map((s, index) => `
    <tr>
      <td>${s.item}${s.promo ? " (Promo)" : ""}</td>
      <td>£${s.cost.toFixed(2)}</td>
      <td>${s.promo ? "FREE" : "£" + s.price.toFixed(2)}</td>
      <td>${s.promo ? "Expense" : "£" + s.profit.toFixed(2)}</td>
      <td>${s.date}</td>
      <td>
        <div class="menuWrapper">
          <button class="menuBtn">⋮</button>
          <div class="menuPopup">
            <div onclick="editSale(${index})">Edit</div>
            <div onclick="copySale(${index})">Copy</div>
            <div onclick="deleteSale(${index})">Delete</div>
          </div>
        </div>
      </td>
    </tr>
  `).join("");

  activateMenus();
}

function editSale(index){
  const s = sales[index];

  const item = prompt("Item:", s.item);
  const cost = parseFloat(prompt("Cost per item (£):", s.cost));
  const price = parseFloat(prompt("Sale price (£):", s.price));
  const qty = parseInt(prompt("Quantity sold:", s.qty), 10);
  const date = s.date;

  if (!item || isNaN(cost) || isNaN(price) || isNaN(qty)) {
    alert("Invalid input.");
    return;
  }

  const profit = (price - cost) * qty;

  sales[index] = { item, cost, price, qty, profit, date, promo: false };

  saveSales();
  renderSales();
  renderTaxSummary();
}

function copySale(index){
  const s = sales[index];
  sales.push({ ...s });
  saveSales();
  renderSales();
  renderTaxSummary();
}

function deleteSale(index){
  if(confirm("Delete this sale?")){
    sales.splice(index, 1);
    saveSales();
    renderSales();
    renderTaxSummary();
  }
}

function renderTaxSummary(){
  const box = document.getElementById("taxSummary");

  let totalSales = sales.reduce((sum, s) => sum + (s.promo ? 0 : s.price * s.qty), 0);
  let totalCost = sales.reduce((sum, s) => sum + (s.promo ? s.cost : s.cost * s.qty), 0);
  let totalProfit = sales.reduce((sum, s) => sum + s.profit, 0);

  box.innerHTML = `
    <h3>Tax Summary</h3>
    <p>Total Sales: £${totalSales.toFixed(2)}</p>
    <p>Total Cost: £${totalCost.toFixed(2)}</p>
    <p>Total Profit: £${totalProfit.toFixed(2)}</p>
    <p>HMRC info: remember to declare profits and promo expenses.</p>
  `;
}
