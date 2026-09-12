// Load saved sales
let savedSales = localStorage.getItem("salesData");
if(savedSales){
  sales = JSON.parse(savedSales);
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
  const item = prompt("Item sold:");
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
  const item = prompt("Promotional item name:");
  const cost = parseFloat(prompt("Cost (£):"));
  const reason = prompt("Reason for promotion (advertising, influencer, shop promotion):");
  const date = new Date().toLocaleDateString();

  // price = 0, profit = -cost (expense)
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
      <td>£${s.cost.toFixed(2)}</td>
      <td>${s.promo ? "FREE" : "£" + s.price.toFixed(2)}</td>
      <td>${s.promo ? "Advertising Expense" : "£" + s.profit.toFixed(2)}</td>
      <td>${s.date}</td>
    </tr>
  `).join("");
}

function renderTaxSummary(){
  const box = document.getElementById("taxSummary");

  let totalSales = sales.reduce((sum, s) => sum + s.price, 0);
  let totalCost = sales.reduce((sum, s) => sum + s.cost, 0);
  let totalProfit = sales.reduce((sum, s) => sum + s.profit, 0);

  // Income tax bands (simple)
  let tax = 0;
  if(totalProfit > 125140){
    tax = (totalProfit - 125140) * 0.45 +
          (125140 - 50270) * 0.40 +
          (50270 - 12570) * 0.20;
  } else if(totalProfit > 50270){
    tax = (totalProfit - 50270) * 0.40 +
          (50270 - 12570) * 0.20;
  } else if(totalProfit > 12570){
    tax = (totalProfit - 12570) * 0.20;
  }

  // National Insurance (Class 4)
  let ni = 0;
  if(totalProfit > 50270){
    ni = (50270 - 12570) * 0.08 +
         (totalProfit - 50270) * 0.02;
  } else if(totalProfit > 12570){
    ni = (totalProfit - 12570) * 0.08;
  }

  let totalTax = tax + ni;

  box.innerHTML = `
    <h3>Tax Summary</h3>
    <p><strong>Total Sales:</strong> £${totalSales.toFixed(2)}</p>
    <p><strong>Total Cost:</strong> £${totalCost.toFixed(2)}</p>
    <p><strong>Total Profit:</strong> £${totalProfit.toFixed(2)}</p>
    <p><strong>Estimated Income Tax:</strong> £${tax.toFixed(2)}</p>
    <p><strong>Estimated National Insurance:</strong> £${ni.toFixed(2)}</p>
    <p><strong>Total Tax Owed:</strong> £${totalTax.toFixed(2)}</p>

    <h4>Self Assessment Deadline</h4>
    <p>File & Pay by: <strong>31 January 2028</strong></p>

    <a href="https://www.gov.uk/log-in-file-self-assessment-tax-return" target="_blank" class="taxLink">
      Go to HMRC Self Assessment
    </a>
  `;
}
