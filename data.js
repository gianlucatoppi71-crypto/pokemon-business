// Central data storage

let inventoryData = [];
let salesData = [];

// Load from localStorage
function loadData() {
  const inv = localStorage.getItem('inventoryData');
  const sales = localStorage.getItem('salesData');
  inventoryData = inv ? JSON.parse(inv) : [];
  salesData = sales ? JSON.parse(sales) : [];
}

function saveData() {
  localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
  localStorage.setItem('salesData', JSON.stringify(salesData));
}

// Tax + profit helpers

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

function calculateTotalProfit() {
  return inventoryData.reduce((sum, item) => {
    const { totalProfit } = calculateItemProfit(item);
    return sum + totalProfit;
  }, 0) + salesData.reduce((sum, sale) => sum + sale.profit, 0);
}

// Very simplified UK tax estimate (for guidance only)
function estimateUkTax(totalProfit) {
  const tradingAllowance = 1000; // £1,000 allowance
  const taxableProfit = Math.max(0, totalProfit - tradingAllowance);

  // Assume basic rate 20% on taxable profit
  const incomeTax = taxableProfit * 0.20;

  // Rough NIC estimate (not exact): 9% on taxable profit
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
    Estimated income tax (20%): £${tax.incomeTax.toFixed(2)}<br>
    Estimated NIC (9%): £${tax.nic.toFixed(2)}<br>
    Estimated total tax: £${tax.totalTax.toFixed(2)}<br>
    Estimated net profit after tax: £${tax.netProfit.toFixed(2)}<br>
    <small>Approximate only. Real UK tax depends on total income and HMRC rules.</small>
  `;
}

// Initial load
loadData();
