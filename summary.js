// BUSINESS SUMMARY PAGE

function renderSummary() {
  loadData();

  const container = document.getElementById('summaryPage');
  if (!container) return;

  const totalInventoryValue = inventoryData.reduce((sum, item) => {
    return sum + (item.sellPrice * item.quantity);
  }, 0);

  const totalSalesProfit = salesData.reduce((sum, sale) => {
    return sum + sale.totalProfit;
  }, 0);

  const totalProfit = calculateTotalProfit();
  const tax = estimateUkTax(totalProfit);

  container.innerHTML = `
    <h1>Business Summary</h1>

    <p><strong>Inventory value:</strong> £${totalInventoryValue.toFixed(2)}</p>
    <p><strong>Total sales profit:</strong> £${totalSalesProfit.toFixed(2)}</p>
    <p><strong>Total profit:</strong> £${totalProfit.toFixed(2)}</p>

    <h2>Tax Estimate</h2>
    <p><strong>Trading allowance:</strong> £${tax.tradingAllowance.toFixed(2)}</p>
    <p><strong>Taxable profit:</strong> £${tax.taxableProfit.toFixed(2)}</p>
    <p><strong>Income tax (20%):</strong> £${tax.incomeTax.toFixed(2)}</p>
    <p><strong>NIC (9%):</strong> £${tax.nic.toFixed(2)}</p>
    <p><strong>Total estimated tax:</strong> £${tax.totalTax.toFixed(2)}</p>
    <p><strong>Net profit after tax:</strong> £${tax.netProfit.toFixed(2)}</p>
  `;
}
