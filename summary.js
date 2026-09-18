// ===============================
// BUSINESS SUMMARY PAGE (FULLY UPDATED FOR BOX + PACK SYSTEM)
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

  // ===============================
  // INVENTORY VALUE (UNSOLD)
  // ===============================
  const totalInventoryValue = inventoryData.reduce((sum, item) => {

    if (item.type === "BOX") {
      const boxValue = item.quantityBoxes * item.sellPriceBox;
      const packValue = item.manualPacks * item.sellPricePack;
      return sum + boxValue + packValue;
    }

    if (item.type === "PACK") {
      const packValue = item.quantityPacks * item.sellPricePack;
      return sum + packValue;
    }

    return sum;
  }, 0);

  // ===============================
  // SALES DATA (BOX + PACK)
  // ===============================
  const totalSalesProfit = salesData.reduce((sum, sale) => sum + sale.totalProfit, 0);

  const totalRevenue = salesData.reduce((sum, sale) => {
    return sum + (sale.sellPrice * sale.quantitySold);
  }, 0);

  const totalCOGS = salesData.reduce((sum, sale) => {
    return sum + (sale.buyPrice * sale.quantitySold);
  }, 0);

  const grossProfit = totalRevenue - totalCOGS;
  const netBusinessProfit = totalSalesProfit - totalExpenses;

  const avgProfitPerSale = salesData.length > 0
    ? (totalSalesProfit / salesData.length)
    : 0;

  const profitMargin = totalRevenue > 0
    ? (grossProfit / totalRevenue) * 100
    : 0;

  // ===============================
  // SUPPLIER PERFORMANCE
  // ===============================
  const supplierStats = {};
  salesData.forEach(sale => {
    if (!supplierStats[sale.supplier]) {
      supplierStats[sale.supplier] = { revenue: 0, profit: 0, items: 0 };
    }
    supplierStats[sale.supplier].revenue += sale.sellPrice * sale.quantitySold;
    supplierStats[sale.supplier].profit += sale.totalProfit;
    supplierStats[sale.supplier].items += sale.quantitySold;
  });

  // ===============================
  // MONTHLY PROFIT (for charts)
  // ===============================
  const monthlyStats = {};
  salesData.forEach(sale => {
    const month = sale.date.substring(0, 7); // YYYY-MM
    if (!monthlyStats[month]) monthlyStats[month] = 0;
    monthlyStats[month] += sale.totalProfit;
  });

  // ===============================
  // TAX CALCULATIONS
  // ===============================
  const tradingAllowance = 1000;
  const taxableProfit = Math.max(0, netBusinessProfit - tradingAllowance);

  const incomeTax = taxableProfit * 0.20;
  const nic = taxableProfit * 0.09;

  const totalTax = incomeTax + nic;
  const netProfitAfterTax = netBusinessProfit - totalTax;

  // ===============================
  // TAX DEADLINE
  // ===============================
  const taxDeadline = localStorage.getItem("taxDeadline") || "";
  let deadlineInfo = "";
  if (taxDeadline) {
    const daysLeft = getDaysLeft(taxDeadline);
    deadlineInfo = `<p><strong>Next tax deadline:</strong> ${taxDeadline} (${daysLeft} days left)</p>`;
  }

  let taxStatus = "";
  if (netBusinessProfit <= tradingAllowance) {
    taxStatus = `<p style="color:green"><strong>Status:</strong> Under trading allowance — usually no tax due.</p>`;
  } else {
    taxStatus = `<p style="color:red"><strong>Status:</strong> Over trading allowance — tax may be due.</p>`;
  }

  // ===============================
  // SUPPLIER PERFORMANCE HTML
  // ===============================
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

  const monthlyChartJSON = JSON.stringify(monthlyStats, null, 2);

  // ===============================
  // RENDER SUMMARY PAGE
  // ===============================
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

// ===============================
// SAVE ANNUAL INCOME
// ===============================
function saveIncome() {
  const input = document.getElementById("incomeInput");
  const value = parseFloat(input.value);

  if (!isNaN(value)) {
    localStorage.setItem("annualIncome", value);
    renderSummary();
  }
}

// ===============================
// SAVE TAX DEADLINE
// ===============================
function saveTaxDeadline() {
  const d = document.getElementById("taxDeadlineInput").value;
  localStorage.setItem("taxDeadline", d);
  renderSummary();
}

// ===============================
// CALCULATE DAYS LEFT
// ===============================
function getDaysLeft(dateStr) {
  const today = new Date();
  const deadline = new Date(dateStr);
  const diff = deadline - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
