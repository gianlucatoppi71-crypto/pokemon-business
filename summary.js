// ===============================
// BUSINESS SUMMARY PAGE (NEW SYSTEM)
// ===============================
// Uses inventoryData, salesData, expensesData, annualIncome, tradingAllowance
// from data.js

function renderSummary() {
  loadData();

  const page = document.getElementById('summaryPage');
  if (!page) return;

  // Inventory value (unsold)
  const inventoryValue = inventoryData.reduce((sum, item) => {
    if (item.type === "BOX") {
      const boxValue = (item.buyPriceBox || 0) * (item.quantityBoxes || 0);
      const packValue = (item.buyPriceBox && item.packsPerBox)
        ? (item.buyPriceBox / item.packsPerBox) * (item.manualPacks || 0)
        : 0;
      return sum + boxValue + packValue;
    } else {
      return sum + (item.buyPricePack || 0) * (item.quantityPacks || 0);
    }
  }, 0);

  // Sales metrics
  let totalRevenue = 0;
  let totalCOGS = 0;
  let totalSalesProfit = 0;

  salesData.forEach(sale => {
    const qty = sale.quantitySold || 0;
    const buy = sale.buyPrice || 0;
    const sell = sale.sellPrice || 0;
    const profit = sale.totalProfit || 0;

    totalRevenue += sell * qty;
    totalCOGS    += buy * qty;
    totalSalesProfit += profit;
  });

  const grossProfit = totalRevenue - totalCOGS;

  // Expenses
  const totalExpenses = expensesData.reduce((sum, exp) => {
    return sum + (exp.amount || 0);
  }, 0);

  // Net business profit
  const netBusinessProfit = totalSalesProfit - totalExpenses;

  // Profit margin
  const profitMargin = totalRevenue > 0
    ? (netBusinessProfit / totalRevenue) * 100
    : 0;

  // Average profit per sale
  const averageProfitPerSale = salesData.length > 0
    ? totalSalesProfit / salesData.length
    : 0;

  // Tax
  const taxableProfit = Math.max(0, netBusinessProfit - tradingAllowance);
  const incomeTax = taxableProfit * 0.20; // 20%

  page.innerHTML = `
    <h1>Business Summary</h1>

    <div class="summary-section">
      <h2>Core Stats</h2>
      <p><strong>Inventory value (unsold):</strong> £${inventoryValue.toFixed(2)}</p>
      <p><strong>Total revenue:</strong> £${totalRevenue.toFixed(2)}</p>
      <p><strong>Cost of goods sold (COGS):</strong> £${totalCOGS.toFixed(2)}</p>
      <p><strong>Gross profit:</strong> £${grossProfit.toFixed(2)}</p>
      <p><strong>Total sales profit:</strong> £${totalSalesProfit.toFixed(2)}</p>
      <p><strong>Total expenses:</strong> £${totalExpenses.toFixed(2)}</p>
    </div>

    <div class="summary-section">
      <h2>Business Profit</h2>
      <p><strong>Net business profit:</strong> £${netBusinessProfit.toFixed(2)}</p>
      <p><strong>Profit margin:</strong> ${profitMargin.toFixed(2)}%</p>
      <p><strong>Average profit per sale:</strong> £${averageProfitPerSale.toFixed(2)}</p>
    </div>

    <div class="summary-section">
      <h2>Your Income</h2>
      <p><strong>Annual income:</strong> £${annualIncome.toFixed(2)}</p>
      <label>Update annual income:</label>
      <input type="number" id="annualIncomeInput" value="${annualIncome.toFixed(2)}" step="0.01">
      <button onclick="updateAnnualIncome()">Save income</button>
    </div>

    <div class="summary-section">
      <h2>Tax Estimate</h2>
      <p><strong>Trading allowance:</strong> £${tradingAllowance.toFixed(2)}</p>
      <p><strong>Taxable profit:</strong> £${taxableProfit.toFixed(2)}</p>
      <p><strong>Income tax (20%):</strong> £${incomeTax.toFixed(2)}</p>
    </div>
  `;
}

function updateAnnualIncome() {
  const input = document.getElementById('annualIncomeInput');
  if (!input) return;

  const value = parseFloat(input.value);
  if (isNaN(value)) return;

  annualIncome = value;
  saveData();
  renderSummary();
  renderTaxSummary();
}
