// ===============================
// GLOBAL DATA STORAGE (NEW SYSTEM)
// ===============================

// Core arrays
let inventoryData = [];
let salesData = [];
let expensesData = [];
let suppliersData = [];
let tradesData = [];
let portfolioData = [];
let customerData = [];
let personalCollectionData = [];   // ⭐ NEW — personal collection storage

// Business settings
let annualIncome = 37000;        // default UK income
let tradingAllowance = 1000;     // UK trading allowance

// ===============================
// LOAD DATA
// ===============================

function loadData() {
  try {
    inventoryData = JSON.parse(localStorage.getItem("inventoryData")) || [];
    salesData     = JSON.parse(localStorage.getItem("salesData"))     || [];
    expensesData  = JSON.parse(localStorage.getItem("expensesData"))  || [];
    suppliersData = JSON.parse(localStorage.getItem("suppliersData")) || [];
    tradesData    = JSON.parse(localStorage.getItem("tradesData"))    || [];
    portfolioData = JSON.parse(localStorage.getItem("portfolioData")) || [];
    customerData  = JSON.parse(localStorage.getItem("customerData"))  || [];
    personalCollectionData = JSON.parse(localStorage.getItem("personalCollectionData")) || []; // ⭐ NEW

    annualIncome      = parseFloat(localStorage.getItem("annualIncome"))      || 37000;
    tradingAllowance  = parseFloat(localStorage.getItem("tradingAllowance"))  || 1000;
  } catch (err) {
    console.error("Error loading data:", err);
  }
}

// ===============================
// SAVE DATA
// ===============================

function saveData() {
  try {
    localStorage.setItem("inventoryData", JSON.stringify(inventoryData));
    localStorage.setItem("salesData",     JSON.stringify(salesData));
    localStorage.setItem("expensesData",  JSON.stringify(expensesData));
    localStorage.setItem("suppliersData", JSON.stringify(suppliersData));
    localStorage.setItem("tradesData",    JSON.stringify(tradesData));
    localStorage.setItem("portfolioData", JSON.stringify(portfolioData));
    localStorage.setItem("customerData",  JSON.stringify(customerData));
    localStorage.setItem("personalCollectionData", JSON.stringify(personalCollectionData)); // ⭐ NEW

    localStorage.setItem("annualIncome",     annualIncome.toString());
    localStorage.setItem("tradingAllowance", tradingAllowance.toString());
  } catch (err) {
    console.error("Error saving data:", err);
  }
}

// ===============================
// TAX SUMMARY
// ===============================

function renderTaxSummary() {
  loadData();

  const el = document.getElementById("taxSummary");
  if (!el) return;

  // Total profit from NEW SYSTEM sales entries
  const totalSalesProfit = salesData.reduce((sum, sale) => {
    return sum + (sale.totalProfit || 0);
  }, 0);

  // Total expenses
  const totalExpenses = expensesData.reduce((sum, exp) => {
    return sum + (exp.amount || 0);
  }, 0);

  const netBusinessProfit = totalSalesProfit - totalExpenses;
  const taxableProfit = Math.max(0, netBusinessProfit - tradingAllowance);
  const incomeTax = taxableProfit * 0.20; // UK basic rate

  el.innerHTML = `
    <p><strong>Total sales profit:</strong> £${totalSalesProfit.toFixed(2)}</p>
    <p><strong>Total expenses:</strong> £${totalExpenses.toFixed(2)}</p>
    <p><strong>Net business profit:</strong> £${netBusinessProfit.toFixed(2)}</p>
    <p><strong>Trading allowance:</strong> £${tradingAllowance.toFixed(2)}</p>
    <p><strong>Taxable profit:</strong> £${taxableProfit.toFixed(2)}</p>
    <p><strong>Income tax (20%):</strong> £${incomeTax.toFixed(2)}</p>
  `;
}

// INITIAL LOAD
loadData();
