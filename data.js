// CENTRAL DATA STORAGE FOR INVENTORY + SALES

let inventoryData = [];
let salesData = [];

// LOAD DATA FROM LOCALSTORAGE
function loadData() {
  const inv = localStorage.getItem('inventoryData');
  const sales = localStorage.getItem('salesData');

  inventoryData = inv ? JSON.parse(inv) : [];
  salesData = sales ? JSON.parse(sales) : [];
}

// SAVE DATA TO LOCALSTORAGE
function saveData() {
  localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
  localStorage.setItem('salesData', JSON.stringify(salesData));
}


// PROFIT CALCULATIONS FOR EACH ITEM
function calculateItemProfit(item) {
  const profitPerUnit = item.sellPrice - item.buyPrice;
  const totalProfit = profitPerUnit * item.quantity;

  const marginPercent = item.sellPrice > 0
    ? (profitPerUnit / item.sellPrice) * 100
    : 0;

  return {
    profitPerUnit,
    totalProfit,
    marginPercent
  };
}


// TOTAL PROFIT (INVENTORY + SALES)
function calculateTotalProfit() {
  const inventoryProfit = inventoryData.reduce((sum, item) => {
    const { totalProfit } = calculateItemProfit(item);
    return sum + totalProfit;
  }, 0);

  const salesProfit = salesData.reduce((sum, sale) => {
    return sum + sale.profit;
  }, 0);

  return inventoryProfit + salesProfit;
}


// FULL UK TAX ESTIMATE (SOLE TRADER)
// Includes:
// - £1,000 trading allowance
// - 20% income tax (basic rate)
// - 9% NIC (simplified estimate)
function estimateUkTax(totalProfit) {
  const tradingAllowance = 1000;
  const taxableProfit = Math.max(0, totalProfit - tradingAllowance);

  const incomeTax = taxableProfit * 0.20; // 20% basic rate
  const nic = taxableProfit * 0.09;       // simplified NIC estimate

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


// RENDER TAX SUMMARY IN SIDEBAR
function renderTaxSummary() {
  loadData();

  const totalProfit = calculateTotalProfit();
  const tax = estimateUkTax(totalProfit);

  const el = document.getElementById('taxSummary');
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
