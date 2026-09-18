// ===============================
// BUSINESS SUMMARY PAGE (FIXED)
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

  // Inventory value (NOT part of profit)
  const totalInventoryValue = inventoryData.reduce((sum, item) => {
    return sum + (item.sellPrice * item.quantity);
  }, 0);

  // Sales profit (profit from sold items only)
  const totalSalesProfit = salesData.reduce((sum, sale) => {
    return sum + sale.totalProfit;
  }, 0);

  // ⭐ FIXED: Business profit = sales profit – expenses
  const businessProfit = totalSalesProfit - totalExpenses;

  // UK trading allowance
  const tradingAllowance = 1000;

  // Taxable profit
  const taxableProfit = Math.max(0, businessProfit - tradingAllowance);

  // UK tax rates
  const incomeTax = taxableProfit * 0.20;
  const nic = taxableProfit * 0.09;

  const totalTax = incomeTax + nic;
  const netProfit = businessProfit - totalTax;

  // Tax deadline
  const taxDeadline = localStorage.getItem("taxDeadline") || "";
  let deadlineInfo = "";
  if (taxDeadline) {
    const daysLeft = getDaysLeft(taxDeadline);
    deadlineInfo = `<p><strong>Next tax deadline:</strong> ${taxDeadline} (${daysLeft} days left)</p>`;
  }

  // Tax status
  let taxStatus = "";
  if (businessProfit <= tradingAllowance) {
    taxStatus = `<p style="color:green"><strong>Status:</strong> Under trading allowance — usually no tax due.</p>`;
  } else {
    taxStatus = `<p style="color:red"><strong>Status:</strong> Over trading allowance — tax may be due.</p>`;
  }

  container.innerHTML = `
    <h1>Business Summary</h1>

    <p><strong>Inventory value (unsold):</strong> £${totalInventoryValue.toFixed(2)}</p>
    <p><strong>Total sales profit:</strong> £${totalSalesProfit.toFixed(2)}</p>
    <p><strong>Total expenses:</strong> £${totalExpenses.toFixed(2)}</p>

    <h2>Business Profit</h2>
    <p><strong>Net business profit:</strong> £${businessProfit.toFixed(2)}</p>

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
    <p><strong>Net profit after tax:</strong> £${netProfit.toFixed(2)}</p>

    ${taxStatus}

    <h2>Tax Deadline</h2>
    <input type="date" id="taxDeadlineInput" value="${taxDeadline}">
    <button onclick="saveTaxDeadline()">Save deadline</button>
    ${deadlineInfo}

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
