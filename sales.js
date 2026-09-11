let salesData = [];

function initSales(){
  renderSales();
}

function renderSales(){
  document.getElementById("sales").innerHTML = `
    <h2>Sales</h2>

    <button onclick="showSaleForm()">Add Sale</button>
    <button onclick="exportSalesCSV()">Export Excel (CSV)</button>
    <button onclick="exportSalesDOC()">Export Word (DOC)</button>

    <div id="saleForm" class="hidden">
      <h3>Add Sale</h3>

      <input id="saleDate" type="date">
      <input id="saleItem" placeholder="Item name">
      <input id="salePrice" type="number" step="0.01" placeholder="Sale price">
      <input id="salePayment" placeholder="Payment method (eBay, PayPal, Cash)">
      <input id="saleCost" type="number" step="0.01" placeholder="Cost">

      <button onclick="addSale()">Save Sale</button>
      <button onclick="hideSaleForm()">Cancel</button>
    </div>

    <table class="salesTable">
      <thead>
        <tr>
          <th>Date</th>
          <th>Item</th>
          <th>Sale Price</th>
          <th>Payment Method</th>
          <th>Cost</th>
          <th>Profit</th>
        </tr>
      </thead>
      <tbody id="salesRows"></tbody>
    </table>
  `;

  updateSalesTable();
}

function showSaleForm(){
  document.getElementById("saleForm").classList.remove("hidden");
}

function hideSaleForm(){
  document.getElementById("saleForm").classList.add("hidden");
}

function addSale(){
  let date = document.getElementById("saleDate").value;
  let item = document.getElementById("saleItem").value;
  let price = parseFloat(document.getElementById("salePrice").value);
  let payment = document.getElementById("salePayment").value;
  let cost = parseFloat(document.getElementById("saleCost").value);
  let profit = price - cost;

  salesData.push({ date, item, price, payment, cost, profit });

  hideSaleForm();
  updateSalesTable();
}

function updateSalesTable(){
  let rows = document.getElementById("salesRows");
  rows.innerHTML = "";

  salesData.forEach(sale => {
    rows.innerHTML += `
      <tr>
        <td>${sale.date}</td>
        <td>${sale.item}</td>
        <td>£${sale.price.toFixed(2)}</td>
        <td>${sale.payment}</td>
        <td>£${sale.cost.toFixed(2)}</td>
        <td>£${sale.profit.toFixed(2)}</td>
      </tr>
    `;
  });
}

function exportSalesCSV(){
  let csv = "Date,Item,Sale Price,Payment Method,Cost,Profit\n";

  salesData.forEach(s => {
    csv += `${s.date},${s.item},${s.price},${s.payment},${s.cost},${s.profit}\n`;
  });

  let blob = new Blob([csv], { type: "text/csv" });
  let url = URL.createObjectURL(blob);

  let a = document.createElement("a");
  a.href = url;
  a.download = "sales_record.csv";
  a.click();
}

function exportSalesDOC(){
  let doc = "Sales Record\n\n";

  salesData.forEach(s => {
    doc += `Date: ${s.date}\nItem: ${s.item}\nSale Price: £${s.price}\nPayment: ${s.payment}\nCost: £${s.cost}\nProfit: £${s.profit}\n\n`;
  });

  let blob = new Blob([doc], { type: "application/msword" });
  let url = URL.createObjectURL(blob);

  let a = document.createElement("a");
  a.href = url;
  a.download = "sales_record.doc";
  a.click();
}