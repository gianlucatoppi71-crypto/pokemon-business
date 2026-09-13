// ===============================
//  TAX SUMMARY SYSTEM (FINAL)
// ===============================

// User‑editable salary (default £37,000)
let userSalary = 37000;

// Allow user to change salary
function setSalary(newSalary) {
  userSalary = Number(newSalary || 0);
  renderTaxSummary();
}

// Convert profit into different time periods
function convertProfit(profit, mode) {
  switch (mode) {
    case "daily": return profit / 365;
    case "weekly": return profit / 52;
    case "monthly": return profit / 12;
    case "yearly": return profit;
    default: return profit;
  }
}

// Current mode (daily / weekly / monthly / yearly)
let taxMode = "yearly";

function setTaxMode(mode) {
  taxMode = mode;
  renderTaxSummary();
}

// MAIN TAX SUMMARY FUNCTION
function renderTaxSummary() {
  loadData();

  if (!Array.isArray(salesData)) salesData = [];

  // Normalize sales
  salesData = salesData.map(sale => ({
    price: Number(sale.price || 0),
    cost: Number(sale.cost || 0),
    profit: Number(sale.profit || (sale.price - sale.cost) || 0)
  }));

  // Total business profit
  const totalProfit = salesData.reduce((sum, s) => sum + s.profit, 0);

  // Apply time conversion
  const convertedProfit = convertProfit(totalProfit, taxMode);

  // Trading allowance
  const tradingAllowance = 1000;

  // Taxable business profit
  const taxableProfit = Math.max(0, totalProfit - tradingAllowance);

  // Income tax (20%)
  const incomeTax = taxableProfit * 0.20;

  // Class 4 NI (9%) — only applies if total income > £12,570
  const totalIncome = userSalary + totalProfit;
  const ni = totalIncome > 12570 ? taxableProfit * 0.09 : 0;

  // Total estimated tax
  const totalTax = incomeTax + ni;

  // Net profit after tax
  const netProfit = totalProfit - totalTax;

  // Render
  const box = document.getElementById("taxSummary");
  if (!box) return;

  box.innerHTML = `
    <p><strong>Your salary:</strong> £${userSalary.toFixed(2)}</p>

    <p><strong>Total business profit:</strong> £${totalProfit.toFixed(2)}</p>

    <p><strong>Trading allowance:</strong> £${tradingAllowance.toFixed(2)}</p>

    <p><strong>Taxable profit:</strong> £${taxableProfit.toFixed(2)}</p>

    <p><strong>Income tax (20%):</strong> £${incomeTax.toFixed(2)}</p>

    <p><strong>NIC (9%):</strong> £${ni.toFixed(2)}</p>

    <p><strong>Total estimated tax:</strong> £${totalTax.toFixed(2)}</p>

    <p><strong>Net profit after tax:</strong> £${netProfit.toFixed(2)}</p>

    <hr>

    <p><strong>${taxMode.toUpperCase()} PROFIT VIEW:</strong></p>
    <p>£${convertedProfit.toFixed(2)}</p>

    <hr>

    <label style="font-size:12px;">Change salary:</label><br>
    <input type="number" id="salaryInput" value="${userSalary}"
           style="width:120px; margin-top:5px;"
           onchange="setSalary(this.value)">

    <hr>

    <label style="font-size:12px;">Profit mode:</label><br>
    <select onchange="setTaxMode(this.value)" style="margin-top:5px;">
      <option value="daily" ${taxMode==="daily"?"selected":""}>Daily</option>
      <option value="weekly" ${taxMode==="weekly"?"selected":""}>Weekly</option>
      <option value="monthly" ${taxMode==="monthly"?"selected":""}>Monthly</option>
      <option value="yearly" ${taxMode==="yearly"?"selected":""}>Yearly</option>
    </select>
  `;
}
