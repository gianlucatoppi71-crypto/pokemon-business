// ===============================
// CENTRAL DATA STORAGE FOR ALL APP MODULES (UPDATED FOR BOX + PACK SYSTEM)
// ===============================

// GLOBAL ARRAYS
let inventoryData = [];
let salesData = [];
let suppliersData = [];
let expensesData = [];
let tradesData = []; // reserved for future upgrades

// ===============================
// LOAD DATA FROM LOCALSTORAGE
// ===============================
function loadData() {
  inventoryData = JSON.parse(localStorage.getItem("inventoryData") || "[]");
  salesData = JSON.parse(localStorage.getItem("salesData") || "[]");
  suppliersData = JSON.parse(localStorage.getItem("suppliersData") || "[]");
  expensesData = JSON.parse(localStorage.getItem("expensesData") || "[]");
  tradesData = JSON.parse(localStorage.getItem("tradesData") || "[]");
}

// ===============================
// SAVE DATA TO LOCALSTORAGE
// ===============================
function saveData() {
  localStorage.setItem("inventoryData", JSON.stringify(inventoryData));
  localStorage.setItem("salesData", JSON.stringify(salesData));
  localStorage.setItem("suppliersData", JSON.stringify(suppliersData));
  localStorage.setItem("expensesData", JSON.stringify(expensesData));
  localStorage.setItem("tradesData", JSON.stringify(tradesData));
}

// ===============================
// PROFIT CALCULATIONS (NEW BOX + PACK SYSTEM)
// ===============================

// Calculate profit for a BOX or PACK sale
function calculateSaleProfit(sale) {
  const profitPerUnit = sale.sellPrice - sale.buyPrice;
  const totalProfit = profitPerUnit * sale.quantitySold;

  return {
    profitPerUnit,
    totalProfit
  };
}

// ===============================
// TOTAL PROFIT (SALES ONLY)
// ===============================
function calculateTotalProfit() {
  return salesData.reduce((sum, sale) => {
    const p = calculateSaleProfit(sale);
    return sum + p.totalProfit;
  }, 0);
}

// ===============================
// UK TAX ESTIMATE (NEW SYSTEM)
// ===============================
function estimateUkTax(totalProfit) {
  const tradingAllowance = 1000;
  const taxableProfit = Math.max(0, totalProfit - tradingAllowance);

  const incomeTax = taxableProfit * 0.20;
  const nic = taxableProfit * 0.09;

  const totalTax = incomeTax + nic;
  const netProfit = totalProfit - totalTax;

  return {
    tradingAllowance,
    taxableProfit,
    incomeTax,
    nic,
    totalTax,
    netProfit
  };
}

// ===============================
// RENDER TAX SUMMARY (NEW SYSTEM)
// ===============================
function renderTaxSummary() {
  loadData();

  const totalProfit = calculateTotalProfit();
  const tax = estimateUkTax(totalProfit);

  const el = document.getElementById("taxSummary");
  if (!el) return;

  el.innerHTML = `
    Total profit: £${totalProfit.toFixed(2)}<br>
    Trading allowance: £${tax.tradingAllowance.toFixed(2)}<br>
    Taxable profit: £${tax.taxableProfit.toFixed(2)}<br>
    Income tax (20%): £${tax.incomeTax.toFixed(2)}<br>
    NIC (9%): £${tax.nic.toFixed(2)}<br>
    Total estimated tax: £${tax.totalTax.toFixed(2)}<br>
    Net profit after tax: £${tax.netProfit.toFixed(2)}<br>
    <small>Estimates only — final tax depends on HMRC rules.</small>
  `;
}

// INITIAL LOAD
loadData();
