// ===============================
// BUSINESS SUMMARY PAGE (ADVANCED)
// ===============================

function renderSummary() {
  loadData();

  const container = document.getElementById('summaryPage');
  if (!container) return;

  // Annual income
  const annualIncome = parseFloat(localStorage.getItem("annualIncome")) || 0;

  // Expenses
  const expensesData = JSON.parse(localStorage.getItem("expensesData") || "[]");
  const totalExpenses = expensesData.reduce((sum, e) => sum + e.amount, 0);

  // Inventory value (unsold)
  const totalInventoryValue = inventoryData.reduce((sum, item) => {
    return sum + (item.sellPrice * item.quantity);
  }, 0);

  // Sales data
  const totalSalesProfit = salesData.reduce((sum, sale) => sum + sale.totalProfit, 0);
  const totalRevenue = salesData.reduce((sum, sale) => sum + sale.totalSellPrice, 0);
  const totalCOGS = salesData.reduce((sum, sale) => sum + sale.totalBuyPrice, 0);

  // Advanced stats
  const grossProfit = totalRevenue - totalCOGS;
  const netBusinessProfit = totalSalesProfit - totalExpenses;

  const avgProfitPerSale = salesData.length > 0
    ? (totalSalesProfit / salesData.length)
    : 0;

  const profitMargin = totalRevenue > 0
    ? (grossProfit / totalRevenue) * 100
    : 0;

  // Supplier performance
  const supplierStats = {};
  salesData.forEach(sale => {
    if (!supplierStats[sale.supplier]) {
      supplierStats[sale.supplier] = { revenue: 0, profit: 0, items: 0 };
    }
    supplierStats[sale.supplier].revenue += sale.totalSellPrice;
    supplierStats[sale.supplier].profit += sale.totalProfit;
    supplierStats[sale.supplier].items += sale.quantity;
  });

  // Monthly chart data (for future chart.js)
  const monthlyStats = {};
  salesData.forEach(sale => {
    const month = sale.date.substring(0, 7); // YYYY-MM
    if (!monthlyStats[month]) monthlyStats[month] = 0;
    monthlyStats[month] += sale.totalProfit;
  });

  // UK trading allowance
  const tradingAllowance = 1000;

  // Taxable profit
  const taxableProfit = Math.max(0, netBusinessProfit - tradingAllowance);

  // UK tax rates
  const incomeTax = taxableProfit * 0.20;
  const nic = taxableProfit * 0.09;

  const totalTax = incomeTax + nic;
  const netProfitAfterTax = netBusinessProfit - totalTax;

  // Tax deadline
  const taxDeadline = localStorage.getItem("taxDeadline") || "";
  let deadlineInfo = "";
  if (taxDeadline) {
    const daysLeft = getDaysLeft(taxDeadline);
    deadlineInfo = `<p><strong>Next tax deadline:</strong> ${taxDeadline} (${daysLeft} days left)</p>`;
  }

  // Tax status
  let taxStatus = "";
  if (netBusinessProfit <= tradingAllowance) {
    taxStatus = `<p style="color:green"><strong>Status:</strong> Under trading allowance — usually no tax due.</p>`;
  } else {
    taxStatus = `<p style="color:red"><strong>Status:</strong> Over trading allowance — tax may be due.</p>`;
  }

  // Supplier performance HTML
  let supplierHTML = "<h2>Supplier Performance</h2>";
  Object.keys(supplierStats).forEach(supplier => {
    const s = supplierStats[supplier];
    supplierHTML += `
      <p><strong>${supplier}</strong><br>
      Revenue: £${s.revenue.toFixed(2)}<br>
      Profit: £${s.profit.toFixed(2)}<br>
      Items sold: ${s.items}</p>
    `;
  });

  // Monthly chart JSON
  const monthlyChartJSON = JSON.stringify(monthlyStats, null, 2);

  container.innerHTML = `
    <h1>Business Summary</h1>

    <h2>Core Stats</h2>
    <p><strong>Inventory value (unsold):</strong> £${totalInventoryValue.toFixed(2)}</p>
    <p><strong>Total revenue:</strong> £${totalRevenue.toFixed(2)}</p>
    <p><strong>Cost of goods sold (COGS):</strong> £${totalCOGS.toFixed(2)}</p>
    <p><strong>Gross profit:</strong> £${grossProfit.toFixed(2)}</p>
    <p><strong>Total sales profit:</strong> £${totalSalesProfit.toFixed(2)}</p>
    <p><strong>Total expenses:</strong> £${totalExpenses.toFixed(2)}</p>

    <h2>Business Profit</h2>
    <p><strong>Net business profit:</strong> £${netBusinessProfit.toFixed(2)}</p>
    <p><strong>Profit margin:</strong> ${profitMargin.toFixed(2)}%</p>
    <p><strong>Average profit per sale:</strong> £${avgProfitPerSale.toFixed(2)}</p>

    <h2>Your Income</h2>
    <p><strong>Annual income:</strong> £${annualIncome.toFixed(2)}</p>

    <label>Update annual income:</label>
    <input type="number" id="incomeInput" value="${annualIncome}" style="width:200px;">
    <button onclick="saveIncome()">Save income</button>

    <h2>Tax Estimate</h2>
    <p><strong>Trading allowance:</strong> £${tradingAllowance.toFixed(2)}</p>
    <p><strong>Taxable profit:</strong> £${taxableProfit.toFixed(2)}</p>
    <p><strong>Income tax (20%):</strong> £${incomeTax.toFixed(2)}</p>
    <p><strong>NIC (9%):</strong> £${nic.toFixed(2)}</p>
    <p><strong>Total estimated tax:</strong> £${totalTax.toFixed(2)}</p>
    <p><strong>Net profit after tax:</strong> £${netProfitAfterTax.toFixed(2)}</p>

    ${taxStatus}

    <h2>Tax Deadline</h2>
    <input type="date" id="taxDeadlineInput" value="${taxDeadline}">
    <button onclick="saveTaxDeadline()">Save deadline</button>
    ${deadlineInfo}

    ${supplierHTML}

    <h2>Monthly Profit (JSON for charts)</h2>
    <pre>${monthlyChartJSON}</pre>

    <h2>HMRC</h2>
    <button onclick="window.open('https://www.gov.uk/self-assessment-tax-returns', '_blank')">
      HMRC Self Assessment (file & pay)
    </button>
  `;
}

// Save annual income
function saveIncome() {
  const input = document.getElementById("incomeInput");
  const value = parseFloat(input.value);

  if (!isNaN(value)) {
    localStorage.setItem("annualIncome", value);
    renderSummary();
  }
}

// Save tax deadline
function saveTaxDeadline() {
  const d = document.getElementById("taxDeadlineInput").value;
  localStorage.setItem("taxDeadline", d);
  renderSummary();
}

// Calculate days left
function getDaysLeft(dateStr) {
  const today = new Date();
  const deadline = new Date(dateStr);
  const diff = deadline - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
