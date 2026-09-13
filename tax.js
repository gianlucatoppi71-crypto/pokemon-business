// ===============================
//  TAX SUMMARY SYSTEM (FINAL)
// ===============================

let userSalary = 37000; // default salary

function setSalary(newSalary) {
  userSalary = Number(newSalary || 0);
  renderTaxSummary();
}

function convertProfit(profit, mode) {
  switch (mode) {
    case "daily": return profit / 365;
    case "weekly": return profit / 52;
    case "monthly": return profit / 12;
    case "yearly": return profit;
    default: return profit;
  }
}

let taxMode = "yearly";

function setTaxMode(mode) {
  taxMode = mode;
  renderTaxSummary();
}

function renderTaxSummary() {
  loadData();

  if (!Array.isArray(salesData)) salesData = [];

  const normalizedSales = salesData.map(s => ({
    price: Number(s.price || s.sellPrice || 0),
    cost: Number(s.cost || 0),
    profit: Number(s.profit || (Number(s.price || 0) - Number(s.cost || 0)) || 0)
  }));

  const totalProfit = normalizedSales.reduce((sum, s) => sum + s.profit, 0);
  const convertedProfit = convertProfit(totalProfit, taxMode);

  const tradingAllowance = 1000;
  const taxableProfit = Math.max(0, totalProfit - tradingAllowance);

  const incomeTax = taxableProfit * 0.20;

  const totalIncome = userSalary + totalProfit;
  const ni = totalIncome > 12570 ? taxableProfit * 0.09 : 0;

  const totalTax = incomeTax + ni;
  const netProfit = totalProfit - totalTax;

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
